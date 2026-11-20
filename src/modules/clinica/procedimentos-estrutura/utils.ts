// Setor Clínica › Procedimentos e Estrutura
import { type SterilizationRec } from "./tipos";

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) { return aStart < bEnd && bStart < aEnd; }

export function effSterilizationStatus(s: SterilizationRec, today: string): string { if (s.status === "Reprocessar") return "Reprocessar"; if (s.expiry && s.expiry < today) return "Vencido"; return s.status; }
