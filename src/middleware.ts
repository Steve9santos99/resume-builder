import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Rotas públicas (não requerem autenticação)
const isPublicRoute = createRouteMatcher([
  '/u/(.*)',       // Currículos públicos
  '/sign-in(.*)',  // Página de login
  '/sign-up(.*)',  // Página de cadastro
]);

export default clerkMiddleware(async (auth, req) => {
  // Protege todas as rotas exceto as públicas
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Ignora arquivos estáticos e internos do Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Sempre executa para rotas de API
    '/(api|trpc)(.*)',
  ],
};
