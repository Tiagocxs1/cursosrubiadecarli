import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br';

export const metadata: Metadata = {
  title: 'Blog — Tricologia e Biomedicina Estética | Dra. Rúbia De Carli',
  description:
    'Artigos especializados em Tricologia, Biomedicina Estética e Harmonização Facial. Conteúdo científico e atualizado por Dra. Rúbia De Carli, CRBM 2144.',
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: 'Blog — Tricologia e Biomedicina Estética',
    description: 'Artigos especializados por Dra. Rúbia De Carli.',
    url: `${BASE_URL}/blog`,
    images: [{ url: 'https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/drarubiadecarli.jpg', width: 1200, height: 630 }],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
