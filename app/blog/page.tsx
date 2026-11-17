import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { getPublishedPosts, formatDate, readingTime, postUrl } from '@/lib/blog';
import type { BlogPost } from '@/lib/blog';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts(1);
  return {
    title: 'Artigos sobre Tricologia e Biomedicina Estética | Dra. Rúbia De Carli',
    description: 'Conteúdo especializado em Tricologia e Biomedicina Estética por Dra. Rúbia De Carli.',
    alternates: { canonical: 'https://cursos.rubiadecarli.com.br/blog' },
    robots: { index: posts.length > 0, follow: true },
  };
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
      <div className="aspect-[16/9] relative overflow-hidden bg-[#FAF9F8]">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8952E]/10 flex items-center justify-center">
            <span className="text-5xl opacity-30">✦</span>
          </div>
        )}
        {post.tags && post.tags.length > 0 && (
          <span className="absolute top-3 left-3 bg-[#D4AF37] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {post.tags[0]}
          </span>
        )}
      </div>

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

        <h2 className="text-lg font-bold text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
          {post.title}
        </h2>

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

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-[#FAF9F8]">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-xs text-[#4A3F35]/50 uppercase tracking-widest mb-8 inline-flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
          >
            ← Voltar ao início
          </Link>
          <div className="mt-4">
            <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">
              Conteúdo Gratuito
            </span>
            <h1 className="text-4xl md:text-5xl font-light mt-2 text-[#1A1A1A]">
              Artigos e Conhecimento
            </h1>
            <p className="mt-4 text-[#4A3F35]/70 text-lg max-w-2xl">
              Conteúdo especializado em Tricologia, Biomedicina Estética e Harmonização Facial
              por Dra. Rúbia De Carli.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-24 text-[#4A3F35]/50">
              <span className="text-5xl mb-4 block opacity-30">✦</span>
              <p>Nenhum artigo publicado ainda.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
