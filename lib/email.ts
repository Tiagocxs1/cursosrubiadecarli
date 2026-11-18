import nodemailer from 'nodemailer';

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

const EMAILS = {
  contato: process.env.CONTATO_EMAIL || 'contato@rubiadecarli.com.br',
  dra: process.env.DRA_EMAIL || 'decarlibiomedicina@gmail.com',
  dev: process.env.DEV_EMAIL || 'tiagocxs.tdb@gmail.com',
  tiago: 'tiagocxs.tdb@gmail.com',
};

function mapCheckbox(v: string): string {
  if (v === 'sim') return '✅ Sim';
  if (v === 'não' || v === 'nao') return '❌ Não';
  return v;
}


function escapeHtml(value: unknown): string {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(value ?? '').replace(/[&<>"']/g, (char) => entities[char]);
}

function safeHeader(value: unknown, maxLength = 160): string {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, maxLength);
}

function buildHtml(data: Record<string, unknown>) {
  const fonte = (data.fonte as string) || (data.origem as string) || '';
  const isEbook = fonte.toLowerCase().includes('ebook') || (data.procedimento as string || '').toLowerCase().includes('ebook');
  const titulo = isEbook ? '🎓 NOVO LEAD DE E-BOOK' : '🚀 NOVO LEAD - CURSOS';

  const rows: Array<[string, unknown]> = [
    ['Nome', data.nome],
    ['E-mail', data.email],
    ['WhatsApp', data.whatsapp || 'Não informado'],
    ['Assunto', data.procedimento || 'Contato Site'],
    ['Curso', data.curso || '—'],
    ['Mensagem', data.mensagem || 'Não informado'],
    ['Origem do formulário', data.origem],
    ['Página de entrada', data.urlOrigem],
    ['Referenciador', data.referrer || 'Acesso direto'],
    ['Fonte / mídia', [data.utmSource, data.midia].filter(Boolean).join(' / ') || 'Não identificado'],
    ['Campanha', data.campanha || '—'],
    ['Conteúdo / termo', [data.conteudo, data.termo].filter(Boolean).join(' / ') || '—'],
    ['Google Ads click ID', data.gclid || data.gbraid || data.wbraid || '—'],
    ['Meta click ID', data.fbclid || '—'],
    ['Microsoft Ads click ID', data.msclkid || '—'],
    ['Dispositivo', data.dispositivo || 'desktop'],
    ['Session ID', data.sessionId || 'unknown'],
    ['Grupo WhatsApp', mapCheckbox(String(data.grupoWhatsapp || '')) || 'Não informado'],
    ['Aceita receber dicas/newsletter', data.newsletter ? 'Sim' : 'Não'],
    ['Aceita contato por WhatsApp', data.contatoWhatsapp ? 'Sim' : 'Não'],
    ['Data / hora', data.dataHora],
  ];

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#222;">
      <h2 style="color:#B8952E;">${titulo}</h2>
      <p>Uma nova solicitação foi recebida no site de cursos da Dra. Rúbia De Carli.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;">
        ${rows.map(([label, value]) => `<tr><td style="width:36%;padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">${escapeHtml(label)}</td><td style="padding:8px;border:1px solid #ddd;overflow-wrap:anywhere;">${escapeHtml(value)}</td></tr>`).join('')}
      </table>
      ${isEbook ? `<p style="margin-top:16px;padding:12px;background:#FDF6E3;border-left:4px solid #B8952E;">📖 Este lead solicitou o e-book. Verifique o fluxo de entrega do material.</p>` : ''}
    </div>
  `;
}

export async function sendLeadEmail(data: Record<string, unknown>) {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }

  const fromEmail = safeHeader(process.env.EMAIL_FROM || 'mkt@tsdigitais.com', 200);
  const fromName = safeHeader(process.env.EMAIL_FROM_NAME || 'MKT | Cursos Rúbia De Carli', 80);
  const from = `"${fromName}" <${fromEmail}>`;
  const to = Array.from(new Set([EMAILS.contato, EMAILS.dra, EMAILS.dev, EMAILS.tiago].filter(Boolean)));
  const fonte = (data.fonte as string) || (data.origem as string) || '';
  const isEbook = fonte.toLowerCase().includes('ebook') || (data.procedimento as string || '').toLowerCase().includes('ebook');
  const safeName = safeHeader(data.nome, 120);
  const safeProcedure = safeHeader(data.procedimento || data.curso || 'Contato Site', 100);
  const subject = isEbook
    ? `🎓 Novo Lead de E-book: ${safeName}`
    : `🚀 Lead: ${safeName} - ${safeProcedure}`;

  await transporter.sendMail({ from, to, subject, html: buildHtml(data) });
}
