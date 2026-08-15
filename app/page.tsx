'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Shield, CheckCircle, Quote, ThumbsUp, Clock, BookOpen, Users, GraduationCap, Award as AwardIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PremiumFooter from '@/components/premium-footer';
import HomeBlogSection from '@/components/home-blog-section';
import { openWhatsApp, buildWhatsAppUrl, trackFormSubmit, captureUTMs, getTrackingData } from '@/lib/tracking';
// --- ENGENHARIA SENSORIAL (ÁUDIO) ---
const playChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
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
    // Audio blocked by browser until first interaction
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

// --- CURSOS MOCKADOS ---
const mockCourses = [
  {
    id: "1",
    title: "Tricologia Essencial",
    description: "Domine as bases para diagnósticos precisos e resultados reais em tricologia.",
    imageUrl: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/curso_tricologia_essencial.png",
    category: "Tricologia",
    duration: "4 módulos completos - 5 horas",
    href: "/cursos/tricologia-essencial",
    waKey: "card_matricula_tricologia" as const,
    highlights: [
      "Anatomia capilar avançada",
      "Diagnóstico de tricoses",
      "Protocolos de tratamento",
      "Casos clínicos reais"
    ]
  },
  {
    id: "2",
    title: "Protocolo Full Face",
    description: "Imersão avançada em técnicas combinadas com práticas atualizadas.",
    imageUrl: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/protocolo_fullface_capa2.png",
    category: "Biomedicina Estética",
    duration: "3 dias de imersão - 12 horas",
    href: "/cursos/protocolo-full-face",
    waKey: "card_matricula_full_face" as const,
    highlights: [
      "Rejuvenescimento facial completo",
      "Técnicas injetáveis modernas",
      "Protocolos personalizados",
      "Resultados excepcionais"
    ]
  }
];

// --- TESTIMONIALS MOCKADOS ---
const allTestimonials = [
  {
    name: "Maria Luiza",
    text: "Tive a grande oportunidade de iniciar minha jornada profissional ao lado da Dra. Rúbia de Carli, referência na Biomedicina Estética e Tricologia. Como estagiária, aprendi imensamente com seu vasto conhecimento, sua didática clara e generosa, e seu profissionalismo exemplar.",
    rating: 5,
    role: "Biomédica",
    photo: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_11_maria.jpg"
  },
  {
    name: "Camila Morh",
    text: "Tive a oportunidade de realizar um curso de extensão sobre Bioestimuladores de Colágeno com a Dra. Rubia, uma profissional altamente qualificada e dedicada a manter-se constantemente atualizada.",
    rating: 5,
    role: "Aluna",
    photo: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_12_camilha_mohr.jpg"
  },
  {
    name: "Gabriela Rigo",
    text: "O curso foi exepcional e cheio de conhecimentos, estudos, comprovações científicas. Consegui agregar muitos conhecimentos e ter uma percepção diferente, com uma profissional excepcional que me proporcionou uma inspiração além do limite, gratidão!",
    rating: 5,
    role: "Aluna",
    photo: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_13_gabriela.jpg"
  }
];

export default function HomePage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const opacity3D = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.3, 0.3, 1]);
  const scale3D = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 1.2]);

  const [, setCurrentSlide] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [formStatus, setFormStatus] = useState('idle');
  const [ebookFormStatus, setEbookFormStatus] = useState('idle');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playChime();
    trackFormSubmit('contato_homepage');
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
          origem: 'site - formulário principal',
          fonte: 'contato_homepage',
          ...getTrackingData(),
        }),
      });
    } catch { /* fail silently */ }
    router.push('/obrigado?tipo=contato');
  };

  const handleEbookFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playChime();
    trackFormSubmit('ebook_homepage');
    setEbookFormStatus('submitting');
    const data = new FormData(e.currentTarget);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.get('nome'),
          whatsapp: data.get('telefone'),
          email: data.get('email'),
          origem: 'site - formulário ebook',
          fonte: 'ebook_homepage',
          grupoWhatsapp: data.get('grupo_whatsapp') ? 'sim' : 'não',
          receberDicas: data.get('receber_dicas') ? 'sim' : 'não',
          ...getTrackingData(),
        }),
      });
    } catch { /* fail silently */ }
    router.push('/obrigado?tipo=ebook');
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    playChime();
  };

  // Extended testimonials for Marquee
  const extendedTestimonials = [...allTestimonials, ...allTestimonials];

  // Captura UTMs ao entrar na página
  useEffect(() => { captureUTMs(); }, []);

  // Auto-play do carrossel
  useEffect(() => {
    const totalSlides = Math.ceil(allTestimonials.length / 3);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
      <motion.nav
        animate={{ opacity: headerVisible ? 1 : 0, y: headerVisible ? 0 : -16 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/90 border-b border-white/20 shadow-sm text-[#1A1A1A]"
      >
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="text-sm sm:text-xl font-bold tracking-widest uppercase text-[#1A1A1A] shrink-0">Dra. Rúbia De Carli</div>
          <div className="hidden md:flex gap-6">
            <button onClick={() => scrollTo('cursos')} className="text-sm tracking-widest uppercase border-b border-[#1A1A1A]/30 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300">Cursos</button>
            <button onClick={() => scrollTo('sobre')} className="text-sm tracking-widest uppercase border-b border-[#1A1A1A]/30 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300">Sobre</button>
            <button onClick={() => scrollTo('investimento')} className="text-sm tracking-widest uppercase border-b border-[#1A1A1A]/30 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300">Investimento</button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTo('investimento')}
              className="text-xs sm:text-sm tracking-widest uppercase px-3 sm:px-4 py-2 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300 pointer-events-auto whitespace-nowrap"
            >
              Garantir Vaga
            </button>
            <button className="md:hidden p-1 text-[#1A1A1A]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              {mobileMenuOpen
                ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 px-4 pb-4">
            {[['cursos','Cursos'],['sobre','Sobre'],['investimento','Investimento']].map(([id, label]) => (
              <button key={id} onClick={() => { scrollTo(id); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-sm tracking-widest uppercase text-[#1A1A1A] border-b border-gray-100 hover:text-[#D4AF37] transition-colors">{label}</button>
            ))}
          </div>
        )}
      </motion.nav>

      <main className="relative z-10">

        {/* FRAME 1: HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12 text-center">
          <p className="text-[#D4AF37] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm md:text-base mb-4 sm:mb-6 font-semibold">
            Masterclass Exclusiva
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#1A1A1A] mb-4 sm:mb-6 drop-shadow-sm">
            Cursos Profissionais em <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8952E]">Tricologia e Biomedicina Estética</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-[#4A3F35] max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-12">
            Aprenda com uma referência na área e eleve sua carreira a um novo patamar de excelência
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => { playChime(); openWhatsApp('hero_garantir_vaga'); }}
              onMouseEnter={playChime}
              className="group relative px-8 py-4 bg-[#1A1A1A] text-white overflow-hidden rounded-full transition-all hover:scale-105 shadow-2xl shadow-[#D4AF37]/20 pointer-events-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 flex items-center gap-3 text-sm tracking-widest uppercase">
                GARANTIR MINHA VAGA <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <a
              href="#cursos"
              className="border border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-full text-lg font-light hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
            >
              Ver Cursos
            </a>
          </div>
        </section>

        {/* FRAME 2: APRESENTAÇÃO + IMAGEM */}
        <section className="min-h-screen flex items-center bg-[#1A1A1A] text-[#FAF9F8] py-16 sm:py-32 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div>
              <FadeIn>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-light mb-6 sm:mb-8">
                  Formação que <span className="italic text-[#D4AF37]">transforma carreiras</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="space-y-6 text-lg text-gray-300 font-light leading-relaxed">
                  <p>Cursos especializados em Tricologia e Biomedicina Estética desenvolvidos por quem é referência nacional na área.</p>
                  <p className="font-medium text-white">Conteúdo científico, prático e atualizado, do diagnóstico à técnica avançada.</p>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} className="relative group cursor-pointer pointer-events-auto">
              <div
                onClick={() => scrollTo('cursos')}
                className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#2A2A2A]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <Image
                  fill
                  src="https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_6_clinic.jpg"
                  alt="Clínica Dra. Rúbia De Carli"
                  className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-8 left-8 z-20">
                  <p className="text-[#D4AF37] tracking-widest text-sm uppercase mb-2">Conheça os Cursos</p>
                  <p className="text-2xl font-light">Tricologia &amp; Biomedicina Estética</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FRAME 3: CURSOS COM IMAGENS (Tangibilidade) */}
        <section id="cursos" className="py-16 sm:py-32 px-4 sm:px-6 bg-white relative z-10 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="text-center mb-20">
              <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">Nossos Cursos</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mt-4">Formação completa e atualizada</h2>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-8">
              {mockCourses.map((course, i) => (
                <FadeIn key={course.id} delay={i * 0.2}>
                  <Card3D className="group relative rounded-3xl overflow-hidden bg-[#FAF9F8] border border-[#D4AF37]/10 shadow-lg">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <Image fill src={course.imageUrl} alt={course.title} className={course.imageUrl.endsWith('.svg') ? 'object-contain' : 'object-cover group-hover:scale-105 transition-transform duration-700'} />
                    </div>
                    <div className="p-8">
                      <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">{course.category}</span>
                      <h3 className="text-2xl font-bold mt-2 mb-4 text-[#1A1A1A]">{course.title}</h3>
                      <p className="text-[#4A3F35] leading-relaxed text-sm mb-2">{course.duration}</p>
                      <p className="text-[#4A3F35] leading-relaxed text-sm mb-4">{course.description}</p>
                      <div className="mt-4 space-y-2">
                        {course.highlights.map((highlight, hIndex) => (
                          <div key={hIndex} className="flex items-center gap-2 text-[#4A3F35]">
                            <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex gap-4">
                        <a
                          href={buildWhatsAppUrl(course.waKey)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => openWhatsApp(course.waKey)}
                          className="px-6 py-2 bg-[#D4AF37] hover:bg-[#B8952E] text-white rounded-lg font-medium transition-colors"
                        >
                          Garantir Vaga
                        </a>
                        <Link
                          href={course.href}
                          className="px-6 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-lg font-medium hover:bg-[#D4AF37] hover:text-white transition-colors"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  </Card3D>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* FRAME 4: A MENTORA */}
        <section id="sobre" className="min-h-screen py-16 sm:py-32 px-4 sm:px-6 bg-[#1A1A1A] text-[#FAF9F8] relative z-10 flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
              <FadeIn className="order-2 md:order-1 relative group pointer-events-auto">
                <div className="relative rounded-t-full rounded-b-[2rem] overflow-hidden aspect-[3/4] border border-[#D4AF37]/20 bg-[#2A2A2A]">
                  <div className="absolute inset-0 bg-[#D4AF37]/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-1000" />
                  <Image fill src="https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/drarubiadecarli.jpg" alt="Dra. Rúbia" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                </div>
              </FadeIn>

              <div className="order-1 md:order-2">
                <FadeIn>
                  <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">A Sua Mentora</span>
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-light mt-4 mb-6 sm:mb-8">Dra. Rúbia de Carli</h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <div className="space-y-6 text-lg text-gray-300 font-light leading-relaxed">
                    <p><strong>Biomédica Estética</strong> com especialização em Tricologia e rejuvenescimento facial.</p>
                    <p>Referência na área, com anos de experiência e compromisso com a formação de profissionais qualificados.</p>
                    <p>Profissional altamente qualificada e dedicada a manter-se constantemente atualizada com as últimas técnicas e protocolos.</p>
                  </div>
                </FadeIn>

                {/* NÚMEROS DE IMPACTO */}
                <FadeIn delay={0.4}>
                  <div className="grid grid-cols-2 gap-6 mt-12 pt-12 border-t border-white/10">
                    {[
                      { number: "500+", label: "Alunos Formados" },
                      { number: "98%",  label: "Satisfação" },
                      { number: "50+",  label: "Cursos Realizados" },
                      { number: "4.9",  label: "Avaliação Média" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex flex-col">
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

        {/* FRAME 5: EBOOKS GRATUITOS */}
        <section id="ebooks" className="py-16 sm:py-32 px-4 sm:px-6 bg-gradient-to-b from-white to-[#FAF9F8] relative z-10">
          <div className="max-w-5xl mx-auto">
            <FadeIn className="text-center mb-10 sm:mb-16">
              <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">Conteúdo Exclusivo</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mt-4">Ebooks Grátis de Tricologia</h2>
              <p className="text-base sm:text-xl text-[#4A3F35] mt-4 sm:mt-6 max-w-2xl mx-auto">Receba materiais exclusivos e acesse nossa comunidade de especialistas</p>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-12">
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-[#D4AF37]/10">
                  <h3 className="text-2xl font-bold mb-6 text-[#1A1A1A]">Ebook: Guia de Tricologia Essencial</h3>
                  <ul className="space-y-3 mb-8 text-[#4A3F35]">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Fundamentos de anatomia capilar</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Diagnóstico das principais tricoses</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Protocolos de tratamento</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Estudos de caso reais</span>
                    </li>
                  </ul>
                  <div className="bg-[#D4AF37]/5 rounded-2xl p-6 border border-[#D4AF37]/20">
                    <p className="text-sm text-[#4A3F35] font-medium mb-2">📚 45 páginas de conteúdo especializado</p>
                    <p className="text-sm text-[#4A3F35]">Validado por especialistas da área</p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="bg-[#FAF9F8] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/20">
                  {ebookFormStatus === 'success' ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">Ebook Enviado!</h3>
                      <p className="text-[#4A3F35] mb-4">Verifique seu email para acessar o material.</p>
                      <p className="text-sm text-[#D4AF37] font-medium">Você receberá também o convite para nosso grupo exclusivo!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleEbookFormSubmit} className="space-y-4">
                      <h3 className="text-2xl font-bold mb-6 text-[#1A1A1A]">Receba Agora</h3>
                      <div><Input required name="nome" type="text" placeholder="Seu Nome Completo" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" /></div>
                      <div><Input required name="email" type="email" placeholder="Seu melhor E-mail" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" /></div>
                      <div><Input required name="telefone" type="tel" placeholder="WhatsApp (com DDD)" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" /></div>
                      
                      <div className="space-y-3 pt-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" name="grupo_whatsapp" value="sim" className="mt-1 w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] focus:ring-2" />
                          <span className="text-sm text-[#4A3F35] group-hover:text-[#1A1A1A] transition-colors">Quero fazer parte do grupo exclusivo de WhatsApp para troca de conhecimentos em Tricologia</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" name="receber_dicas" value="sim" className="mt-1 w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] focus:ring-2" />
                          <span className="text-sm text-[#4A3F35] group-hover:text-[#1A1A1A] transition-colors">Desejo receber dicas exclusivas e atualizações sobre novos cursos</span>
                        </label>
                      </div>

                      <button type="submit" disabled={ebookFormStatus === 'submitting'} className="w-full py-4 mt-6 bg-[#D4AF37] hover:bg-[#B8952E] text-white rounded-xl font-semibold tracking-wide transition-all flex justify-center items-center gap-2 disabled:opacity-70">
                        {ebookFormStatus === 'submitting' ? 'Enviando...' : 'BAIXAR EBOOK GRATIS'}
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" /> Seus dados estão 100% seguros
                      </p>
                    </form>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* FRAME 6: BENEFÍCIOS DOS CURSOS */}
        <section id="investimento" className="min-h-screen py-16 sm:py-32 px-4 sm:px-6 bg-gradient-to-b from-[#FAF9F8] to-[#e8e6e1] flex items-center">
          <div className="max-w-5xl mx-auto w-full">
            <FadeIn className="text-center mb-16">
              <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">Transformação Profissional</span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-light mt-4 mb-4 sm:mb-6">Eleve Sua Carreira</h2>
              <p className="text-lg text-[#4A3F35] font-light leading-relaxed mb-8">
                A especialização que diferencia profissionais comuns de especialistas reconhecidos no mercado
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-[#D4AF37]/10 border border-[#D4AF37]/20 relative overflow-hidden pointer-events-auto">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-bl-full -z-0" />

                <div className="relative z-10">
                  
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <Link href="/cursos/tricologia" className="text-xl font-semibold mb-4 text-[#1A1A1A] hover:text-[#D4AF37] transition-colors inline-block">Tricologia Essencial →</Link>
                      <ul className="space-y-3 text-[#4A3F35]">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>Certificação profissional em Tricologia</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>Conteúdo baseado em evidências científicas</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>Suporte direto com especialista Dra. Rúbia</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>Material didático completo e atualizado</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <Link href="/cursos/protocolo-full-face" className="text-xl font-semibold mb-4 text-[#1A1A1A] hover:text-[#D4AF37] transition-colors inline-block">Protocolo Full Face →</Link>
                      <ul className="space-y-3 text-[#4A3F35]">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>Técnicas avançadas de rejuvenescimento</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>Protocolos combinados e personalizados</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>Aulas práticas com supervisão</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>Resultados comprovados e casos reais</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-center mt-12">
                    <a
                      href={buildWhatsAppUrl('investimento_garantir_vaga')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => openWhatsApp('investimento_garantir_vaga')}
                      className="px-8 py-4 bg-[#D4AF37] hover:bg-[#B8952E] text-white rounded-2xl font-semibold tracking-wide transition-all shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:-translate-y-1 inline-flex justify-center items-center gap-2 mx-auto"
                    >
                      GARANTIR MINHA VAGA <ArrowRight className="w-5 h-5" />
                    </a>
                    <p className="text-center text-sm text-[#4A3F35] mt-4">Consulte condições e turmas disponíveis</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* DIFERENCIAIS DA PLATAFORMA */}
            <FadeIn delay={0.4}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-[#D4AF37]/10 shadow-sm">
                  <BookOpen className="w-10 h-10 text-[#D4AF37] mb-4" />
                  <h4 className="font-bold text-[#1A1A1A] mb-2">Conteúdo Exclusivo</h4>
                  <p className="text-sm text-[#4A3F35]">Aulas presenciais, materiais complementares e atualizações constantes</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-[#D4AF37]/10 shadow-sm">
                  <Users className="w-10 h-10 text-[#D4AF37] mb-4" />
                  <h4 className="font-bold text-[#1A1A1A] mb-2">Comunidade Exclusiva</h4>
                  <p className="text-sm text-[#4A3F35]">Grupo de WhatsApp para troca de conhecimentos e networking</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-[#D4AF37]/10 shadow-sm">
                  <GraduationCap className="w-10 h-10 text-[#D4AF37] mb-4" />
                  <h4 className="font-bold text-[#1A1A1A] mb-2">Certificação Reconhecida</h4>
                  <p className="text-sm text-[#4A3F35]">Certificado válido para o currículo e reconhecido no mercado</p>
                </div>
              </div>
            </FadeIn>

            {/* SELOS DE GARANTIA E INFORMAÇÕES */}
            <FadeIn delay={0.5}>
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {[
                  { title: "Certificação Garantida", desc: "Após a finalização, receba certificado que chancelará sua autoridade em Tricologia.", icon: <AwardIcon className="w-6 h-6 text-[#D4AF37]" /> },
                  { title: "Referência Nacional", desc: "Método validado pela Dra. Rúbia, uma das maiores autoridades em Tricologia do Brasil.", icon: <ThumbsUp className="w-6 h-6 text-[#D4AF37]" /> },
                  { title: "Suporte Contínuo", desc: "Acompanhamento pós-curso com acesso a atualizações e grupo exclusivo de alunos.", icon: <Clock className="w-6 h-6 text-[#D4AF37]" /> }
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

        {/* FRAME 7: PROVA SOCIAL DESLIZANTE (Marquee) */}
        <section className="py-16 sm:py-32 bg-[#1A1A1A] text-[#FAF9F8] relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-20">
            <FadeIn className="text-center">
              <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">Depoimentos de Alunas</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mt-4">Quem já vive a transformação</h2>
            </FadeIn>
          </div>

          {/* Container do Marquee */}
          <div className="w-full flex overflow-hidden group">
            <motion.div
              className="flex gap-8 px-4 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            >
              {/* Duplicamos os arrays para criar o loop contínuo perfeitamente liso */}
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
                      <Image fill src={testimonial.photo} alt={testimonial.name} className="object-cover" />
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

        {/* FRAME 8: CAPTURA DE LEADS */}
        <section id="contato" className="py-16 sm:py-32 px-4 sm:px-6 bg-white relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-16">
<FadeIn className="flex-1">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-light mb-4 sm:mb-6">Ainda tem dúvidas?</h2>
              <p className="text-lg text-[#4A3F35] font-light leading-relaxed mb-8">
                Fale diretamente com nossa equipe de concierges. Deixe seus dados e entraremos em contato para entender se nossos cursos são o próximo passo ideal para sua carreira.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                Atendimento humano e personalizado.
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="flex-1 w-full">
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
                    <div><Input required name="nome" type="text" placeholder="Seu Nome Completo" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" /></div>
                    <div><Input required name="email" type="email" placeholder="Seu melhor E-mail" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" /></div>
                    <div><Input required name="telefone" type="tel" placeholder="WhatsApp (com DDD)" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" /></div>
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

      <HomeBlogSection />
      <PremiumFooter />

    </div>
  );
}