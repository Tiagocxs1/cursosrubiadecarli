import Link from 'next/link';
import PremiumFooter from '@/components/premium-footer';
import SiteNavbar from '@/components/site-navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de Uso dos cursos presenciais da Dra. Rúbia De Carli — Tricologia e Biomedicina Estética.',
  alternates: { canonical: 'https://cursos.rubiadecarli.com.br/termos-de-uso' },
  robots: { index: false, follow: false },
};

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <SiteNavbar />

      {/* CONTENT */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full">

        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Termos de Uso</h1>
          <p className="text-sm text-gray-500">Última atualização: março de 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">1. Identificação</h2>
            <p>
              Os presentes Termos de Uso regulam a relação entre <strong>Dra. Rúbia De Carli</strong> (CRBM 2144),
              responsável técnica pelos cursos presenciais, com endereço na R. Alfredo Chaves, 1208, W Tower sala 306,
              Caxias do Sul/RS, e-mail <strong>contato@rubiaadecarli.com.br</strong>, e os participantes que se inscrevem
              nos cursos presenciais de Tricologia e Biomedicina Estética oferecidos por esta plataforma.
            </p>
            <p>
              Ao realizar a inscrição em qualquer curso, o participante declara ter lido, compreendido e concordado
              integralmente com estes Termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">2. Objeto</h2>
            <p>
              A plataforma <strong>cursos.rubiadecarli.com.br</strong> tem como objeto a divulgação e gestão de inscrições
              em cursos presenciais de formação continuada nas áreas de Tricologia e Biomedicina Estética,
              voltados exclusivamente a profissionais da saúde habilitados (biomédicos, médicos, fisioterapeutas,
              enfermeiros, cirurgiões-dentistas e demais profissionais com habilitação legal para procedimentos estéticos).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">3. Requisitos de Participação</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ser profissional de saúde com registro ativo no respectivo conselho de classe;</li>
              <li>Ter capacidade civil plena (ser maior de 18 anos);</li>
              <li>Fornecer informações verdadeiras e completas no momento da inscrição;</li>
              <li>Apresentar comprovante de habilitação profissional quando solicitado;</li>
              <li>Realizar o pagamento conforme condições acordadas antes do início do curso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">4. Inscrição e Confirmação de Vaga</h2>
            <p>
              A inscrição é realizada mediante contato via WhatsApp ou formulário disponível no site, seguida da
              confirmação do pagamento. A vaga somente é garantida após a confirmação do pagamento integral ou
              do sinal acordado. Vagas são limitadas e a ordem de inscrição e pagamento define a prioridade.
            </p>
            <p>
              O participante receberá confirmação da inscrição por e-mail ou WhatsApp, contendo local, data,
              horário e demais instruções do curso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo dos cursos — incluindo materiais didáticos, apostilas, apresentações, técnicas
              demonstradas e demais conteúdos — é de propriedade exclusiva da Dra. Rúbia De Carli e é protegido
              pela legislação de direitos autorais (Lei nº 9.610/1998).
            </p>
            <p>
              É vedado ao participante reproduzir, gravar, distribuir, comercializar ou compartilhar qualquer
              conteúdo dos cursos sem autorização prévia e expressa por escrito. A gravação de aulas somente
              é permitida mediante autorização explícita da instrutora e para uso pessoal e exclusivo do participante.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">6. Conduta no Curso</h2>
            <p>O participante compromete-se a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Manter postura profissional e ética durante todo o curso;</li>
              <li>Chegar no horário estabelecido;</li>
              <li>Utilizar os equipamentos e insumos do curso com responsabilidade;</li>
              <li>Respeitar colegas, instrutores e pacientes modelos;</li>
              <li>Seguir todas as normas de biossegurança determinadas pela instrutora;</li>
              <li>Assinar os termos de consentimento exigidos para práticas com pacientes.</li>
            </ul>
            <p>
              O descumprimento dessas normas poderá implicar no desligamento do participante do curso, sem
              direito a reembolso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">7. Certificação</h2>
            <p>
              O certificado de participação será emitido ao participante que completar a carga horária mínima
              de <strong>75% de presença</strong> e cumprir os requisitos práticos do curso. A emissão do
              certificado ocorre em até 15 dias úteis após a conclusão do curso, no formato digital.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">8. Cancelamento e Reembolso</h2>
            <p>
              As condições de cancelamento e reembolso estão descritas na{' '}
              <Link href="/politica-de-reembolso" className="text-[#D4AF37] hover:underline">
                Política de Reembolso
              </Link>, que integra estes Termos de Uso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">9. Responsabilidade</h2>
            <p>
              A Dra. Rúbia De Carli não se responsabiliza por danos decorrentes do uso inadequado das técnicas
              ensinadas fora do contexto supervisionado do curso, nem pela aplicação das técnicas em desacordo
              com a legislação profissional vigente. O participante é inteiramente responsável pela prática
              profissional que exerce após a formação.
            </p>
            <p>
              A plataforma não se responsabiliza por problemas técnicos de conectividade ou disponibilidade
              do site que impeçam temporariamente o acesso às informações.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">10. Alterações nos Termos</h2>
            <p>
              Estes Termos podem ser alterados a qualquer momento, com publicação da versão atualizada nesta página.
              O uso contínuo da plataforma ou a manutenção da inscrição em cursos após as alterações implica
              na aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">11. Foro e Legislação</h2>
            <p>
              Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de{' '}
              <strong>Caxias do Sul/RS</strong> para dirimir quaisquer controvérsias oriundas destes Termos,
              com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">12. Contato</h2>
            <p>
              Para dúvidas sobre estes Termos, entre em contato:
            </p>
            <ul className="list-none space-y-1 mt-2">
              <li><strong>E-mail:</strong> contato@rubiaadecarli.com.br</li>
              <li><strong>WhatsApp:</strong> (54) 99235-0352</li>
              <li><strong>Endereço:</strong> R. Alfredo Chaves, 1208, W Tower sala 306 — Caxias do Sul/RS</li>
            </ul>
          </section>

        </div>
      </main>

      <PremiumFooter />
    </div>
  );
}
