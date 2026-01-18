import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DadosCurriculo } from '@/types';
import PublicPDFViewer from '@/components/PublicPDFViewer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const curriculo = await prisma.curriculo.findUnique({
    where: { slug }
  });

  if (!curriculo) {
    return { title: 'Currículo não encontrado' };
  }

  const dados = JSON.parse(curriculo.conteudo) as DadosCurriculo;

  return {
    title: `Currículo de ${dados.nome || 'Profissional'}`,
    description: dados.resumo ? dados.resumo.slice(0, 160) + '...' : 'Veja o currículo profissional completo.',
    openGraph: {
      title: `Currículo de ${dados.nome}`,
      description: `Confira a experiência profissional de ${dados.nome}.`,
      type: 'profile',
    },
  };
}

export default async function PublicCurriculoPage({ params }: Props) {
  const { slug } = await params;
  
  const curriculo = await prisma.curriculo.findUnique({
    where: { slug }
  });

  if (!curriculo) {
    return notFound();
  }

  const dados = JSON.parse(curriculo.conteudo) as DadosCurriculo;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6 text-white">
        <h1 className="text-2xl font-bold">{dados.nome ? `Currículo de ${dados.nome}` : 'Currículo Profissional'}</h1>
        <p className="text-slate-400 text-sm">Visualização Pública</p>
      </div>

      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden">
        <PublicPDFViewer dados={dados} />
      </div>
      
      <div className="mt-4">
        <a href="/" className="text-slate-500 hover:text-white text-sm transition-colors">
          Crie seu próprio currículo em <strong>Resume Builder</strong>
        </a>
      </div>
    </div>
  );
}
