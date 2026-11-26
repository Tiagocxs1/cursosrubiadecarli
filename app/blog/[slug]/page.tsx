import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';
import { getPostBySlug, getAllPostSlugs, formatDate, readingTime } from '@/lib/blog';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/schema';
import JsonLd from '@/components/json-ld';

export const runtime = 'edge';

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br').replace(/\\n/g, '').trim().replace(/\/+$/, '');

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = `/blog/${slug}`;
  const image = post.cover_image ?? '/drarubiadecarli.jpg';

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt ?? post.title,
    alternates: { canonical: `${BASE_URL}${url}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? post.title,
      url: `${BASE_URL}${url}`,
      type: 'article',
      publishedTime: post.published_at ?? post.created_at,
      authors: [post.author ?? 'Dra. Rúbia De Carli'],
      tags: post.tags ?? [],
      images: [{ url: image.startsWith('http') ? image : `${BASE_URL}${image}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? post.title,
      images: [image.startsWith('http') ? image : `${BASE_URL}${image}`],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const url = `/blog/${slug}`;
  const date = formatDate(post.published_at ?? post.created_at);
  const time = readingTime(post.content);

  const articleSchema = buildArticleSchema({
    title: post.title,
    description: post.excerpt ?? post.title,
    url,
    image: post.cover_image,
    datePublished: post.published_at ?? post.created_at,
    authorName: post.author ?? undefined,
    tags: post.tags ?? undefined,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Início', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url },
  ]);

  return (
    <>
      <JsonLd schema={articleSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <main className="min-h-screen bg-white">
        {/* Hero com imagem */}
        {post.cover_image && (
          <div className="relative w-full h-64 md:h-96 bg-[#FAF9F8]">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#4A3F35]/50 mb-8">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Início</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#D4AF37] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#4A3F35]/80 line-clamp-1">{post.title}</span>
          </nav>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full uppercase tracking-wider"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[#4A3F35]/60 mb-8 pb-8 border-b border-gray-100">
            {post.author && (
              <span className="font-medium text-[#4A3F35]">{post.author}</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {time}
            </span>
          </div>

          {/* Conteúdo */}
          {post.content ? (
            <div
              className="prose prose-lg prose-headings:font-bold prose-headings:text-[#1A1A1A] prose-p:text-[#4A3F35] prose-p:leading-relaxed prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1A1A1A] prose-li:text-[#4A3F35] max-w-none"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(post.content, {
                  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
                  allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    img: ['src', 'alt', 'width', 'height', 'loading'],
                    a: ['href', 'target', 'rel'],
                  },
                }),
              }}
            />
          ) : (
            <p className="text-[#4A3F35]/60 italic">Conteúdo não disponível.</p>
          )}

          {/* CTA final */}
          <div className="mt-16 p-8 bg-gradient-to-br from-[#D4AF37]/10 to-[#B8952E]/5 rounded-3xl border border-[#D4AF37]/20 text-center">
            <p className="text-sm text-[#D4AF37] font-semibold uppercase tracking-widest mb-2">
              Aprenda com a especialista
            </p>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
              Quer se aprofundar no tema?
            </h3>
            <p className="text-[#4A3F35]/70 mb-6 max-w-md mx-auto">
              Conheça os cursos presenciais da Dra. Rúbia De Carli e torne-se referência na área.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/cursos/tricologia-essencial"
                className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#B8952E] transition-colors text-sm"
              >
                Ver Curso de Tricologia
              </Link>
              <Link
                href="/cursos/protocolo-full-face"
                className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] font-semibold rounded-full hover:bg-[#D4AF37]/10 transition-colors text-sm"
              >
                Ver Protocolo Full Face
              </Link>
            </div>
          </div>

          {/* Voltar */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A3F35]/60 hover:text-[#D4AF37] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver todos os artigos
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
