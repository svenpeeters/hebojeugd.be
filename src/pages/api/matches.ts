import type { APIRoute } from 'astro';
import { getMatchesSafe } from '../../lib/matches';

export const GET: APIRoute = async () => {
  try {
    const matches = await getMatchesSafe();

    return new Response(JSON.stringify({ matches }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify(
        {
          matches: [],
          error: 'Failed to load matches',
          detail: String(error?.message || error),
        },
        null,
        2,
      ),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      },
    );
  }
};
