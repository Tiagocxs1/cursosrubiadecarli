import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/providers/toaster-provider'
import { ConfettiProvider } from '@/components/providers'
import TrackingScript from '@/components/tracking-script'
import CookieBanner from '@/components/cookie-banner'
import JsonLd from '@/components/json-ld'
import { buildOrganizationSchema, buildPersonSchema } from '@/lib/schema'

const inter = Inter({ subsets: ['latin'] })

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br').replace(/\\n/g, '').trim().replace(/\/+$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Cursos Presenciais em Tricologia e Biomedicina Estética | Dra. Rúbia De Carli',
    template: '%s | Dra. Rúbia De Carli',
  },
  description:
    'Cursos presenciais em Tricologia e Biomedicina Estética em Caxias do Sul, RS. Formação com certificação, aula prática e mais de 500 alunos formados. Dra. Rúbia De Carli, CRBM 2144.',
  keywords: [
    'curso tricologia',
    'curso biomedicina estética',
    'tricologia Caxias do Sul',
    'harmonização facial presencial',
    'protocolo full face',
    'Dra Rúbia De Carli',
    'curso presencial biomédica',
    'alopecia androgenética',
    'bioestimuladores colágeno',
  ],
  authors: [{ name: 'Dra. Rúbia De Carli', url: BASE_URL }],
  creator: 'Dra. Rúbia De Carli',
  publisher: 'Cursos Dra. Rúbia De Carli',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Cursos Dra. Rúbia De Carli',
    title: 'Cursos Presenciais em Tricologia e Biomedicina Estética | Dra. Rúbia De Carli',
    description:
      'Cursos presenciais de Tricologia e Biomedicina Estética em Caxias do Sul, RS. Conheça os programas e consulte as próximas turmas.',
    images: [
      {
        url: 'https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/drarubiadecarli.jpg',
        width: 1200,
        height: 630,
        alt: 'Dra. Rúbia De Carli — Cursos Presenciais',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dra. Rúbia De Carli — Cursos Presenciais',
    description: 'Tricologia e Biomedicina Estética. Caxias do Sul, RS.',
    images: ['https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/drarubiadecarli.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
        <head>
          <TrackingScript />
          <JsonLd schema={[buildOrganizationSchema(), buildPersonSchema()]} />
        </head>
        <body className={inter.className}>
          <ConfettiProvider />
          <ToastProvider />
          <CookieBanner />
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </body>
      </html>
  )
}
