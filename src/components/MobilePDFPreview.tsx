'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { BlobProvider } from '@react-pdf/renderer';
import { CurriculoPDF } from './CurriculoPDF';
import { DadosCurriculo } from '@/types';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configuração do worker para processar o PDF
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MobilePDFPreviewProps {
  dados: DadosCurriculo;
}

export function MobilePDFPreview({ dados }: MobilePDFPreviewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [width, setWidth] = useState(350);

  // Ajusta a largura do PDF para caber na tela
  useEffect(() => {
    const handleResize = () => {
      // Pega 95% da largura da tela, máximo 600px
      const newWidth = Math.min(window.innerWidth * 0.95, 600);
      setWidth(newWidth);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-[400px] w-full">
      <BlobProvider document={<CurriculoPDF dados={dados} />}>
        {({ url, loading, error }) => {
          if (loading) {
            return (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-300 text-sm">Gerando visualização...</p>
              </div>
            );
          }
          
          if (error) {
            return (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-4xl mb-4">⚠️</span>
                <p className="text-red-400">Erro ao carregar o PDF</p>
                <p className="text-slate-500 text-sm mt-2">Tente novamente</p>
              </div>
            );
          }
          
          return (
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="flex items-center justify-center py-10">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              }
              className="flex flex-col items-center gap-4"
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page 
                  key={`page_${index + 1}`}
                  pageNumber={index + 1} 
                  width={width}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-2xl rounded-lg overflow-hidden"
                />
              ))}
            </Document>
          );
        }}
      </BlobProvider>
      
      {/* Indicador de páginas */}
      {numPages > 0 && (
        <p className="text-slate-400 text-sm mt-4">
          {numPages} {numPages === 1 ? 'página' : 'páginas'}
        </p>
      )}
    </div>
  );
}
