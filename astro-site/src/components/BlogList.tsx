import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

type Post = {
  id: string; title: string; slug: string | null; excerpt: string | null;
  content: string | null; cover_image: string | null; tags: string[] | null;
  author: string | null; published_at: string | null; created_at: string;
};
const formatDate=(value:string|null)=>value?new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(value)):'';
const readingTime=(value:string|null)=>value?Math.max(1,Math.round(value.replace(/<[^>]+>/g,'').split(/\s+/).length/200))+' min de leitura':'1 min';

export default function BlogList(){
 const [posts,setPosts]=useState<Post[]>([]);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{fetch('/api/blog?limit=100').then(r=>r.ok?r.json():[]).then(data=>setPosts(Array.isArray(data)?data:[])).catch(()=>setPosts([])).finally(()=>setLoading(false));},[]);
 return <main className="min-h-screen bg-[#FAF9F8]">
  <section className="bg-white border-b border-gray-100 py-16 px-6"><div className="max-w-7xl mx-auto">
   <a href="/" className="text-xs text-[#4A3F35]/50 uppercase tracking-widest mb-8 inline-flex items-center gap-1 hover:text-[#D4AF37] transition-colors">← Voltar ao início</a>
   <div className="mt-4"><span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">Conteúdo Gratuito</span>
    <h1 className="text-4xl md:text-5xl font-light mt-2 text-[#1A1A1A]">Artigos e Conhecimento</h1>
    <p className="mt-4 text-[#4A3F35]/70 text-lg max-w-2xl">Conteúdo especializado em Tricologia, Biomedicina Estética e Harmonização Facial por Dra. Rúbia De Carli.</p>
   </div></div></section>
  <section className="py-16 px-6"><div className="max-w-7xl mx-auto">
   {loading?<div className="text-center py-24 text-[#4A3F35]/50">Carregando artigos...</div>:posts.length===0?<div className="text-center py-24 text-[#4A3F35]/50"><span className="text-5xl mb-4 block opacity-30">✦</span><p>Nenhum artigo publicado ainda.</p></div>:
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{posts.map(post=><a key={post.id} href={`/blog/${encodeURIComponent(post.slug||post.id)}/`} className="group bg-white rounded-3xl overflow-hidden border border-[#D4AF37]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
     <div className="aspect-[16/9] relative overflow-hidden bg-[#FAF9F8]">{post.cover_image?<img src={post.cover_image} alt={post.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>:<div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8952E]/10 flex items-center justify-center"><span className="text-5xl opacity-30">✦</span></div>}
      {post.tags?.length?<span className="absolute top-3 left-3 bg-[#D4AF37] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">{post.tags[0]}</span>:null}</div>
     <div className="p-6 flex flex-col flex-1"><div className="flex items-center gap-3 text-xs text-[#4A3F35]/60 mb-3"><span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{formatDate(post.published_at||post.created_at)}</span><span>·</span><span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{readingTime(post.content)}</span></div>
      <h2 className="text-lg font-bold text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">{post.title}</h2>
      {post.excerpt?<p className="text-sm text-[#4A3F35] leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>:null}
      <span className="mt-4 text-xs font-semibold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Ler artigo <ArrowRight className="w-3 h-3"/></span>
     </div></a>)}</div>}
  </div></section></main>;
}
