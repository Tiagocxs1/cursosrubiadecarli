interface Env {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_ORGANIZATION_ID?: string;
}
type PostRow = { id: string; post_name: string | null };

async function findPublishedPost(env: Env, slug: string): Promise<boolean> {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY || !env.SUPABASE_ORGANIZATION_ID) return false;
  const query = new URL('/rest/v1/contents', env.SUPABASE_URL);
  query.searchParams.set('select', 'id,post_name');
  query.searchParams.set('organization_id', 'eq.' + env.SUPABASE_ORGANIZATION_ID);
  query.searchParams.set('post_status', 'eq.publish');
  query.searchParams.set('limit', '1');
  if (/^[0-9a-f-]{20,}$/i.test(slug)) query.searchParams.set('id', 'eq.' + slug);
  else query.searchParams.set('post_name', 'eq.' + slug);

  try {
    const response = await fetch(query, {
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: 'Bearer ' + env.SUPABASE_PUBLISHABLE_KEY,
      },
    });
    if (!response.ok) return false;
    const rows = await response.json() as PostRow[];
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

export async function onRequest({ request, env, next }: {
  request: Request;
  env: Env;
  next: (request?: Request) => Promise<Response>;
}) {
  const url = new URL(request.url);
  const slug = decodeURIComponent(url.pathname.replace(/\/+$/, '').split('/').pop() || '');

  // Internal article renderer used after a public slug has been verified.
  if (slug === 'post') return next();

  if (!slug || !(await findPublishedPost(env, slug))) {
    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=60' },
    });
  }

  const target = new URL('/blog/post/', url.origin);
  return next(new Request(target, request));
}
