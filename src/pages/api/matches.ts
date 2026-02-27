import type { APIRoute } from 'astro';
import matches from '../../data/matches.json';

function toDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

export const GET: APIRoute = () => {
  const sorted = [...matches].sort((a, b) =>
    toDateTime(a.date, a.time).getTime() - toDateTime(b.date, b.time).getTime()
  );

  return new Response(JSON.stringify({ matches: sorted }, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
