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
};

function mapCheckbox(v: string): string {
  if (v === 'sim') return '✅ Sim';
  if (v === 'não' || v === 'nao') return '❌ Não';
  return v;
}

function buildHtml(data: Record<string, unknown>) {
  const fonte = (data.fonte as string) || (data.origem as string) || '';
  const isEbook = fonte.toLowerCase().includes('ebook') || (data.procedimento as string || '').toLowerCase().includes('ebook');
  const titulo = isEbook ? '🎓 NOVO LEAD DE E-BOOK' : '🚀 NOVO LEAD - CURSOS';

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#B8952E;">${titulo}</h2>
      <p style="color:#333;">Um novo lead foi registrado no site de cursos da Dra. Rúbia De Carli.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">Nome</td><td style="padding:8px;border:1px solid #ddd;">${data.nome as string}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">E-mail</td><td style="padding:8px;border:1px solid #ddd;">${data.email as string}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">WhatsApp</td><td style="padding:8px;border:1px solid #ddd;"><a href="https://wa.me/${(data.whatsapp as string)?.replace(/\D/g, '')}">${data.whatsapp as string}</a></td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">Assunto</td><td style="padding:8px;border:1px solid #ddd;">${(data.procedimento as string) || 'Contato Site'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">Curso</td><td style="padding:8px;border:1px solid #ddd;">${(data.curso as string) || '—'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">Mensagem</td><td style="padding:8px;border:1px solid #ddd;">${(data.mensagem as string) || 'Não informado'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">Origem</td><td style="padding:8px;border:1px solid #ddd;">${(data.origem as string) || (data.urlOrigem as string)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">Site/Página</td><td style="padding:8px;border:1px solid #ddd;">${(data.urlOrigem as string) || 'cursos.rubiadecarli.com.br'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">Data/Hora</td><td style="padding:8px;border:1px solid #ddd;">${data.dataHora as string}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">Dispositivo</td><td style="padding:8px;border:1px solid #ddd;">${(data.dispositivo as string) || 'desktop'}</td></tr>
        ${data.grupoWhatsapp ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">Grupo WhatsApp Tricologia</td><td style="padding:8px;border:1px solid #ddd;">${mapCheckbox(data.grupoWhatsapp as string)}</td></tr>` : ''}
        ${data.receberDicas ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#FAF9F8;">Dicas & novos cursos</td><td style="padding:8px;border:1px solid #ddd;">${mapCheckbox(data.receberDicas as string)}</td></tr>` : ''}
      </table>
      ${isEbook ? `<p style="margin-top:16px;padding:12px;background:#FDF6E3;border-left:4px solid #B8952E;color:#333;">📖 <strong>Ação:</strong> encaminhe o link do e-book para o lead e chame no WhatsApp informando que o material já foi enviado e que está disponível para tirar todas as dúvidas sobre os cursos.</p>` : ''}
    </div>
  `;
}

export async function sendLeadEmail(data: Record<string, unknown>) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('E-mail não enviado: SMTP não configurado');
    return;
  }

  const fromEmail = process.env.EMAIL_FROM || 'mkt@tsdigitais.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'MKT | Cursos Rúbia De Carli';
  const from = `"${fromName}" <${fromEmail}>`;
  const to = [EMAILS.contato, EMAILS.dra, EMAILS.dev].join(', ');
  const fonte = (data.fonte as string) || (data.origem as string) || '';
  const isEbook = fonte.toLowerCase().includes('ebook') || (data.procedimento as string || '').toLowerCase().includes('ebook');
  const subject = isEbook
    ? `🎓 Novo Lead de E-book: ${data.nome as string}`
    : `🚀 Lead: ${data.nome as string} - ${(data.procedimento || data.curso || 'Contato Site') as string}`;
  const html = buildHtml(data);

  await transporter.sendMail({ from, to, subject, html });
}
