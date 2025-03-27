import { PUBLIC_WEBSITE_HOST } from '$env/static/public';
import { buildDate } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import { format } from 'date-fns';

export const GET: RequestHandler = async () => {
  const pages = import.meta.glob('/src/routes/**/+page.(svelte|md)');

  const exclude: string[] = [];

  const routes = Object.keys(pages)
    .map((x) => x.replace('/src/routes', ''))
    .map((x) => x.replace('/+page.svelte', ''))
    .map((x) => x.replace('/+page.md', ''))
    .map((x) => x.replaceAll(/\/\(\w+\)/g, '')) // remove (groups)
    .filter((x) => !x.includes('[')) // filter out parameterized routes
    .filter((x) => !exclude.includes(x)) // filter out excluded routes
    .sort();

  const createSitemapEntry = (route: string) =>
    `
  <url>
    <loc>${PUBLIC_WEBSITE_HOST}${route}</loc>
    <lastmod>${format(buildDate, 'yyyy-MM-dd')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `.trim();

  const sitemap = `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .flatMap((route) => createSitemapEntry(route))
  .join('')
  .replaceAll('\n', '')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
