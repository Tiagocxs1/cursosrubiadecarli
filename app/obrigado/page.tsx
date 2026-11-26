'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, openWhatsApp } from '@/lib/tracking';

const content = {
  ebook: {
    badge: "Solicitação Recebida",
    title: "Recebemos seu pedido do e-book",
    description: "Seus dados foram registrados. A equipe entrará em contato para orientar o acesso ao material.",
    highlight: "Caso prefira, você também pode falar diretamente com a equipe pelo WhatsApp.",
    cta: {
      primary: { label: "Falar com a Equipe", waKey: "obrigado_ebook" as const, external: true },
      secondary: { label: "Ver os Cursos", href: "/#cursos" },
    },
  },
  contato: {
    badge: "Mensagem Recebida!",
    title: "Nossa equipe vai entrar em contato",
    description: "Em breve você receberá um retorno via WhatsApp.",
    highlight: "Enquanto espera, explore nossos cursos presenciais e veja qual é a melhor opção para a sua carreira.",
    cta: {
      primary: { label: "Ver os Cursos", href: "/#cursos" },
      secondary: { label: "Voltar ao Início", href: "/" },
    },
  },
};

function ObrigadoContent() {
  const params = useSearchParams();
  const tipo = params.get('tipo') === 'contato' ? 'contato' : 'ebook';
  const c = content[tipo];

  return (
    <div className="min-h-screen bg-[#FAF9F8] flex flex-col items-center justify-center px-6 py-16 text-[#1A1A1A]">

      {/* Logo */}
      <Link href="/" className="mb-12 block">
        <Image
          src="https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/logo-dra-rubia-de-carli.png"
          alt="Dra. Rúbia De Carli"
          width={160}
          height={60}
          className="object-contain"
        />
      </Link>

      {/* Card */}
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-[#D4AF37]/20 p-10 text-center">

        {/* Ícone */}
        <div className="w-20 h-20 bg-[#D4AF37]/15 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#D4AF37]" />
        </div>

        {/* Badge */}
        <span className="inline-block text-xs font-bold text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-4 py-1.5 rounded-full mb-4">
          {c.badge}
        </span>

        {/* Título */}
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-3">{c.title}</h1>
        <p className="text-[#4A3F35] leading-relaxed mb-6">{c.description}</p>

        {/* Separador */}
        <div className="border-t border-[#D4AF37]/20 my-6" />

        {/* Próximo passo */}
        <p className="text-sm text-[#4A3F35] leading-relaxed mb-8">{c.highlight}</p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {'waKey' in c.cta.primary ? (
            <a
              href={buildWhatsAppUrl(c.cta.primary.waKey)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openWhatsApp((c.cta.primary as { waKey: 'obrigado_ebook' }).waKey)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B8952E] text-white rounded-xl font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {c.cta.primary.label}
            </a>
          ) : (
            <Link
              href={(c.cta.primary as { href: string }).href}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B8952E] text-white rounded-xl font-semibold transition-colors"
            >
              {c.cta.primary.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            href={c.cta.secondary.href}
            className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-semibold hover:bg-[#D4AF37] hover:text-white transition-colors"
          >
            {c.cta.secondary.label}
          </Link>
        </div>
      </div>

      {/* Rodapé simples */}
      <p className="mt-10 text-xs text-gray-400">
        © {new Date().getFullYear()} Dra. Rúbia De Carli · Todos os direitos reservados
      </p>
    </div>
  );
}

export default function ObrigadoPage() {
  return (
    <Suspense>
      <ObrigadoContent />
    </Suspense>
  );
}
