import type { Metadata } from 'next';
import JsonLd from '@/components/json-ld';
import { buildCourseSchema, buildFaqSchema, buildBreadcrumbSchema } from '@/lib/schema';
import EnhancedCoursePageTemplate from '@/components/EnhancedCoursePageTemplate';
import { protocoloFullFaceEnhancedData } from './enhancedCourseData';

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br').replace(/\n/g, '').trim().replace(/\/+$/, '');
const COURSE_URL = '/cursos/protocolo-full-face';

const faq = [
  {
    question: 'O curso é online ou presencial?',
    answer: 'O curso é 100% presencial, realizado em Caxias do Sul, RS. A imersão prática em pacientes reais é o diferencial para dominar as técnicas.',
  },
  {
    question: 'O curso oferece certificado?',
    answer: 'Sim. Ao concluir o curso, você recebe certificado oficial de conclusão, válido nacionalmente, chancelando sua autoridade em Harmonização Facial.',
  },
  {
    question: 'Qual a duração do curso?',
    answer: 'O curso é uma imersão de 3 dias intensivos (12 horas), com teoria pela manhã e prática em pacientes reais à tarde.',
  },
  {
    question: 'Qual o investimento e formas de pagamento?',
    answer: 'O investimento é R$ 2.997,00 à vista ou em até 6x de R$ 548,00. Consulte condições especiais via WhatsApp.',
  },
  {
    question: 'Para quem é indicado este curso?',
    answer: 'Biomédicos, médicos, farmacêuticos, dentistas e enfermeiros habilitados para atuar em harmonização facial e estética injetável.',
  },
  {
    question: 'Há prática em pacientes reais?',
    answer: 'Sim. A parte prática é realizada em pacientes reais, sob supervisão direta da Dra. Rúbia, garantindo segurança e aprendizado real.',
  },
  {
    question: 'O que inclui o material do curso?',
    answer: 'Apostila completa com protocolos, dosagens, mapas de injeção, casos clínicos, acesso a aulas extras e grupo exclusivo de WhatsApp.',
  },
  {
    question: 'Qual a política de cancelamento?',
    answer: 'Cancelamento gratuito em até 7 dias após a inscrição. Após esse prazo, consulte condições via WhatsApp.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Curso Full Face Presencial em Caxias do Sul',
    description: 'Imersão presencial de 3 dias em harmonização facial, com prática supervisionada em Caxias do Sul. Conheça os módulos, o investimento e as próximas turmas.',
    keywords: ['protocolo full face', 'harmonização facial Caxias do Sul', 'curso harmonização facial presencial', 'Dra. Rúbia De Carli', 'bioestimuladores colágeno', 'toxina botulínica curso', 'preenchedores ácido hialurônico'],
    authors: [{ name: 'Dra. Rúbia De Carli', url: BASE_URL }],
    alternates: { canonical: `${BASE_URL}${COURSE_URL}` },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: `${BASE_URL}${COURSE_URL}`,
      siteName: 'Cursos Dra. Rúbia De Carli',
      title: 'Curso Full Face Presencial em Caxias do Sul | Dra. Rúbia De Carli',
      description: 'Imersão presencial de 3 dias em harmonização facial, com prática supervisionada em Caxias do Sul, RS.',
      images: [{
        url: 'https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/protocolo_fullface_capa2.png',
        width: 1200,
        height: 630,
        alt: 'Curso Protocolo Full Face - Dra. Rúbia De Carli',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Curso Full Face Presencial em Caxias do Sul',
      description: 'Imersão presencial de 3 dias em harmonização facial em Caxias do Sul, RS.',
      images: ['https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/protocolo_fullface_capa2.png'],
    },
    robots: { index: true, follow: true },
  };
}

const courseSchema = buildCourseSchema({
  name: 'Protocolo Full Face',
  description: 'Curso presencial de Harmonização Facial (Protocolo Full Face) em Caxias do Sul, RS. 3 dias imersivos, 12 horas, prática em pacientes reais. Toxina, Preenchedores, Bioestimuladores, Fullips. Dra. Rúbia De Carli (CRBM 2144).',
  url: COURSE_URL,
  price: '2997.00',
  duration: 'P3D',
  image: 'https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/protocolo_fullface_capa2.png',
  keywords: ['harmonização facial', 'curso presencial', 'Caxias do Sul', 'bioestimuladores', 'toxina botulínica', 'preenchedores', 'Dra. Rúbia De Carli'],
});

const faqSchema = buildFaqSchema(faq);
const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Início', url: BASE_URL },
  { name: 'Cursos', url: `${BASE_URL}/#cursos` },
  { name: 'Protocolo Full Face', url: `${BASE_URL}${COURSE_URL}` },
]);

export default function ProtocoloFullFaceCoursePage() {
  return (
    <>
      <JsonLd schema={[courseSchema, faqSchema, breadcrumbSchema]} />
      <EnhancedCoursePageTemplate {...protocoloFullFaceEnhancedData} />
      <section id="faq" className="bg-[#FAF9F8] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl font-semibold text-[#1A1A1A]">Perguntas frequentes</h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.question} className="rounded-xl border border-[#D4AF37]/20 bg-white p-5">
                <summary className="cursor-pointer font-semibold text-[#1A1A1A]">{item.question}</summary>
                <p className="mt-3 leading-relaxed text-[#4A3F35]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}