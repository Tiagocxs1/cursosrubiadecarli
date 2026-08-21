import { Metadata } from 'next';
import JsonLd from '@/components/json-ld';
import { buildCourseSchema, buildFaqSchema, buildBreadcrumbSchema, buildOrganizationSchema, buildPersonSchema } from '@/lib/schema';
import EnhancedCoursePageTemplate from '@/components/EnhancedCoursePageTemplate';
import { tricologiaEnhancedData } from './enhancedCourseData';

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br').replace(/\n/g, '').trim().replace(/\/+$/, '');
const COURSE_URL = '/cursos/tricologia-essencial';

const faq = [
  {
    question: 'O curso é online ou presencial?',
    answer: 'O curso é 100% presencial, realizado em Caxias do Sul, RS. A prática clínica e o contato direto com a Dra. Rúbia são essenciais para a formação de excelência.',
  },
  {
    question: 'O curso oferece certificado?',
    answer: 'Sim. Ao concluir o curso, você recebe certificado oficial de conclusão, válido nacionalmente, que chancelará sua autoridade em Tricologia.',
  },
  {
    question: 'Qual a duração do curso?',
    answer: 'O curso é dividido em 3 módulos, totalizando 5 horas de conteúdo teórico e prático intensivo.',
  },
  {
    question: 'Qual o investimento e formas de pagamento?',
    answer: 'O investimento é R$ 1.297,00 à vista ou em até 6x de R$ 237,17. Consulte condições especiais via WhatsApp.',
  },
  {
    question: 'Para quem é indicado este curso?',
    answer: 'Biomédicos, farmacêuticos, médicos, enfermeiros e demais profissionais da saúde habilitados para atuar em estética e tricologia.',
  },
  {
    question: 'Há suporte após o curso?',
    answer: 'Sim. Alunos têm acesso ao grupo exclusivo de WhatsApp para networking, dúvidas e atualizações contínuas com a Dra. Rúbia e colegas.',
  },
  {
    question: 'O que inclui o material didático?',
    answer: 'Apostila completa, protocolos passo a passo, casos clínicos, acesso a aulas extras e grupo exclusivo de WhatsApp para networking.',
  },
  {
    question: 'Qual a política de cancelamento?',
    answer: 'Cancelamento gratuito em até 7 dias após a inscrição. Após esse prazo, consulte condições via WhatsApp.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Tricologia Essencial — Curso Presencial em Caxias do Sul | Dra. Rúbia De Carli',
    description: 'Curso presencial de Tricologia em Caxias do Sul, RS. 3 módulos, 5 horas, certificação garantida, aula prática com Dra. Rúbia De Carli (CRBM 2144). Domine diagnóstico e tratamento de alopecias. Garanta sua vaga.',
    keywords: ['curso tricologia', 'tricologia Caxias do Sul', 'curso tricologia presencial', 'Dra. Rúbia De Carli', 'alopecia androgenética tratamento', 'tricologia essencial', 'certificação tricologia'],
    authors: [{ name: 'Dra. Rúbia De Carli', url: BASE_URL }],
    alternates: { canonical: `${BASE_URL}${COURSE_URL}` },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: `${BASE_URL}${COURSE_URL}`,
      siteName: 'Cursos Dra. Rúbia De Carli',
      title: 'Tricologia Essencial — Curso Presencial em Caxias do Sul | Dra. Rúbia De Carli',
      description: 'Curso presencial de Tricologia em Caxias do Sul, RS. 3 módulos, certificação, aula prática. Dra. Rúbia De Carli (CRBM 2144). Garanta sua vaga.',
      images: [{
        url: 'https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/curso_tricologia_essencial.png',
        width: 1200,
        height: 630,
        alt: 'Curso Tricologia Essencial - Dra. Rúbia De Carli',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tricologia Essencial — Curso Presencial em Caxias do Sul',
      description: 'Curso presencial de Tricologia em Caxias do Sul, RS. 3 módulos, certificação, aula prática. Dra. Rúbia De Carli. Garanta sua vaga.',
      images: ['https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/curso_tricologia_essencial.png'],
    },
    robots: { index: true, follow: true },
  };
}

const courseSchema = buildCourseSchema({
  name: 'Tricologia Essencial',
  description: 'Curso presencial de Tricologia em Caxias do Sul, RS. 3 módulos, 5 horas, certificação garantida, aula prática com Dra. Rúbia De Carli (CRBM 2144). Domine diagnóstico e tratamento de alopecias.',
  url: COURSE_URL,
  price: '1297.00',
  duration: 'PT5H',
  image: 'https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/curso_tricologia_essencial.png',
  keywords: ['tricologia', 'curso presencial', 'Caxias do Sul', 'alopecia', 'Dra. Rúbia De Carli'],
});

const faqSchema = buildFaqSchema(faq);
const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Início', url: BASE_URL },
  { name: 'Cursos', url: `${BASE_URL}/cursos` },
  { name: 'Tricologia Essencial', url: `${BASE_URL}${COURSE_URL}` },
]);

export default function TricologiaCoursePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([buildOrganizationSchema(), buildPersonSchema(), courseSchema, faqSchema, breadcrumbSchema]) }}
      />
      <EnhancedCoursePageTemplate {...tricologiaEnhancedData} />
    </>
  );
}