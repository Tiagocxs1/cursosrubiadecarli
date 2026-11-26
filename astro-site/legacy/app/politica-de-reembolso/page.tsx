import PremiumFooter from '@/components/premium-footer';
import SiteNavbar from '@/components/site-navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Reembolso',
  description: 'Política de cancelamento e reembolso dos cursos presenciais da Dra. Rúbia De Carli.',
  alternates: { canonical: 'https://cursos.rubiadecarli.com.br/politica-de-reembolso' },
  robots: { index: false, follow: false },
};

export default function PoliticaDeReembolsoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <SiteNavbar />

      {/* CONTENT */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full">

        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Política de Reembolso</h1>
          <p className="text-sm text-gray-500">Última atualização: março de 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <p className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 text-amber-900 text-sm">
              <strong>Importante:</strong> Esta política aplica-se exclusivamente aos cursos presenciais ministrados
              pela Dra. Rúbia De Carli. Por se tratar de formação presencial com vagas limitadas e custos
              operacionais fixos, os prazos e condições abaixo são aplicados de forma rigorosa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">1. Cancelamento pelo Participante</h2>
            <p>
              O participante pode solicitar o cancelamento da inscrição e requerer reembolso, observados os
              seguintes prazos contados a partir da data de realização do curso:
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#1A1A1A] text-white">
                    <th className="text-left px-4 py-3 rounded-tl-lg">Prazo de cancelamento</th>
                    <th className="text-left px-4 py-3 rounded-tr-lg">Reembolso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3">Até 15 dias antes do curso</td>
                    <td className="px-4 py-3 text-green-700 font-medium">100% do valor pago</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="px-4 py-3">Entre 8 e 14 dias antes do curso</td>
                    <td className="px-4 py-3 text-yellow-700 font-medium">50% do valor pago</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3">Entre 3 e 7 dias antes do curso</td>
                    <td className="px-4 py-3 text-orange-700 font-medium">Crédito para próxima turma</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3">Menos de 3 dias antes ou no dia do curso</td>
                    <td className="px-4 py-3 text-red-700 font-medium">Sem reembolso</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              O reembolso, quando aplicável, será processado em até <strong>10 dias úteis</strong> após a
              confirmação do cancelamento, pela mesma forma de pagamento utilizada na inscrição.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">2. Como Solicitar o Cancelamento</h2>
            <p>A solicitação de cancelamento deve ser feita exclusivamente por escrito, através de:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>E-mail:</strong> contato@rubiaadecarli.com.br — com assunto &ldquo;Cancelamento de Inscrição&rdquo;
                e seu nome completo e data do curso;
              </li>
              <li>
                <strong>WhatsApp:</strong> (54) 99235-0352 — com mensagem informando nome completo, curso
                e data solicitada para cancelamento.
              </li>
            </ul>
            <p className="mt-3">
              A data do cancelamento é considerada a data de recebimento da solicitação por escrito,
              não a data do envio. Solicitações recebidas fora do horário comercial (seg a sex, 9h–18h)
              serão processadas no próximo dia útil.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">3. Transferência de Vaga</h2>
            <p>
              O participante pode transferir sua vaga para outra pessoa, desde que:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>A transferência seja solicitada com no mínimo <strong>5 dias úteis</strong> de antecedência;</li>
              <li>O substituto atenda aos requisitos de participação (profissional de saúde habilitado);</li>
              <li>Os dados do substituto sejam informados por escrito para confirmação.</li>
            </ul>
            <p className="mt-3">
              A transferência é gratuita e não gera custos adicionais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">4. Reagendamento pelo Participante</h2>
            <p>
              O participante pode solicitar o reagendamento para outra turma disponível, desde que:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>A solicitação seja feita com no mínimo <strong>10 dias de antecedência</strong>;</li>
              <li>Haja vaga disponível na turma de interesse;</li>
              <li>O reagendamento seja solicitado por escrito (e-mail ou WhatsApp).</li>
            </ul>
            <p className="mt-3">
              <strong>Cada inscrição permite um único reagendamento sem custo.</strong> Reagendamentos
              adicionais poderão estar sujeitos a taxa administrativa de 10% do valor do curso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">5. Cancelamento pela Organizadora</h2>
            <p>
              Em casos excepcionais — como número insuficiente de participantes, doença ou emergência da
              instrutora, força maior ou eventos imprevisíveis — a Dra. Rúbia De Carli reserva-se o direito
              de cancelar ou reagendar o curso, com aviso prévio de no mínimo <strong>48 horas</strong>.
            </p>
            <p className="mt-3">Neste caso, o participante terá direito a:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Reembolso integral</strong> do valor pago; ou</li>
              <li><strong>Crédito total</strong> para participação em próxima turma do mesmo curso, com prioridade de vaga.</li>
            </ul>
            <p className="mt-3">
              A organizadora não se responsabiliza por despesas adicionais do participante decorrentes do
              cancelamento (passagens, hospedagem, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">6. Ausência e Não Comparecimento</h2>
            <p>
              O não comparecimento ao curso sem cancelamento prévio formal implica em perda total do valor
              investido, sem direito a reembolso ou crédito, independentemente do motivo.
            </p>
            <p className="mt-3">
              Em casos de emergência médica devidamente comprovada (atestado médico), a organizadora avaliará
              individualmente a possibilidade de crédito para futura turma, sem garantia de concessão.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">7. Direito de Arrependimento (CDC)</h2>
            <p>
              Nos termos do art. 49 do Código de Defesa do Consumidor, para compras realizadas à distância
              (internet, telefone ou WhatsApp), o consumidor tem o direito de desistir da compra em até{' '}
              <strong>7 dias corridos</strong> a partir da data do pagamento, com reembolso integral, desde
              que o curso ainda não tenha ocorrido.
            </p>
            <p className="mt-3">
              Para exercer este direito, entre em contato pelos canais indicados na seção 2 desta política.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">8. Dúvidas</h2>
            <p>Para esclarecimentos sobre esta política:</p>
            <ul className="list-none space-y-1 mt-2">
              <li><strong>E-mail:</strong> contato@rubiaadecarli.com.br</li>
              <li><strong>WhatsApp:</strong> (54) 99235-0352</li>
              <li><strong>Horário:</strong> Segunda a sexta, 9h às 18h</li>
            </ul>
          </section>

        </div>
      </main>

      <PremiumFooter />
    </div>
  );
}
