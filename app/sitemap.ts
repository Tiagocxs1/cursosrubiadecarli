import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/blog';

export const revalidate = 3600;

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br').replace(/\\n/g, '').trim().replace(/\/+$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/cursos/tricologia-essencial`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/cursos/protocolo-full-face`, changeFrequency: 'monthly', priority: 0.9 },
  ];

  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    posts = await getPublishedPosts();
  } catch {
    // Se o Supabase estiver indisponível, mantém apenas as páginas estáticas.
  }

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug ?? post.id}`,
    ...(post.published_at ? { lastModified: new Date(post.published_at) } : {}),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  if (posts.length > 0) {
    staticRoutes.push({
      url: `${BASE_URL}/blog`,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return [...staticRoutes, ...blogRoutes];
}
