// Setor Clínica › Finanças da Clínica
import { type ContaItem, type GlosaItem, type PacoteItem } from "./tipos";

export const FIN_RECEITA_ESPECIALIDADE = [{ nome: "Clínica Geral", receita: 182400, custo: 52200 }, { nome: "Cardiologia", receita: 148600, custo: 43800 }, { nome: "Pediatria", receita: 96400, custo: 31200 }, { nome: "Ginecologia", receita: 78200, custo: 26800 }, { nome: "Ortopedia", receita: 118500, custo: 32400 }, { nome: "Dermatologia", receita: 64200, custo: 11600 }];

export const FIN_RECEITA_PROFISSIONAL = [{ nome: "Dra. Ana Paula — Clínica Geral", receita: 198400, custo: 51200 }, { nome: "Dr. Roberto — Cardiologia", receita: 132800, custo: 40200 }, { nome: "Dra. Camila — Pediatria", receita: 96400, custo: 31200 }, { nome: "Dr. Thiago — Ortopedia", receita: 118500, custo: 34200 }, { nome: "Dra. Juliana — Obstetrícia", receita: 78200, custo: 25800 }, { nome: "Dr. Felipe — Clínica Geral", receita: 64000, custo: 15400 }];

export const FIN_RECEITA_PROCEDIMENTO = [{ nome: "Consulta", receita: 412800, custo: 118000 }, { nome: "Infiltração", receita: 48600, custo: 18200 }, { nome: "Ultrassom", receita: 42800, custo: 12400 }, { nome: "Coleta / Biópsia de pele", receita: 42500, custo: 19800 }, { nome: "Imobilização", receita: 31200, custo: 11800 }, { nome: "Eletrocardiograma", receita: 28400, custo: 7200 }, { nome: "Sutura", receita: 22600, custo: 9800 }, { nome: "Curativo", receita: 18400, custo: 9200 }, { nome: "Cauterização", receita: 19800, custo: 9400 }, { nome: "Troca de sonda", receita: 12800, custo: 9400 }, { nome: "Retirada de pontos", receita: 8400, custo: 6200 }, { nome: "Drenagem de abscesso", receita: 7200, custo: 4800 }];

export const FIN_PAGADOR = [{ nome: "Particular", valor: 206490, cor: "#0F5F5C" }, { nome: "Convênio", valor: 412980, cor: "#2C8D84" }, { nome: "SUS", valor: 68830, cor: "#E4A11B" }];

export const FIN_CUSTO_DETALHE = [{ nome: "Pessoal", valor: 118800, pct: 60 }, { nome: "Estrutura", valor: 35640, pct: 18 }, { nome: "Insumos", valor: 25740, pct: 13 }, { nome: "Equipamentos", valor: 17820, pct: 9 }];

export const FIN_FATURAMENTO = [{ convenio: "Unimed", faturado: 198400, glosado: 8920 }, { convenio: "Amil", faturado: 124600, glosado: 7480 }, { convenio: "Bradesco", faturado: 89980, glosado: 3240 }, { convenio: "SUS", faturado: 68830, glosado: 2060 }];

export const SEED_GLOSAS: GlosaItem[] = [
  { id: "gl-1", convenio: "Unimed", descricao: "Consulta — Cardiologia · 22/05", motivo: "Documentação", valor: 3420, data: "22/05/2026", status: "Glosada" },
  { id: "gl-2", convenio: "Amil", descricao: "Ultrassom · 20/05", motivo: "Autorização", valor: 2890, data: "20/05/2026", status: "Glosada" },
  { id: "gl-3", convenio: "Bradesco", descricao: "Infiltração · 18/05", motivo: "Código", valor: 1840, data: "18/05/2026", status: "Glosada" },
  { id: "gl-4", convenio: "Unimed", descricao: "Consulta — Clínica Geral · 15/05", motivo: "Documentação", valor: 2650, data: "15/05/2026", status: "Em recurso" },
  { id: "gl-5", convenio: "Amil", descricao: "Coleta / Biópsia · 12/05", motivo: "Autorização", valor: 1980, data: "12/05/2026", status: "Glosada" },
  { id: "gl-6", convenio: "SUS", descricao: "Consulta — Pediatria · 10/05", motivo: "Código", valor: 2060, data: "10/05/2026", status: "Glosada" },
];

export const SEED_PACOTES: PacoteItem[] = [
  { id: "pk-1", nome: "Check-up completo", paciente: "João Pedro Santos", total: 4800, pago: 3200, parcelas: 4, parcelasPagas: 2, status: "Em dia" },
  { id: "pk-2", nome: "Tratamento ortopédico", paciente: "Lucas Gabriel Martins", total: 12600, pago: 4200, parcelas: 6, parcelasPagas: 2, status: "Atrasado" },
  { id: "pk-3", nome: "Acompanhamento cardiológico", paciente: "Carlos Eduardo Oliveira", total: 7200, pago: 7200, parcelas: 6, parcelasPagas: 6, status: "Quitado" },
  { id: "pk-4", nome: "Pré-natal", paciente: "Fernanda Lima Almeida", total: 9800, pago: 4900, parcelas: 5, parcelasPagas: 2, status: "Em dia" },
  { id: "pk-5", nome: "Acompanhamento dermatológico", paciente: "Juliana Pereira Rocha", total: 3600, pago: 1200, parcelas: 3, parcelasPagas: 1, status: "Em dia" },
];

export const SEED_CONTAS: ContaItem[] = [
  { id: "ct-1", paciente: "Maria Aparecida Silva", descricao: "Consulta — Clínica Geral", vencimento: "2026-06-20", valor: 12400, status: "A vencer" },
  { id: "ct-2", paciente: "Lucas Gabriel Martins", descricao: "Tratamento ortopédico — parcela 3", vencimento: "2026-06-05", valor: 2100, status: "Vencida", diasVencida: 8 },
  { id: "ct-3", paciente: "Juliana Pereira Rocha", descricao: "Acompanhamento dermatológico — parcela 2", vencimento: "2026-05-08", valor: 1200, status: "Vencida", diasVencida: 36 },
  { id: "ct-4", paciente: "João Pedro Santos", descricao: "Check-up — parcela 3", vencimento: "2026-06-25", valor: 1200, status: "A vencer" },
  { id: "ct-5", paciente: "Carlos Eduardo Oliveira", descricao: "Consulta — Cardiologia", vencimento: "2026-05-02", valor: 8000, status: "Vencida", diasVencida: 42 },
  { id: "ct-6", paciente: "Fernanda Lima Almeida", descricao: "Pré-natal — parcela 3", vencimento: "2026-06-18", valor: 1960, status: "Paga" },
];

export const FIN_PERDIDAS = [
  { id: "pd-1", paciente: "Maria Aparecida Silva", data: "10/06/2026", motivo: "Falta", valor: 420, detalhe: "Consulta — Clínica Geral · sem aviso" },
  { id: "pd-2", paciente: "João Pedro Santos", data: "09/06/2026", motivo: "Cancelamento", valor: 380, detalhe: "Consulta — Clínica Geral · cancelou no dia" },
  { id: "pd-3", paciente: "Ana Beatriz Costa", data: "08/06/2026", motivo: "Falta", valor: 350, detalhe: "Consulta — Pediatria · sem aviso" },
  { id: "pd-4", paciente: "Pedro Henrique Souza", data: "05/06/2026", motivo: "Cancelamento", valor: 350, detalhe: "Consulta — Pediatria · reagendou" },
  { id: "pd-5", paciente: "Rosa Maria Ferreira", data: "03/06/2026", motivo: "Falta", valor: 460, detalhe: "Consulta — Clínica Geral · sem aviso" },
  { id: "pd-6", paciente: "Lucas Gabriel Martins", data: "02/06/2026", motivo: "Cancelamento", valor: 520, detalhe: "Retorno — Ortopedia · cancelou no dia" },
];

export const FIN_ORCAMENTO = [{ categoria: "Receita", previsto: 652000, realizado: 688300 }, { categoria: "Pessoal", previsto: 126000, realizado: 118800 }, { categoria: "Insumos", previsto: 28400, realizado: 25740 }, { categoria: "Equipamentos", previsto: 21200, realizado: 17820 }];

export const FIN_INVESTIMENTOS = [
  { nome: "Ultrassom U-02", tipo: "Equipamento", investido: 184000, depreciacao: 73600 },
  { nome: "Reforma das salas da Clínica", tipo: "Reforma", investido: 245000, depreciacao: 49000 },
  { nome: "Sistema de gestão e tecnologia", tipo: "Tecnologia", investido: 96000, depreciacao: 38400 },
  { nome: "Monitor da Clínica M-09", tipo: "Equipamento", investido: 42800, depreciacao: 21400 },
  { nome: "Eletrocardiógrafo E-03", tipo: "Equipamento", investido: 36500, depreciacao: 18250 },
];

export const FIN_EQUIP_PARADO = [
  { nome: "Ultrassom U-02", horas: 18, custoHora: 420, canceladas: 12, remarcadas: 8 },
  { nome: "Sala 4 — Clínica", horas: 12, custoHora: 260, canceladas: 6, remarcadas: 7 },
  { nome: "Monitor da Clínica M-09", horas: 9, custoHora: 180, canceladas: 3, remarcadas: 5 },
  { nome: "Eletrocardiógrafo E-03", horas: 6, custoHora: 150, canceladas: 2, remarcadas: 3 },
];

export const FIN_PREVISTO_REALIZADO = [{ m: "Jan", previsto: 612, realizado: 598 }, { m: "Fev", previsto: 624, realizado: 631 }, { m: "Mar", previsto: 640, realizado: 652 }, { m: "Abr", previsto: 648, realizado: 641 }, { m: "Mai", previsto: 660, realizado: 672 }, { m: "Jun", previsto: 652, realizado: 688 }];
