import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  memberImports: defineTable({
    externalId: v.string(),
    source: v.string(),
    createdAt: v.string(),
    rowCount: v.number(),
    isActive: v.boolean(),
    status: v.union(v.literal('completed')),
  })
    .index('by_external_id', ['externalId'])
    .index('by_is_active_and_created_at', ['isActive', 'createdAt']),

  members: defineTable({
    importExternalId: v.string(),
    sourceRowNumber: v.number(),
    naam: v.string(),
    adres: v.string(),
    postcode: v.string(),
    woonplaats: v.string(),
    geboortedatum: v.string(),
    telefoonMama: v.string(),
    telefoonPapa: v.string(),
    emailMama: v.string(),
    emailPapa: v.string(),
    ploeg: v.string(),
    club: v.string(),
    rawDataJson: v.string(),
  })
    .index('by_import_external_id', ['importExternalId'])
    .index('by_naam_and_geboortedatum', ['naam', 'geboortedatum']),

  campaigns: defineTable({
    externalId: v.string(),
    mode: v.union(v.literal('test'), v.literal('send')),
    createdAt: v.string(),
    recipientCount: v.number(),
    filter: v.union(
      v.null(),
      v.object({
        childNames: v.array(v.string()),
        parentRoles: v.array(v.union(v.literal('mama'), v.literal('papa'))),
        teams: v.array(v.string()),
      }),
    ),
  })
    .index('by_external_id', ['externalId'])
    .index('by_created_at', ['createdAt']),

  seasonIntentRecipients: defineTable({
    externalId: v.string(),
    campaignExternalId: v.string(),
    mode: v.union(v.literal('test'), v.literal('send')),
    to: v.string(),
    originalTo: v.string(),
    effectiveTo: v.string(),
    parentRole: v.union(v.literal('mama'), v.literal('papa')),
    childName: v.string(),
    ploeg: v.string(),
    club: v.string(),
    sentAt: v.string(),
    resendEmailId: v.union(v.null(), v.string()),
  })
    .index('by_external_id', ['externalId'])
    .index('by_campaign_external_id', ['campaignExternalId']),

  seasonIntentResponses: defineTable({
    recipientExternalId: v.string(),
    campaignExternalId: v.string(),
    choice: v.union(v.literal('stay'), v.literal('leave'), v.literal('talk')),
    respondedAt: v.string(),
  })
    .index('by_recipient_external_id', ['recipientExternalId'])
    .index('by_campaign_external_id', ['campaignExternalId']),
});
