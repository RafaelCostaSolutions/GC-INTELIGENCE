// Tipos compartilhados — comuns aos dois setores
export type View = { kind: "home" } | { kind: "results"; query: string } | { kind: "sector"; id: string };

export type AlertItem = { id: string; title: string; sector: string; severity: "Crítico" | "Alto" | "Médio"; time: string; detail: string; equipment: string };

export type SectorStatus = "Ativo" | "Atenção" | "Crítico";

export type AiSuggestion = { title: string; detail: string; sectorId: string };

export type AiAnswer = { diagnosis: string; steps: string[]; impact: string; sectorId: string; sectorName: string };
