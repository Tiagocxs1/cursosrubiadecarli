import type { Metadata } from 'next';
import JsonLd from '@/components/json-ld';
import { buildCourseSchema, buildBreadcrumbSchema, buildFaqSchema } from '@/lib/schema';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br';

export const metadata: Metadata = {
  title: 'Curso Protocolo Full Face — Imersão Presencial | Dra. Rúbia De Carli',
  description:
    'Imersão presencial de 3 dias em harmonização facial avançada. Toxina botulínica, preenchedores, bioestimuladores e mais. R$ 2.997. Caxias do Sul, RS. Certificação garantida.',
  keywords: [
    'curso harmonização facial presencial',
    'protocolo full face',
    'curso toxina botulínica',
    'bioestimuladores colágeno curso',
    'harmonização facial Caxias do Sul',
    'Dra Rúbia De Carli full face',
    'preenchimento ácido hialurônico curso',
  ],
  alternates: {
    canonical: `${BASE_URL}/cursos/protocolo-full-face`,
  },
  openGraph: {
    title: 'Protocolo Full Face — Imersão Presencial | Dra. Rúbia De Carli',
    description:
      'Domine a harmonização facial com 3 dias de imersão em Caxias do Sul. Prática com pacientes reais. R$ 2.997.',
    url: `${BASE_URL}/cursos/protocolo-full-face`,
    images: [{ url: 'https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/protocolofullface.webp', width: 1200, height: 630, alt: 'Curso Protocolo Full Face' }],
  },
};

const courseSchema = buildCourseSchema({
  name: 'Protocolo Full Face',
  description:
    'Formação presencial intensiva de 3 dias em harmonização facial. Aborda toxina botulínica global, preenchedores com ácido hialurônico, bioestimuladores de colágeno, técnica Fullips London Face e preenchimento orbicular.',
  url: '/cursos/protocolo-full-face',
  price: 'R$ 2.997',
  duration: 'P3D',
  image: 'https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/protocolofullface.webp',
  keywords: [
    'Harmonização Facial',
    'Toxina Botulínica',
    'Ácido Hialurônico',
    'Bioestimuladores de Colágeno',
    'Biomedicina Estética',
    'Full Face',
  ],
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Início', url: '/' },
  { name: 'Cursos', url: '/#cursos' },
  { name: 'Protocolo Full Face', url: '/cursos/protocolo-full-face' },
]);

const faqSchema = buildFaqSchema([
  {
    question: 'O Protocolo Full Face é presencial ou online?',
    answer: 'O curso é exclusivamente presencial, realizado em Caxias do Sul, RS, em formato de imersão de 3 dias.',
  },
  {
    question: 'Qual a carga horária do Protocolo Full Face?',
    answer: 'São 12 horas de imersão presencial distribuídas em 3 dias, com prática em pacientes reais.',
  },
  {
    question: 'Qual o valor do Protocolo Full Face?',
    answer: 'O investimento é de R$ 2.997, incluindo materiais exclusivos, certificado e acompanhamento pós-curso.',
  },
  {
    question: 'Quais técnicas são ensinadas no Protocolo Full Face?',
    answer:
      'Toxina botulínica global, preenchedores com ácido hialurônico, bioestimuladores de colágeno (Radiesse, Sculptra), técnica Fullips London Face e preenchimento orbicular para olheiras.',
  },
  {
    question: 'Há prática com pacientes reais?',
    answer:
      'Sim. O curso inclui aplicação supervisionada em pacientes reais sob orientação direta da Dra. Rúbia De Carli.',
  },
]);

export default function ProtocoloFullFaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={courseSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={faqSchema} />
      {children}
    </>
  );
}
