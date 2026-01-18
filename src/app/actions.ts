'use server';

import { prisma } from '@/lib/prisma';
import { DadosCurriculo } from '@/types';
import { auth } from '@clerk/nextjs/server';

// Função auxiliar para obter userId (Clerk ou fallback local)
async function getUserId(): Promise<string> {
  try {
    const { userId } = await auth();
    return userId || 'local-user';
  } catch {
    return 'local-user';
  }
}

export async function salvarCurriculo(dados: DadosCurriculo) {
  const userId = await getUserId();
  const dadosString = JSON.stringify(dados);

  // Procura currículo existente do usuário
  const existe = await prisma.curriculo.findUnique({
    where: { userId }
  });

  if (existe) {
    // Atualiza
    await prisma.curriculo.update({
      where: { id: existe.id },
      data: { 
        conteudo: dadosString,
        slug: dados.slug || existe.slug,
        corPrincipal: dados.corPrincipal,
        fotoUrl: dados.fotoUrl || null,
      },
    });
    return { success: true, message: "Currículo atualizado!" };
  } else {
    // Cria novo
    await prisma.curriculo.create({
      data: { 
        userId, 
        conteudo: dadosString,
        slug: dados.slug || undefined,
        corPrincipal: dados.corPrincipal,
        fotoUrl: dados.fotoUrl || null,
      },
    });
    return { success: true, message: "Currículo criado!" };
  }
}

export async function carregarCurriculo(): Promise<DadosCurriculo | null> {
  const userId = await getUserId();
  
  const item = await prisma.curriculo.findUnique({
    where: { userId }
  });
  
  if (item && item.conteudo) {
    return JSON.parse(item.conteudo) as DadosCurriculo;
  }
  return null;
}

export async function buscarCurriculoPorSlug(slug: string) {
  const curriculo = await prisma.curriculo.findUnique({
    where: { slug }
  });

  if (curriculo && curriculo.conteudo) {
    return {
      dados: JSON.parse(curriculo.conteudo) as DadosCurriculo,
      corPrincipal: curriculo.corPrincipal,
      fotoUrl: curriculo.fotoUrl,
    };
  }
  return null;
}
