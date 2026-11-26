export async function onRequestGet({request,next}:{request:Request;next:(request?:Request)=>Promise<Response>}){
 const url=new URL(request.url);
 if(url.pathname.replace(/\/+$/,'')==='/blog/post')return next();
 const target=new URL('/blog/post/',url.origin);
 const rewritten=new Request(target,request);
 return next(rewritten);
}
