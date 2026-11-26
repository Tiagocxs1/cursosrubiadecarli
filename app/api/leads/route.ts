import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

type LeadPayload = Record<string, unknown>;

const CRM_BASE = 'https://tsdigitais-central-astro.tiagocxs-tdb.workers.dev';
const CRM_FORM_KEY = 'ede60fad09cd4a5185d884e0451a1258';

async function syncLeadToCentral(payload: Record<string, unknown>) {
  // Use the verified production origin for the CRM allowlist. Keep the actual
  // preview/production URL as sourceUrl for audit and attribution.
  const parentOrigin = 'https://cursos.rubiadecarli.com.br';
  const sourceUrl = String(payload.urlOrigem ?? parentOrigin);
  const data = {
    nome: String(payload.nome ?? ''),
    email: String(payload.email ?? ''),
    whatsapp: String(payload.whatsapp ?? ''),
    telefone: String(payload.whatsapp ?? ''),
    mensagem: String(payload.mensagem ?? ''),
    curso: String(payload.curso ?? ''),
    procedimento: String(payload.procedimento ?? ''),
    origem: String(payload.origem ?? 'site'),
    fonte: String(payload.fonte ?? 'contato_site'),
    newsletter: payload.newsletter === true,
    receberDicas: payload.receberDicas === 'sim' || payload.newsletter === true,
    contatoWhatsapp: payload.contatoWhatsapp === true,
    consentimento: true,
  };
  const response = await fetch(CRM_BASE + '/api/public/forms/' + CRM_FORM_KEY + '/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data,
      sourceUrl,
      referrerUrl: String(payload.referrer ?? ''),
      parentOrigin,
    }),
    signal: AbortSignal.timeout(15000),
  });
  const result = await response.json().catch(() => ({})) as Record<string, unknown>;
  const notifications = result.notifications && typeof result.notifications === 'object'
    ? result.notifications as Record<string, unknown>
    : {};
  return {
    ok: response.ok && result.ok !== false && result.success !== false,
    error: response.ok ? null : (String(result.error || 'crm_http_' + response.status)),
    notifications,
    submissionId: String(result.submissionId || ''),
  };
}
function valueOf(value: unknown, maxLength = 500): string {
  if (typeof value === 'string') return value.trim().slice(0, maxLength);
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

function truthy(value: unknown): boolean {
  return value === true || value === 'true' || value === 'sim' || value === 'yes' || value === 1;
}

function safePageUrl(value: string, fallback: string): string {
  for (const candidate of [value, fallback]) {
    if (!candidate) continue;
    try {
      const parsed = new URL(candidate);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        return parsed.toString().slice(0, 2048);
      }
    } catch {
      // Ignore invalid URLs and try the fallback.
    }
  }
  return 'https://cursos.rubiadecarli.com.br/';
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }

    const email = valueOf(body.email, 254).toLowerCase();
    const fonte = valueOf(body.fonte, 100) || 'contato_site';
    const origem = valueOf(body.origem, 200) || 'site';
    const isNewsletter = fonte === 'newsletter_footer' || origem === 'site - newsletter footer';
    const nome = valueOf(body.nome, 160) || (isNewsletter ? email : '');
    const whatsapp = valueOf(body.whatsapp || body.telefone, 40);
    const mensagem = valueOf(body.mensagem, 4000);
    const curso = valueOf(body.curso, 180);
    const procedimento = valueOf(body.procedimento, 180) || curso || (isNewsletter ? 'Newsletter' : 'Contato Site');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
    }
    if (!nome) {
      return NextResponse.json({ error: 'Informe seu nome.' }, { status: 400 });
    }

    const consentNewsletter = truthy(body.newsletter) || truthy(body.receberDicas);
    const consentWhatsapp = truthy(body.contatoWhatsapp) || truthy(body.whatsappConsent);
    const referer = req.headers.get('referer') || '';
    const originHeader = req.headers.get('origin') || 'https://cursos.rubiadecarli.com.br';
    const pageFallback = referer || originHeader;
    const urlOrigem = safePageUrl(valueOf(body.urlOrigem, 2048), pageFallback);

    const payload = {
      nome,
      email,
      whatsapp,
      curso,
      procedimento,
      mensagem,
      origem,
      fonte,
      grupoWhatsapp: valueOf(body.grupoWhatsapp, 20),
      receberDicas: consentNewsletter ? 'sim' : 'não',
      newsletter: consentNewsletter,
      contatoWhatsapp: consentWhatsapp,
      dataHora: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'full',
        timeStyle: 'short',
      }),
      dataISO: new Date().toISOString(),
      urlOrigem,
      referrer: valueOf(body.referrer, 2048) || referer,
      utmSource: valueOf(body.utmSource || body.utm_source || body.source, 160),
      midia: valueOf(body.midia || body.utmMedium || body.utm_medium, 160),
      campanha: valueOf(body.campanha || body.utmCampaign || body.utm_campaign, 200),
      conteudo: valueOf(body.conteudo || body.utmContent || body.utm_content, 200),
      termo: valueOf(body.termo || body.utmTerm || body.utm_term, 200),
      gclid: valueOf(body.gclid, 500),
      fbclid: valueOf(body.fbclid, 500),
      gbraid: valueOf(body.gbraid, 500),
      wbraid: valueOf(body.wbraid, 500),
      msclkid: valueOf(body.msclkid, 500),
      dclid: valueOf(body.dclid, 500),
      dispositivo: valueOf(body.dispositivo, 30) || 'desktop',
      sessionId: valueOf(body.sessionId, 120) || 'unknown',
      timestamp: Number.isFinite(Number(body.timestamp)) ? Number(body.timestamp) : Date.now(),
      userAgent: valueOf(body.userAgent, 500),
    };

    let crmSynced = false;
    let crmNotifications: Record<string, unknown> = {};
    let crmSubmissionId = '';
    try {
      const crmResult = await syncLeadToCentral(payload);
      crmSynced = crmResult.ok;
      crmNotifications = crmResult.notifications;
      crmSubmissionId = crmResult.submissionId;
      if (!crmResult.ok) console.error('Lead não sincronizado no CRM central:', crmResult.error);
    } catch (error) {
      console.error('Falha de conexão com o CRM central:', error);
    }

    let stored = false;
    if (supabase) {
      try {
        const organizationId =
          process.env.SUPABASE_ORGANIZATION_ID?.replace(/\\n/g, '').trim() || 'CURSOS_RUBIA';
        const { error } = await supabase.from('customers').insert({
          full_name: payload.nome,
          phone: payload.whatsapp,
          email: payload.email,
          lead_source: 'Site Cursos',
          status: 'Lead',
          organization_id: organizationId,
          customer_type: 'PF',
          metadata: {
            fonte: payload.fonte,
            curso: payload.curso,
            procedimento: payload.procedimento,
            mensagem: payload.mensagem,
            origem: payload.origem,
            urlOrigem: payload.urlOrigem,
            referrer: payload.referrer,
            dispositivo: payload.dispositivo,
            sessionId: payload.sessionId,
            utmSource: payload.utmSource,
            utmMedium: payload.midia,
            utmCampaign: payload.campanha,
            utmContent: payload.conteudo,
            utmTerm: payload.termo,
            gclid: payload.gclid,
            fbclid: payload.fbclid,
            gbraid: payload.gbraid,
            wbraid: payload.wbraid,
            msclkid: payload.msclkid,
            dclid: payload.dclid,
            consentNewsletter: payload.newsletter,
            consentWhatsapp: payload.contatoWhatsapp,
            grupoWhatsapp: payload.grupoWhatsapp,
            dataISO: payload.dataISO,
          },
        });
        if (error) throw error;
        stored = true;
      } catch (error) {
        console.error('Falha ao salvar lead no Supabase:', error);
      }
    } else {
      console.error('Lead não salvo: configuração do Supabase ausente.');
    }

    // O CRM central é o registro oficial e também executa as notificações.
    // A tabela customers é apenas um espelho opcional: falha nela não descarta
    // um lead que já foi gravado com sucesso no CRM.
    if (!crmSynced) {
      return NextResponse.json(
        { success: false, error: 'Não foi possível registrar sua solicitação no CRM. Tente novamente.' },
        { status: 503 },
      );
    }

    const emailSent = crmNotifications.email === 'sent';
    const telegramSent = crmNotifications.telegram === 'sent';

    return NextResponse.json(
      {
        success: true,
        stored,
        crmSynced: true,
        submissionId: crmSubmissionId,
        emailSent,
        telegramSent,
        notifications: crmNotifications,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Erro na rota de leads:', error);
    return NextResponse.json(
      { success: false, error: 'Não foi possível processar sua solicitação.' },
      { status: 500 },
    );
  }
}
