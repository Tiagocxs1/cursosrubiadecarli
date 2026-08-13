# SEO / GEO / E-E-A-T / LLM Optimization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar o site de cursos da Dra. Rúbia De Carli rastreável, citável e rankável por buscadores tradicionais, AI Overviews, Perplexity e outros LLMs, seguindo o checklist completo de SEO/GEO/E-E-A-T 2026.

**Architecture:** Separado em 4 subsistemas independentes que podem ser executados em paralelo por agentes distintos. Cada subsistema produz código funcional e testável isoladamente. O domínio do site de cursos é configurado via `NEXT_PUBLIC_APP_URL` no `.env.local`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Google Analytics 4, Google Tag Manager (futuro), JSON-LD Schema.org.

---

## Estado Atual (contexto para o executor)

| Arquivo | Status | Observação |
|---|---|---|
| `public/robots.txt` | ⚠️ Incompleto | Só tem `Allow: /` — sem regras para bots de IA |
| `public/llms.txt` | ⚠️ Desatualizado | Aponta para a clínica, não para os cursos |
| `public/sitemap.xml` | ⚠️ Desatualizado | URLs da clínica, estático, sem cursos |
| `public/llms-full.txt` | ❌ Inexistente | Precisa ser criado |
| `public/ai.txt` | ❌ Inexistente | Precisa ser criado |
| `public/ads.txt` | ❌ Inexistente | Precisa ser criado |
| `public/humans.txt` | ❌ Inexistente | Precisa ser criado |
| `public/.well-known/security.txt` | ❌ Inexistente | Precisa ser criado |
| Schema JSON-LD | ❌ Inexistente | Nenhum schema markup no site |
| Open Graph / Twitter Cards | ⚠️ Incompleto | Só tem title e description globais |
| Cookie Consent (LGPD) | ❌ Inexistente | Precisa ser criado |
| GTM | ❌ Inexistente | GA4 injetado diretamente — migrar para GTM |

---

## Mapa de Arquivos

```
public/
  robots.txt                    MODIFY — adicionar bots de IA
  llms.txt                      MODIFY — atualizar para cursos
  llms-full.txt                 CREATE — conteúdo completo para RAG
  ai.txt                        CREATE — permissões de uso por LLMs
  ads.txt                       CREATE — declaração de anunciantes
  humans.txt                    CREATE — créditos da equipe
  .well-known/
    security.txt                CREATE — contato de segurança
sitemap.xml                     DELETE — substituído pelo dinâmico

app/
  sitemap.ts                    CREATE — sitemap dinâmico Next.js
  robots.ts                     CREATE — robots dinâmico Next.js (opcional)
  layout.tsx                    MODIFY — metadata global, JSON-LD Organization+Person
  page.tsx                      MODIFY — metadata da homepage
  cursos/
    tricologia/
      layout.tsx                CREATE — metadata + JSON-LD Course
    protocolo-full-face/
      layout.tsx                CREATE — metadata + JSON-LD Course
  obrigado/
    layout.tsx                  CREATE — metadata noindex

lib/
  schema.ts                     CREATE — builders de JSON-LD (Organization, Person, Course, FAQ)
  tracking.ts                   MODIFY — suporte a GTM dataLayer + consent

components/
  tracking-script.tsx           MODIFY — suporte a GTM (substitui GA4 direto)
  cookie-banner.tsx             CREATE — banner LGPD com Google Consent Mode v2
  json-ld.tsx                   CREATE — componente genérico para injetar JSON-LD

.env.example                    MODIFY — adicionar NEXT_PUBLIC_GTM_ID
```

---

## Subsistema 1 — Arquivos de Protocolo

> **Objetivo:** Garantir que bots, crawlers e LLMs encontrem regras claras de acesso e conteúdo estruturado.

### Task 1.1: robots.txt com regras para IA

**Files:**
- Modify: `public/robots.txt`

- [ ] Substituir o conteúdo de `public/robots.txt` por:

```
# Motores de Busca Tradicionais
User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /dashboard/
Disallow: /sign-in
Disallow: /sign-up

User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /dashboard/

User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/
Disallow: /sign-in
Disallow: /sign-up

# Bots de IA — acesso permitido ao conteúdo público
User-agent: GPTBot
Allow: /
Disallow: /api/
Disallow: /dashboard/

User-agent: ChatGPT-User
Allow: /
Disallow: /api/
Disallow: /dashboard/

User-agent: Google-Extended
Allow: /
Disallow: /api/
Disallow: /dashboard/

User-agent: ClaudeBot
Allow: /
Disallow: /api/
Disallow: /dashboard/

User-agent: PerplexityBot
Allow: /
Disallow: /api/
Disallow: /dashboard/

User-agent: anthropic-ai
Allow: /
Disallow: /api/
Disallow: /dashboard/

User-agent: cohere-ai
Allow: /
Disallow: /api/
Disallow: /dashboard/

# Sitemaps
Sitemap: https://cursos.rubiadecarli.com.br/sitemap.xml
Sitemap: https://cursos.rubiadecarli.com.br/sitemap-images.xml
```

> ⚠️ **Substitua o domínio** `cursos.rubiadecarli.com.br` pelo domínio real do site de cursos.

- [ ] Commit: `feat(seo): update robots.txt with AI bot rules`

---

### Task 1.2: llms.txt atualizado para cursos

**Files:**
- Modify: `public/llms.txt`

- [ ] Substituir o conteúdo do `public/llms.txt` atual (que aponta para a clínica) por:

```markdown
# Dra. Rúbia De Carli — Cursos Profissionais

> Plataforma de cursos presenciais em Tricologia e Biomedicina Estética ministrados pela Dra. Rúbia De Carli (CRBM 2144), referência nacional com mais de 10 anos de experiência e 500+ alunos formados.

## Sobre

- **Domínio:** cursos.rubiadecarli.com.br
- **Localização:** Caxias do Sul, RS — Brasil
- **Formato:** Cursos presenciais (imersão)
- **Público-alvo:** Biomédicos, fisioterapeutas, enfermeiros e profissionais de saúde
- **Contato comercial:** WhatsApp +55 54 99235-0352

## Instrutora

**Dra. Rúbia De Carli**
- Biomédica Estética (CRBM 2144)
- Especialista em Tricologia (IAT — International Association of Trichologists)
- Formação internacional em Face/Londres
- 2 pós-graduações na área
- 500+ alunos formados | 98% de satisfação

## Cursos Disponíveis

### Tricologia Essencial
- **Formato:** Presencial — 3 módulos (5 horas)
- **Valor:** R$ 997
- **Conteúdo:**
  - Módulo 1: Anatomia Capilar (1h) — estrutura do couro cabeludo, fibra capilar, distúrbios
  - Módulo 2: Tricoses — Doenças e anormalidades da haste (3h) — diagnóstico e tratamentos
  - Módulo 3: Alopecia não cicatriciais (1h) — AAG, eflúvio telógeno, alopecia areata
- **Certificação:** Garantida após conclusão
- **Inscrições:** [Tricologia Essencial](/cursos/tricologia)

### Protocolo Full Face
- **Formato:** Presencial — imersão de 3 dias (12 horas)
- **Valor:** R$ 2.997
- **Conteúdo:**
  - Toxina Botulínica Global — suavização de linhas de expressão
  - Preenchedores com Ácido Hialurônico — reposição de volume
  - Bioestimuladores de Colágeno — rejuvenescimento profundo
  - Técnica Fullips London Face — preenchimento labial
  - Preenchimento Orbicular Skin — área periorbital
- **Certificação:** Garantida após conclusão
- **Inscrições:** [Protocolo Full Face](/cursos/protocolo-full-face)

## Materiais Gratuitos

- Ebook: "Guia de Tricologia Essencial" (45 páginas) — disponível via [formulário na homepage](/#ebooks)

## Depoimentos

- Maria Luiza (Biomédica): "Aprendi imensamente com seu vasto conhecimento e didática clara."
- Gabriela Rigo (Aluna): "O curso foi excepcional, cheio de conhecimentos e comprovações científicas."
- Camila Morh (Aluna): "Uma profissional altamente qualificada e dedicada a manter-se atualizada."

## Links Principais

- [Homepage](/)
- [Tricologia Essencial](/cursos/tricologia)
- [Protocolo Full Face](/cursos/protocolo-full-face)
- [Conteúdo Completo para IA](/llms-full.txt)
```

- [ ] Commit: `feat(seo): update llms.txt for courses site`

---

### Task 1.3: llms-full.txt — conteúdo completo para RAG

**Files:**
- Create: `public/llms-full.txt`

- [ ] Criar `public/llms-full.txt` com o conteúdo expandido (usado por sistemas RAG que fazem ingestão completa):

```markdown
# Conteúdo Completo — Cursos da Dra. Rúbia De Carli

> Arquivo destinado a sistemas de IA e RAG. Contém a transcrição estruturada de todo o conteúdo público do site.
> Atualizado em: 2026-03-28

---

## Página Principal (/)

### Proposta de Valor
Cursos presenciais em Tricologia e Biomedicina Estética ministrados pela Dra. Rúbia De Carli, referência nacional com mais de 10 anos de experiência. Formação baseada em evidências científicas, com certificação garantida e suporte pós-curso.

### Cursos

**Tricologia Essencial**
Curso presencial de 5 horas dividido em 3 módulos. Indicado para profissionais de saúde que buscam segurança técnica e domínio clínico em tricologia desde o primeiro atendimento. Investimento: R$ 997. Inclui certificado e material didático.

**Protocolo Full Face**
Imersão presencial de 3 dias (12 horas) em harmonização facial avançada. Foco em precisão, técnica, segurança e naturalidade com pacientes reais sob supervisão. Investimento: R$ 2.997. Inclui certificado e acompanhamento pós-curso.

### Sobre a Instrutora
Dra. Rúbia De Carli é Biomédica Estética com mais de 10 anos de experiência, especialização em Tricologia pelo IAT (International Association of Trichologists), formação em Face/Londres e 2 pós-graduações. Atendeu mais de 1.000 pacientes por ano e formou mais de 500 alunos com índice de satisfação de 98%.

---

## Página: Tricologia Essencial (/cursos/tricologia)

### O que é Tricologia
Tricologia é a especialidade que estuda o cabelo e o couro cabeludo — suas doenças, anormalidades e tratamentos. Profissionais treinados em tricologia são capazes de realizar diagnósticos precisos e propor protocolos de tratamento para condições como alopecia androgenética, eflúvio telógeno e alopecia areata.

### Módulos do Curso

**Módulo 1: Anatomia Capilar (1 hora)**
- Estrutura do couro cabeludo
- Estrutura interna do cabelo e da fibra capilar
- Distúrbios capilares mais comuns

**Módulo 2: Tricoses — Doenças e Anormalidades da Haste (3 horas)**
- Definição e classificação das tricoses
- Métodos de diagnóstico clínico
- Protocolos de tratamento atualizados
- Análise de doenças capilares por casos reais

**Módulo 3: Alopecia Não Cicatriciais (1 hora)**
- Ciclo capilar e suas fases
- Alopecia Androgenética masculina e feminina
- Eflúvio Telógeno: causas e abordagem clínica
- Alopecia Areata: fisiopatologia e tratamento
- Diagnóstico diferencial

### Bônus — 10 primeiros inscritos
E-book "Os Benefícios Ocultos dos Nutrientes" + aula extra sobre Foliculite no Couro Cabeludo.

### Investimento
R$ 997 — inclui material didático, certificação e acesso a grupo exclusivo de alunos.

---

## Página: Protocolo Full Face (/cursos/protocolo-full-face)

### O que é o Protocolo Full Face
Formação intensiva presencial voltada a profissionais que desejam dominar a harmonização facial com excelência, segurança e naturalidade. Realizada em 3 dias de imersão teórico-prática com aplicação em pacientes reais sob supervisão direta da Dra. Rúbia De Carli.

### Módulos do Curso

**Toxina Botulínica Global**
Técnicas avançadas de aplicação para suavização de linhas de expressão. Inclui mapeamento de pontos de injeção, dosagem segura e resultados naturais.

**Preenchedores com Ácido Hialurônico**
Reposição de volume e reposicionamento dos contornos faciais. Técnicas de preenchimento estratégico para resultados harmoniosos.

**Bioestimuladores de Colágeno**
Estímulo natural de colágeno para rejuvenescimento e firmeza. Inclui Radiesse, Sculptra e outros bioestimuladores com resultados progressivos.

**Técnica Fullips London Face**
Preenchimento labial para volume e rejuvenescimento com técnicas de contorno e simetria.

**Preenchimento Orbicular Skin**
Rejuvenescimento periorbital — clareamento de olheiras, volumização segura para um olhar mais descansado.

### Diferenciais
- Prática com pacientes reais sob supervisão
- Avaliação facial individualizada
- Planejamento de protocolos personalizados
- Acesso a materiais exclusivos pós-curso
- Comunidade de networking com profissionais da área

### Investimento
R$ 2.997 — inclui 12 horas de curso, material exclusivo, certificação e acompanhamento pós-curso.

---

## Perguntas Frequentes

**Os cursos são presenciais ou online?**
Todos os cursos são exclusivamente presenciais, realizados em Caxias do Sul, RS.

**Qual a carga horária de cada curso?**
Tricologia Essencial: 5 horas (3 módulos). Protocolo Full Face: 12 horas (3 dias de imersão).

**Os cursos emitem certificado?**
Sim. Todos os participantes recebem certificado de conclusão após finalizar o curso.

**Quem pode participar dos cursos?**
Profissionais de saúde habilitados: biomédicos, fisioterapeutas, enfermeiros, médicos e outros.

**Como me inscrevo?**
Entre em contato via WhatsApp: +55 54 99235-0352 para verificar disponibilidade de turmas e condições.

**Qual o valor dos cursos?**
Tricologia Essencial: R$ 997. Protocolo Full Face: R$ 2.997.

**Há parcelamento disponível?**
Consulte as condições diretamente com a equipe via WhatsApp.
```

- [ ] Commit: `feat(seo): create llms-full.txt for RAG indexing`

---

### Task 1.4: ai.txt — permissões para LLMs

**Files:**
- Create: `public/ai.txt`

- [ ] Criar `public/ai.txt`:

```
# ai.txt — Dra. Rúbia De Carli | Cursos Profissionais
# Protocolo de permissões para agentes de IA e LLMs
# Especificação: https://site.attrakt.com/ai-txt/

# Permissões gerais
Site: https://cursos.rubiadecarli.com.br
Contact: contato@rubiadecarli.com.br

# Uso não-comercial e pesquisa (permitido)
Use-case: research
Permission: allow

# Respostas a usuários em chatbots (permitido)
Use-case: ai-responses
Permission: allow

# Treinamento de modelos (sob solicitação)
Use-case: training
Permission: require-permission
Contact: contato@rubiadecarli.com.br

# Raspagem massiva de dados (não permitido)
Use-case: scraping
Permission: disallow

# Atribuição obrigatória
Attribution-required: true
Attribution-url: https://cursos.rubiadecarli.com.br

# Direitos autorais
Copyright: 2026 Dra. Rúbia De Carli. Todos os direitos reservados.
```

- [ ] Commit: `feat(seo): add ai.txt permissions protocol`

---

### Task 1.5: ads.txt, humans.txt e security.txt

**Files:**
- Create: `public/ads.txt`
- Create: `public/humans.txt`
- Create: `public/.well-known/security.txt`

- [ ] Criar `public/ads.txt`:

```
# ads.txt — Authorized Digital Sellers
# https://iabtechlab.com/ads-txt/
# Atualizado em: 2026-03-28
#
# Nenhum inventário de anúncios programáticos autorizado no momento.
# Este arquivo será atualizado caso anúncios sejam ativados.
placeholder.example.com, placeholder, DIRECT
```

- [ ] Criar `public/humans.txt`:

```
/* TEAM */
Instructora e Conteúdo: Dra. Rúbia De Carli
  CRBM: 2144
  Especialização: Tricologia (IAT) e Biomedicina Estética
  Localização: Caxias do Sul, RS — Brasil

Desenvolvimento Web: Equipe Técnica
  Contato: contato@rubiadecarli.com.br

/* SITE */
Última atualização: 2026-03-28
Linguagem: Português (Brasil)
Framework: Next.js 14 (App Router)
Hospedagem: Vercel
Standards: HTML5, CSS3, TypeScript

/* THANKS */
Alunas e pacientes que confiam no trabalho da Dra. Rúbia De Carli.
```

- [ ] Criar a pasta `public/.well-known/` e o arquivo `security.txt`:

```
-----BEGIN PGP SIGNED MESSAGE-----

# security.txt — Dra. Rúbia De Carli | Cursos
# Conforme RFC 9116 — https://securitytxt.org/

Contact: mailto:contato@rubiadecarli.com.br
Expires: 2027-03-28T00:00:00.000Z
Preferred-Languages: pt-BR, en
Canonical: https://cursos.rubiadecarli.com.br/.well-known/security.txt

-----BEGIN PGP SIGNATURE-----
(assinar com GPG para produção — opcional para sites pequenos)
-----END PGP SIGNATURE-----
```

> ⚠️ Para produção, gere a assinatura GPG real ou remova os blocos PGP e mantenha apenas o conteúdo simples.

- [ ] Commit: `feat(seo): add ads.txt, humans.txt and security.txt protocols`

---

### Task 1.6: Sitemap dinâmico via Next.js

**Files:**
- Create: `app/sitemap.ts`
- Delete: `public/sitemap.xml` (substituído)

- [ ] Criar `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/cursos/tricologia`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cursos/protocolo-full-face`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/obrigado`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ];
}
```

> **Como testar:** `npm run dev` → acessar `http://localhost:3000/sitemap.xml` — deve retornar XML válido com as 4 URLs.

- [ ] Deletar `public/sitemap.xml` (o Next.js agora gera automaticamente)
- [ ] Commit: `feat(seo): replace static sitemap.xml with dynamic Next.js sitemap`

---

## Subsistema 2 — Schema Markup & Meta Tags

> **Objetivo:** Dar estrutura semântica a todas as páginas para facilitar extração de dados por Google, AI Overviews e LLMs.

### Task 2.1: lib/schema.ts — builders de JSON-LD

**Files:**
- Create: `lib/schema.ts`

- [ ] Criar `lib/schema.ts`:

```typescript
/**
 * Schema.org JSON-LD Builders
 * ============================
 * Gera objetos estruturados para Organization, Person, Course e FAQ.
 * Usar com o componente <JsonLd> em cada página.
 *
 * Referência: https://schema.org
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br';
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
    logo: `${BASE_URL}/Logo-dra-rubia-de-carli.png`,
    image: `${BASE_URL}/drarubiadecarli.jpg`,
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
    image: `${BASE_URL}/drarubiadecarli.jpg`,
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
  duration: string;        // formato ISO 8601 — ex.: PT5H, P3D
  image: string;
  keywords: string[];
}

export function buildCourseSchema(input: CourseSchemaInput) {
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
        price: input.price.replace('R$ ', '').replace('.', '').replace(',', '.'),
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '50',
      bestRating: '5',
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
```

- [ ] Commit: `feat(schema): add JSON-LD schema builders`

---

### Task 2.2: componente JsonLd

**Files:**
- Create: `components/json-ld.tsx`

- [ ] Criar `components/json-ld.tsx`:

```tsx
/**
 * Componente genérico para injetar JSON-LD em qualquer página.
 * Usar em layouts e pages (Server Components).
 *
 * @example
 * import JsonLd from '@/components/json-ld'
 * import { buildOrganizationSchema } from '@/lib/schema'
 *
 * <JsonLd schema={buildOrganizationSchema()} />
 */
export default function JsonLd({ schema }: { schema: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

- [ ] Commit: `feat(schema): add generic JsonLd component`

---

### Task 2.3: Metadata + JSON-LD global no layout.tsx

**Files:**
- Modify: `app/layout.tsx`

- [ ] Adicionar `Organization` e `Person` schemas + Open Graph global:

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from '@/components/providers/toaster-provider'
import { ConfettiProvider } from '@/components/providers'
import TrackingScript from '@/components/tracking-script'
import JsonLd from '@/components/json-ld'
import { buildOrganizationSchema, buildPersonSchema } from '@/lib/schema'

const inter = Inter({ subsets: ['latin'] })

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Dra. Rúbia De Carli — Cursos Presenciais em Tricologia e Biomedicina Estética',
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
    title: 'Dra. Rúbia De Carli — Cursos Presenciais em Tricologia e Biomedicina Estética',
    description:
      'Formação presencial com certificação em Tricologia e Biomedicina Estética. Caxias do Sul, RS. +500 alunos formados.',
    images: [
      {
        url: '/drarubiadecarli.jpg',
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
    images: ['/drarubiadecarli.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider dynamic afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" afterSignOutUrl="/">
      <html lang="pt-BR">
        <head>
          <TrackingScript />
          <JsonLd schema={[buildOrganizationSchema(), buildPersonSchema()]} />
        </head>
        <body className={inter.className}>
          <ConfettiProvider />
          <ToastProvider />
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

- [ ] Commit: `feat(seo): enhance global metadata and add Organization+Person JSON-LD`

---

### Task 2.4: Metadata por página — Homepage

**Files:**
- Create: `app/(home)/metadata.ts` ou adicionar export em `app/page.tsx`

> ⚠️ `app/page.tsx` é `'use client'` — metadata deve ser exportada em um `layout.tsx` nesse nível ou em um arquivo separado. A forma mais simples é criar um `app/(home)/layout.tsx` wrapper. Porém, como a homepage já usa `'use client'` com animações pesadas, o caminho mais limpo é criar um `app/layout-home.tsx` que envolva a rota em um route group.

**Alternativa mais simples (recomendada para este projeto):** Adicionar metadata diretamente no `app/page.tsx` como Server Component + extrair animações para Client Component filho. Por ora, adicionar metadata via `generateMetadata` num arquivo adjacente.

- [ ] Criar `app/(marketing)/layout.tsx` com metadata da homepage:

```typescript
// Como app/page.tsx é 'use client', a metadata vai em um layout intermediário.
// Criar uma rota group para a homepage pública:
// Mover app/page.tsx → app/(marketing)/page.tsx
// Criar app/(marketing)/layout.tsx com a metadata

import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br';

export const metadata: Metadata = {
  title: 'Cursos Presenciais em Tricologia e Biomedicina Estética | Dra. Rúbia De Carli',
  description:
    'Aprenda Tricologia e Biomedicina Estética com a Dra. Rúbia De Carli em Caxias do Sul, RS. Curso Tricologia Essencial (R$ 997) e Protocolo Full Face (R$ 2.997). Certificação garantida.',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Cursos Presenciais — Tricologia e Biomedicina Estética',
    description:
      'Dra. Rúbia De Carli forma profissionais em Tricologia e Harmonização Facial. 500+ alunos | 98% satisfação | Caxias do Sul, RS.',
    url: BASE_URL,
    images: [{ url: '/drarubiadecarli.jpg', width: 1200, height: 630 }],
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

> ⚠️ **Nota:** Reorganizar a homepage em route group `(marketing)` requer mover `app/page.tsx` → `app/(marketing)/page.tsx`. Fazer isso apenas se não houver conflito com outras rotas do projeto. Validar que o dashboard e auth routes continuam funcionando.

- [ ] Commit: `feat(seo): add homepage metadata with canonical URL`

---

### Task 2.5: Metadata + JSON-LD para curso Tricologia

**Files:**
- Create: `app/cursos/tricologia/layout.tsx`

- [ ] Criar `app/cursos/tricologia/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import JsonLd from '@/components/json-ld';
import { buildCourseSchema, buildBreadcrumbSchema, buildFaqSchema } from '@/lib/schema';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cursos.rubiadecarli.com.br';

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
    images: [{ url: '/imgi_10_modulo3.jpg', width: 1200, height: 630 }],
  },
};

const courseSchema = buildCourseSchema({
  name: 'Tricologia Essencial',
  description:
    'Curso presencial de Tricologia em 3 módulos para profissionais de saúde. Aborda anatomia capilar, tricoses (doenças e anormalidades da haste) e alopecias não cicatriciais.',
  url: '/cursos/tricologia',
  price: 'R$ 997',
  duration: 'PT5H',
  image: '/imgi_10_modulo3.jpg',
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
```

- [ ] Commit: `feat(schema): add Course JSON-LD and metadata for Tricologia page`

---

### Task 2.6: Metadata + JSON-LD para curso Protocolo Full Face

**Files:**
- Create: `app/cursos/protocolo-full-face/layout.tsx`

- [ ] Criar `app/cursos/protocolo-full-face/layout.tsx`:

```typescript
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
    images: [{ url: '/protocolofullface.webp', width: 1200, height: 630 }],
  },
};

const courseSchema = buildCourseSchema({
  name: 'Protocolo Full Face',
  description:
    'Formação presencial intensiva de 3 dias em harmonização facial. Aborda toxina botulínica global, preenchedores com ácido hialurônico, bioestimuladores de colágeno, técnica Fullips London Face e preenchimento orbicular.',
  url: '/cursos/protocolo-full-face',
  price: 'R$ 2.997',
  duration: 'P3D',
  image: '/protocolofullface.webp',
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
    answer: 'Toxina botulínica global, preenchedores com ácido hialurônico, bioestimuladores de colágeno (Radiesse, Sculptra), técnica Fullips London Face e preenchimento orbicular para olheiras.',
  },
  {
    question: 'Há prática com pacientes reais?',
    answer: 'Sim. O curso inclui aplicação supervisionada em pacientes reais sob orientação direta da Dra. Rúbia De Carli.',
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
```

- [ ] Commit: `feat(schema): add Course JSON-LD and metadata for Protocolo Full Face page`

---

### Task 2.7: noindex na página /obrigado

**Files:**
- Create: `app/obrigado/layout.tsx`

- [ ] Criar `app/obrigado/layout.tsx`:

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Obrigado | Dra. Rúbia De Carli',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ObrigadoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] Commit: `feat(seo): add noindex to /obrigado page`

---

## Subsistema 3 — GTM + Cookie Consent (LGPD)

> **Objetivo:** Centralizar rastreamento no GTM e garantir compliance com a LGPD via banner de consentimento de cookies.

### Task 3.1: Atualizar TrackingScript para GTM

**Files:**
- Modify: `components/tracking-script.tsx`
- Modify: `lib/tracking.ts`
- Modify: `.env.example`

- [ ] Atualizar `components/tracking-script.tsx` para suportar GTM (com GA4 dentro do GTM) e Google Consent Mode v2:

```tsx
'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { GA_MEASUREMENT_ID } from '@/lib/tracking';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    // Dispara pageview via dataLayer (GTM pega automaticamente)
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'pageview', page: url });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function TrackingScript() {
  const hasGtm = Boolean(GTM_ID);
  const hasGa4 = Boolean(GA_MEASUREMENT_ID);

  return (
    <>
      {/* Google Consent Mode v2 — deve ser o PRIMEIRO script, antes de GTM/GA4 */}
      <Script id="consent-mode-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          // Consentimento padrão: negado até o usuário aceitar (LGPD / GDPR)
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500,
          });
        `}
      </Script>

      {/* Google Tag Manager — inclui GA4, Meta Pixel etc. via interface GTM */}
      {hasGtm && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
          {/* GTM noscript fallback */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* GA4 direto — fallback para quando GTM não estiver configurado */}
      {!hasGtm && hasGa4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
                send_page_view: true,
                anonymize_ip: true,
              });
            `}
          </Script>
        </>
      )}

      <Suspense>
        <RouteTracker />
      </Suspense>
    </>
  );
}
```

- [ ] Adicionar `NEXT_PUBLIC_GTM_ID` ao `.env.example`:

```
# Google Tag Manager (substitui injeção direta de GA4)
# Obtenha em tagmanager.google.com → Criar conta → Criar contêiner
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

- [ ] Atualizar `lib/tracking.ts` — a função `track()` também deve disparar via `dataLayer`:

```typescript
// Substituir a função track() existente por:
export function track(event: TrackEvent): void {
  if (typeof window === 'undefined') return;

  // Via GTM dataLayer (preferencial)
  if (window.dataLayer) {
    window.dataLayer.push({
      event: event.action,
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }

  // Via gtag direto (fallback)
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }
}
```

- [ ] Commit: `feat(tracking): migrate to GTM with Google Consent Mode v2`

---

### Task 3.2: Banner de cookie consent (LGPD)

**Files:**
- Create: `components/cookie-banner.tsx`
- Modify: `app/layout.tsx` — incluir `<CookieBanner />`

- [ ] Criar `components/cookie-banner.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';

const CONSENT_KEY = 'rubia_cookie_consent';

type ConsentState = 'accepted' | 'rejected' | null;

function updateGoogleConsent(state: 'accepted' | 'rejected') {
  if (typeof window === 'undefined' || !window.gtag) return;
  const granted = state === 'accepted' ? 'granted' : 'denied';
  window.gtag('consent', 'update', {
    analytics_storage: granted,
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
  });
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState;
    if (stored) {
      setConsent(stored);
      updateGoogleConsent(stored);
    } else {
      // Mostra o banner após 1s para não atrapalhar o LCP
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
    updateGoogleConsent('accepted');
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setConsent('rejected');
    updateGoogleConsent('rejected');
    setVisible(false);
  }

  if (!visible || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t border-[#D4AF37]/20 shadow-2xl"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <Shield className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />

        <div className="flex-1">
          <p className="text-sm text-[#1A1A1A] font-medium mb-1">
            Usamos cookies para melhorar sua experiência
          </p>
          <p className="text-xs text-[#4A3F35] leading-relaxed">
            Utilizamos cookies para análise de tráfego (Google Analytics) e rastreamento de conversões.
            Seus dados são tratados conforme a{' '}
            <a href="/politica-de-privacidade" className="underline hover:text-[#D4AF37] transition-colors">
              Política de Privacidade
            </a>{' '}
            em conformidade com a LGPD.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-sm border border-gray-200 text-[#4A3F35] rounded-lg hover:border-[#D4AF37] transition-colors"
          >
            Rejeitar
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm bg-[#D4AF37] hover:bg-[#B8952E] text-white rounded-lg font-medium transition-colors"
          >
            Aceitar cookies
          </button>
        </div>

        <button
          onClick={reject}
          aria-label="Fechar"
          className="absolute top-3 right-3 md:hidden text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] Adicionar `<CookieBanner />` no `app/layout.tsx` dentro do `<body>`:

```typescript
import CookieBanner from '@/components/cookie-banner'

// Dentro do <body>:
<CookieBanner />
```

- [ ] Commit: `feat(lgpd): add cookie consent banner with Google Consent Mode v2`

---

## Checklist de Verificação Final

Após executar todos os subsistemas, verificar:

- [ ] `https://SEU_DOMINIO/robots.txt` — carrega com as regras dos bots de IA
- [ ] `https://SEU_DOMINIO/llms.txt` — conteúdo dos cursos (não da clínica)
- [ ] `https://SEU_DOMINIO/llms-full.txt` — conteúdo completo
- [ ] `https://SEU_DOMINIO/ai.txt` — permissões de IA
- [ ] `https://SEU_DOMINIO/humans.txt` — créditos da equipe
- [ ] `https://SEU_DOMINIO/.well-known/security.txt` — contato de segurança
- [ ] `https://SEU_DOMINIO/sitemap.xml` — retorna XML com 4 URLs dos cursos
- [ ] `https://SEU_DOMINIO/` — inspecionar elemento → ver JSON-LD Organization e Person
- [ ] `https://SEU_DOMINIO/cursos/tricologia` — ver JSON-LD Course, FAQ e Breadcrumb
- [ ] `https://SEU_DOMINIO/cursos/protocolo-full-face` — ver JSON-LD Course, FAQ e Breadcrumb
- [ ] `https://SEU_DOMINIO/obrigado` — `<meta name="robots" content="noindex">` presente
- [ ] Banner de cookies aparece ao entrar pela primeira vez
- [ ] "Aceitar" dispara `gtag('consent', 'update', ...)` no console do browser
- [ ] Validar schemas em: [https://validator.schema.org](https://validator.schema.org)
- [ ] Validar Open Graph em: [https://www.opengraph.xyz](https://www.opengraph.xyz)
- [ ] Validar rich results em: [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)

---

## O que fica fora do escopo (requer serviços externos)

| Item | Ação necessária |
|---|---|
| Google Search Console | Verificar domínio + submeter sitemap manualmente |
| Google Tag Manager | Criar conta em tagmanager.google.com + configurar tags de GA4 e Meta Pixel |
| Meta Pixel (CAPI) | Configurar servidor intermediário (Vercel Edge ou n8n) para server-side tracking |
| Google Ads Conversion | Configurar no GTM após ativar campanhas |
| Link Building / Digital PR | Atividade contínua — publicar artigos em portais de biomedicina e saúde |
| Monitoramento CrUX | Verificar mensalmente no Search Console → Core Web Vitals |
