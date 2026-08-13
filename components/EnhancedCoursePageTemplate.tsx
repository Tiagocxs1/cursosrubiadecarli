"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { captureUTMs, getTrackingData } from '@/lib/tracking';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Shield, CheckCircle, Play, X, Quote, Award, ThumbsUp, Clock } from 'lucide-react';
import PremiumFooter from './premium-footer';

// --- ENGENHARIA SENSORIAL (ÁUDIO) ---
const playChime = () => {
  try {
    const AudioContext: typeof window.AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch {
    // áudio bloqueado pelo navegador
  }
};

// --- FUNDO PREMIUM 2D ---
function PremiumBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[20%] w-[15rem] sm:w-[30rem] h-[15rem] sm:h-[30rem] bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-[128px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
          x: [0, -60, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[10%] w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-[#B8952E] rounded-full mix-blend-multiply filter blur-[128px]"
      />
    </div>
  );
}

// --- ANIMAÇÃO DE SCROLL (FADE IN) ---
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.35, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- CARDS COM EFEITO 3D ---
const Card3D = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    className={`bg-white p-8 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#D4AF37]/10 ${className}`}
  >
    {children}
  </motion.div>
);

export type MenuLink = { href: string; label: string; external?: boolean };

export type ModuleItem = {
  title: string;
  duration: string;
  highlights: string[];
  img?: string
};

export type InvestmentBlock = {
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  installments?: string;
  installmentPrice?: string;
  priceLabel?: string;
  bulletPoints: string[];
  ctaText: string;
  ctaUrl: string;
};

export type BonusBlock = {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  extraText?: string;
};

export type OpportunityBlock = {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
};

export type StatBlock = { number: string; label: string };

export type AboutInstructor = {
  name: string;
  image: string;
  title?: string;
  descriptionLines: string[];
};

export type CourseSection = {
  sectionTitle: string;
  sectionSubtitle: string;
  description: string;
  learnings: string[];
  modules?: ModuleItem[];
  infoCards?: { title: string; value: string }[];
};

export type HeroData = {
  titlePrefix: string;
  titleHighlight?: string;
  titleSuffix?: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  secondaryText: string;
  secondaryAnchor: string;
  courseAvatar?: string;
};

export type VideoSection = {
  title: string;
  label?: string;
  url: string;
  platform: 'youtube' | 'vimeo';
};

export type Testimonial = {
  name: string;
  text: string;
  rating: number;
  platform: string;
  role: string;
  photo: string;
};

export type EnhancedCoursePageTemplateProps = {
  courseName: string;
  menuLinks?: MenuLink[];
  hero: HeroData;
  instructor: AboutInstructor;
  video?: VideoSection;
  course: CourseSection;
  testimonials: Testimonial[];
  bonus?: BonusBlock;
  stats?: StatBlock[];
  investment?: InvestmentBlock;
  opportunity?: OpportunityBlock;
  phoneLink: string;
};

export default function EnhancedCoursePageTemplate({
  courseName,
  menuLinks,
  hero,
  instructor,
  video,
  course,
  testimonials,
  stats,
  investment,
  phoneLink,
}: EnhancedCoursePageTemplateProps) {
  const { scrollYProgress } = useScroll();
  const opacity3D = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.3, 0.3, 1]);
  const scale3D = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 1.2]);

  const [isVideoModalOpen, setVideoModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { captureUTMs(); }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playChime();
    setFormStatus('submitting');
    const data = new FormData(e.currentTarget);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.get('nome'),
          whatsapp: data.get('telefone'),
          email: data.get('email'),
          curso: courseName,
          origem: 'site - formulário curso',
          fonte: 'contato_curso',
          ...getTrackingData(),
        }),
      });
    } catch { /* fail silently */ }
    setFormStatus('success');
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    playChime();
  };

  const extendedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="relative min-h-screen bg-[#FAF9F8] text-[#1A1A1A] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-white">

      {/* BACKGROUND ANIMADO */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: opacity3D, scale: scale3D }}
      >
        <PremiumBackground />
      </motion.div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/90 border-b border-white/20 shadow-sm text-[#1A1A1A]">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="text-sm sm:text-xl font-bold tracking-widest uppercase text-[#1A1A1A] pointer-events-auto shrink-0">
            Dra. Rúbia De Carli
          </Link>
          {menuLinks && menuLinks.length > 0 && (
            <div className="hidden md:flex gap-6 pointer-events-auto">
              {menuLinks.filter(l => !l.external).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-widest uppercase border-b border-[#1A1A1A]/30 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => scrollTo('investimento')}
              className="text-xs sm:text-sm tracking-widest uppercase px-3 sm:px-4 py-2 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300 whitespace-nowrap"
            >
              Garantir Vaga
            </button>
            {menuLinks && menuLinks.length > 0 && (
              <button
                className="md:hidden p-1 text-[#1A1A1A]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen
                  ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                }
              </button>
            )}
          </div>
        </div>
        {mobileMenuOpen && menuLinks && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 px-4 pb-4">
            {menuLinks.filter(l => !l.external).map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-sm tracking-widest uppercase text-[#1A1A1A] border-b border-gray-100 hover:text-[#D4AF37] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <main className="relative z-10">

        {/* FRAME 1: HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-12 text-center">
          <FadeIn>
            <p className="text-[#D4AF37] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm md:text-base mb-4 sm:mb-6 font-semibold">
              Masterclass Exclusiva
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#1A1A1A] mb-4 sm:mb-6 drop-shadow-sm">
              {hero.titlePrefix}{" "}
              {hero.titleHighlight ? (
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8952E]">
                  {hero.titleHighlight}
                </span>
              ) : null}
              {hero.titleSuffix ? " " + hero.titleSuffix : ""}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-base sm:text-xl md:text-2xl text-[#4A3F35] max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-12">
              {hero.subtitle}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.open(hero.ctaUrl, "_blank")}
                onMouseEnter={playChime}
                className="group relative px-8 py-4 bg-[#1A1A1A] text-white overflow-hidden rounded-full transition-all hover:scale-105 shadow-2xl shadow-[#D4AF37]/20 pointer-events-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 flex items-center gap-3 text-sm tracking-widest uppercase">
                  {hero.ctaText} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <a
                href={hero.secondaryAnchor}
                className="border border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-full text-lg font-light hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
              >
                {hero.secondaryText}
              </a>
            </div>
          </FadeIn>
        </section>

        {/* FRAME 2: O QUE VOCÊ IRÁ APRENDER */}
        <section className="min-h-screen flex items-center bg-[#1A1A1A] text-[#FAF9F8] py-16 sm:py-32 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div>
              <FadeIn>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-light mb-6 sm:mb-8">
                  O que você <span className="italic text-[#D4AF37]">irá aprender</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="space-y-6 text-lg text-gray-300 font-light leading-relaxed">
                  <p>{course.sectionSubtitle}</p>
                  <p className="font-medium text-white">{course.description}</p>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} className="relative group cursor-pointer pointer-events-auto">
              <div onClick={() => { setVideoModalOpen(true); playChime(); }} className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#2A2A2A]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1614859324967-bdf471b421ff?auto=format&fit=crop&q=80&w=800"
                  alt="Aplicação"
                  className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-[#D4AF37] transition-all duration-500">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 z-20">
                  <p className="text-[#D4AF37] tracking-widest text-sm uppercase mb-2">{video?.label ?? 'Assistir Teaser'}</p>
                  <p className="text-2xl font-light">{video?.title ?? courseName}</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FRAME 3.2: MÓDULOS COM IMAGENS */}
        <section className="py-16 sm:py-32 px-4 sm:px-6 bg-white relative z-10 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="text-center mb-10 sm:mb-20">
              <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">O Programa</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mt-4">O que você vai dominar</h2>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {course.modules?.map((mod, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <Card3D className="group relative rounded-3xl overflow-hidden bg-[#FAF9F8] border border-[#D4AF37]/10 shadow-lg p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        fill
                        src={mod.img || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"}
                        alt={mod.title}
                        className={`${mod.img?.endsWith('.svg') ? 'object-contain' : 'object-cover group-hover:scale-105 transition-transform duration-700'}`}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-8">
                      <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Módulo {i + 1}</span>
                      <h3 className="text-2xl font-bold mt-2 mb-4 text-[#1A1A1A]">{mod.title}</h3>
                      <p className="text-[#4A3F35] leading-relaxed text-sm">{mod.duration}</p>
                      <div className="mt-4 space-y-2">
                        {mod.highlights.map((highlight, hIndex) => (
                          <div key={hIndex} className="flex items-center gap-2 text-[#4A3F35]">
                            <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card3D>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* FRAME 3.5: A MENTORA + ESTATÍSTICAS */}
        <section className="min-h-screen py-16 sm:py-32 px-4 sm:px-6 bg-[#1A1A1A] text-[#FAF9F8] relative z-10 flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
              <FadeIn className="order-2 md:order-1 relative group pointer-events-auto">
                <div className="relative rounded-t-full rounded-b-[2rem] overflow-hidden aspect-[3/4] border border-[#D4AF37]/20 bg-[#2A2A2A]">
                  <div className="absolute inset-0 bg-[#D4AF37]/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-1000" />
                  <Image
                    fill
                    src={instructor.image}
                    alt={instructor.name}
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </FadeIn>

              <div className="order-1 md:order-2">
                <FadeIn>
                  <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">A Sua Mentora</span>
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-light mt-4 mb-6 sm:mb-8">{instructor.name}</h2>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div className="space-y-6 text-lg text-gray-300 font-light leading-relaxed">
                    <p>{instructor.title}</p>
                    {instructor.descriptionLines.map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <div className="grid grid-cols-2 gap-6 mt-12 pt-12 border-t border-white/10">
                    {stats?.map((stat, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-4xl font-bold text-[#D4AF37] mb-1">{stat.number}</span>
                        <span className="text-sm font-light text-gray-400 uppercase tracking-widest">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* FRAME 4: A OFERTA E GARANTIAS */}
        <section id="investimento" className="min-h-screen py-16 sm:py-32 px-4 sm:px-6 bg-gradient-to-b from-[#FAF9F8] to-[#e8e6e1] flex items-center">
          <div className="max-w-5xl mx-auto w-full">
            <FadeIn className="text-center mb-10 sm:mb-16">
              <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">Decisão</span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-light mt-4 mb-4 sm:mb-6">Sua Ascensão Profissional</h2>
              <p className="text-base sm:text-xl text-[#4A3F35]">O mercado recompensa de forma desproporcional quem domina a técnica.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-16 shadow-2xl shadow-[#D4AF37]/10 border border-[#D4AF37]/20 relative overflow-hidden pointer-events-auto">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-bl-full -z-0" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 sm:gap-12">
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2">{courseName}</h3>
                    <p className="text-[#D4AF37] font-medium mb-5 sm:mb-8">Turma Exclusiva • Vagas Limitadas</p>

                    <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                      {course.learnings.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-[#4A3F35] text-sm sm:text-base">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 sm:pt-8 md:pt-0 md:pl-12">
                    <div className="text-[#1A1A1A] flex items-baseline gap-2 mb-1">
                      <span className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter">{investment?.price}</span>
                    </div>
                    <p className="text-[#4A3F35] mb-3 text-sm font-medium">{investment?.priceLabel ?? 'à vista'}</p>
                    {investment?.installments && investment?.installmentPrice && (
                      <p className="text-[#4A3F35]/70 mb-8 text-sm">
                        Ou {investment.originalPrice ?? ''} no prazo em até {investment.installments}x de {investment.installmentPrice}
                      </p>
                    )}

                    <button
                      onClick={() => { playChime(); window.open(investment?.ctaUrl || phoneLink, "_blank"); }}
                      className="w-full py-5 bg-[#D4AF37] hover:bg-[#B8952E] text-white rounded-2xl font-semibold tracking-wide transition-all shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:-translate-y-1 flex justify-center items-center gap-2"
                    >
                      Garantir Minha Vaga <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" /> Pagamento 100% Seguro
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                {[
                  { title: "Certificação Garantida", desc: "Após a finalização do curso, receba um certificado oficial que chancelará a sua autoridade no mercado.", icon: <Award className="w-6 h-6 text-[#D4AF37]" /> },
                  { title: "Altamente Recomendável", desc: "O método validado pela Dra. Rúbia De Carli, uma das maiores referências no mercado estético nacional.", icon: <ThumbsUp className="w-6 h-6 text-[#D4AF37]" /> },
                  { title: "Cancelamento Grátis", desc: "Se você não gostar do conteúdo, ou sentir que não é para si, cancele gratuitamente em até 7 dias.", icon: <Clock className="w-6 h-6 text-[#D4AF37]" /> }
                ].map((info, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">{info.icon}</div>
                    <h4 className="font-bold text-[#1A1A1A] mb-2">{info.title}</h4>
                    <p className="text-sm text-[#4A3F35] font-light leading-relaxed">{info.desc}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FRAME 5: PROVA SOCIAL DESLIZANTE (Marquee) */}
        <section className="py-16 sm:py-32 bg-[#1A1A1A] text-[#FAF9F8] relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-20">
            <FadeIn className="text-center">
              <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">O Padrão Ouro</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mt-4">Quem já vive a transformação</h2>
            </FadeIn>
          </div>

          <div className="w-full flex overflow-hidden group">
            <motion.div
              className="flex gap-8 px-4 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            >
              {extendedTestimonials.map((testimonial, i) => (
                <div key={i} className="w-[280px] sm:w-[350px] md:w-[450px] shrink-0 bg-[#2A2A2A] p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/5 relative hover:border-[#D4AF37]/30 transition-colors duration-500">
                  <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-gray-300 font-light italic leading-relaxed mb-8 line-clamp-4">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37]/20 shrink-0">
                      <Image fill src={testimonial.photo} alt={testimonial.name} className="object-cover" sizes="56px" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{testimonial.name}</p>
                      <p className="text-sm text-[#D4AF37]">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FRAME 6: CAPTURA DE LEADS */}
        <section id="contato" className="py-16 sm:py-32 px-4 sm:px-6 bg-white relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-16">
            <FadeIn className="flex-1">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-light mb-4 sm:mb-6">Ainda tem dúvidas?</h2>
              <p className="text-lg text-[#4A3F35] font-light leading-relaxed mb-8">
                Fale diretamente com nossa equipe. Deixe seus dados e entraremos em contato para entender se o {courseName} é o próximo passo ideal para sua carreira.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                Atendimento humano e personalizado.
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="flex-1 w-full">
              <div className="bg-[#FAF9F8] p-8 rounded-3xl border border-[#D4AF37]/20 shadow-xl shadow-black/5">
                {formStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Solicitação Enviada!</h3>
                    <p className="text-[#4A3F35]">Nossa equipe entrará em contato em breve via WhatsApp.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div><input required name="nome" type="text" placeholder="Seu Nome Completo" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" /></div>
                    <div><input required name="email" type="email" placeholder="Seu melhor E-mail" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" /></div>
                    <div><input required name="telefone" type="tel" placeholder="WhatsApp (com DDD)" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" /></div>
                    <button type="submit" disabled={formStatus === 'submitting'} className="w-full py-4 mt-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-xl font-semibold tracking-wide transition-all flex justify-center items-center disabled:opacity-70">
                      {formStatus === 'submitting' ? 'Enviando...' : 'Falar com a Equipe'}
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </section>

      </main>

      <PremiumFooter />

      {/* MODAL DE VÍDEO */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm pointer-events-auto"
          >
            <div className="relative w-full max-w-5xl aspect-video bg-[#111] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center">
              <button onClick={() => setVideoModalOpen(false)} className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/50 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center text-white/50">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl tracking-widest uppercase">Teaser do Curso</p>
                <p className="text-sm mt-2">Em breve disponível.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
