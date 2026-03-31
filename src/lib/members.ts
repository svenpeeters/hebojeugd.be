import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { ALLOWED_YOUTH_TEAMS, type ParentRole, type SeasonIntentRecipient } from './season-intent/shared.js';

type SourceRow = Record<string, string>;

export interface MemberRecord {
  sourceRowNumber: number;
  naam: string;
  adres: string;
  postcode: string;
  woonplaats: string;
  geboortedatum: string;
  telefoonMama: string;
  telefoonPapa: string;
  emailMama: string;
  emailPapa: string;
  ploeg: string;
  club: string;
  rawDataJson: string;
}

type SkipReason =
  | 'staff'
  | 'unsupported_team'
  | 'duplicate_parent_email'
  | 'invalid_email'
  | 'missing_email';

interface SkippedRecord {
  childName: string;
  role?: ParentRole;
  ploeg: string;
  value?: string;
  reason: SkipReason;
}

export interface RecipientPreviewResult {
  recipients: SeasonIntentRecipient[];
  summary: {
    sourceRows: number;
    recipientCount: number;
    skipped: Record<SkipReason, number>;
  };
  preview: SeasonIntentRecipient[];
  skippedRecords: SkippedRecord[];
}

const MEMBERS_CSV_PATH = path.join(process.cwd(), 'data', 'members.csv');
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function loadMembersFromCsv() {
  const raw = await fs.readFile(MEMBERS_CSV_PATH, 'utf-8');
  return parseMembersCsv(raw);
}

export function parseMembersCsv(rawCsv: string): MemberRecord[] {
  const rows = parseCsv(rawCsv.replace(/^\uFEFF/, ''));
  if (rows.length === 0) {
    throw new Error('CSV is leeg.');
  }

  const [headers, ...dataRows] = rows;

  return dataRows
    .filter((row) => row.some((value) => value.trim() !== ''))
    .map((row, index) => {
      const source = rowToObject(headers, row);
      return {
        sourceRowNumber: index + 2,
        naam: normalizeValue(source.Naam),
        adres: normalizeValue(source.Adres),
        postcode: normalizeValue(source.Postcode),
        woonplaats: normalizeValue(source.Woonplaats),
        geboortedatum: normalizeValue(source.Geboortedatum),
        telefoonMama: normalizeValue(source['Telefoon (mama)']),
        telefoonPapa: normalizeValue(source['Telefoon (papa)']),
        emailMama: normalizeEmail(source['E-mailadres (mama)']),
        emailPapa: normalizeEmail(source['E-mailadres (papa)']),
        ploeg: normalizeValue(source.Ploeg),
        club: normalizeValue(source.Club),
        rawDataJson: JSON.stringify(source),
      } satisfies MemberRecord;
    });
}

export function buildSeasonIntentRecipients(members: MemberRecord[]): RecipientPreviewResult {
  const recipients: SeasonIntentRecipient[] = [];
  const skippedRecords: SkippedRecord[] = [];
  const skipped: Record<SkipReason, number> = {
    staff: 0,
    unsupported_team: 0,
    duplicate_parent_email: 0,
    invalid_email: 0,
    missing_email: 0,
  };

  for (const member of members) {
    const ploeg = normalizeValue(member.ploeg);
    const childName = normalizeValue(member.naam);
    const club = normalizeValue(member.club);

    if (ploeg.toLowerCase() === 'staff') {
      skipped.staff += 1;
      skippedRecords.push({ childName, ploeg, reason: 'staff' });
      continue;
    }

    if (!ALLOWED_YOUTH_TEAMS.has(ploeg)) {
      skipped.unsupported_team += 1;
      skippedRecords.push({ childName, ploeg, reason: 'unsupported_team' });
      continue;
    }

    let rowAddedRecipient = false;
    const seenEmails = new Set<string>();

    for (const [role, email] of [
      ['mama', member.emailMama],
      ['papa', member.emailPapa],
    ] as const) {
      if (!email) {
        continue;
      }

      if (!EMAIL_REGEX.test(email)) {
        skipped.invalid_email += 1;
        skippedRecords.push({ childName, ploeg, role, value: email, reason: 'invalid_email' });
        continue;
      }

      if (seenEmails.has(email)) {
        skipped.duplicate_parent_email += 1;
        skippedRecords.push({ childName, ploeg, role, value: email, reason: 'duplicate_parent_email' });
        continue;
      }

      seenEmails.add(email);
      rowAddedRecipient = true;
      recipients.push({
        id: randomUUID(),
        to: email,
        parentRole: role,
        childName,
        ploeg,
        club,
      });
    }

    if (!rowAddedRecipient) {
      skipped.missing_email += 1;
      skippedRecords.push({ childName, ploeg, reason: 'missing_email' });
    }
  }

  return {
    recipients,
    summary: {
      sourceRows: members.length,
      recipientCount: recipients.length,
      skipped,
    },
    preview: recipients.slice(0, 10),
    skippedRecords,
  };
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function rowToObject(headers: string[], row: string[]): SourceRow {
  const result: SourceRow = {};

  for (let index = 0; index < headers.length; index += 1) {
    result[headers[index]] = normalizeValue(row[index]);
  }

  return result;
}

function normalizeEmail(email: string | undefined) {
  return normalizeValue(email).toLowerCase();
}

function normalizeValue(value: string | undefined) {
  return (value ?? '').replace(/\u200e|\u202a|\u202c|\u202d|\u202e/g, '').trim();
}
