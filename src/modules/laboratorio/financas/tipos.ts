// Setor Laboratório › Finanças do Laboratório
export type FinExam = { name: string; area: string; qty: number; precoTabela: number; precoMedio: number; reagente: number; pessoal: number; equipamento: number; origem: "Interno" | "Enviado"; apoio?: string };

export type SavedFin = { id: string; kind: string; exam?: string; motivo?: string; acao?: string; custo?: number; at?: string; recordId?: string };
