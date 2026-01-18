// src/types/index.ts

export interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  periodo: string;
  descricao: string;
}

export interface Formacao {
  id: string;
  instituicao: string;
  curso: string;
  ano: string;
}

export interface DadosCurriculo {
  // Dados Pessoais
  nome: string;
  cargo: string;
  resumo: string;

  // Contato
  email: string;
  telefone: string;
  linkedin: string;

  // Configurações
  slug: string;
  corPrincipal: string;
  habilidades: string;
  fotoUrl: string;

  // Listas
  experiencias: Experiencia[];
  formacao: Formacao[];
}

export const estadoInicial: DadosCurriculo = {
  nome: "",
  cargo: "",
  resumo: "",
  email: "",
  telefone: "",
  linkedin: "",
  slug: "",
  corPrincipal: "#2c3e50",
  habilidades: "",
  fotoUrl: "",
  experiencias: [
    { id: "1", empresa: "", cargo: "", periodo: "", descricao: "" },
  ],
  formacao: [{ id: "1", instituicao: "", curso: "", ano: "" }],
};
