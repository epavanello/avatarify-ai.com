import { PUBLIC_WEBSITE_HOST } from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';
import config from '$lib/config';

export const GET: RequestHandler = async () => {
  const robots = `
User-agent: *

${config.noIndex ? 'Disallow: /' : 'Allow: /'}

Sitemap: ${PUBLIC_WEBSITE_HOST}/sitemap.xml`.trim();
  return new Response(robots);
};
