import { NextResponse } from 'next/server';
import { getPublishedPosts } from '@/lib/blog';

// Revalida a cada 5 minutos para não ficar stale
export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit') ?? '3');

  const posts = await getPublishedPosts(limit);

  return NextResponse.json(posts, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
