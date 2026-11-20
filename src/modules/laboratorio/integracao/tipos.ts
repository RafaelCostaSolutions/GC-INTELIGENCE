// Setor Laboratório › Integração com Outros Módulos
export type LabTicket = { id: string; equipment: string; type: string; description: string; priority: string; status: string; createdAt: string };

export type BedsideRec = { id: string; patientName: string; unit: string; bed: string; exam: string; result: string; createdAt: string };

export type DelayRec = { id: string; patientName: string; exam: string; unit: string; bed: string; delayH: number; impact: string; prioritized?: boolean };

export type ReagentOut = { id: string; reagent: string; exam: string; qty: number; unitCost: number; total: number; createdAt: string };
