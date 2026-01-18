'use client';

import dynamic from "next/dynamic";
import { CurriculoPDF } from '@/components/CurriculoPDF';
import { DadosCurriculo } from '@/types';

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-slate-500">Gerando visualização...</div> }
);

interface Props {
  dados: DadosCurriculo;
}

export default function PublicPDFViewer({ dados }: Props) {
  return (
    <PDFViewer width="100%" height="100%">
      <CurriculoPDF dados={dados} />
    </PDFViewer>
  );
}
