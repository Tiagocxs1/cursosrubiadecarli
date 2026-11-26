import type { EnhancedCoursePageTemplateProps } from "@/components/EnhancedCoursePageTemplate";

export const tricologiaEnhancedData: EnhancedCoursePageTemplateProps = {
  courseName: "Tricologia Essencial",
  phoneLink: "https://wa.me/5554992350352?text=Ol%C3%A1!%20Tenho%20interesse%20no%20curso%20Tricologia%20Essencial%3A%20Domine%20as%20Bases%20para%20Diagn%C3%B3sticos%20Precisos%20e%20Resultados%20Reais.%20Gostaria%20de%20saber%20mais%20sobre%20os%20m%C3%B3dulos%20e%20como%20funciona%20o%20curso.",
  menuLinks: [
    { href: '#curso', label: 'Sobre' },
    { href: '#depoimentos', label: 'Depoimentos' },
    { href: '#investimento', label: 'Investimento' },
    { href: '#contato', label: 'Contato' },
    { href: 'https://wa.me/5554992350352?text=Ol%C3%A1!%20Tenho%20interesse%20no%20curso%20Tricologia%20Essencial.', label: 'Começar agora', external: true }
  ],
  video: {
    label: "Assistir Teaser",
    title: "O Universo Capilar",
    url: "",
    platform: "youtube",
    image: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/curso_tricologia_essencial.png",
  },
  hero: {
    titlePrefix: "Tricologia",
    titleHighlight: "Essencial",
    subtitle: "Domine as Bases para Diagnósticos Precisos e Resultados Reais",
    description: "Um curso presencial, em 3 módulos, para quem busca segurança técnica e domínio clínico desde o primeiro atendimento.",
    ctaText: "Quero Começar",
    ctaUrl: "https://wa.me/5554992350352?text=Ol%C3%A1!%20Tenho%20interesse%20no%20curso%20Tricologia%20Essencial.",
    secondaryText: "Saiba Mais",
    secondaryAnchor: "#curso"
  },
  instructor: {
    name: "Dra. Rúbia De Carli",
    image: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/drarubiadecarli.jpg",
    title: "Biomédica especialista em Tricologia e Rejuvenescimento Facial, com mais de 10 anos de experiência e mais de 500 alunos formados.",
    descriptionLines: [
      "Sou Rúbia De Carli, com formação internacional (Face/Londres), certificação pelo International Association of Trichologists e 2 pós-graduações. Minha missão é descomplicar a Tricologia com segurança técnica, conteúdo de valor e prática, entregando excelência clínica e transformação real para profissionais e pacientes."
    ]
  },
  course: {
    sectionTitle: "O que você vai aprender",
    sectionSubtitle: "Nesse curso você aprenderá sobre a Anatomia folicular e a estrutura da fibra capilar. Suas principais anormalidades, as Tricoses iniciando pela fisiopatologia e suas manifestações clínicas até o tratamento. As principais causas de queda e afinamento capilar que são apresentadas nas alopecias não cicatriciais (eflúvios, alopecia androgenética e alopecia areata).",
    description: "",
    learnings: [
      "Certificação Garantida",
      "Altamente Recomendável",
      "Cancelamento grátis"
    ],
    modules: [
      {
        title: "Anatomia Capilar",
        duration: "1 hora",
        img: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/tricologia_essencial_modulo_1_anatomia_capilar.png",
        highlights: ["Estrutura do couro cabeludo", "Estrutura interna do cabelo", "Distúrbios capilares"]
      },
      {
        title: "Tricoses - Doenças e anormalidades da haste",
        duration: "3 horas",
        img: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/tricologia_essencial_modulo_2_tricoses.png",
        highlights: ["Tricoses", "Diagnóstico", "Tratamentos", "Análise de doenças capilares"]
      },
      {
        title: "Alopecia não cicatriciais",
        duration: "1 hora",
        img: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/tricologia_essencial_modulo_3_alopecia.png",
        highlights: ["Ciclo capilar", "Alopecia Androgenética masculina e feminina", "Eflúvio Telogeno", "Alopecia Areata", "Diagnóstico"]
      }
    ]
  },
  testimonials: [
    {
      name: "Maria Luiza",
      text: "Tive a grande oportunidade de iniciar minha jornada profissional ao lado da Dra. Rúbia de Carli, referência na Biomedicina Estética e Tricologia. Como estagiária, aprendi imensamente com seu vasto conhecimento, sua didática clara e generosa, e seu profissionalismo exemplar. Sua dedicação aos pacientes e paixão pelo que faz me inspiram até hoje.",
      rating: 5,
      platform: "Curso",
      role: "Biomédica",
      photo: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_11_maria.jpg"
    },
    {
      name: "Camila Morh",
      text: "Tive a oportunidade de realizar um curso de extensão sobre Bioestimuladores de Colágeno com a Dra. Rúbia, uma profissional altamente qualificada e dedicada a manter-se constantemente atualizada. O curso abordou de maneira detalhada os diversos tipos de bioestimuladores, suas aplicações clínicas, protocolos de segurança e benefícios para os pacientes.",
      rating: 5,
      platform: "Curso",
      role: "Aluna",
      photo: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_12_camilha_mohr.jpg"
    },
    {
      name: "Gabriela Rigo",
      text: "O curso foi excepcional e cheio de conhecimentos, estudos, comprovações científicas. Consegui agregar muitos conhecimentos e ter uma percepção diferente, com uma profissional excepcional que me proporcionou uma inspiração além do limite, gratidão!",
      rating: 5,
      platform: "Curso",
      role: "Aluna",
      photo: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_13_gabriela.jpg"
    },
    {
      name: "Camila Panassol",
      text: "Realizei o curso de Bioestimuladores de colágeno com a Dra. Rúbia, e foi um curso excelente! Na prática, a Dra. Rúbia nos passou muita calma e confiança, além de ser muito atenciosa a cada detalhe. Super recomendo!",
      rating: 5,
      platform: "Curso",
      role: "Paciente",
      photo: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_14_camila.jpg"
    },
    {
      name: "Fernanda Franciosi",
      text: "Ser estagiária da Dra. Rúbia foi muito mais do que um aprendizado técnico. Foi uma vivência que me inspirou a ser melhor, a buscar excelência e a enxergar a estética além da beleza. Ela está sempre em busca pelo novo e pelo melhor para seus pacientes. Sou imensamente grata por essa experiência.",
      rating: 5,
      platform: "Curso",
      role: "Biomédica",
      photo: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_1_fernanda.jpg"
    },
    {
      name: "Monique Scain",
      text: "O curso de Bioestimuladores de Colágeno que fiz contigo foi uma experiência incrível, muito enriquecedora e cheia de aprendizado. Tua didática, conhecimento e dedicação fizeram toda a diferença no meu desenvolvimento na área.",
      rating: 5,
      platform: "Curso",
      role: "Aluna",
      photo: "https://res.cloudinary.com/dhfek3urm/image/upload/cursos-rubiadecarli/imgi_3_monique.jpg"
    }
  ],
  bonus: {
    title: "Garanta sua vaga agora!",
    description: "Os 10 primeiros inscritos recebem um bônus exclusivo: E-book \"Os Benefícios Ocultos dos Nutrientes\" + acesso a uma aula extra sobre Foliculite no Couro Cabeludo.",
    ctaText: "Quero me Especializar",
    ctaUrl: "https://wa.me/5554992350352?text=Ol%C3%A1!%20Tenho%20interesse%20no%20curso%20Tricologia%20Essencial.",
    extraText: "Vagas limitadas — comece a dominar a tricologia hoje!"
  },
  stats: [
    { number: "500+", label: "Alunos formados" },
    { number: "98%", label: "Satisfação" },
    { number: "50+", label: "Cursos realizados" },
    { number: "4.9", label: "Avaliação média" }
  ],
  investment: {
    title: "Aproveite o desconto!",
    subtitle: "Vagas limitadas e conteúdo 100% ao vivo — comece a dominar a tricologia hoje!",
    price: "R$ 1.297,00",
    priceLabel: "à vista",
    installments: "6",
    installmentPrice: "R$ 237,17",
    originalPrice: "R$ 1.423,00",
    bulletPoints: [
      "1 hora sobre Anatomia Capilar",
      "3 horas sobre Doenças de Couro Cabeludo",
      "Certificação garantida após conclusão"
    ],
    ctaText: "Quero me Especializar",
    ctaUrl: "https://wa.me/5554992350352?text=Ol%C3%A1!%20Tenho%20interesse%20no%20curso%20Tricologia%20Essencial."
  },
  opportunity: {
    title: "NÃO PERCA ESSA OPORTUNIDADE",
    description: "Além da compra do curso, você poderá estar recebendo um e-book de forma gratuita para ajudar em seus estudos e melhorar a vida de seus pacientes.",
    ctaText: "Quero Começar",
    ctaUrl: "https://wa.me/5554992350352?text=Ol%C3%A1!%20Tenho%20interesse%20no%20curso%20Tricologia%20Essencial."
  }
};
