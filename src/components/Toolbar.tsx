'use client';

import React from 'react';
import { toast } from 'sonner';
import { DadosCurriculo } from '@/types';

interface ToolbarProps {
  slug: string;
  onSave: () => void;
  isSaving: boolean;
  dados: DadosCurriculo;
}

export const Toolbar = ({ slug, onSave, isSaving, dados }: ToolbarProps) => {

  const handleCopyLink = () => {
    if (!slug) {
      toast.error("Crie um Link Personalizado antes de compartilhar!");
      return;
    }
    
    const url = `${window.location.origin}/u/${slug}`;
    
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copiado para a área de transferência!");
    });
  };

  const handleDownloadBackup = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(dados, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `backup-curriculo-${dados.nome || 'sem-nome'}.json`;
    link.click();
    toast.success("Backup baixado com sucesso!");
  };

  return (
    <div className="flex gap-1">
      <button 
        onClick={handleDownloadBackup}
        className="text-slate-500 hover:text-slate-700 hover:bg-slate-200 text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-1.5"
        title="Baixar dados em JSON"
      >
        📥 <span className="hidden sm:inline">Backup</span>
      </button>

      <button 
        onClick={handleCopyLink}
        className="text-slate-500 hover:text-slate-700 hover:bg-slate-200 text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-1.5"
      >
        🔗 <span className="hidden sm:inline">Copiar Link</span>
      </button>

      <button 
        onClick={onSave}
        disabled={isSaving}
        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs px-4 py-2 rounded-lg transition-all font-semibold shadow-md shadow-emerald-500/30 flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
      >
        {isSaving ? (
          <>
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Salvando...</span>
          </>
        ) : (
          <>💾 Salvar</>
        )}
      </button>
    </div>
  );
};
