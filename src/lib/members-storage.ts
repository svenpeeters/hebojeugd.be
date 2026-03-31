import { anyApi } from 'convex/server';
import type { MemberRecord } from './members.js';
import { getConvexClient } from './convex-client.js';

interface MemberImportMetadata {
  externalId: string;
  source: string;
  createdAt: string;
  rowCount: number;
  isActive: true;
  status: 'completed';
}

export async function replaceMembersSnapshot(memberImport: MemberImportMetadata, members: MemberRecord[]) {
  const client = getConvexClient();
  await client.mutation(anyApi.members.replaceActiveImportSnapshot, {
    memberImport,
    members: members.map((member) => ({
      ...member,
      importExternalId: memberImport.externalId,
    })),
  });
}

export async function loadActiveMembers(): Promise<MemberRecord[]> {
  const client = getConvexClient();
  const activeImport = await client.query(anyApi.members.getActiveImport, {});

  if (!activeImport) {
    throw new Error('No active member import found in Convex');
  }

  // Delay between Convex queries to respect rate limit (5 req/s)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const members = await client.query(anyApi.members.getMembersForImport, {
    importExternalId: activeImport.externalId,
  });

  return members.map((member: any) => ({
    sourceRowNumber: member.sourceRowNumber,
    naam: member.naam,
    adres: member.adres,
    postcode: member.postcode,
    woonplaats: member.woonplaats,
    geboortedatum: member.geboortedatum,
    telefoonMama: member.telefoonMama,
    telefoonPapa: member.telefoonPapa,
    emailMama: member.emailMama,
    emailPapa: member.emailPapa,
    ploeg: member.ploeg,
    club: member.club,
    rawDataJson: member.rawDataJson,
  }));
}

