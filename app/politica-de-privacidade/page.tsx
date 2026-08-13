import PremiumFooter from '@/components/premium-footer';
import SiteNavbar from '@/components/site-navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade da plataforma de cursos da Dra. Rúbia De Carli.',
  robots: { index: false, follow: false },
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <SiteNavbar />

      {/* CONTENT */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full">

        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Política de Privacidade</h1>
          <p className="text-sm text-gray-500">Última atualização: março de 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">1. Controladora dos Dados</h2>
            <p>
              A <strong>Dra. Rúbia De Carli</strong> (CRBM 2144), com endereço na R. Alfredo Chaves, 1208,
              W Tower sala 306, Caxias do Sul/RS, e-mail <strong>contato@rubiaadecarli.com.br</strong>,
              é a controladora dos dados pessoais coletados por esta plataforma, nos termos da Lei Geral de
              Proteção de Dados (Lei nº 13.709/2018 — LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">2. Dados que Coletamos</h2>
            <p>Coletamos os seguintes dados pessoais:</p>

            <h3 className="text-base font-semibold text-[#1A1A1A] mt-4 mb-2">2.1 Dados fornecidos diretamente por você</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nome completo;</li>
              <li>Endereço de e-mail;</li>
              <li>Número de telefone/WhatsApp;</li>
              <li>Profissão e número de registro no conselho de classe (ex.: CRBM, CRM, CREFITO);</li>
              <li>Cidade e estado;</li>
              <li>Informações de pagamento (processadas por terceiros — não armazenamos dados de cartão).</li>
            </ul>

            <h3 className="text-base font-semibold text-[#1A1A1A] mt-4 mb-2">2.2 Dados coletados automaticamente</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Endereço IP;</li>
              <li>Tipo de navegador e dispositivo;</li>
              <li>Páginas visitadas e tempo de permanência;</li>
              <li>Origem do acesso (ex.: redes sociais, busca orgânica);</li>
              <li>Dados de cookies (conforme nossa política de cookies).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">3. Finalidade do Tratamento</h2>
            <p>Seus dados são utilizados para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processar e confirmar inscrições em cursos presenciais;</li>
              <li>Enviar informações sobre o curso (local, horário, materiais);</li>
              <li>Emitir certificados de participação;</li>
              <li>Entrar em contato para suporte e atendimento ao participante;</li>
              <li>Enviar comunicações sobre novos cursos, conteúdos e promoções (mediante consentimento);</li>
              <li>Cumprir obrigações legais e regulatórias;</li>
              <li>Melhorar a experiência de navegação na plataforma;</li>
              <li>Prevenir fraudes e garantir a segurança da plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">4. Base Legal</h2>
            <p>O tratamento de seus dados é fundamentado nas seguintes bases legais (art. 7º da LGPD):</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Execução de contrato:</strong> para processar sua inscrição e fornecer o curso contratado;</li>
              <li><strong>Consentimento:</strong> para envio de comunicações de marketing e novidades;</li>
              <li><strong>Legítimo interesse:</strong> para melhoria dos serviços e segurança da plataforma;</li>
              <li><strong>Cumprimento de obrigação legal:</strong> para emissão de notas fiscais e obrigações fiscais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">5. Compartilhamento de Dados</h2>
            <p>
              Não vendemos seus dados pessoais. Podemos compartilhá-los apenas com:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Processadores de pagamento</strong> (ex.: operadoras de cartão, plataformas de cobrança)
                — exclusivamente para viabilizar o pagamento da inscrição;
              </li>
              <li>
                <strong>Plataformas de comunicação</strong> (ex.: e-mail, WhatsApp Business) — para envio de
                confirmações e informações sobre o curso;
              </li>
              <li>
                <strong>Serviços de análise</strong> (ex.: Google Analytics) — para fins estatísticos e de
                melhoria da plataforma, com dados anonimizados quando possível;
              </li>
              <li>
                <strong>Autoridades públicas</strong> — quando exigido por lei, ordem judicial ou regulação aplicável.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">6. Retenção de Dados</h2>
            <p>Seus dados são mantidos pelos seguintes períodos:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dados de inscrição e participação:</strong> 5 anos após o término do curso (para fins de certificação e obrigações legais);</li>
              <li><strong>Dados fiscais:</strong> 5 anos (conforme legislação tributária);</li>
              <li><strong>Dados de marketing:</strong> até a solicitação de cancelamento do consentimento;</li>
              <li><strong>Logs de acesso:</strong> 6 meses (conforme Marco Civil da Internet — Lei nº 12.965/2014).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">7. Seus Direitos</h2>
            <p>
              Nos termos da LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Acesso:</strong> confirmar se tratamos seus dados e obter uma cópia deles;</li>
              <li><strong>Correção:</strong> solicitar a correção de dados incompletos ou desatualizados;</li>
              <li><strong>Eliminação:</strong> solicitar a exclusão dos dados tratados com base em consentimento;</li>
              <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado e legível;</li>
              <li><strong>Revogação do consentimento:</strong> retirar o consentimento para fins de marketing a qualquer momento;</li>
              <li><strong>Oposição:</strong> opor-se ao tratamento em determinadas situações;</li>
              <li><strong>Informação:</strong> ser informado sobre com quem compartilhamos seus dados.</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer desses direitos, entre em contato pelo e-mail{' '}
              <strong>contato@rubiaadecarli.com.br</strong> ou pelo WhatsApp <strong>(54) 99235-0352</strong>.
              Responderemos em até <strong>15 dias úteis</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">8. Cookies</h2>
            <p>
              Utilizamos cookies para melhorar sua experiência de navegação. Os cookies podem ser desativados
              nas configurações do seu navegador, porém isso pode afetar algumas funcionalidades do site.
              Ao continuar navegando, você concorda com o uso de cookies essenciais ao funcionamento da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">9. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra
              acesso não autorizado, alteração, divulgação ou destruição. Isso inclui uso de conexões seguras
              (HTTPS), controle de acesso restrito e parceiros que seguem padrões de segurança reconhecidos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">10. Transferência Internacional</h2>
            <p>
              Alguns de nossos fornecedores de serviços (como plataformas de e-mail e análise) podem estar
              localizados fora do Brasil. Nestes casos, asseguramos que tais transferências ocorram com garantias
              adequadas de proteção, em conformidade com a LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">11. Alterações nesta Política</h2>
            <p>
              Esta Política pode ser atualizada periodicamente. A versão mais recente estará sempre disponível
              nesta página, com a data de última atualização indicada no início do documento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">12. Contato e Encarregado (DPO)</h2>
            <p>
              Para questões sobre privacidade e proteção de dados, entre em contato com nossa responsável:
            </p>
            <ul className="list-none space-y-1 mt-2">
              <li><strong>Responsável:</strong> Dra. Rúbia De Carli</li>
              <li><strong>E-mail:</strong> contato@rubiaadecarli.com.br</li>
              <li><strong>WhatsApp:</strong> (54) 99235-0352</li>
              <li><strong>Endereço:</strong> R. Alfredo Chaves, 1208, W Tower sala 306 — Caxias do Sul/RS</li>
            </ul>
            <p className="mt-3">
              Você também pode registrar reclamações perante a{' '}
              <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> —{' '}
              <strong>www.gov.br/anpd</strong>.
            </p>
          </section>

        </div>
      </main>

      <PremiumFooter />
    </div>
  );
}
