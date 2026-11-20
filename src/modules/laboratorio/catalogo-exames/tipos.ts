// Setor Laboratório › Cadastro e Catálogo de Exames
export type SupportLab = { id: string; name: string; cnpj: string; contact: string; prazo: string; areas: string[]; cost: number; recordId?: string };

export type ExamPackage = { id: string; name: string; examIds: string[]; price: number; recordId?: string };
