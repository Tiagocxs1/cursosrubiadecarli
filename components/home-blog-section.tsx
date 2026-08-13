'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { type BlogPost, formatDate, readingTime, postUrl } from '@/lib/blog-utils';

function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#D4AF37]/10 shadow-sm animate-pulse">
      <div className="aspect-[16/9] bg-gray-100" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-20 bg-gray-100 rounded" />
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  const slug = postUrl(post);
  const date = formatDate(post.published_at ?? post.created_at);
  const time = readingTime(post.content);

  return (
    <Link
      href={`/blog/${slug}`}
      className="group bg-white rounded-3xl overflow-hidden border border-[#D4AF37]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Imagem */}
      <div className="aspect-[16/9] relative overflow-hidden bg-[#FAF9F8]">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8952E]/10 flex items-center justify-center">
            <span className="text-4xl opacity-30">✦</span>
          </div>
        )}
        {/* Tag */}
        {post.tags && post.tags.length > 0 && (
          <span className="absolute top-3 left-3 bg-[#D4AF37] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {post.tags[0]}
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-[#4A3F35]/60 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {time}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-[#4A3F35] leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        <span className="mt-4 text-xs font-semibold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
          Ler artigo <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}

export default function HomeBlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog?limit=3')
      .then((r) => r.json())
      .then((data: BlogPost[]) => {
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  // Não renderiza seção se não há posts e não está carregando
  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-[#FAF9F8] relative z-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">
              Conteúdo Gratuito
            </span>
            <h2 className="text-3xl md:text-4xl font-light mt-2 text-[#1A1A1A]">
              Artigos e Conhecimento
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all shrink-0"
          >
            Ver todos os artigos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)
            : posts.map((post) => <BlogCard key={post.id} post={post} />)}
        </div>
      </div>
    </section>
  );
}
