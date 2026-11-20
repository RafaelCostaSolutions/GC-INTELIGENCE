// Setor Clínica › Equipe e Produtividade
import { type Profissional } from "./tipos";

export function stars(v: number) { const full = Math.round(v); return "★".repeat(full) + "☆".repeat(5 - full); }

export function overlap(a1: string, a2: string, b1: string, b2: string) { return a1 < b2 && b1 < a2; }

export function calcRepasse(p: Profissional) { if (p.modelo === "% sobre produção") return p.producaoBruta * (p.valorRepasse / 100); if (p.modelo === "Por consulta") return p.consultas * p.valorRepasse; return p.valorRepasse; }
