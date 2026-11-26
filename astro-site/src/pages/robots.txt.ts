import type { APIRoute } from 'astro';
export const GET: APIRoute = () => new Response(
  'User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://cursos.rubiadecarli.com.br/sitemap.xml\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } }
);
