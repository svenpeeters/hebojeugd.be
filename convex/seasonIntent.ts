import { mutationGeneric, queryGeneric } from 'convex/server';
import { v } from 'convex/values';

export const createCampaign = mutationGeneric({
  args: {
    campaign: v.object({
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
    }),
    recipients: v.array(
      v.object({
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
      }),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('campaigns', args.campaign);

    for (const recipient of args.recipients) {
      await ctx.db.insert('seasonIntentRecipients', recipient);
    }

    return { ok: true };
  },
});

export const getSentRecipientKeys = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const recipients = await ctx.db
      .query('seasonIntentRecipients')
      .filter((q) => q.eq(q.field('mode'), 'send'))
      .collect();

    return recipients.map((r) => ({
      to: r.to,
      childName: r.childName,
      parentRole: r.parentRole,
    }));
  },
});

// Combined query: returns active members + sent recipient keys in a single call
export const getActiveMembersAndSentKeys = queryGeneric({
  args: {},
  handler: async (ctx) => {
    // Get active import
    const [activeImport] = await ctx.db
      .query('memberImports')
      .withIndex('by_is_active_and_created_at', (q) => q.eq('isActive', true))
      .order('desc')
      .take(1);

    if (!activeImport) {
      return { members: [], sentKeys: [] };
    }

    // Get members for active import
    const members = await ctx.db
      .query('members')
      .withIndex('by_import_external_id', (q) => q.eq('importExternalId', activeImport.externalId))
      .take(512);

    // Get sent recipient keys
    const sentRecipients = await ctx.db
      .query('seasonIntentRecipients')
      .filter((q) => q.eq(q.field('mode'), 'send'))
      .collect();

    return {
      members: members.map((m) => ({
        sourceRowNumber: m.sourceRowNumber,
        naam: m.naam,
        adres: m.adres,
        postcode: m.postcode,
        woonplaats: m.woonplaats,
        geboortedatum: m.geboortedatum,
        telefoonMama: m.telefoonMama,
        telefoonPapa: m.telefoonPapa,
        emailMama: m.emailMama,
        emailPapa: m.emailPapa,
        ploeg: m.ploeg,
        club: m.club,
        rawDataJson: m.rawDataJson,
      })),
      sentKeys: sentRecipients.map((r) => ({
        to: r.to,
        childName: r.childName,
        parentRole: r.parentRole,
      })),
    };
  },
});

export const getRecipientByExternalId = queryGeneric({
  args: {
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('seasonIntentRecipients')
      .withIndex('by_external_id', (q) => q.eq('externalId', args.externalId))
      .unique();
  },
});

export const getResponseByRecipientExternalId = queryGeneric({
  args: {
    recipientExternalId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('seasonIntentResponses')
      .withIndex('by_recipient_external_id', (q) => q.eq('recipientExternalId', args.recipientExternalId))
      .unique();
  },
});

export const createResponse = mutationGeneric({
  args: {
    recipientExternalId: v.string(),
    campaignExternalId: v.string(),
    choice: v.union(v.literal('stay'), v.literal('leave'), v.literal('talk')),
    respondedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('seasonIntentResponses')
      .withIndex('by_recipient_external_id', (q) => q.eq('recipientExternalId', args.recipientExternalId))
      .unique();

    if (existing) {
      return { ok: true, created: false, response: existing };
    }

    const responseId = await ctx.db.insert('seasonIntentResponses', args);
    const response = await ctx.db.get(responseId);
    return { ok: true, created: true, response };
  },
});
