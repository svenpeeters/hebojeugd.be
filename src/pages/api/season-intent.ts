import type { APIRoute } from 'astro';
import { buildSeasonIntentRecipients } from '../../lib/members.js';
import { loadActiveMembers } from '../../lib/members-storage.js';
import { sendSeasonIntentEmails } from '../../lib/season-intent/email.js';
import { appendCampaign, loadSentRecipientKeys, sentRecipientKeyString } from '../../lib/season-intent/storage.js';
import { ALLOWED_YOUTH_TEAMS, isSeasonIntentMode, jsonHeaders, type SeasonIntentMode } from '../../lib/season-intent/shared.js';

interface RequestBody {
  mode?: string;
  filter?: {
    childNames?: unknown;
    parentRoles?: unknown;
    teams?: unknown;
  };
}

type ParentRoleFilter = 'mama' | 'papa';

function isParentRoleFilter(value: string): value is ParentRoleFilter {
  return value === 'mama' || value === 'papa';
}

const unauthorized = () =>
  new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
    status: 401,
    headers: jsonHeaders(),
  });

const badRequest = (error: string, details?: Record<string, unknown>) =>
  new Response(JSON.stringify({ ok: false, error, ...details }), {
    status: 400,
    headers: jsonHeaders(),
  });

const internalError = (error: string, detail: string) =>
  new Response(JSON.stringify({ ok: false, error, detail }), {
    status: 500,
    headers: jsonHeaders(),
  });

export const POST: APIRoute = async ({ request }) => {
  const expectedToken = import.meta.env.SEASON_INTENT_TOKEN?.trim();
  const authorization = request.headers.get('authorization')?.trim();

  if (!expectedToken || authorization !== `Bearer ${expectedToken}`) {
    return unauthorized();
  }

  let mode: SeasonIntentMode = 'dry-run';
  let filterChildNames: string[] = [];
  let filterParentRoles: ParentRoleFilter[] = [];
  let filterTeams: string[] = [];

  try {
    const body = (await request.json().catch(() => ({}))) as RequestBody;
    mode = isSeasonIntentMode(body?.mode) ? body.mode : 'dry-run';
    filterChildNames = Array.isArray(body?.filter?.childNames)
      ? body.filter.childNames
          .map((value) => String(value).trim())
          .filter(Boolean)
      : [];
    filterParentRoles = Array.isArray(body?.filter?.parentRoles)
      ? body.filter.parentRoles
          .map((value) => String(value).trim().toLowerCase())
          .filter(isParentRoleFilter)
      : [];
    filterTeams = Array.isArray(body?.filter?.teams)
      ? body.filter.teams
          .map((value) => String(value).trim().toUpperCase())
          .filter((value) => ALLOWED_YOUTH_TEAMS.has(value))
      : [];
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (mode === 'test' && filterChildNames.length === 0) {
    return badRequest('filter.childNames is required in test mode');
  }

  try {
    const members = await loadActiveMembers();
    const result = buildSeasonIntentRecipients(members);
    const hasFilter = filterChildNames.length > 0 || filterParentRoles.length > 0 || filterTeams.length > 0;
    const filterSummary = hasFilter
      ? { childNames: filterChildNames, parentRoles: filterParentRoles, teams: filterTeams }
      : null;

    const selectedRecipients = !hasFilter
      ? result.recipients
      : result.recipients.filter((recipient) => {
          const childNameMatches = filterChildNames.length === 0 || filterChildNames.includes(recipient.childName);
          const parentRoleMatches =
            filterParentRoles.length === 0 || filterParentRoles.includes(recipient.parentRole);
          const teamMatches = filterTeams.length === 0 || filterTeams.includes(recipient.ploeg);
          return childNameMatches && parentRoleMatches && teamMatches;
        });

    if (hasFilter && selectedRecipients.length === 0) {
      return badRequest('No recipients matched the provided filter', {
        filter: filterSummary,
      });
    }

    // Deduplication: remove recipients that were already sent in a previous campaign
    const sentKeys = await loadSentRecipientKeys();
    const sentKeySet = new Set(sentKeys.map(sentRecipientKeyString));
    const deduplicatedRecipients = selectedRecipients.filter(
      (r) => sentKeySet.has(sentRecipientKeyString({ to: r.to, childName: r.childName, parentRole: r.parentRole })),
    );
    const newRecipients = selectedRecipients.filter(
      (r) => !sentKeySet.has(sentRecipientKeyString({ to: r.to, childName: r.childName, parentRole: r.parentRole })),
    );

    if (mode === 'dry-run') {
      return new Response(
        JSON.stringify(
          {
            ok: true,
            mode,
            source: 'convex:members',
            summary: result.summary,
            totalRecipientCount: result.recipients.length,
            selectedRecipientCount: selectedRecipients.length,
            newRecipientCount: newRecipients.length,
            deduplicatedCount: deduplicatedRecipients.length,
            filter: filterSummary,
            selectedRecipients: newRecipients,
            deduplicatedRecipients: deduplicatedRecipients.map((r) => ({
              to: r.to,
              childName: r.childName,
              parentRole: r.parentRole,
              ploeg: r.ploeg,
            })),
            skippedRecords: result.skippedRecords,
          },
          null,
          2,
        ),
        {
          status: 200,
          headers: jsonHeaders(),
        },
      );
    }

    if (newRecipients.length === 0) {
      return new Response(
        JSON.stringify(
          {
            ok: true,
            mode,
            totalRecipientCount: result.recipients.length,
            selectedRecipientCount: selectedRecipients.length,
            newRecipientCount: 0,
            deduplicatedCount: deduplicatedRecipients.length,
            filter: filterSummary,
            message: 'All selected recipients were already sent in a previous campaign',
          },
          null,
          2,
        ),
        {
          status: 200,
          headers: jsonHeaders(),
        },
      );
    }

    const baseUrl = import.meta.env.SEASON_INTENT_BASE_URL?.trim() || 'https://www.hebojeugd.be';
    const from = import.meta.env.RESEND_FROM_EMAIL?.trim() || 'info@hebojeugd.be';
    const replyTo = import.meta.env.RESEND_REPLY_TO?.trim() || undefined;

    const sent = await sendSeasonIntentEmails({
      recipients: newRecipients,
      mode,
      from,
      replyTo,
      baseUrl,
    });

    await appendCampaign(
      {
        externalId: sent.campaignId,
        mode,
        createdAt: sent.sentAt,
        recipientCount: sent.records.length,
        filter: filterSummary,
      },
      sent.records,
    );

    return new Response(
      JSON.stringify(
        {
          ok: true,
          mode,
          campaignId: sent.campaignId,
          totalRecipientCount: result.recipients.length,
          selectedRecipientCount: selectedRecipients.length,
          newRecipientCount: newRecipients.length,
          deduplicatedCount: deduplicatedRecipients.length,
          filter: filterSummary,
          recipientCount: sent.records.length,
          preview: sent.records.slice(0, 10),
        },
        null,
        2,
      ),
      {
        status: 200,
        headers: jsonHeaders(),
      },
    );
  } catch (error: any) {
    return internalError('Season intent processing failed', String(error?.message || error));
  }
};
