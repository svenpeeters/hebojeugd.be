import type { APIRoute } from 'astro';

const CLUB_ID = '9732';
const GRAPHQL_URL = 'https://datalake-prod2018.rbfa.be/graphql';

const QUERY = `
  query clubMatchesAssignations($clubId: ID!, $language: Language!, $startDate: String!, $endDate: String!, $hasLocation: Boolean!) {
    clubMatchesAssignations(clubId: $clubId, language: $language, startDate: $startDate, endDate: $endDate, hasLocation: $hasLocation) {
      startTime
      ageGroup
      title
      homeTeam {
        name
        clubId
      }
      awayTeam {
        name
        clubId
      }
      location {
        address
        postalCode
        city
      }
    }
  }
`;

function toYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

export const GET: APIRoute = async () => {
  try {
    const now = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + 6);

    const variables = {
      clubId: CLUB_ID,
      language: 'nl',
      startDate: toYmd(now),
      endDate: toYmd(end),
      hasLocation: true,
    };

    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY, variables }),
    });

    if (!res.ok) {
      throw new Error(`Upstream returned ${res.status}`);
    }

    const payload = await res.json();
    const upstreamMatches = payload?.data?.clubMatchesAssignations ?? [];

    const matches = upstreamMatches
      .map((m: any) => {
        const [date = '', time = ''] = String(m.startTime || '').split('T');
        const location = [m?.location?.address, m?.location?.postalCode, m?.location?.city]
          .filter(Boolean)
          .join(', ');

        return {
          date,
          time: (time || '').slice(0, 5),
          team: m?.ageGroup || m?.title || 'Onbekend',
          home: m?.homeTeam?.name || '',
          away: m?.awayTeam?.name || '',
          location,
          isHome: String(m?.homeTeam?.clubId || '') === CLUB_ID,
        };
      })
      .sort((a: any, b: any) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

    return new Response(JSON.stringify({ matches, source: 'voetbalvlaanderen' }, null, 2), {
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
          source: 'voetbalvlaanderen',
          error: 'Failed to load upstream matches',
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
