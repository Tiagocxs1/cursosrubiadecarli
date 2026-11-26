interface Env {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ORGANIZATION_ID?: string;
}
type Body = Record<string,unknown>;
const CRM_BASE='https://tsdigitais-central-astro.tiagocxs-tdb.workers.dev';
const CRM_FORM_KEY='ede60fad09cd4a5185d884e0451a1258';
const PARENT_ORIGIN='https://cursos.rubiadecarli.com.br';
function valueOf(v:unknown,max=500):string{
 if(typeof v==='string')return v.trim().slice(0,max);
 if(typeof v==='number'&&Number.isFinite(v))return String(v);
 return '';
}
function truthy(v:unknown){return v===true||v==='true'||v==='sim'||v==='yes'||v===1;}
function safeUrl(value:string,fallback:string){
 for(const item of [value,fallback])try{const u=new URL(item);if(u.protocol==='https:'||u.protocol==='http:')return u.toString().slice(0,2048);}catch{}
 return PARENT_ORIGIN+'/';
}
async function insertMirror(env:Env,payload:Record<string,unknown>){
 const key=env.SUPABASE_SERVICE_ROLE_KEY||env.SUPABASE_PUBLISHABLE_KEY;
 if(!env.SUPABASE_URL||!key||!env.SUPABASE_ORGANIZATION_ID)return false;
 const res=await fetch(new URL('/rest/v1/customers',env.SUPABASE_URL),{
  method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=minimal'},
  body:JSON.stringify({full_name:payload.nome,phone:payload.whatsapp,email:payload.email,lead_source:'Site Cursos',status:'Lead',organization_id:env.SUPABASE_ORGANIZATION_ID,customer_type:'PF',metadata:{
   fonte:payload.fonte,curso:payload.curso,procedimento:payload.procedimento,mensagem:payload.mensagem,origem:payload.origem,urlOrigem:payload.urlOrigem,
   referrer:payload.referrer,dispositivo:payload.dispositivo,sessionId:payload.sessionId,utmSource:payload.utmSource,utmMedium:payload.midia,
   utmCampaign:payload.campanha,utmContent:payload.conteudo,utmTerm:payload.termo,gclid:payload.gclid,fbclid:payload.fbclid,
   gbraid:payload.gbraid,wbraid:payload.wbraid,msclkid:payload.msclkid,dclid:payload.dclid,consentNewsletter:payload.newsletter,
   consentWhatsapp:payload.contatoWhatsapp,grupoWhatsapp:payload.grupoWhatsapp,dataISO:payload.dataISO
  }})
 });
 return res.ok;
}
export async function onRequestPost({request,env}:{request:Request;env:Env}){
 try{
  const origin=request.headers.get('origin');
  if(origin){try{if(new URL(origin).origin!==new URL(request.url).origin)return Response.json({success:false,error:'Origem não autorizada.'},{status:403});}catch{return Response.json({success:false,error:'Origem inválida.'},{status:403});}}
  const length=Number(request.headers.get('content-length')||0);
  if(length>24000)return Response.json({success:false,error:'Solicitação muito grande.'},{status:413});
  const body=await request.json() as Body;
  if(!body||typeof body!=='object'||Array.isArray(body))return Response.json({success:false,error:'Dados inválidos.'},{status:400});
  const email=valueOf(body.email,254).toLowerCase();
  const fonte=valueOf(body.fonte,100)||'contato_site';
  const origem=valueOf(body.origem,200)||'site';
  const newsletter=fonte==='newsletter_footer'||origem==='site - newsletter footer';
  const nome=valueOf(body.nome,160)||(newsletter?email:'');
  const whatsapp=valueOf(body.whatsapp||body.telefone,40);
  const mensagem=valueOf(body.mensagem,4000);
  const curso=valueOf(body.curso,180);
  const procedimento=valueOf(body.procedimento,180)||curso||(newsletter?'Newsletter':'Contato Site');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return Response.json({success:false,error:'Informe um e-mail válido.'},{status:400});
  if(!nome)return Response.json({success:false,error:'Informe seu nome.'},{status:400});
  const consentNewsletter=truthy(body.newsletter)||truthy(body.receberDicas);
  const consentWhatsapp=truthy(body.contatoWhatsapp)||truthy(body.whatsappConsent);
  const referer=request.headers.get('referer')||'';
  const originHeader=request.headers.get('origin')||new URL(request.url).origin;
  const urlOrigem=safeUrl(valueOf(body.urlOrigem,2048),referer||originHeader);
  const payload={
   nome,email,whatsapp,curso,procedimento,mensagem,origem,fonte,
   grupoWhatsapp:valueOf(body.grupoWhatsapp,20),receberDicas:consentNewsletter?'sim':'não',
   newsletter:consentNewsletter,contatoWhatsapp:consentWhatsapp,
   dataHora:new Date().toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'full',timeStyle:'short'}),
   dataISO:new Date().toISOString(),urlOrigem,referrer:valueOf(body.referrer,2048)||referer,
   utmSource:valueOf(body.utmSource||body.utm_source||body.source,160),
   midia:valueOf(body.midia||body.utmMedium||body.utm_medium,160),
   campanha:valueOf(body.campanha||body.utmCampaign||body.utm_campaign,200),
   conteudo:valueOf(body.conteudo||body.utmContent||body.utm_content,200),
   termo:valueOf(body.termo||body.utmTerm||body.utm_term,200),
   gclid:valueOf(body.gclid,500),fbclid:valueOf(body.fbclid,500),gbraid:valueOf(body.gbraid,500),
   wbraid:valueOf(body.wbraid,500),msclkid:valueOf(body.msclkid,500),dclid:valueOf(body.dclid,500),
   dispositivo:valueOf(body.dispositivo,30)||'desktop',sessionId:valueOf(body.sessionId,120)||'unknown',
   timestamp:Number.isFinite(Number(body.timestamp))?Number(body.timestamp):Date.now(),userAgent:valueOf(body.userAgent,500)
  };
  const data={
   nome:payload.nome,email:payload.email,whatsapp:payload.whatsapp,telefone:payload.whatsapp,mensagem:payload.mensagem,
   curso:payload.curso,procedimento:payload.procedimento,origem:payload.origem,fonte:payload.fonte,
   newsletter:payload.newsletter,receberDicas:payload.receberDicas==='sim'||payload.newsletter===true,
   contatoWhatsapp:payload.contatoWhatsapp,consentimento:true
  };
  const crm=await fetch(CRM_BASE+'/api/public/forms/'+CRM_FORM_KEY+'/submissions',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({data,sourceUrl:String(payload.urlOrigem||PARENT_ORIGIN),referrerUrl:String(payload.referrer||''),parentOrigin:PARENT_ORIGIN}),
   signal:AbortSignal.timeout(15000)
  });
  const result=await crm.json().catch(()=>({})) as Record<string,unknown>;
  const notifications=result.notifications&&typeof result.notifications==='object'?result.notifications as Record<string,unknown>:{};
  const crmSynced=crm.ok&&result.ok!==false&&result.success!==false;
  if(!crmSynced)return Response.json({success:false,error:'Não foi possível registrar sua solicitação no CRM. Tente novamente.'},{status:503});
  let stored=false;
  try{stored=await insertMirror(env,payload);}catch{stored=false;}
  return Response.json({success:true,stored,crmSynced:true,submissionId:String(result.submissionId||''),emailSent:notifications.email==='sent',telegramSent:notifications.telegram==='sent',notifications});
 }catch{return Response.json({success:false,error:'Não foi possível processar sua solicitação.'},{status:500});}
}
