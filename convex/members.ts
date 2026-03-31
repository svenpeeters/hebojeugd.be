import { mutationGeneric, queryGeneric } from 'convex/server';
import { v } from 'convex/values';

const memberValidator = v.object({
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
});

export const replaceActiveImportSnapshot = mutationGeneric({
  args: {
    memberImport: v.object({
      externalId: v.string(),
      source: v.string(),
      createdAt: v.string(),
      rowCount: v.number(),
      isActive: v.boolean(),
      status: v.union(v.literal('completed')),
    }),
    members: v.array(memberValidator),
  },
  handler: async (ctx, args) => {
    const activeImports = await ctx.db
      .query('memberImports')
      .withIndex('by_is_active_and_created_at', (q) => q.eq('isActive', true))
      .order('desc')
      .take(20);

    for (const memberImport of activeImports) {
      await ctx.db.patch(memberImport._id, { isActive: false });
    }

    await ctx.db.insert('memberImports', args.memberImport);

    for (const member of args.members) {
      await ctx.db.insert('members', member);
    }

    return { ok: true, rowCount: args.members.length };
  },
});

export const getActiveImport = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const [activeImport] = await ctx.db
      .query('memberImports')
      .withIndex('by_is_active_and_created_at', (q) => q.eq('isActive', true))
      .order('desc')
      .take(1);

    return activeImport ?? null;
  },
});

export const getMembersForImport = queryGeneric({
  args: {
    importExternalId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('members')
      .withIndex('by_import_external_id', (q) => q.eq('importExternalId', args.importExternalId))
      .take(512);
  },
});
