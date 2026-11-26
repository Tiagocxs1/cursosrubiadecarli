import type { BlogPost } from './blog';

export type { BlogPost };

/** Retorna o identificador de URL do post (slug ou id como fallback). */
export function postUrl(post: Pick<BlogPost, 'slug' | 'id'>): string {
  return post.slug ?? post.id;
}

/** Formata data para exibição em pt-BR. */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

/** Tempo estimado de leitura (aprox. 200 palavras/min). */
export function readingTime(content: string | null): string {
  if (!content) return '1 min';
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min de leitura`;
}
