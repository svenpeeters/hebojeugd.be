const CLUB_ID = '9732';
const GRAPHQL_URL = 'https://datalake-prod2018.rbfa.be/graphql';
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;

let memoryCache: { fetchedAt: string; matches: any[] } | null = null;

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

function cleanClubName(name: string) {
  if (!name) return '';

  return name
    .replace(/\s+[A-Z]\s+\d+$/u, '') // e.g. "B 1", "C 3"
    .replace(/\s+[A-Z]$/u, '') // e.g. "A", "B", "C"
    .replace(/\s+\d+-\d+$/u, '') // e.g. "2-1"
    .replace(/\s+\d+$/u, '') // trailing number
    .replace(/\s{2,}/g, ' ')
    .trim();
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables }),
  });

  if (!res.ok) throw new Error(`Upstream returned ${res.status}`);

  const payload = await res.json();
  const upstreamMatches = payload?.data?.clubMatchesAssignations ?? [];

  return upstreamMatches
    .map((m: any) => {
      const [date = '', time = ''] = String(m.startTime || '').split('T');
      const location = [m?.location?.address, m?.location?.postalCode, m?.location?.city]
        .filter(Boolean)
        .join(', ');

      const teamLabel = (m?.ageGroup || m?.title || 'Onbekend').replace('Recrea Veteran', '35+ Veteranen');

      const homeRaw = m?.homeTeam?.name || '';
      const awayRaw = m?.awayTeam?.name || '';

      return {
        date,
        time: (time || '').slice(0, 5),
        team: teamLabel,
        home: cleanClubName(homeRaw),
        away: cleanClubName(awayRaw),
        homeRaw,
        awayRaw,
        location,
        isHome: String(m?.homeTeam?.clubId || '') === CLUB_ID,
      };
    })
    .sort((a: any, b: any) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

export async function getMatches() {
  if (memoryCache) {
    const age = Date.now() - new Date(memoryCache.fetchedAt).getTime();
    if (age < CACHE_TTL_MS) return memoryCache.matches;
  }

  const matches = await fetchUpstreamMatches();
  memoryCache = { fetchedAt: new Date().toISOString(), matches };
  return matches;
}

export async function getMatchesSafe() {
  try {
    return await getMatches();
  } catch {
    return memoryCache?.matches ?? [];
  }
}
