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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, whatsapp, curso, assunto, mensagem, origem, fonte } = body;

    const isNewsletter = fonte === 'newsletter_footer' || origem === 'site - newsletter footer';
    if (!nome || !email || (!whatsapp && !isNewsletter)) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const payload = {
      nome,
      email,
      whatsapp: whatsapp || '',
      procedimento: curso || assunto || origem || fonte || 'Contato Site',
      mensagem: mensagem || '',
      origem: origem || fonte || 'site',
      fonte: fonte || '',
      curso: curso || '',
      grupoWhatsapp: body.grupoWhatsapp || '',
      receberDicas: body.receberDicas || '',
      dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'full', timeStyle: 'short' }),
      dataISO: new Date().toISOString(),
      urlOrigem: body.urlOrigem
        ? (body.urlOrigem as string).startsWith('http')
          ? body.urlOrigem
          : `https://cursos.rubiadecarli.com.br${(body.urlOrigem as string).startsWith('/') ? '' : '/'}${body.urlOrigem}`
        : (req.headers.get('origin') || 'https://cursos.rubiadecarli.com.br') + (req.headers.get('referer') ? new URL(req.headers.get('referer') as string).pathname : ''),
      midia: body.midia || '',
      campanha: body.campanha || '',
      conteudo: body.conteudo || '',
      termo: body.termo || '',
      gclid: body.gclid || '',
      fbclid: body.fbclid || '',
      dispositivo: body.dispositivo || 'desktop',
      sessionId: body.sessionId || 'unknown',
      timestamp: body.timestamp || Date.now(),
      userAgent: body.userAgent || req.headers.get('user-agent') || '',
    };

    if (supabase) {
      try {
        const organizationId = process.env.SUPABASE_ORGANIZATION_ID?.replace(/\\n/g, '').trim() || 'CURSOS_RUBIA';
        const { error: insertError } = await supabase.from('customers').insert({
          full_name: nome,
          phone: whatsapp,
          email,
          lead_source: 'Site Cursos',
          status: 'Lead',
          organization_id: organizationId,
          customer_type: 'PF',
          metadata: {
            curso: payload.curso,
            procedimento: payload.procedimento,
            mensagem: payload.mensagem,
            origem: payload.origem,
            fonte: payload.fonte,
            urlOrigem: payload.urlOrigem,
            dispositivo: payload.dispositivo,
          },
        });
        if (insertError) {
          console.error('Erro ao salvar lead no Supabase:', insertError.message);
        }
      } catch (supabaseError) {
        console.error('Erro ao salvar no Supabase:', supabaseError);
      }
    } else {
      console.warn('Supabase não configurado — lead não salvo no banco');
    }

    await sendTelegram(payload);

    try {
      await sendLeadEmail(payload);
    } catch (emailError) {
      console.error('Falha ao enviar e-mail do lead:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro na rota de leads:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

async function sendTelegram(data: Record<string, unknown>) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return;

  const siteLabel = (data.origem as string) || (data.urlOrigem as string) || 'cursos.rubiadecarli.com.br';
  const pagina = (data.urlOrigem as string) || 'cursos.rubiadecarli.com.br';
  const assunto = (data.procedimento as string) || 'Contato Site';

  const texto = `🚀 *NOVO LEAD - ${siteLabel.toUpperCase()}*\n\n` +
    `👤 *Nome:* ${data.nome}\n` +
    `📧 *E-mail:* ${data.email}\n` +
    `📱 *Zap:* [${data.whatsapp}](https://wa.me/${(data.whatsapp as string)?.replace(/\D/g, '')})\n` +
    `📝 *Assunto:* ${assunto}\n` +
    `🌐 *Site/Página:* ${pagina}\n` +
    `📅 *Data/Hora:* ${data.dataHora}\n` +
    `🔗 *Origem:* ${siteLabel}` +
    (mapCheckboxGroup(data) ? `\n💬 *Grupo WhatsApp:* ${mapCheckboxGroup(data)}` : '') +
    (mapCheckboxDicas(data) ? `\n📣 *Dicas/Cursos:* ${mapCheckboxDicas(data)}` : '');

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: texto,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('Falha no Telegram:', err);
  }
}

function mapCheckboxGroup(data: Record<string, unknown>): string {
  const v = (data.grupoWhatsapp as string) || (data['checkbox_grupo_whatsapp'] as string) || '';
  if (v === 'sim') return '✅ Sim';
  if (v === 'não' || v === 'nao') return '❌ Não';
  return '';
}

function mapCheckboxDicas(data: Record<string, unknown>): string {
  const v = (data.receberDicas as string) || (data['checkbox_receber_dicas'] as string) || '';
  if (v === 'sim') return '✅ Sim';
  if (v === 'não' || v === 'nao') return '❌ Não';
  return '';
}