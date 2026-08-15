import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/cursos(.*)',
  '/blog(.*)',
  '/obrigado(.*)',
  '/termos-de-uso',
  '/politica-de-privacidade',
  '/politica-de-reembolso',
  '/lgpd',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/blog(.*)',
  '/api/webhook',
  '/api/leads',
  '/sitemap.xml',
  '/robots.txt',
  '/favicon.ico',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};