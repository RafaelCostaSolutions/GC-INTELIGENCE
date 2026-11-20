// Setor Clínica › Equipe e Produtividade
export type Vinculo = "CLT" | "PJ" | "Cooperado" | "Autônomo";

export type ModeloRepasse = "Fixo" | "% sobre produção" | "Por consulta";

export type Profissional = { id: string; recordId?: string; name: string; specialty: string; council: string; vinculo: Vinculo; phone: string; email: string; valorHora: number; pctRepasse: number; ativo: boolean; modelo: ModeloRepasse; valorRepasse: number; producaoBruta: number; consultas: number; procedimentos: number; retornos: number; teleconsultas: number; tempoMedio: number; horasContratadas: number; horasTrabalhadas: number; satisfacao: number; avaliacoes: number; comentarios: string[] };

export type EscalaItem = { id: string; recordId?: string; profissionalId: string; dia: string; inicio: string; fim: string; sala: string };

export type MetaItem = { id: string; recordId?: string; tipo: "Profissional" | "Especialidade"; alvo: string; metaMensal: number };

export type RepasseStatus = { profissionalId: string; status: "Pendente" | "Pago"; recordId?: string };
