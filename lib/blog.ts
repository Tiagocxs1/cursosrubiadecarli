/**
 * Blog — funções de acesso à tabela `contents` no Supabase.
 *
 * Filtra sempre por org_id (NEXT_PUBLIC_CLERK_ORG_ID) e status = 'published'.
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ORG_ID = process.env.NEXT_PUBLIC_CLERK_ORG_ID ?? '';

export { postUrl, formatDate, readingTime } from './blog-utils';

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Lista posts publicados para o org, ordenados por data. */
export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
  let query = supabaseAdmin
    .from('contents')
    .select(
      'id, org_id, title, slug, excerpt, cover_image, status, type, tags, author, published_at, created_at'
    )
    .eq('org_id', ORG_ID)
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[blog] getPublishedPosts error:', error.message);
    return [];
  }

  return (data ?? []) as BlogPost[];
}

/** Busca um post pelo slug ou id. */
export async function getPostBySlug(slugOrId: string): Promise<BlogPost | null> {
  // Tenta por slug primeiro
  const { data: bySlug } = await supabaseAdmin
    .from('contents')
    .select('*')
    .eq('org_id', ORG_ID)
    .eq('slug', slugOrId)
    .eq('status', 'published')
    .single();

  if (bySlug) return bySlug as BlogPost;

  // Fallback por id
  const { data: byId } = await supabaseAdmin
    .from('contents')
    .select('*')
    .eq('org_id', ORG_ID)
    .eq('id', slugOrId)
    .eq('status', 'published')
    .single();

  return (byId ?? null) as BlogPost | null;
}

/** Retorna todos os slugs/ids publicados (para generateStaticParams). */
export async function getAllPostSlugs(): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from('contents')
    .select('id, slug')
    .eq('org_id', ORG_ID)
    .eq('status', 'published');

  return (data ?? []).map((p: { id: string; slug: string | null }) => p.slug ?? p.id);
}
