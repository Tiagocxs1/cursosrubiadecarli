/**
 * Tracking & Analytics Utilities
 * ================================
 * Centraliza todo o rastreamento do site:
 *   - Construção de URLs do WhatsApp com mensagens pré-definidas
 *   - Disparo de eventos GA4 (gtag)
 *   - Builder de UTMs para links compartilhados em campanhas externas
 *
 * Como usar:
 *   import { buildWhatsAppUrl, track, buildUtmUrl } from '@/lib/tracking'
 *
 * Para ativar o GA4 coloque o Measurement ID em:
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID no .env.local
 */

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------

export const WHATSAPP_NUMBER = '5554992350352';

/** Measurement ID do Google Analytics 4 (GA4). */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface UtmParams {
  /** Origem do tráfego: instagram, google, whatsapp, email… */
  utm_source: string;
  /** Mídia: social, cpc, email, referral, organic */
  utm_medium: string;
  /** Nome da campanha: lancamento_tricologia, black_friday… */
  utm_campaign: string;
  /** Conteúdo específico (A/B): banner_hero, botao_cta… */
  utm_content?: string;
  /** Termo de busca pago */
  utm_term?: string;
}

export interface TrackEvent {
  /** Nome do evento GA4 (snake_case recomendado) */
  action: string;
  /** Categoria/tipo de elemento: button, link, form */
  category: string;
  /** Texto visível ou ID do elemento */
  label?: string;
  /** Valor numérico opcional (ex.: preço) */
  value?: number;
}

// ---------------------------------------------------------------------------
// GA4 — disparo de eventos
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Dispara um evento personalizado via GTM dataLayer (preferencial) ou gtag direto (fallback).
 * Só executa no browser.
 *
 * @example
 * track({ action: 'click_whatsapp', category: 'cta', label: 'hero_garantir_vaga' })
 */
export function track(event: TrackEvent): void {
  if (typeof window === 'undefined') return;

  const parameters: Record<string, string | number | undefined> = {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
  };

  if (event.action === 'generate_lead' && event.label) {
    parameters.lead_source = event.label;
    parameters.form_name = event.label;
  }

  if (GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: event.action, ...parameters });
    return;
  }

  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', event.action, parameters);
  }
}

/**
 * Rastreia cliques em links do WhatsApp.
 * Chame antes de abrir o link.
 */
export function trackWhatsApp(label: string): void {
  track({ action: 'click_whatsapp', category: 'whatsapp', label });
}

/**
 * Rastreia envios de formulário.
 */
export function trackFormStart(formName: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = 'rubia_form_start_' + formName + '_' + window.location.pathname;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch {
    // Tracking must never block a form interaction.
  }
  track({ action: 'form_start', category: 'form', label: formName });
}

/** Dispara o evento recomendado de conversão do GA4 após o servidor confirmar o lead. */
export function trackFormSubmit(formName: string): void {
  // Dispara uma única conversão após o servidor aceitar o lead.
  track({ action: 'generate_lead', category: 'form', label: formName });
}

export function trackNewsletterSignup(): void {
  // A inscrição em newsletter também é aquisição de lead no GA4.
  track({ action: 'generate_lead', category: 'newsletter', label: 'newsletter_footer' });
}

/**
 * Rastreia pageviews manualmente (útil em SPAs / rotas dinâmicas).
 */
export function trackPageView(url: string): void {
  track({ action: 'page_view', category: 'navigation', label: url });
}

// ---------------------------------------------------------------------------
// WhatsApp — builder de URLs com mensagens pré-definidas
// ---------------------------------------------------------------------------

const WA_MESSAGES = {
  /** Hero principal — intenção genérica */
  hero_garantir_vaga:
    'Olá! Vi o site e quero garantir minha vaga em um dos cursos presenciais da Dra. Rúbia. Podem me informar sobre as próximas turmas?',

  /** Card de curso — Tricologia */
  card_matricula_tricologia:
    'Olá! Tenho interesse em me matricular no curso *Tricologia Essencial* da Dra. Rúbia. Gostaria de saber mais sobre valores e datas disponíveis.',

  /** Card de curso — Protocolo Full Face */
  card_matricula_full_face:
    'Olá! Tenho interesse em me matricular no curso *Protocolo Full Face* da Dra. Rúbia. Gostaria de saber mais sobre valores e datas disponíveis.',

  /** Seção de investimento / garantir vaga geral */
  investimento_garantir_vaga:
    'Olá! Quero garantir minha vaga nos cursos presenciais da Dra. Rúbia. Podem me informar sobre as próximas turmas e valores?',

  /** Página de obrigado — pós ebook */
  obrigado_ebook:
    'Olá! Acabei de baixar o ebook e gostaria de saber mais sobre os cursos presenciais da Dra. Rúbia.',

  /** Genérico / fallback */
  geral:
    'Olá! Gostaria de saber mais sobre os cursos presenciais da Dra. Rúbia De Carli.',
} as const;

export type WhatsAppKey = keyof typeof WA_MESSAGES;

/**
 * Constrói a URL completa do WhatsApp com mensagem codificada.
 * Rastreia automaticamente o clique no GA4.
 *
 * @param key  - chave da mensagem pré-definida em WA_MESSAGES
 * @returns    URL pronta para usar em href ou window.open
 *
 * @example
 * <a href={buildWhatsAppUrl('hero_garantir_vaga')} target="_blank">Garantir Vaga</a>
 */
export function buildWhatsAppUrl(key: WhatsAppKey = 'geral'): string {
  const message = WA_MESSAGES[key];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Abre o WhatsApp em nova aba e rastreia o evento.
 * Use em handlers onClick de botões.
 */
export function openWhatsApp(key: WhatsAppKey = 'geral'): void {
  trackWhatsApp(key);
  window.open(buildWhatsAppUrl(key), '_blank', 'noopener,noreferrer');
}

// ---------------------------------------------------------------------------
// UTM — builder para links compartilhados em campanhas externas
// ---------------------------------------------------------------------------

/**
 * Adiciona parâmetros UTM a qualquer URL interna ou externa.
 * Use ao criar links para postar em Instagram, e-mail, Google Ads, etc.
 *
 * @example
 * buildUtmUrl('https://seusite.com/cursos/tricologia-essencial', {
 *   utm_source: 'instagram',
 *   utm_medium: 'social',
 *   utm_campaign: 'lancamento_tricologia',
 *   utm_content: 'stories_jun2025',
 * })
 * // → https://seusite.com/cursos/tricologia?utm_source=instagram&utm_medium=social&...
 */
export function buildUtmUrl(baseUrl: string, params: UtmParams): string {
  const url = new URL(baseUrl, 'https://placeholder.com');
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  // Se a URL original era relativa, retorna só o path+search
  if (baseUrl.startsWith('/')) return url.pathname + url.search;
  return url.toString();
}

// ---------------------------------------------------------------------------
// Preset de campanhas — exemplos prontos para usar
// ---------------------------------------------------------------------------

/**
 * Links pré-montados com UTMs para campanhas recorrentes.
 * Importe e use diretamente em bio do Instagram, e-mail marketing, etc.
 *
 * @example
 * import { CAMPAIGN_LINKS } from '@/lib/tracking'
 * // Cole CAMPAIGN_LINKS.instagram_bio na bio do Instagram
 */
export const CAMPAIGN_LINKS = {
  instagram_bio: buildUtmUrl('https://cursos.rubiadecarli.com.br', {
    utm_source: 'instagram',
    utm_medium: 'social',
    utm_campaign: 'bio_link',
  }),
  instagram_stories_tricologia: buildUtmUrl('https://cursos.rubiadecarli.com.br/cursos/tricologia-essencial', {
    utm_source: 'instagram',
    utm_medium: 'stories',
    utm_campaign: 'tricologia',
    utm_content: 'stories_swipe_up',
  }),
  instagram_stories_full_face: buildUtmUrl('https://cursos.rubiadecarli.com.br/cursos/protocolo-full-face', {
    utm_source: 'instagram',
    utm_medium: 'stories',
    utm_campaign: 'full_face',
    utm_content: 'stories_swipe_up',
  }),
  email_newsletter: buildUtmUrl('https://cursos.rubiadecarli.com.br', {
    utm_source: 'email',
    utm_medium: 'newsletter',
    utm_campaign: 'newsletter_semanal',
  }),
  google_ads_tricologia: buildUtmUrl('https://cursos.rubiadecarli.com.br/cursos/tricologia-essencial', {
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'tricologia_search',
    utm_content: 'ad_principal',
  }),
  whatsapp_compartilhamento: buildUtmUrl('https://cursos.rubiadecarli.com.br', {
    utm_source: 'whatsapp',
    utm_medium: 'referral',
    utm_campaign: 'indicacao',
  }),
} as const;

// ---------------------------------------------------------------------------
// UTM Capture — lê parâmetros da URL e persiste no localStorage
// ---------------------------------------------------------------------------

const TRACKING_STORAGE_KEY = 'rubia_tracking_session';
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'gbraid', 'wbraid', 'dclid', 'fbclid', 'msclkid',
] as const;

/**
 * Chame no useEffect das páginas para capturar UTMs da URL e salvar no localStorage.
 * Assim o lead que vem do Instagram e navega para outra página não perde a origem.
 */
export function captureUTMs(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const data: Record<string, string> = {};
  let found = false;

  for (const key of TRACKING_PARAMS) {
    const val = params.get(key);
    if (val) { data[key] = val; found = true; }
  }

  if (found) {
    data.url_origem = window.location.href;
    try { localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
  }
}

export interface TrackingPayload {
  dataHora: string;
  dataISO: string;
  dispositivo: string;
  utmSource: string;
  midia: string;
  campanha: string;
  conteudo: string;
  termo: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  dclid: string;
  fbclid: string;
  msclkid: string;
  urlOrigem: string;
  referrer: string;
  sessionId: string;
  timestamp: number;
  userAgent: string;
}

/**
 * Retorna todos os campos de rastreamento para incluir no payload do webhook.
 * Segue o mesmo formato do domínio principal (camelCase, conforme N8N_FIELD_MAPPING).
 * Lê do localStorage (capturado na entrada) + URL atual como fallback.
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    const existing = sessionStorage.getItem('rubia_session_id');
    if (existing) return existing;
    const generated = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : 'rubia-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem('rubia_session_id', generated);
    return generated;
  } catch {
    return 'session-unavailable';
  }
}

/**
 * Retorna origem, campanha e identificadores de clique preservados desde a entrada.
 */
export function getTrackingData(): TrackingPayload {
  let stored: Record<string, string> = {};

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(TRACKING_STORAGE_KEY);
      if (raw) stored = JSON.parse(raw);
    } catch {
      stored = {};
    }

    const params = new URLSearchParams(window.location.search);
    for (const key of TRACKING_PARAMS) {
      const val = params.get(key);
      if (val) stored[key] = val;
    }
    if (!stored.url_origem) stored.url_origem = window.location.href;
  }

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  return {
    dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'full', timeStyle: 'short' }),
    dataISO: new Date().toISOString(),
    dispositivo: isMobile ? 'mobile' : 'desktop',
    utmSource: stored.utm_source ?? '',
    midia: stored.utm_medium ?? '',
    campanha: stored.utm_campaign ?? '',
    conteudo: stored.utm_content ?? '',
    termo: stored.utm_term ?? '',
    gclid: stored.gclid ?? '',
    gbraid: stored.gbraid ?? '',
    wbraid: stored.wbraid ?? '',
    dclid: stored.dclid ?? '',
    fbclid: stored.fbclid ?? '',
    msclkid: stored.msclkid ?? '',
    urlOrigem: stored.url_origem ?? (typeof window !== 'undefined' ? window.location.href : ''),
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    sessionId: getOrCreateSessionId(),
    timestamp: Date.now(),
    userAgent: ua,
  };
}
