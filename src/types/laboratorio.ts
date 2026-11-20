// Tipos compartilhados — setor Laboratório
export type RefRange = { id: string; faixa: string; min: string; max: string; unit: string; critMin: string; critMax: string };

export type CatalogExam = { id: string; code: string; name: string; area: string; methodology: string; prazo: string; sample: string; price: number; active: boolean; origin: "Interno" | "Enviado"; supportLabId?: string; sendCost?: number; sendPrazo?: string; prep: string; references: RefRange[]; prices: Record<string, number>; recordId?: string };
