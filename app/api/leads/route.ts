import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendLeadEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

type LeadPayload = Record<string, unknown>;

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
    if (!nome || (!isNewsletter && !whatsapp)) {
      return NextResponse.json({ error: 'Preencha os campos obrigatórios.' }, { status: 400 });
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

    let emailSent = false;
    try {
      await sendLeadEmail(payload);
      emailSent = true;
    } catch (error) {
      console.error('Falha ao enviar notificação por e-mail:', error);
    }

    const telegramSent = await sendTelegram(payload);

    // Nunca responder "sucesso" quando nenhum destino recebeu o lead.
    if (!stored && !emailSent) {
      return NextResponse.json(
        { success: false, error: 'Não foi possível registrar sua solicitação. Tente novamente.' },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { success: true, stored, emailSent, telegramSent },
      { status: stored ? 200 : 202 },
    );
  } catch (error) {
    console.error('Erro na rota de leads:', error);
    return NextResponse.json(
      { success: false, error: 'Não foi possível processar sua solicitação.' },
      { status: 500 },
    );
  }
}

async function sendTelegram(data: Record<string, unknown>): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return false;

  const clean = (value: unknown) => String(value ?? '').replace(/[\\r\\n]+/g, ' ').slice(0, 500);
  const lines = [
    '🚀 NOVO LEAD — CURSOS DRA. RÚBIA',
    '',
    'Nome: ' + clean(data.nome),
    'E-mail: ' + clean(data.email),
    'WhatsApp: ' + clean(data.whatsapp),
    'Assunto: ' + clean(data.procedimento),
    'Página: ' + clean(data.urlOrigem),
    'Origem: ' + clean(data.utmSource) + ' / ' + clean(data.midia),
    'Campanha: ' + clean(data.campanha),
    'Data: ' + clean(data.dataHora),
    'Aceita newsletter: ' + (data.newsletter ? 'Sim' : 'Não'),
    'Aceita contato WhatsApp: ' + (data.contatoWhatsapp ? 'Sim' : 'Não'),
  ];

  try {
    const response = await fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\\n') }),
    });
    if (!response.ok) {
      console.error('Telegram rejeitou a notificação:', response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Falha de conexão com Telegram:', error);
    return false;
  }
}