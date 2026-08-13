import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/blog';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/cursos/tricologia-essencial`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cursos/protocolo-full-face`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/obrigado`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ];

  // Blog posts dinâmicos
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts();
    blogRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug ?? post.id}`,
      lastModified: post.published_at ? new Date(post.published_at) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // Supabase não disponível no build — retorna apenas rotas estáticas
  }

  return [...staticRoutes, ...blogRoutes];
}
