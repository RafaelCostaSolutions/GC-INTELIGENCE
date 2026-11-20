// Setor Clínica › Finanças da Clínica
export type GlosaItem = { id: string; convenio: string; descricao: string; motivo: "Documentação" | "Autorização" | "Código"; valor: number; data: string; status: "Glosada" | "Em recurso" };

export type PacoteItem = { id: string; nome: string; paciente: string; total: number; pago: number; parcelas: number; parcelasPagas: number; status: "Em dia" | "Atrasado" | "Quitado" };

export type ContaItem = { id: string; paciente: string; descricao: string; vencimento: string; valor: number; status: "A vencer" | "Vencida" | "Paga"; diasVencida?: number };
