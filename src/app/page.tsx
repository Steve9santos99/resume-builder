'use client';

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { CurriculoPDF } from "@/components/CurriculoPDF";
import { Toolbar } from "@/components/Toolbar";
import { DadosCurriculo, estadoInicial } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { toast, Toaster } from 'sonner';
import { salvarCurriculo, carregarCurriculo } from "./actions";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-white">Carregando visualizador...</div> }
);

const CORES_DISPONIVEIS = [
  '#2c3e50', // Azul Clássico
  '#1a1a2e', // Azul Escuro
  '#10b981', // Verde Tech
  '#7c3aed', // Roxo Criativo
  '#c0392b', // Vermelho Forte
  '#f59e0b', // Laranja
];

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [dados, setDados] = useState<DadosCurriculo>(estadoInicial);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dadosCarregados = useRef(false);

  // Debounce para performance do PDF
  const dadosParaPDF = useDebounce(dados, 1000);

  // Carregar do banco de dados (fallback para localStorage)
  useEffect(() => {
    async function loadData() {
      try {
        const dadosDoBanco = await carregarCurriculo();
        if (dadosDoBanco) {
          setDados(dadosDoBanco);
        } else {
          // Fallback para localStorage
          const dadosSalvos = localStorage.getItem('curriculo-dados-v1');
          if (dadosSalvos) {
            setDados(JSON.parse(dadosSalvos));
          }
        }
      } catch (err) {
        console.error("Erro ao carregar do banco", err);
        // Fallback para localStorage
        const dadosSalvos = localStorage.getItem('curriculo-dados-v1');
        if (dadosSalvos) {
          setDados(JSON.parse(dadosSalvos));
        }
      }
      dadosCarregados.current = true;
      setIsClient(true);
    }
    loadData();
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    if (dadosCarregados.current) {
      const timer = setTimeout(() => {
        localStorage.setItem('curriculo-dados-v1', JSON.stringify(dados));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [dados]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
  };

  const updateItem = (lista: 'experiencias' | 'formacao', index: number, campo: string, valor: string) => {
    setDados(prev => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const novaLista = [...prev[lista]] as any[];
      novaLista[index] = { ...novaLista[index], [campo]: valor };
      return { ...prev, [lista]: novaLista };
    });
  };

  const addItem = (lista: 'experiencias' | 'formacao') => {
    const novoItem = lista === 'experiencias' 
      ? { id: Date.now().toString(), empresa: '', cargo: '', periodo: '', descricao: '' }
      : { id: Date.now().toString(), instituicao: '', curso: '', ano: '' };

    setDados(prev => ({ ...prev, [lista]: [...prev[lista], novoItem] }));
  };

  const removeItem = (lista: 'experiencias' | 'formacao', index: number) => {
    setDados(prev => ({ ...prev, [lista]: prev[lista].filter((_, i) => i !== index) }));
  };

  const moverItem = (lista: 'experiencias' | 'formacao', index: number, direcao: 'cima' | 'baixo') => {
    setDados(prev => {
      const novaLista = [...prev[lista]];
      if (direcao === 'cima' && index === 0) return prev;
      if (direcao === 'baixo' && index === novaLista.length - 1) return prev;

      const novoIndex = direcao === 'cima' ? index - 1 : index + 1;
      const temp = novaLista[index];
      novaLista[index] = novaLista[novoIndex];
      novaLista[novoIndex] = temp;

      return { ...prev, [lista]: novaLista };
    });
  };

  const handleSalvarNuvem = async () => {
    setIsSaving(true);
    try {
      // Salvar no banco de dados
      const result = await salvarCurriculo(dados);
      // Salvar também no localStorage como backup
      localStorage.setItem('curriculo-dados-v1', JSON.stringify(dados));
      toast.success(result.message || "Currículo salvo com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar. Tente novamente.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setDados(prev => ({ ...prev, fotoUrl: reader.result as string }));
        toast.success("Foto carregada com sucesso!");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao carregar foto.");
      setIsUploading(false);
    }
  };

  const handleImportarBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.experiencias) {
          setDados(json);
          toast.success("Backup restaurado com sucesso!");
        } else {
          toast.error("Arquivo inválido.");
        }
      } catch {
        toast.error("Erro ao ler o arquivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  const limparTudo = () => {
    if (confirm("Tem certeza? Isso apagará todos os dados.")) {
      setDados(estadoInicial);
      localStorage.removeItem('curriculo-dados-v1');
      toast.success("Dados limpos!");
    }
  };

  if (!isClient) return null;

  return (
    <main className="flex flex-col h-screen bg-slate-50">
      <Toaster position="top-right" richColors />
      
      {/* HEADER MODERNIZADO */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-purple-500/25">CV</div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Resume Builder</h1>
            <span className="text-xs text-slate-400">Gerador de Currículos Profissionais</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Botões de ação agrupados */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            <Toolbar 
              slug={dados.slug || ''} 
              onSave={handleSalvarNuvem} 
              isSaving={isSaving} 
              dados={dados} 
            />
          </div>
          
          {/* Limpar - link de texto */}
          <button onClick={limparTudo} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
            Limpar
          </button>
          
          {/* Usuário */}
          <div className="pl-3 border-l border-slate-200">
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-purple-100"
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md shadow-purple-500/25 hover:shadow-lg hover:-translate-y-0.5">
                  Entrar
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* FORMULÁRIO - SIDEBAR MODERNIZADA */}
        <div className="w-full md:w-[420px] bg-white border-r border-slate-200 overflow-y-auto sidebar" style={{ padding: '24px 28px 80px' }}>
          
          {/* FOTO */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative w-28 h-28 mb-3">
              {dados.fotoUrl ? (
                <img src={dados.fotoUrl} alt="Perfil" className="w-full h-full rounded-2xl object-cover border-4 border-white shadow-lg" />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 border-4 border-white shadow-lg text-3xl">
                  📷
                </div>
              )}
              <label className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-2 rounded-xl cursor-pointer hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition-all hover:scale-105">
                <span className="text-sm">✏️</span>
                <input type="file" accept="image/*" onChange={handleFotoUpload} className="hidden" disabled={isUploading} />
              </label>
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium">Foto de Perfil</p>
          </div>

          {/* PERSONALIZAÇÃO - Card especial */}
          <div className="card-personalizacao mb-6">
            <h2 className="text-xs uppercase tracking-wider text-purple-700 font-bold mb-4 flex items-center gap-2">
              <span>🎨</span> Personalização
            </h2>
            
            {/* Cores */}
            <div className="mb-4">
              <label className="input-label">Cor do Tema</label>
              <div className="flex gap-3 flex-wrap">
                {CORES_DISPONIVEIS.map((cor) => (
                  <button
                    key={cor}
                    onClick={() => setDados(prev => ({ ...prev, corPrincipal: cor }))}
                    className={`w-9 h-9 rounded-xl border-2 transition-all hover:scale-110 shadow-sm ${
                      dados.corPrincipal === cor ? 'border-slate-800 scale-110 shadow-md ring-2 ring-offset-2 ring-slate-300' : 'border-white opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: cor }}
                    title={cor}
                  />
                ))}
              </div>
            </div>
            
            {/* Link */}
            <div>
              <label className="input-label">Link Público</label>
              <div className="flex items-center bg-white rounded-xl border border-purple-200 px-4 py-3">
                <span className="text-purple-400 text-sm font-medium">/u/</span>
                <input 
                  name="slug" 
                  value={dados.slug} 
                  onChange={handleChange} 
                  placeholder="seu-nome" 
                  className="flex-1 bg-transparent outline-none text-purple-700 font-medium ml-1 placeholder:text-purple-300"
                />
              </div>
            </div>
          </div>

          {/* DADOS PESSOAIS */}
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-3">Sobre Você</h2>
            <div className="grid gap-3">
              <input name="nome" placeholder="Nome Completo" value={dados.nome} onChange={handleChange} className="input-field" />
              <input name="cargo" placeholder="Cargo Desejado (ex: Desenvolvedor Full Stack)" value={dados.cargo} onChange={handleChange} className="input-field" />
              <textarea name="resumo" placeholder="Resumo Profissional..." value={dados.resumo} onChange={handleChange} rows={4} className="input-field" />
            </div>
          </div>

          {/* CONTATO */}
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-3">Contato & Skills</h2>
            <div className="grid gap-3">
              <input name="email" placeholder="E-mail" value={dados.email} onChange={handleChange} className="input-field" />
              <input name="telefone" placeholder="Telefone" value={dados.telefone} onChange={handleChange} className="input-field" />
              <input name="linkedin" placeholder="LinkedIn" value={dados.linkedin} onChange={handleChange} className="input-field" />
              <div className="pt-2">
                <label className="text-xs text-slate-400 block mb-1">Habilidades (separe por vírgula):</label>
                <textarea name="habilidades" placeholder="Ex: React, Node.js, Python..." value={dados.habilidades} onChange={handleChange} className="input-field" rows={2} />
              </div>
            </div>
          </div>

          {/* EXPERIÊNCIAS */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
              <h2 className="text-sm uppercase tracking-wide text-slate-500 font-bold">Experiência</h2>
              <button onClick={() => addItem('experiencias')} className="btn-add">+ Adicionar</button>
            </div>
            {dados.experiencias.map((exp, index) => (
              <div key={exp.id} className="card-item">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                  <div className="flex gap-2">
                    <button onClick={() => moverItem('experiencias', index, 'cima')} disabled={index === 0} className="text-slate-400 hover:text-blue-600 disabled:opacity-30">⬆️</button>
                    <button onClick={() => moverItem('experiencias', index, 'baixo')} disabled={index === dados.experiencias.length - 1} className="text-slate-400 hover:text-blue-600 disabled:opacity-30">⬇️</button>
                    <button onClick={() => removeItem('experiencias', index)} className="text-red-400 text-xs hover:text-red-600">🗑️</button>
                  </div>
                </div>
                <input placeholder="Empresa" value={exp.empresa} onChange={(e) => updateItem('experiencias', index, 'empresa', e.target.value)} className="input-field mb-2" />
                <div className="flex gap-2 mb-2">
                  <input placeholder="Cargo" value={exp.cargo} onChange={(e) => updateItem('experiencias', index, 'cargo', e.target.value)} className="input-field w-1/2" />
                  <input placeholder="Período" value={exp.periodo} onChange={(e) => updateItem('experiencias', index, 'periodo', e.target.value)} className="input-field w-1/2" />
                </div>
                <textarea placeholder="Atividades..." value={exp.descricao} onChange={(e) => updateItem('experiencias', index, 'descricao', e.target.value)} rows={3} className="input-field" />
              </div>
            ))}
          </div>

          {/* FORMAÇÃO */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
              <h2 className="text-sm uppercase tracking-wide text-slate-500 font-bold">Educação</h2>
              <button onClick={() => addItem('formacao')} className="btn-add">+ Adicionar</button>
            </div>
            {dados.formacao.map((form, index) => (
              <div key={form.id} className="card-item">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                  <div className="flex gap-2">
                    <button onClick={() => moverItem('formacao', index, 'cima')} disabled={index === 0} className="text-slate-400 hover:text-blue-600 disabled:opacity-30">⬆️</button>
                    <button onClick={() => moverItem('formacao', index, 'baixo')} disabled={index === dados.formacao.length - 1} className="text-slate-400 hover:text-blue-600 disabled:opacity-30">⬇️</button>
                    <button onClick={() => removeItem('formacao', index)} className="text-red-400 text-xs hover:text-red-600">🗑️</button>
                  </div>
                </div>
                <input placeholder="Instituição" value={form.instituicao} onChange={(e) => updateItem('formacao', index, 'instituicao', e.target.value)} className="input-field mb-2" />
                <div className="flex gap-2">
                  <input placeholder="Curso" value={form.curso} onChange={(e) => updateItem('formacao', index, 'curso', e.target.value)} className="input-field w-2/3" />
                  <input placeholder="Ano" value={form.ano} onChange={(e) => updateItem('formacao', index, 'ano', e.target.value)} className="input-field w-1/3" />
                </div>
              </div>
            ))}
          </div>

          {/* IMPORTAR BACKUP */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Restaurar Backup</h3>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 p-2 rounded text-slate-600 text-sm transition-colors border border-slate-300 border-dashed">
              <span>📂 Carregar Backup (JSON)</span>
              <input type="file" accept=".json" onChange={handleImportarBackup} className="hidden" />
            </label>
            <p className="text-[10px] text-slate-400 mt-1">Isso substituirá os dados atuais.</p>
          </div>

        </div>

        {/* PREVIEW PDF - ÁREA MODERNIZADA */}
        <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 flex justify-center items-center p-6 relative">
          {dados !== dadosParaPDF && (
            <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs px-4 py-2 rounded-lg shadow-lg shadow-purple-500/30 animate-pulse z-10 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Atualizando...
            </div>
          )}
          <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl shadow-slate-400/30 border border-white">
            <PDFViewer width="100%" height="100%">
              <CurriculoPDF dados={dadosParaPDF} />
            </PDFViewer>
          </div>
        </div>

      </div>
    </main>
  );
}
