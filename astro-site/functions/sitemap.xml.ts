interface Env{SUPABASE_URL?:string;SUPABASE_PUBLISHABLE_KEY?:string;SUPABASE_ORGANIZATION_ID?:string;}
const base='https://cursos.rubiadecarli.com.br';
const staticPaths=['/','/cursos/tricologia-essencial','/cursos/protocolo-full-face'];
function esc(v:string){return v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
export async function onRequestGet({env}:{env:Env}){
 const urls=staticPaths.map(path=>({loc:base+path,lastmod:''}));
 try{
  if(env.SUPABASE_URL&&env.SUPABASE_PUBLISHABLE_KEY&&env.SUPABASE_ORGANIZATION_ID){
   const query=new URL('/rest/v1/contents',env.SUPABASE_URL);
   query.searchParams.set('select','id,post_name,post_date,created_at');
   query.searchParams.set('organization_id','eq.'+env.SUPABASE_ORGANIZATION_ID);
   query.searchParams.set('post_status','eq.publish');
   query.searchParams.set('order','post_date.desc.nullslast');
   query.searchParams.set('limit','500');
   const res=await fetch(query,{headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,Authorization:'Bearer '+env.SUPABASE_PUBLISHABLE_KEY}});
   if(res.ok){
    const posts=await res.json() as Array<{id:string;post_name:string|null;post_date:string|null;created_at:string}>;
    if(posts.length>0){
     urls.push({loc:base+'/blog',lastmod:''});
     for(const post of posts){
      const slug=post.post_name||post.id;
      urls.push({loc:base+'/blog/'+encodeURIComponent(slug),lastmod:post.post_date||post.created_at||''});
     }
    }
   }
  }
 }catch{}
 const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(x=>'<url><loc>'+esc(x.loc)+'</loc>'+(x.lastmod?'<lastmod>'+esc(x.lastmod.slice(0,10))+'</lastmod>':'')+'</url>').join('')+'</urlset>';
 return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=300, stale-while-revalidate=600'}});
}
