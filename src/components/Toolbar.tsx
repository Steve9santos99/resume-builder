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
    <div className="flex gap-2">
      <button 
        onClick={handleDownloadBackup}
        className="text-slate-300 hover:text-white text-xs px-3 py-2 border border-slate-600 rounded transition-colors"
        title="Baixar dados em JSON"
      >
        📥 Backup
      </button>

      <button 
        onClick={handleCopyLink}
        className="text-slate-300 hover:text-white text-xs px-3 py-2 border border-slate-600 rounded transition-colors flex items-center gap-1"
      >
        🔗 Copiar Link
      </button>

      <button 
        onClick={onSave}
        disabled={isSaving}
        className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-xs px-4 py-2 rounded transition-colors font-bold shadow-lg flex items-center gap-2"
      >
        {isSaving ? (
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : "💾 Salvar"}
      </button>
    </div>
  );
};
