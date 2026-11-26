import React,{useEffect,useState} from 'react';
import {ArrowLeft,Calendar,Clock,Tag} from 'lucide-react';

type Post={id:string;title:string;slug:string|null;excerpt:string|null;content:string|null;cover_image:string|null;tags:string[]|null;author:string|null;published_at:string|null;created_at:string};
const date=(value:string|null)=>value?new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(value)):'';
const minutes=(value:string|null)=>value?Math.max(1,Math.round(value.replace(/<[^>]+>/g,'').split(/\s+/).length/200))+' min de leitura':'1 min';

export default function BlogArticle(){
 const [post,setPost]=useState<Post|null>(null);
 const [html,setHtml]=useState('');
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState(false);
 useEffect(()=>{
  const slug=decodeURIComponent(location.pathname.replace(/\/+$/,'').split('/').pop()||'');
  fetch('/api/blog?slug='+encodeURIComponent(slug)).then(r=>r.ok?r.json():null).then(async data=>{
   if(!data||!data.id){setError(true);return;}
   setPost(data);
   if(data.content){
    const mod=await import('dompurify');
    setHtml(mod.default.sanitize(data.content,{ALLOWED_TAGS:['a','abbr','b','blockquote','br','code','div','em','h1','h2','h3','h4','hr','i','img','li','ol','p','pre','section','span','strong','table','tbody','td','th','thead','tr','u','ul'],ALLOWED_ATTR:['href','src','alt','title','target','rel','width','height','loading','class','colspan','rowspan']}));
   }
   document.title=data.title+' | Blog | Dra. Rúbia De Carli';
   const canonical='https://cursos.rubiadecarli.com.br/blog/'+encodeURIComponent(slug);
   let link=document.querySelector('link[rel="canonical"]') as HTMLLinkElement|null;
   if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link);}
   link.href=canonical;
   const desc=document.querySelector('meta[name="description"]') as HTMLMetaElement|null;
   if(desc)desc.content=data.excerpt||data.title;
  }).catch(()=>setError(true)).finally(()=>setLoading(false));
 },[]);
 if(loading)return <main className="min-h-screen bg-white px-6 py-24 text-center text-[#4A3F35]">Carregando artigo...</main>;
 if(error||!post)return <main className="min-h-screen bg-white px-6 py-24 text-center text-[#4A3F35]"><h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1><a href="/blog/" className="text-[#D4AF37] underline">Voltar ao blog</a></main>;
 const slug=post.slug||post.id;
 return <main className="min-h-screen bg-white">
  {post.cover_image?<div className="relative w-full h-64 md:h-96 bg-[#FAF9F8]"><img src={post.cover_image} alt={post.title} className="absolute inset-0 w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/></div>:null}
  <div className="max-w-3xl mx-auto px-6 py-12">
   <nav className="flex items-center gap-2 text-xs text-[#4A3F35]/50 mb-8"><a href="/" className="hover:text-[#D4AF37]">Início</a><span>/</span><a href="/blog/" className="hover:text-[#D4AF37]">Blog</a><span>/</span><span className="text-[#4A3F35]/80 line-clamp-1">{post.title}</span></nav>
   {post.tags?.length?<div className="flex flex-wrap gap-2 mb-4">{post.tags.map(tag=><span key={tag} className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full uppercase tracking-wider"><Tag className="w-3 h-3"/>{tag}</span>)}</div>:null}
   <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight mb-4">{post.title}</h1>
   <div className="flex items-center gap-4 text-sm text-[#4A3F35]/60 mb-8 pb-8 border-b border-gray-100">{post.author?<span className="font-medium text-[#4A3F35]">{post.author}</span>:null}<span className="flex items-center gap-1"><Calendar className="w-4 h-4"/>{date(post.published_at||post.created_at)}</span><span className="flex items-center gap-1"><Clock className="w-4 h-4"/>{minutes(post.content)}</span></div>
   {html?<article className="prose prose-lg prose-headings:font-bold prose-headings:text-[#1A1A1A] prose-p:text-[#4A3F35] prose-p:leading-relaxed prose-a:text-[#D4AF37] prose-a:no-underline prose-strong:text-[#1A1A1A] prose-li:text-[#4A3F35] max-w-none" dangerouslySetInnerHTML={{__html:html}}/>:<p className="text-[#4A3F35]/60 italic">Conteúdo não disponível.</p>}
   <div className="mt-16 p-8 bg-gradient-to-br from-[#D4AF37]/10 to-[#B8952E]/5 rounded-3xl border border-[#D4AF37]/20 text-center"><p className="text-sm text-[#D4AF37] font-semibold uppercase tracking-widest mb-2">Aprenda com a especialista</p><h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Quer se aprofundar no tema?</h3><p className="text-[#4A3F35]/70 mb-6 max-w-md mx-auto">Conheça os cursos presenciais da Dra. Rúbia De Carli e torne-se referência na área.</p><div className="flex flex-col sm:flex-row gap-3 justify-center"><a href="/cursos/tricologia-essencial/" className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#B8952E] transition-colors text-sm">Ver Curso de Tricologia</a><a href="/cursos/protocolo-full-face/" className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] font-semibold rounded-full hover:bg-[#D4AF37]/10 transition-colors text-sm">Ver Protocolo Full Face</a></div></div>
   <div className="mt-12"><a href="/blog/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A3F35]/60 hover:text-[#D4AF37] transition-colors"><ArrowLeft className="w-4 h-4"/>Ver todos os artigos</a></div>
  </div></main>;
}
