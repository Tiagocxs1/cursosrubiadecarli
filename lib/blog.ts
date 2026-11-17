/**
 * Blog — funções de acesso à tabela `contents` no Supabase.
 *
 * Filtra sempre por org_id (SUPABASE_ORGANIZATION_ID) e status = 'published'.
 * Usa supabaseAdmin (service role) para ignorar RLS e garantir leitura segura
 * em Server Components e API routes.
 *
 * ⚠️ Assunções sobre a tabela `contents` (ajuste os nomes se necessário):
 *   id, org_id, title, slug, excerpt, content, cover_image,
 *   status, type, tags, author, published_at, created_at
 */

import 'server-only';
import { supabaseAdmin } from './supabase';

// ---------------------------------------------------------------------------
// Tipo
// ---------------------------------------------------------------------------

export interface BlogPost {
  id: string;
  org_id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  status: string;
  type: string | null;
  tags: string[] | null;
  author: string | null;
  published_at: string | null;
  created_at: string;
}

interface ContentRow {
  id: string;
  organization_id: string;
  post_title: string | null;
  post_name: string | null;
  post_excerpt: string | null;
  post_content: string | null;
  featured_image: string | null;
  post_status: string | null;
  post_tag: string | string[] | null;
  post_author: string | null;
  post_date: string | null;
  created_at: string;
}

function parseTags(raw: string | string[] | null): string[] | null {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [String(parsed)];
  } catch {
    return raw.split(',').map((t) => t.trim()).filter(Boolean);
  }
}

function mapRow(row: ContentRow): BlogPost {
  return {
    id: row.id,
    org_id: row.organization_id,
    title: row.post_title ?? '',
    slug: row.post_name,
    excerpt: row.post_excerpt,
    content: row.post_content,
    cover_image: row.featured_image,
    status: row.post_status ?? '',
    type: null,
    tags: parseTags(row.post_tag),
    author: row.post_author,
    published_at: row.post_date,
    created_at: row.created_at,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ORG_ID = process.env.SUPABASE_ORGANIZATION_ID?.replace(/\\n/g, '').trim() ?? '';

export { postUrl, formatDate, readingTime } from './blog-utils';

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Lista posts publicados para o org, ordenados por data. */
export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
  const select =
    'id, organization_id, post_title, post_name, post_excerpt, post_content, featured_image, post_status, post_tag, post_author, post_date, created_at';
  let query = supabaseAdmin
    .from('contents')
    .select(select)
    .eq('organization_id', ORG_ID)
    .eq('post_status', 'publish')
    .order('post_date', { ascending: false, nullsFirst: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[blog] getPublishedPosts error:', error.message);
    return [];
  }

  return (data ?? []).map(mapRow) as BlogPost[];
}

/** Busca um post pelo slug ou id. */
export async function getPostBySlug(slugOrId: string): Promise<BlogPost | null> {
  // Tenta por slug primeiro
  const { data: bySlug } = await supabaseAdmin
    .from('contents')
    .select('*')
    .eq('organization_id', ORG_ID)
    .eq('post_name', slugOrId)
    .eq('post_status', 'publish')
    .single();

  if (bySlug) return mapRow(bySlug as ContentRow) as BlogPost;

  // Fallback por id
  const { data: byId } = await supabaseAdmin
    .from('contents')
    .select('*')
    .eq('organization_id', ORG_ID)
    .eq('id', slugOrId)
    .eq('post_status', 'publish')
    .single();

  return (byId ? mapRow(byId as ContentRow) : null) as BlogPost | null;
}

/** Retorna todos os slugs/ids publicados (para generateStaticParams). */
export async function getAllPostSlugs(): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from('contents')
    .select('id, post_name')
    .eq('organization_id', ORG_ID)
    .eq('post_status', 'publish');

  return (data ?? []).map((p: { id: string; post_name: string | null }) => p.post_name ?? p.id);
}
