// Setor Laboratório › Controle de Insumos e Reagentes
import { type LabLote, type LabMov, type LabReagente } from "./tipos";

export const INSUMO_LOCAIS = ["Geladeira 1", "Geladeira 2", "Freezer", "Almoxarifado"];

export const INSUMO_BANCADAS = ["Bancada Bioquímica", "Bancada Hematologia", "Bancada Hormonal", "Bancada Imunologia"];

export const INSUMO_EQUIPS = ["Analisador L-01", "Analisador L-02", "Centrífuga C-05", "Autoclave A-03", "Microscópio M-01"];

export const INSUMO_EXAMES = [
  { exame: "Glicemia em jejum", reagenteId: "rg-glicemia", realizados: 1240, teorico: 1.1, equipamento: "Analisador L-01", bancada: "Bancada Bioquímica" },
  { exame: "Hemoglobina glicada", reagenteId: "rg-hba1c", realizados: 486, teorico: 1.2, equipamento: "Analisador L-01", bancada: "Bancada Bioquímica" },
  { exame: "Hemograma completo", reagenteId: "rg-hemograma", realizados: 1180, teorico: 1.0, equipamento: "Analisador L-02", bancada: "Bancada Hematologia" },
  { exame: "Colesterol total e frações", reagenteId: "rg-colesterol", realizados: 742, teorico: 1.3, equipamento: "Analisador L-01", bancada: "Bancada Bioquímica" },
  { exame: "TSH", reagenteId: "rg-tsh", realizados: 512, teorico: 1.0, equipamento: "Analisador L-02", bancada: "Bancada Hormonal" },
  { exame: "Proteína C reativa (PCR)", reagenteId: "rg-pcr", realizados: 386, teorico: 1.0, equipamento: "Analisador L-01", bancada: "Bancada Imunologia" },
];

export const SEED_REAGENTES: LabReagente[] = [
  { id: "rg-glicemia", nome: "Reagente Glicose Oxidase", fabricante: "BioLab", area: "Bioquímica", unidade: "mL", custoUnit: 1.85, estoqueMin: 120, pontoReposicao: 180, condicao: "2–8°C", teoricoPorExame: 1.1 },
  { id: "rg-hba1c", nome: "Reagente Hemoglobina Glicada", fabricante: "BioLab", area: "Bioquímica", unidade: "teste", custoUnit: 6.40, estoqueMin: 80, pontoReposicao: 140, condicao: "2–8°C", teoricoPorExame: 1.2 },
  { id: "rg-hemograma", nome: "Reagente Hemograma / Diluente", fabricante: "HemaSys", area: "Hematologia", unidade: "mL", custoUnit: 0.95, estoqueMin: 150, pontoReposicao: 220, condicao: "Ambiente (15–25°C)", teoricoPorExame: 1.0 },
  { id: "rg-colesterol", nome: "Reagente Colesterol Enzimático", fabricante: "BioLab", area: "Bioquímica", unidade: "mL", custoUnit: 2.10, estoqueMin: 100, pontoReposicao: 160, condicao: "2–8°C", teoricoPorExame: 1.3 },
  { id: "rg-tsh", nome: "Reagente TSH Quimioluminescência", fabricante: "ImunoTech", area: "Hormonal", unidade: "teste", custoUnit: 8.90, estoqueMin: 60, pontoReposicao: 100, condicao: "-20°C", teoricoPorExame: 1.0 },
  { id: "rg-pcr", nome: "Reagente Proteína C Reativa", fabricante: "ImunoTech", area: "Imunologia", unidade: "teste", custoUnit: 5.20, estoqueMin: 50, pontoReposicao: 90, condicao: "2–8°C", teoricoPorExame: 1.0 },
];

export const SEED_LOTES: LabLote[] = [
  { id: "lt-1", reagenteId: "rg-glicemia", codigo: "GLI-2401", validade: "2026-12-20", qty: 420, qtyInicial: 800, fornecedor: "BioLab Distribuidora", notaFiscal: "NF 4821", local: "Geladeira 1", condicaoRecebida: "2–8°C", bloqueado: false, motivoBloqueio: "" },
  { id: "lt-2", reagenteId: "rg-glicemia", codigo: "GLI-2402", validade: "2026-06-28", qty: 96, qtyInicial: 400, fornecedor: "BioLab Distribuidora", notaFiscal: "NF 4910", local: "Geladeira 1", condicaoRecebida: "2–8°C", bloqueado: false, motivoBloqueio: "" },
  { id: "lt-3", reagenteId: "rg-hemograma", codigo: "HEM-118", validade: "2026-11-15", qty: 640, qtyInicial: 900, fornecedor: "HemaSys", notaFiscal: "NF 3302", local: "Almoxarifado", condicaoRecebida: "Ambiente (15–25°C)", bloqueado: false, motivoBloqueio: "" },
  { id: "lt-4", reagenteId: "rg-hba1c", codigo: "A1C-077", validade: "2026-07-08", qty: 118, qtyInicial: 300, fornecedor: "BioLab Distribuidora", notaFiscal: "NF 5001", local: "Geladeira 2", condicaoRecebida: "2–8°C", bloqueado: false, motivoBloqueio: "" },
  { id: "lt-5", reagenteId: "rg-tsh", codigo: "TSH-055", validade: "2027-01-30", qty: 74, qtyInicial: 200, fornecedor: "ImunoTech", notaFiscal: "NF 2214", local: "Freezer", condicaoRecebida: "-20°C", bloqueado: false, motivoBloqueio: "" },
  { id: "lt-6", reagenteId: "rg-pcr", codigo: "PCR-039", validade: "2026-09-10", qty: 62, qtyInicial: 180, fornecedor: "ImunoTech", notaFiscal: "NF 2219", local: "Geladeira 1", condicaoRecebida: "2–8°C", bloqueado: true, motivoBloqueio: "Recall do fabricante — lote recolhido" },
  { id: "lt-7", reagenteId: "rg-colesterol", codigo: "COL-210", validade: "2026-10-05", qty: 0, qtyInicial: 300, fornecedor: "BioLab Distribuidora", notaFiscal: "NF 4880", local: "Geladeira 1", condicaoRecebida: "2–8°C", bloqueado: false, motivoBloqueio: "" },
];

export const SEED_MOVS: LabMov[] = [
  { id: "mv-1", tipo: "saida", reagenteId: "rg-glicemia", loteId: "lt-1", qty: 132, data: "12/06/2026", exame: "Glicemia em jejum", equipamento: "Analisador L-01", bancada: "Bancada Bioquímica", pacienteId: "p1", pacienteNome: "Maria Aparecida Silva", responsavel: "Téc. Juliana — Coleta", motivo: "Consumo em exame", valor: 244.20 },
  { id: "mv-2", tipo: "saida", reagenteId: "rg-hemograma", loteId: "lt-3", qty: 118, data: "12/06/2026", exame: "Hemograma completo", equipamento: "Analisador L-02", bancada: "Bancada Hematologia", pacienteId: "p5", pacienteNome: "Fernanda Lima Almeida", responsavel: "Téc. Marcos — Coleta", motivo: "Consumo em exame", valor: 112.10 },
  { id: "mv-3", tipo: "saida", reagenteId: "rg-hba1c", loteId: "lt-4", qty: 48, data: "11/06/2026", exame: "Hemoglobina glicada", equipamento: "Analisador L-01", bancada: "Bancada Bioquímica", pacienteId: "p1", pacienteNome: "Maria Aparecida Silva", responsavel: "Téc. Juliana — Coleta", motivo: "Consumo em exame", valor: 307.20 },
  { id: "mv-4", tipo: "saida", reagenteId: "rg-colesterol", loteId: "lt-7", qty: 96, data: "10/06/2026", exame: "Colesterol total e frações", equipamento: "Analisador L-01", bancada: "Bancada Bioquímica", pacienteId: "p4", pacienteNome: "Carlos Eduardo Oliveira", responsavel: "Téc. Juliana — Coleta", motivo: "Consumo em exame", valor: 201.60 },
  { id: "mv-5", tipo: "perda", reagenteId: "rg-glicemia", loteId: "lt-2", qty: 18, data: "09/06/2026", exame: "—", equipamento: "—", bancada: "Bancada Bioquímica", pacienteId: "", pacienteNome: "—", responsavel: "Téc. Marcos — Coleta", motivo: "Quebra", valor: 33.30 },
];
