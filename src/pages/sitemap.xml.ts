import type { APIRoute } from 'astro';

const pages = [
  '/',
  '/jeugdwerking',
  '/trainers',
  '/kalender',
  '/inschrijven',
  '/kledij',
  '/paastoernooi',
  '/open-trainingsdagen',
  '/huishoudelijk-reglement',
  '/trainers-cards',
];

export const GET: APIRoute = () => {
  const base = 'https://www.hebojeugd.be';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (path) => `  <url><loc>${base}${path}</loc></url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
