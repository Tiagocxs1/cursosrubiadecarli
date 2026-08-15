import type { Metadata } from 'next';
import JsonLd from '@/components/json-ld';
import { buildCourseSchema, buildBreadcrumbSchema, buildFaqSchema } from '@/lib/schema';

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br').replace(/\\n/g, '').trim().replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Curso Tricologia Essencial — Presencial | Dra. Rúbia De Carli',
  description:
    'Curso presencial de Tricologia em Caxias do Sul. Aprenda anatomia capilar, tricoses e alopecia com a Dra. Rúbia De Carli (CRBM 2144). R$ 997 | Certificação garantida.',
  keywords: [
    'curso tricologia presencial',
    'tricologia Caxias do Sul',
    'alopecia androgenética tratamento',
    'curso couro cabeludo',
    'tricoses diagnóstico',
    'Dra Rúbia De Carli tricologia',
  ],
  alternates: {
    canonical: `${BASE_URL}/cursos/tricologia`,
  },
  openGraph: {
    title: 'Curso Tricologia Essencial Presencial — Dra. Rúbia De Carli',
    description:
      'Domine diagnósticos e tratamentos capilares. Curso presencial em 3 módulos (5h). Certificação garantida. Caxias do Sul, RS.',
    url: `${BASE_URL}/cursos/tricologia`,
    images: [{ url: 'https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_10_modulo3.jpg', width: 1200, height: 630, alt: 'Curso Tricologia Essencial' }],
  },
};

const courseSchema = buildCourseSchema({
  name: 'Tricologia Essencial',
  description:
    'Curso presencial de Tricologia em 3 módulos para profissionais de saúde. Aborda anatomia capilar, tricoses (doenças e anormalidades da haste) e alopecias não cicatriciais.',
  url: '/cursos/tricologia',
  price: 'R$ 997',
  duration: 'PT5H',
  image: 'https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_10_modulo3.jpg',
  keywords: [
    'Tricologia',
    'Alopecia',
    'Anatomia Capilar',
    'Tricoses',
    'Diagnóstico Capilar',
    'Eflúvio Telógeno',
  ],
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Início', url: '/' },
  { name: 'Cursos', url: '/#cursos' },
  { name: 'Tricologia Essencial', url: '/cursos/tricologia' },
]);

const faqSchema = buildFaqSchema([
  {
    question: 'O curso de Tricologia Essencial é presencial ou online?',
    answer: 'O curso é exclusivamente presencial, realizado em Caxias do Sul, RS.',
  },
  {
    question: 'Qual a carga horária do curso de Tricologia?',
    answer: 'São 5 horas de curso divididas em 3 módulos: Anatomia Capilar (1h), Tricoses (3h) e Alopecia não cicatriciais (1h).',
  },
  {
    question: 'Qual o valor do curso de Tricologia Essencial?',
    answer: 'O investimento é de R$ 997, incluindo material didático e certificado de conclusão.',
  },
  {
    question: 'O curso emite certificado?',
    answer: 'Sim, todos os participantes recebem certificado de conclusão após finalizar o curso.',
  },
  {
    question: 'Quem pode participar do curso de Tricologia?',
    answer: 'Profissionais de saúde habilitados: biomédicos, fisioterapeutas, enfermeiros, médicos e outros.',
  },
]);

export default function TricologiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={courseSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={faqSchema} />
      {children}
    </>
  );
}
