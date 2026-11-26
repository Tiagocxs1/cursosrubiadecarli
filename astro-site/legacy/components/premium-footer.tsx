'use client';

import React, { useState } from 'react';
import { getTrackingData, trackFormStart, trackNewsletterSignup } from '@/lib/tracking';
import Link from 'next/link';
import { Instagram, Facebook, MapPin, Phone, Mail, Clock, Shield, BadgeCheck } from 'lucide-react';

interface PremiumFooterProps {
  className?: string;
}

export default function PremiumFooter({ className = "" }: PremiumFooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          nome: email,
          newsletter: true,
          receberDicas: 'sim',
          origem: 'site - newsletter footer',
          fonte: 'newsletter_footer',
          ...getTrackingData(),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error('Falha ao inscrever e-mail');
      setNewsletterError('');
      trackNewsletterSignup();
    } catch {
      setNewsletterError('Não foi possível concluir sua inscrição. Tente novamente.');
      return;
    }
    setSubscribed(true);
    setEmail('');
    setNewsletterConsent(false);
  };

  return (
    <footer className={`bg-[#1A1A1A] border-t border-[#D4AF37]/20 text-white ${className}`}>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* BRAND + CONTATO */}
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Dra. Rúbia De Carli</h3>
            <p className="text-xs text-gray-400 mt-1">Especialista em Tricologia e Biomedicina Estética</p>
          </div>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>Resp. Técnico: Dra. Rúbia De Carli</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>CRBM 2144</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <a href="https://wa.me/5554992350352" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
                (54) 99235-0352
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>contato@rubiadecarli.com.br</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>R. Alfredo Chaves, 1208, W Tower sala 306 — Caxias do Sul/RS</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>Seg a Sex: 9h–18h</span>
            </div>
          </div>
        </div>

        {/* CURSOS */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-widest">Cursos</h4>
          <ul className="space-y-2">
            {[
              { label: "Tricologia Essencial",  href: "/cursos/tricologia-essencial" },
              { label: "Protocolo Full Face",   href: "/cursos/protocolo-full-face" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <h4 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-widest pt-2">Navegação</h4>
          <ul className="space-y-2">
            {[
              { label: "Sobre a Dra. Rúbia",  href: "/#sobre" },
              { label: "Depoimentos",          href: "/#depoimentos" },
              { label: "Contato",              href: "/#contato" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* LEGAL */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-widest">Legal</h4>
          <ul className="space-y-2">
            {[
              { label: "Termos de Uso",           href: "/termos-de-uso" },
              { label: "Política de Privacidade", href: "/politica-de-privacidade" },
              { label: "Política de Reembolso",   href: "/politica-de-reembolso" },
              { label: "LGPD",                    href: "/lgpd" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* NEWSLETTER + REDES */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-widest mb-3">Newsletter</h4>
            {subscribed ? (
              <p className="text-sm text-gray-300">Inscrito! ✓</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} onFocusCapture={() => trackFormStart('newsletter_footer')} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail"
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <label className="flex items-start gap-2 text-xs leading-relaxed text-gray-400">
                  <input
                    type="checkbox"
                    required
                    checked={newsletterConsent}
                    onChange={(event) => setNewsletterConsent(event.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    Aceito receber novidades e informações sobre os cursos por e-mail. Posso cancelar
                    a inscrição quando quiser. Consulte a{' '}
                    <Link href="/politica-de-privacidade" className="underline hover:text-[#D4AF37]">
                      Política de Privacidade
                    </Link>.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={!newsletterConsent}
                  className="w-full rounded-lg bg-[#D4AF37] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#B8952E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Inscrever
                </button>
                {newsletterError && <p className="text-sm text-red-300" role="alert">{newsletterError}</p>}
              </form>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-widest mb-3">Redes Sociais</h4>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/rubiadecarliesteticaavancada/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#D4AF37] hover:text-white transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/drarubiadecarli/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#D4AF37] hover:text-white transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <span>© 2026 Dra. Rúbia De Carli. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <Link href="/termos-de-uso" className="hover:text-[#D4AF37] transition-colors">Termos</Link>
            <Link href="/politica-de-privacidade" className="hover:text-[#D4AF37] transition-colors">Privacidade</Link>
            <Link href="/lgpd" className="hover:text-[#D4AF37] transition-colors">LGPD</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
