import { anyApi } from 'convex/server';
import type { SeasonIntentCampaignRecord, SeasonIntentResponseRecord } from './shared.js';
import { getConvexClient } from '../convex-client.js';

export interface SentRecipientKey {
  to: string;
  childName: string;
  parentRole: 'mama' | 'papa';
}

export function sentRecipientKeyString(key: SentRecipientKey): string {
  return `${key.to}|${key.childName}|${key.parentRole}`;
}

export async function loadSentRecipientKeys(): Promise<SentRecipientKey[]> {
  const client = getConvexClient();
  return await client.query(anyApi.seasonIntent.getSentRecipientKeys, {});
}

interface CampaignMetadata {
  externalId: string;
  mode: 'test' | 'send';
  createdAt: string;
  recipientCount: number;
  filter: {
    childNames: string[];
    parentRoles: Array<'mama' | 'papa'>;
    teams: string[];
  } | null;
}

export async function appendCampaign(metadata: CampaignMetadata, recipients: SeasonIntentCampaignRecord[]) {
  const client = getConvexClient();
  await client.mutation(anyApi.seasonIntent.createCampaign, {
    campaign: metadata,
    recipients: recipients.map((recipient) => ({
      externalId: recipient.id,
      campaignExternalId: recipient.campaignId,
      mode: recipient.mode,
      to: recipient.to,
      originalTo: recipient.originalTo,
      effectiveTo: recipient.effectiveTo,
      parentRole: recipient.parentRole,
      childName: recipient.childName,
      ploeg: recipient.ploeg,
      club: recipient.club,
      sentAt: recipient.sentAt,
      resendEmailId: recipient.resendEmailId,
    })),
  });
}

export async function findRecipientById(id: string) {
  const client = getConvexClient();
  const recipient = await client.query(anyApi.seasonIntent.getRecipientByExternalId, {
    externalId: id,
  });

  if (!recipient) return null;

  return {
    id: recipient.externalId,
    campaignId: recipient.campaignExternalId,
    mode: recipient.mode,
    to: recipient.to,
    originalTo: recipient.originalTo,
    effectiveTo: recipient.effectiveTo,
    parentRole: recipient.parentRole,
    childName: recipient.childName,
    ploeg: recipient.ploeg,
    club: recipient.club,
    sentAt: recipient.sentAt,
    resendEmailId: recipient.resendEmailId,
  } satisfies SeasonIntentCampaignRecord;
}

export async function findResponseById(id: string) {
  const client = getConvexClient();
  const response = await client.query(anyApi.seasonIntent.getResponseByRecipientExternalId, {
    recipientExternalId: id,
  });

  if (!response) return null;

  return {
    id: response.recipientExternalId,
    campaignId: response.campaignExternalId,
    choice: response.choice,
    respondedAt: response.respondedAt,
  } satisfies SeasonIntentResponseRecord;
}

export async function saveResponse(response: SeasonIntentResponseRecord) {
  const client = getConvexClient();
  const result = await client.mutation(anyApi.seasonIntent.createResponse, {
    recipientExternalId: response.id,
    campaignExternalId: response.campaignId,
    choice: response.choice,
    respondedAt: response.respondedAt,
  });

  return {
    created: Boolean(result?.created),
  };
}

