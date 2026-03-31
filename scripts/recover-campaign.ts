/**
 * Recovery script: fetches sent emails from Resend, extracts the recipient
 * UUIDs from the email body, and stores the missing campaign + recipients
 * in Convex so deduplication and respond links keep working.
 *
 * Usage:
 *   pnpm tsx scripts/recover-campaign.ts --dry-run
 *   pnpm tsx scripts/recover-campaign.ts
 *
 * Environment: reads .env.local and .env for RESEND_API_KEY and CONVEX_URL.
 */
import { config as loadEnv } from 'dotenv';
import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';
import { buildSeasonIntentRecipients } from '../src/lib/members.js';
import { loadActiveMembers } from '../src/lib/members-storage.js';

loadEnv({ path: '.env.local', override: false });
loadEnv({ path: '.env', override: false });

const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
const CONVEX_URL = process.env.CONVEX_URL?.trim() || process.env.PUBLIC_CONVEX_URL?.trim();

if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');
if (!CONVEX_URL) throw new Error('Missing CONVEX_URL');

interface ResendEmailListItem {
  id: string;
  to: string[];
  from: string;
  subject: string;
  created_at: string;
}

interface ResendEmailDetail {
  id: string;
  to: string[];
  from: string;
  subject: string;
  html: string | null;
  text: string | null;
  created_at: string;
}

async function fetchEmailList(): Promise<ResendEmailListItem[]> {
  const all: ResendEmailListItem[] = [];
  let lastId: string | undefined;

  while (true) {
    const params = new URLSearchParams({ limit: '100' });
    if (lastId) params.set('after', lastId);

    const res = await fetch(`https://api.resend.com/emails?${params}`, {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });

    if (!res.ok) {
      throw new Error(`Resend list error: ${res.status} ${await res.text()}`);
    }

    const body = await res.json() as { data: ResendEmailListItem[]; has_more: boolean };
    all.push(...body.data);

    if (!body.has_more || body.data.length === 0) break;
    lastId = body.data[body.data.length - 1].id;
  }

  return all;
}

async function fetchEmailDetail(emailId: string): Promise<ResendEmailDetail> {
  const res = await fetch(`https://api.resend.com/emails/${emailId}`, {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`Resend detail error for ${emailId}: ${res.status} ${await res.text()}`);
  }

  return await res.json() as ResendEmailDetail;
}

function extractUuidFromHtml(html: string): string | null {
  // Match the UUID in /api/season-intent/respond/<uuid>
  const match = html.match(/\/api\/season-intent\/respond\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  return match ? match[1] : null;
}

function extractChildNameFromSubject(subject: string): string | null {
  // "VC HEBO Jeugd - Daniels Arthur Seizoen 2026-2027"
  const match = subject.match(/^(?:\[TEST\] )?VC HEBO Jeugd - (.+?) Seizoen/);
  return match ? match[1] : null;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('Fetching email list from Resend...');
  const allEmails = await fetchEmailList();
  console.log(`Found ${allEmails.length} total emails.`);

  // Filter: non-test season-intent emails sent at or after the U9 campaign
  const campaignStart = '2026-03-31 17:32:35';
  const campaignEmails = allEmails.filter(
    (e) =>
      e.created_at >= campaignStart &&
      e.subject.includes('Seizoen 2026-2027') &&
      !e.subject.startsWith('[TEST]'),
  );
  console.log(`${campaignEmails.length} campaign emails found (from ${campaignStart}).`);

  if (campaignEmails.length === 0) {
    console.log('No campaign emails found. Nothing to recover.');
    return;
  }

  // Load members to get ploeg/club info
  console.log('Loading members from Convex...');
  const members = await loadActiveMembers();
  const result = buildSeasonIntentRecipients(members);

  // Build lookup: childName -> recipient info (for ploeg, club, parentRole)
  const recipientsByKey = new Map<string, (typeof result.recipients)[number][]>();
  for (const r of result.recipients) {
    const key = `${r.to.toLowerCase()}|${r.childName}`;
    const existing = recipientsByKey.get(key) || [];
    existing.push(r);
    recipientsByKey.set(key, existing);
  }

  // Check what's already in Convex
  const convex = new ConvexHttpClient(CONVEX_URL!);
  let existingKeys: Array<{ to: string; childName: string; parentRole: string }>;
  try {
    existingKeys = await convex.query(anyApi.seasonIntent.getSentRecipientKeys, {});
  } catch {
    existingKeys = [];
  }
  const existingKeySet = new Set(
    existingKeys.map((k) => `${k.to}|${k.childName}|${k.parentRole}`),
  );
  console.log(`Already in Convex: ${existingKeySet.size} recipient keys.`);

  // Fetch each email's HTML to extract the UUID
  console.log(`\nFetching ${campaignEmails.length} email details from Resend...`);
  const recovered: Array<{
    uuid: string;
    resendEmailId: string;
    to: string;
    childName: string;
    parentRole: string;
    ploeg: string;
    club: string;
    createdAt: string;
  }> = [];
  const failed: string[] = [];

  for (const email of campaignEmails) {
    const toAddr = (email.to[0] || '').toLowerCase();
    const childName = extractChildNameFromSubject(email.subject);

    if (!childName) {
      failed.push(`${toAddr}: could not parse childName from subject "${email.subject}"`);
      continue;
    }

    // Fetch email detail to get UUID
    let detail: ResendEmailDetail;
    try {
      detail = await fetchEmailDetail(email.id);
    } catch (err: any) {
      failed.push(`${toAddr} (${childName}): failed to fetch detail — ${err.message}`);
      continue;
    }

    const html = detail.html || detail.text || '';
    const uuid = extractUuidFromHtml(html);

    if (!uuid) {
      failed.push(`${toAddr} (${childName}): no UUID found in email body`);
      continue;
    }

    // Find matching recipient for ploeg/club/parentRole
    const key = `${toAddr}|${childName}`;
    const candidates = recipientsByKey.get(key);
    if (!candidates || candidates.length === 0) {
      failed.push(`${toAddr} (${childName}): no matching member found`);
      continue;
    }

    // Use the first candidate (there should only be one per email+child combo)
    const member = candidates[0];
    const dedupKey = `${member.to}|${member.childName}|${member.parentRole}`;

    if (existingKeySet.has(dedupKey)) {
      console.log(`  SKIP (already in Convex): ${member.parentRole} ${childName} → ${toAddr}`);
      continue;
    }

    recovered.push({
      uuid,
      resendEmailId: email.id,
      to: member.to,
      childName: member.childName,
      parentRole: member.parentRole,
      ploeg: member.ploeg,
      club: member.club,
      createdAt: email.created_at,
    });
  }

  console.log(`\nRecovery summary:`);
  console.log(`  To recover: ${recovered.length}`);
  console.log(`  Failed: ${failed.length}`);
  if (failed.length > 0) {
    for (const f of failed) console.log(`    ${f}`);
  }

  if (recovered.length === 0) {
    console.log('\nNothing to recover.');
    return;
  }

  console.log(`\nRecipients to recover:`);
  for (const r of recovered) {
    console.log(`  ${r.parentRole} ${r.childName} (${r.ploeg}) → ${r.to} [uuid=${r.uuid}]`);
  }

  if (dryRun) {
    console.log(`\nDry run — no changes made. Run without --dry-run to store in Convex.`);
    return;
  }

  // Store in Convex
  const campaignId = recovered[0].createdAt;
  const recipients = recovered.map((r) => ({
    externalId: r.uuid,
    campaignExternalId: campaignId,
    mode: 'send' as const,
    to: r.to,
    originalTo: r.to,
    effectiveTo: r.to,
    parentRole: r.parentRole as 'mama' | 'papa',
    childName: r.childName,
    ploeg: r.ploeg,
    club: r.club,
    sentAt: r.createdAt,
    resendEmailId: r.resendEmailId,
  }));

  await convex.mutation(anyApi.seasonIntent.createCampaign, {
    campaign: {
      externalId: campaignId,
      mode: 'send',
      createdAt: campaignId,
      recipientCount: recipients.length,
      filter: { childNames: [], parentRoles: [], teams: ['U9'] },
    },
    recipients,
  });

  console.log(`\nCampaign stored in Convex with ${recipients.length} recipients (with original UUIDs).`);
}

main().catch((err) => {
  console.error('Recovery failed:', err);
  process.exit(1);
});
