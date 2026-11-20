// Setor Laboratório › Inteligência e Modo IA
import { GESTOR_KEYWORDS, LAB_INTEL_KEYWORDS } from "./dados";
import { type GestorSug } from "./tipos";

export function gestorScore(item: GestorSug, tokens: string[]) {
  const kws = GESTOR_KEYWORDS[item.id] || []; let score = 0;
  for (const token of tokens) for (const kw of kws) { let common = 0; while (common < Math.min(token.length, kw.length) && token[common] === kw[common]) common += 1; if (token === kw) score += 3; else if (common >= 4) score += 2; else if (token.includes(kw) || kw.includes(token)) score += 1; }
  return score;
}

export function labIntelScore(item: { id: string }, tokens: string[]) {
  const keywords = LAB_INTEL_KEYWORDS[item.id] || [];
  let score = 0;
  for (const token of tokens) {
    for (const kw of keywords) {
      let common = 0;
      while (common < Math.min(token.length, kw.length) && token[common] === kw[common]) common += 1;
      if (token === kw) score += 3;
      else if (common >= 4) score += 2;
      else if (token.includes(kw) || kw.includes(token)) score += 1;
    }
  }
  return score;
}
