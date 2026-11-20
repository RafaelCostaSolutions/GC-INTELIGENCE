// Setor Laboratório › Qualidade e Rastreabilidade
export type LotStatus = "Aprovado" | "Em uso" | "Vencido" | "Bloqueado";

export type ReagentLot = { id: string; reagent: string; lot: string; expiry: string; stock: number; unit: string; status: LotStatus; equipment: string; recordId?: string };

export type QCStatus = "Aprovado" | "Reprovado";

export type QCControl = { id: string; date: string; name: string; equipment: string; reagentLot: string; expected: number; obtained: number; unit: string; status: QCStatus; note: string; recordId?: string };

export type CorrectiveAction = { id: string; controlId: string; reagentLot: string; equipment: string; actionType: string; description: string; responsible: string; date: string; recordId?: string };

export type QCBlock = { id: string; controlId: string; equipment: string; reagentLot: string; active: boolean; createdAt: string };
