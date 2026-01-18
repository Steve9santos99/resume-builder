import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Rotas públicas (não requerem autenticação)
const isPublicRoute = createRouteMatcher([
  '/u/(.*)',           // Currículos públicos
  '/sign-in(.*)',      // Página de login
  '/sign-up(.*)',      // Página de cadastro
  '/forgot-password',  // Recuperação de senha
  '/sso-callback',     // Callback OAuth
]);

export default clerkMiddleware(async (auth, req) => {
  // Protege todas as rotas exceto as públicas
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    
    // Se não estiver logado, redireciona para nossa página de login interna
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
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
