import type { APIRoute } from 'astro';
import { anyApi } from 'convex/server';
import { getConvexClient } from '../../../lib/convex-client.js';
import { jsonHeaders } from '../../../lib/season-intent/shared.js';

export const GET: APIRoute = async ({ request }) => {
  const expectedToken = import.meta.env.SEASON_INTENT_TOKEN?.trim();
  const authorization = request.headers.get('authorization')?.trim();

  if (!expectedToken || authorization !== `Bearer ${expectedToken}`) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: jsonHeaders(),
    });
  }

  try {
    const convex = getConvexClient();
    const results = await convex.query(anyApi.seasonIntent.getResults, {});

    const url = new URL(request.url);
    const teamFilter = url.searchParams.get('team')?.toUpperCase();
    const statusFilter = url.searchParams.get('status'); // 'responded' or 'pending'

    let filtered = teamFilter
      ? results.filter((r: any) => r.ploeg === teamFilter)
      : results;

    if (statusFilter === 'responded') {
      filtered = filtered.filter((r: any) => r.choice !== null);
    } else if (statusFilter === 'pending') {
      filtered = filtered.filter((r: any) => r.choice === null);
    }

    const responded = filtered.filter((r: any) => r.choice !== null);
    const pending = filtered.filter((r: any) => r.choice === null);

    return new Response(
      JSON.stringify(
        {
          ok: true,
          totalSent: filtered.length,
          responded: responded.length,
          pending: pending.length,
          summary: {
            stay: responded.filter((r: any) => r.choice === 'stay').length,
            leave: responded.filter((r: any) => r.choice === 'leave').length,
            talk: responded.filter((r: any) => r.choice === 'talk').length,
          },
          results: filtered.sort((a: any, b: any) => a.childName.localeCompare(b.childName)),
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
    return new Response(
      JSON.stringify({ ok: false, error: String(error?.message || error) }),
      {
        status: 500,
        headers: jsonHeaders(),
      },
    );
  }
};
