// Setor Laboratório › Qualidade e Rastreabilidade
import { type QCControl, type ReagentLot } from "./tipos";

export const SEED_LOTS: ReagentLot[] = [
  { id: "lot-gli", reagent: "Glicemia", lot: "GLI-2026-084", expiry: "2026-09-30", stock: 42, unit: "testes", status: "Em uso", equipment: "Analisador L-01" },
  { id: "lot-hba", reagent: "Hemoglobina glicada", lot: "HBA-2026-041", expiry: "2026-12-15", stock: 18, unit: "testes", status: "Aprovado", equipment: "Analisador L-02" },
  { id: "lot-pcr", reagent: "Proteína C reativa (PCR)", lot: "PCR-2026-019", expiry: "2026-06-30", stock: 0, unit: "testes", status: "Vencido", equipment: "Analisador L-01" },
  { id: "lot-tsh", reagent: "TSH", lot: "TSH-2026-057", expiry: "2027-02-28", stock: 25, unit: "testes", status: "Aprovado", equipment: "Analisador L-02" },
];

export const SEED_CONTROLS: QCControl[] = [
  { id: "ctl-1", date: "2026-11-12", name: "Controle Normal", equipment: "Analisador L-01", reagentLot: "GLI-2026-084", expected: 100, obtained: 98, unit: "mg/dL", status: "Aprovado", note: "Dentro da faixa esperada." },
  { id: "ctl-2", date: "2026-11-12", name: "Controle Alto", equipment: "Analisador L-01", reagentLot: "GLI-2026-084", expected: 280, obtained: 312, unit: "mg/dL", status: "Reprovado", note: "Obtido 11,4% acima do esperado — fora da tolerância de 10%." },
  { id: "ctl-3", date: "2026-11-12", name: "Controle Normal", equipment: "Analisador L-02", reagentLot: "TSH-2026-057", expected: 5.0, obtained: 5.1, unit: "µUI/mL", status: "Aprovado", note: "Dentro da faixa esperada." },
];

export const TRACE_BY_LOT: Record<string, { patient: string; exam: string; date: string; equipment: string }[]> = {
  "GLI-2026-084": [{ patient: "Maria Aparecida Silva", exam: "Glicemia em jejum", date: "12/11/2026", equipment: "Analisador L-01" }, { patient: "Rosa Maria Ferreira", exam: "Glicemia em jejum", date: "12/11/2026", equipment: "Analisador L-01" }],
  "HBA-2026-041": [{ patient: "Fernanda Lima Almeida", exam: "Hemoglobina glicada", date: "10/11/2026", equipment: "Analisador L-02" }],
  "TSH-2026-057": [{ patient: "Ana Beatriz Costa", exam: "TSH", date: "09/11/2026", equipment: "Analisador L-02" }],
  "CRE-2026-038": [{ patient: "Rosa Maria Ferreira", exam: "Creatinina", date: "12/11/2026", equipment: "Analisador L-01" }],
};
