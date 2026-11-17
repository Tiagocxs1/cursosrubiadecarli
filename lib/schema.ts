/**
 * Schema.org JSON-LD Builders
 * ============================
 * Gera objetos estruturados para Organization, Person, Course, FAQ e Breadcrumb.
 * Usar com o componente <JsonLd> em cada página.
 *
 * Referência: https://schema.org
 */

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br').replace(/\\n/g, '').trim().replace(/\/+$/, '');
const WHATSAPP = 'https://wa.me/5554992350352';

// ---------------------------------------------------------------------------
// Organization
// ---------------------------------------------------------------------------
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Cursos Dra. Rúbia De Carli',
    url: BASE_URL,
    logo: `https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/logo-dra-rubia-de-carli.png`,
    image: `https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/drarubiadecarli.jpg`,
    description:
      'Cursos presenciais em Tricologia e Biomedicina Estética ministrados pela Dra. Rúbia De Carli, referência nacional com mais de 500 alunos formados.',
    telephone: '+55-54-99235-0352',
    email: 'contato@rubiadecarli.com.br',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Caxias do Sul',
      addressRegion: 'RS',
      addressCountry: 'BR',
    },
    sameAs: [
      'https://www.instagram.com/drarubiadecarli',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+55-54-99235-0352',
      availableLanguage: 'Portuguese',
      url: WHATSAPP,
    },
  };
}

// ---------------------------------------------------------------------------
// Person (instrutora)
// ---------------------------------------------------------------------------
export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Dra. Rúbia De Carli',
    jobTitle: 'Biomédica Estética especialista em Tricologia e Harmonização Facial',
    image: `https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/drarubiadecarli.jpg`,
    url: BASE_URL,
    description:
      'Biomédica Estética (CRBM 2144) com especialização em Tricologia pelo IAT, formação internacional em Face/Londres e mais de 10 anos de experiência. Formou mais de 500 alunos com 98% de satisfação.',
    knowsAbout: [
      'Tricologia',
      'Biomedicina Estética',
      'Harmonização Facial',
      'Bioestimuladores de Colágeno',
      'Toxina Botulínica',
      'Alopecia',
    ],
    worksFor: {
      '@type': 'EducationalOrganization',
      name: 'Cursos Dra. Rúbia De Carli',
      url: BASE_URL,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Caxias do Sul',
      addressRegion: 'RS',
      addressCountry: 'BR',
    },
  };
}

// ---------------------------------------------------------------------------
// Course
// ---------------------------------------------------------------------------
export interface CourseSchemaInput {
  name: string;
  description: string;
  url: string;
  price: string;
  /** Duração ISO 8601 — ex.: PT5H (5 horas), P3D (3 dias) */
  duration: string;
  image: string;
  keywords: string[];
}

export function buildCourseSchema(input: CourseSchemaInput) {
  const rawPrice = input.price.replace(/[^0-9,.-]/g, '');
  const priceValue = rawPrice.includes(',')
    ? rawPrice.replace(/[.]/g, '').replace(',', '.')
    : rawPrice;

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: input.name,
    description: input.description,
    url: `${BASE_URL}${input.url}`,
    image: input.image.startsWith('http') ? input.image : `${BASE_URL}${input.image}`,
    keywords: input.keywords.join(', '),
    inLanguage: 'pt-BR',
    courseMode: 'onsite',
    educationalLevel: 'Professional',
    teaches: input.keywords,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      location: {
        '@type': 'Place',
        name: 'Caxias do Sul, RS',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Caxias do Sul',
          addressRegion: 'RS',
          addressCountry: 'BR',
        },
      },
      offers: {
        '@type': 'Offer',
        price: priceValue,
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        url: WHATSAPP,
      },
    },
    provider: {
      '@type': 'Person',
      name: 'Dra. Rúbia De Carli',
      url: BASE_URL,
    },
  };
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// Article (Blog)
// ---------------------------------------------------------------------------
export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  image: string | null;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  tags?: string[];
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: `${BASE_URL}${input.url}`,
    image: input.image
      ? input.image.startsWith('http')
        ? input.image
        : `${BASE_URL}${input.image}`
      : `https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/drarubiadecarli.jpg`,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    inLanguage: 'pt-BR',
    keywords: input.tags?.join(', ') ?? '',
    author: {
      '@type': 'Person',
      name: input.authorName ?? 'Dra. Rúbia De Carli',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'Cursos Dra. Rúbia De Carli',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/logo-dra-rubia-de-carli.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}${input.url}`,
    },
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}
