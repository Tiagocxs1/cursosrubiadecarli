interface Env {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_ORGANIZATION_ID?: string;
}
type Row = {
  id:string; organization_id:string; post_title:string|null; post_name:string|null; post_excerpt:string|null;
  post_content:string|null; featured_image:string|null; post_status:string|null; post_tag:string|string[]|null;
  post_author:string|null; post_date:string|null; created_at:string;
};
function tags(raw:Row['post_tag']):string[]|null{
  if(Array.isArray(raw))return raw.filter(Boolean);
  if(!raw)return null;
  try{const v=JSON.parse(raw);return Array.isArray(v)?v.map(String).filter(Boolean):[String(v)];}
  catch{return raw.split(',').map(x=>x.trim()).filter(Boolean);}
}
function map(row:Row){
 return {id:row.id,org_id:row.organization_id,title:row.post_title??'',slug:row.post_name,excerpt:row.post_excerpt,content:row.post_content,cover_image:row.featured_image,status:row.post_status??'',type:null,tags:tags(row.post_tag),author:row.post_author,published_at:row.post_date,created_at:row.created_at};
}
async function query(env:Env,filter:string,limit:number){
 if(!env.SUPABASE_URL||!env.SUPABASE_PUBLISHABLE_KEY||!env.SUPABASE_ORGANIZATION_ID)return [];
 const url=new URL('/rest/v1/contents',env.SUPABASE_URL);
 url.searchParams.set('select','id,organization_id,post_title,post_name,post_excerpt,post_content,featured_image,post_status,post_tag,post_author,post_date,created_at');
 url.searchParams.set('organization_id','eq.'+env.SUPABASE_ORGANIZATION_ID);
 url.searchParams.set('post_status','eq.publish');
 url.searchParams.set('order','post_date.desc.nullslast');
 if(filter)url.searchParams.set('post_name','eq.'+filter);
 else url.searchParams.set('limit',String(limit));
 const response=await fetch(url,{headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,Authorization:'Bearer '+env.SUPABASE_PUBLISHABLE_KEY}});
 if(!response.ok)throw new Error('SUPABASE_BLOG_QUERY_FAILED');
 return await response.json() as Row[];
}
export async function onRequestGet({request,env}:{request:Request;env:Env}){
 try{
  const url=new URL(request.url);
  const slug=url.searchParams.get('slug')?.trim()||'';
  if(slug){
   let rows=await query(env,slug,1);
   if(!rows.length&&/^[0-9a-f-]{20,}$/i.test(slug)){
    if(!env.SUPABASE_URL||!env.SUPABASE_PUBLISHABLE_KEY||!env.SUPABASE_ORGANIZATION_ID)return Response.json(null,{status:404});
    const byId=new URL('/rest/v1/contents',env.SUPABASE_URL);
    byId.searchParams.set('select','id,organization_id,post_title,post_name,post_excerpt,post_content,featured_image,post_status,post_tag,post_author,post_date,created_at');
    byId.searchParams.set('organization_id','eq.'+env.SUPABASE_ORGANIZATION_ID);
    byId.searchParams.set('post_status','eq.publish');
    byId.searchParams.set('id','eq.'+slug);
    byId.searchParams.set('limit','1');
    const res=await fetch(byId,{headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,Authorization:'Bearer '+env.SUPABASE_PUBLISHABLE_KEY}});
    if(res.ok)rows=await res.json() as Row[];
   }
   return Response.json(rows[0]?map(rows[0]):null,{status:rows[0]?200:404,headers:{'Cache-Control':'public, max-age=60, stale-while-revalidate=300'}});
  }
  const limit=Math.min(100,Math.max(1,Number(url.searchParams.get('limit')||3)||3));
  const rows=await query(env,'',limit);
  return Response.json(rows.map(map),{headers:{'Cache-Control':'public, max-age=60, stale-while-revalidate=300'}});
 }catch{
  return Response.json({error:'Não foi possível carregar os artigos.'},{status:503});
 }
}
