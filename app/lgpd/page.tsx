import Link from 'next/link';
import PremiumFooter from '@/components/premium-footer';
import SiteNavbar from '@/components/site-navbar';
import { Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LGPD — Proteção de Dados',
  description: 'Informações sobre o tratamento de dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).',
  robots: { index: false, follow: false },
};

export default function LgpdPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <SiteNavbar />

      {/* CONTENT */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full">

        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-7 h-7 text-[#D4AF37]" />
            <h1 className="text-3xl font-bold text-[#1A1A1A]">LGPD</h1>
          </div>
          <p className="text-base text-gray-600">Lei Geral de Proteção de Dados — Lei nº 13.709/2018</p>
          <p className="text-sm text-gray-500 mt-1">Última atualização: março de 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <p className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-4 text-blue-900 text-sm">
              A <strong>Lei Geral de Proteção de Dados (LGPD)</strong> é a legislação brasileira que regula
              o tratamento de dados pessoais por pessoas físicas e jurídicas, com o objetivo de proteger os
              direitos fundamentais de liberdade, privacidade e o livre desenvolvimento da personalidade.
              Esta página resume como cumprimos a LGPD em nossas operações.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">1. Quem Somos (Controladora)</h2>
            <div className="bg-gray-50 rounded-lg p-5 space-y-2 text-sm">
              <p><strong>Nome:</strong> Dra. Rúbia De Carli</p>
              <p><strong>Registro:</strong> CRBM 2144</p>
              <p><strong>Atividade:</strong> Cursos presenciais de Tricologia e Biomedicina Estética</p>
              <p><strong>Endereço:</strong> R. Alfredo Chaves, 1208, W Tower sala 306 — Caxias do Sul/RS</p>
              <p><strong>E-mail:</strong> contato@rubiaadecarli.com.br</p>
              <p><strong>Telefone:</strong> (54) 99235-0352</p>
            </div>
            <p className="mt-4">
              Atuamos como <strong>controladora</strong> dos dados pessoais que coletamos através do site{' '}
              <strong>cursos.rubiadecarli.com.br</strong> e dos formulários de inscrição nos cursos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">2. Princípios que Seguimos</h2>
            <p>Em conformidade com o art. 6º da LGPD, tratamos dados pessoais observando os seguintes princípios:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Finalidade:</strong> coletamos dados apenas para fins legítimos, específicos e informados ao titular;</li>
              <li><strong>Adequação:</strong> o tratamento é compatível com as finalidades informadas;</li>
              <li><strong>Necessidade:</strong> coletamos somente os dados estritamente necessários;</li>
              <li><strong>Livre acesso:</strong> garantimos consulta fácil e gratuita sobre o tratamento dos dados;</li>
              <li><strong>Qualidade:</strong> mantemos os dados exatos, claros e atualizados;</li>
              <li><strong>Transparência:</strong> fornecemos informações claras sobre o tratamento;</li>
              <li><strong>Segurança:</strong> adotamos medidas técnicas para proteger os dados;</li>
              <li><strong>Prevenção:</strong> tomamos medidas para evitar danos decorrentes do tratamento;</li>
              <li><strong>Não discriminação:</strong> não realizamos tratamento discriminatório ou abusivo;</li>
              <li><strong>Responsabilização:</strong> demonstramos a adoção de medidas eficazes de conformidade.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">3. Dados Pessoais que Tratamos</h2>
            <p>Tratamos as seguintes categorias de dados pessoais:</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-[#1A1A1A] text-sm mb-2">Dados de Identificação</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Nome completo</li>
                  <li>• E-mail</li>
                  <li>• Telefone / WhatsApp</li>
                  <li>• Cidade e estado</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-[#1A1A1A] text-sm mb-2">Dados Profissionais</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Profissão</li>
                  <li>• Número do conselho de classe</li>
                  <li>• Especialidade</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-[#1A1A1A] text-sm mb-2">Dados de Navegação</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Endereço IP</li>
                  <li>• Dados de cookies</li>
                  <li>• Páginas visitadas</li>
                  <li>• Origem do acesso</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-[#1A1A1A] text-sm mb-2">Dados Financeiros</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Comprovantes de pagamento</li>
                  <li>• Dados fiscais (NF)</li>
                  <li className="text-xs text-gray-500 italic">* Dados de cartão são processados por terceiros</li>
                </ul>
              </div>
            </div>

            <p className="mt-4 text-sm">
              <strong>Não tratamos dados sensíveis</strong> (saúde, biometria, origem racial, convicções
              religiosas, etc.) sem base legal específica e consentimento expresso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">4. Bases Legais para o Tratamento</h2>
            <p>
              Todo tratamento de dados possui uma base legal conforme o art. 7º da LGPD:
            </p>
            <div className="mt-4 space-y-3">
              {[
                {
                  base: 'Execução de contrato (art. 7º, V)',
                  desc: 'Para processar sua inscrição, confirmar vaga e fornecer o curso contratado.',
                },
                {
                  base: 'Consentimento (art. 7º, I)',
                  desc: 'Para envio de comunicações de marketing, novidades e promoções de cursos.',
                },
                {
                  base: 'Legítimo interesse (art. 7º, IX)',
                  desc: 'Para melhoria da plataforma, prevenção de fraudes e segurança do sistema.',
                },
                {
                  base: 'Cumprimento de obrigação legal (art. 7º, II)',
                  desc: 'Para emissão de notas fiscais, retenção de registros exigidos por lei e obrigações tributárias.',
                },
              ].map((item) => (
                <div key={item.base} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-[#1A1A1A]">{item.base}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">5. Seus Direitos como Titular</h2>
            <p>
              A LGPD garante a você, titular dos dados, os seguintes direitos (art. 18):
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { titulo: 'Confirmação e acesso', desc: 'Saber se tratamos seus dados e obter uma cópia.' },
                { titulo: 'Correção', desc: 'Corrigir dados incompletos, inexatos ou desatualizados.' },
                { titulo: 'Anonimização ou eliminação', desc: 'Solicitar a exclusão de dados tratados com base em consentimento.' },
                { titulo: 'Portabilidade', desc: 'Receber seus dados em formato estruturado e interoperável.' },
                { titulo: 'Eliminação com consentimento', desc: 'Ter seus dados eliminados após revogação do consentimento.' },
                { titulo: 'Informação sobre compartilhamento', desc: 'Saber com quais entidades públicas ou privadas compartilhamos seus dados.' },
                { titulo: 'Revogação do consentimento', desc: 'Retirar o consentimento para marketing a qualquer momento.' },
                { titulo: 'Oposição', desc: 'Opor-se ao tratamento realizado com base em legítimo interesse.' },
                { titulo: 'Revisão de decisões automatizadas', desc: 'Solicitar revisão de decisões tomadas automaticamente que afetem seus interesses.' },
                { titulo: 'Reclamação à ANPD', desc: 'Registrar reclamação perante a Autoridade Nacional de Proteção de Dados.' },
              ].map((d) => (
                <div key={d.titulo} className="border border-gray-200 rounded-lg p-3">
                  <p className="font-semibold text-sm text-[#1A1A1A]">{d.titulo}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{d.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg px-5 py-4">
              <p className="text-sm font-semibold text-[#1A1A1A] mb-1">Como exercer seus direitos:</p>
              <p className="text-sm text-gray-700">
                Envie sua solicitação para <strong>contato@rubiaadecarli.com.br</strong> ou
                via WhatsApp <strong>(54) 99235-0352</strong> com:
                nome completo, descrição do direito que deseja exercer e, se necessário, documento de identificação.
                Responderemos em até <strong>15 dias úteis</strong>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">6. Retenção e Eliminação</h2>
            <div className="overflow-x-auto mt-2">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#1A1A1A] text-white">
                    <th className="text-left px-4 py-3 rounded-tl-lg">Categoria de dado</th>
                    <th className="text-left px-4 py-3 rounded-tr-lg">Período de retenção</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Inscrição e certificação', '5 anos após o curso'],
                    ['Dados fiscais / notas fiscais', '5 anos (obrigação tributária)'],
                    ['Logs de acesso (Marco Civil)', '6 meses'],
                    ['Comunicações de marketing', 'Até revogação do consentimento'],
                    ['Comunicações via e-mail/WhatsApp', '2 anos ou até solicitação de exclusão'],
                  ].map(([cat, periodo], i) => (
                    <tr key={cat} className={`border-b border-gray-200 ${i % 2 !== 0 ? 'bg-gray-50' : ''}`}>
                      <td className="px-4 py-3">{cat}</td>
                      <td className="px-4 py-3 font-medium">{periodo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Após o término do período de retenção, os dados são eliminados de forma segura ou anonimizados,
              salvo quando a retenção for necessária para cumprimento de obrigação legal ou exercício regular de direitos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">7. Segurança dos Dados</h2>
            <p>Adotamos as seguintes medidas para proteger seus dados:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Transmissão de dados via protocolo <strong>HTTPS/TLS</strong>;</li>
              <li>Acesso restrito aos dados por pessoas autorizadas e com necessidade de conhecê-los;</li>
              <li>Uso de fornecedores de hospedagem e serviços com políticas de segurança reconhecidas;</li>
              <li>Monitoramento regular de vulnerabilidades e atualizações de segurança.</li>
            </ul>
            <p className="mt-3">
              Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares,
              comunicaremos a <strong>ANPD</strong> e os titulares afetados nos prazos previstos na LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">8. Cookies e Rastreamento</h2>
            <p>
              Utilizamos cookies essenciais ao funcionamento do site e cookies analíticos para entender como
              os visitantes interagem com a plataforma. O banner de cookies exibido na primeira visita permite
              que você gerencie suas preferências.
            </p>
            <p className="mt-3">
              Ferramentas de análise de terceiros (como Google Analytics) podem coletar dados de navegação de
              forma agregada. Para mais detalhes, consulte nossa{' '}
              <Link href="/politica-de-privacidade" className="text-[#D4AF37] hover:underline">
                Política de Privacidade
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">9. Encarregado (DPO)</h2>
            <p>
              A pessoa responsável pelo tratamento de dados e pelo atendimento às solicitações dos titulares é:
            </p>
            <div className="bg-gray-50 rounded-lg p-5 space-y-1 text-sm mt-3">
              <p><strong>Encarregada:</strong> Dra. Rúbia De Carli</p>
              <p><strong>E-mail:</strong> contato@rubiaadecarli.com.br</p>
              <p><strong>WhatsApp:</strong> (54) 99235-0352</p>
              <p><strong>Horário de atendimento:</strong> Segunda a sexta, 9h às 18h</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">10. Autoridade Nacional de Proteção de Dados</h2>
            <p>
              Se você acredita que seus direitos como titular de dados não foram respeitados, pode registrar
              uma reclamação perante a <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong>:
            </p>
            <ul className="list-none space-y-1 mt-2 text-sm">
              <li><strong>Site:</strong> www.gov.br/anpd</li>
              <li><strong>E-mail:</strong> comunicacao@anpd.gov.br</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">11. Atualizações</h2>
            <p>
              Este documento pode ser atualizado para refletir mudanças em nossas práticas ou na legislação.
              A versão vigente estará sempre disponível nesta página com a data de última atualização.
              Mudanças significativas serão comunicadas por e-mail aos titulares afetados.
            </p>
          </section>

        </div>
      </main>

      <PremiumFooter />
    </div>
  );
}
