import type { APIRoute } from 'astro';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const CLUB_ID = '9732';
const GRAPHQL_URL = 'https://datalake-prod2018.rbfa.be/graphql';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1x per day
const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'matches.json');

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

async function readCache() {
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed?.fetchedAt || !Array.isArray(parsed?.matches)) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeCache(matches: any[]) {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(
    CACHE_FILE,
    JSON.stringify({ fetchedAt: new Date().toISOString(), matches }, null, 2),
    'utf-8',
  );
}

async function fetchUpstreamMatches() {
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

  return upstreamMatches
    .map((m: any) => {
      const [date = '', time = ''] = String(m.startTime || '').split('T');
      const location = [m?.location?.address, m?.location?.postalCode, m?.location?.city]
        .filter(Boolean)
        .join(', ');

      const teamLabel = (m?.ageGroup || m?.title || 'Onbekend')
        .replace('Recrea Veteran', '35+ Veteranen');

      return {
        date,
        time: (time || '').slice(0, 5),
        team: teamLabel,
        home: m?.homeTeam?.name || '',
        away: m?.awayTeam?.name || '',
        location,
        isHome: String(m?.homeTeam?.clubId || '') === CLUB_ID,
      };
    })
    .sort((a: any, b: any) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

export const GET: APIRoute = async () => {
  try {
    const cached = await readCache();
    const now = Date.now();

    if (cached) {
      const age = now - new Date(cached.fetchedAt).getTime();
      if (age < CACHE_TTL_MS) {
        return new Response(JSON.stringify({ matches: cached.matches }, null, 2), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        });
      }
    }

    const matches = await fetchUpstreamMatches();
    await writeCache(matches);

    return new Response(JSON.stringify({ matches }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    const cached = await readCache();
    if (cached?.matches?.length) {
      return new Response(JSON.stringify({ matches: cached.matches }, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }

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
