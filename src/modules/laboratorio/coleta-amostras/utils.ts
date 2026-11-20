// Setor Laboratório › Coleta e Amostras
import { type SampleRec } from "./tipos";

export function timeSince(iso: string) { const ms = Date.now() - new Date(iso).getTime(); if (ms < 0) return "agora"; const h = Math.floor(ms / 3600000); if (h < 1) return `${Math.max(0, Math.floor(ms / 60000))} min`; if (h < 24) return `${h} h`; const d = Math.floor(h / 24); return d === 1 ? "1 dia" : `${d} dias`; }

export function disposeEligibleAt(s: SampleRec) { if (!s.resultAt) return null; return new Date(new Date(s.resultAt).getTime() + 48 * 3600000); }
