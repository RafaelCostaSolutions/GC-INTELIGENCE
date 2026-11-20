// Setor Laboratório › Finanças do Laboratório
import { type FinExam } from "./tipos";

export const FIN_EXAMS: FinExam[] = [
  { name: "Hemograma completo", area: "Hematologia", qty: 2100, precoTabela: 58, precoMedio: 52, reagente: 12, pessoal: 9, equipamento: 6, origem: "Interno" },
  { name: "Glicemia em jejum", area: "Bioquímica", qty: 1650, precoTabela: 32, precoMedio: 28, reagente: 7, pessoal: 6, equipamento: 4, origem: "Interno" },
  { name: "Hemoglobina glicada", area: "Bioquímica", qty: 620, precoTabela: 68, precoMedio: 58, reagente: 22, pessoal: 10, equipamento: 8, origem: "Interno" },
  { name: "Colesterol total e frações", area: "Bioquímica", qty: 980, precoTabela: 74, precoMedio: 62, reagente: 18, pessoal: 9, equipamento: 7, origem: "Interno" },
  { name: "TSH", area: "Hormonal", qty: 740, precoTabela: 82, precoMedio: 68, reagente: 28, pessoal: 11, equipamento: 9, origem: "Interno" },
  { name: "Estradiol", area: "Hormonal", qty: 120, precoTabela: 96, precoMedio: 78, reagente: 42, pessoal: 8, equipamento: 2, origem: "Enviado", apoio: "Lab Apoio Hormonal" },
  { name: "Vitamina D 25-OH", area: "Hormonal", qty: 180, precoTabela: 118, precoMedio: 96, reagente: 58, pessoal: 8, equipamento: 2, origem: "Enviado", apoio: "Lab Apoio Hormonal" },
  { name: "Proteína C reativa (PCR)", area: "Imunologia", qty: 340, precoTabela: 64, precoMedio: 54, reagente: 24, pessoal: 9, equipamento: 6, origem: "Interno" },
  { name: "Sorologia Hepatite B — HBsAg", area: "Imunologia", qty: 190, precoTabela: 92, precoMedio: 74, reagente: 48, pessoal: 9, equipamento: 3, origem: "Enviado", apoio: "Lab Apoio Sorologia" },
  { name: "Urocultura com antibiograma", area: "Microbiologia", qty: 260, precoTabela: 86, precoMedio: 71, reagente: 26, pessoal: 14, equipamento: 8, origem: "Interno" },
  { name: "Urina tipo I (EAS)", area: "Urinálise", qty: 1480, precoTabela: 38, precoMedio: 18, reagente: 9, pessoal: 7, equipamento: 4, origem: "Interno" },
  { name: "Parasitológico de fezes", area: "Parasitologia", qty: 520, precoTabela: 52, precoMedio: 22, reagente: 14, pessoal: 10, equipamento: 5, origem: "Interno" },
  { name: "Raio-X de tórax", area: "Imagem", qty: 380, precoTabela: 145, precoMedio: 118, reagente: 18, pessoal: 22, equipamento: 28, origem: "Interno" },
  { name: "Ultrassom abdominal", area: "Imagem", qty: 310, precoTabela: 210, precoMedio: 172, reagente: 12, pessoal: 38, equipamento: 42, origem: "Interno" },
  { name: "Tomografia de crânio", area: "Imagem", qty: 95, precoTabela: 480, precoMedio: 292, reagente: 280, pessoal: 18, equipamento: 6, origem: "Enviado", apoio: "Lab Apoio Imagem" },
  { name: "Ressonância magnética de joelho", area: "Imagem", qty: 28, precoTabela: 720, precoMedio: 398, reagente: 410, pessoal: 22, equipamento: 8, origem: "Enviado", apoio: "Lab Apoio Imagem" },
];

export const FIN_PREJUIZO: Record<string, { motivo: string; sugestao: string; acoes: string[] }> = {
  "Urina tipo I (EAS)": { motivo: "Preço de convênio baixo — o preço médio realizado (SUS a 45% da tabela) ficou abaixo do custo de pessoal + reagente.", sugestao: "Reajustar preço: renegociar a tabela do SUS / convênios ou concentrar o EAS em pacotes com margem positiva.", acoes: ["Reajustar preço com convênio", "Negociar reagente", "Incluir em pacote"] },
  "Parasitológico de fezes": { motivo: "Custo de reagente alto para o preço praticado + volume baixo para diluir o custo fixo.", sugestao: "Negociar reagente: trocar fornecedor / comprar em maior volume e revisar o preço mínimo por convênio.", acoes: ["Negociar reagente", "Reajustar preço com convênio", "Terceirizar exame"] },
  "Tomografia de crânio": { motivo: "Custo de envio ao laboratório de apoio alto (R$ 280 por exame) + preço de convênio baixo no mix do mês.", sugestao: "Renegociar o contrato com o laboratório de apoio e o preço por convênio antes de ampliar a oferta.", acoes: ["Renegociar laboratório de apoio", "Reajustar preço com convênio", "Terceirizar exame"] },
  "Ressonância magnética de joelho": { motivo: "Volume baixo (28 exames no mês) + custo de envio muito alto (R$ 410 por exame).", sugestao: "Terceirizar / suspender a oferta própria: encaminhar para o apoio com preço fechado ou pausar até atingir volume mínimo.", acoes: ["Terceirizar exame", "Renegociar laboratório de apoio", "Suspender oferta temporariamente"] },
};

export const FIN_ENVIADOS = [
  { exam: "Estradiol", apoio: "Lab Apoio Hormonal", envio: 42, transporte: 6, pessoal: 8, preco: 78, internoEstimado: 68 },
  { exam: "Vitamina D 25-OH", apoio: "Lab Apoio Hormonal", envio: 58, transporte: 8, pessoal: 8, preco: 96, internoEstimado: 84 },
  { exam: "Sorologia Hepatite B — HBsAg", apoio: "Lab Apoio Sorologia", envio: 48, transporte: 6, pessoal: 9, preco: 74, internoEstimado: 71 },
  { exam: "Tomografia de crânio", apoio: "Lab Apoio Imagem", envio: 280, transporte: 24, pessoal: 18, preco: 292, internoEstimado: 520 },
  { exam: "Ressonância magnética de joelho", apoio: "Lab Apoio Imagem", envio: 410, transporte: 32, pessoal: 22, preco: 398, internoEstimado: 610 },
];

export const FIN_REPETICAO_SEED = [
  { motivo: "Amostra hemolisada", qty: 42, custoUnit: 38, detalhe: "Reagente R$ 18 + tempo de equipe R$ 12 + nova coleta R$ 8" },
  { motivo: "Coleta insuficiente", qty: 36, custoUnit: 34, detalhe: "Reagente R$ 15 + tempo de equipe R$ 11 + nova coleta R$ 8" },
  { motivo: "Controle reprovado", qty: 18, custoUnit: 52, detalhe: "Reagente R$ 28 + tempo de equipe R$ 16 + nova coleta R$ 8" },
  { motivo: "Falha de equipamento", qty: 12, custoUnit: 68, detalhe: "Reagente R$ 34 + tempo de equipe R$ 22 + nova coleta R$ 12" },
  { motivo: "Jejum inadequado", qty: 28, custoUnit: 26, detalhe: "Reagente R$ 10 + tempo de equipe R$ 8 + nova coleta R$ 8" },
  { motivo: "Identificação divergente", qty: 9, custoUnit: 30, detalhe: "Reagente R$ 12 + tempo de equipe R$ 10 + nova coleta R$ 8" },
];

export const FIN_PERDIDA = [
  { exam: "Tomografia de crânio", motivo: "Paciente não compareceu", qty: 6, valorUnit: 292 },
  { exam: "Ressonância magnética de joelho", motivo: "Convênio não autorizou", qty: 4, valorUnit: 398 },
  { exam: "Ultrassom abdominal", motivo: "Equipamento parado — atraso", qty: 8, valorUnit: 172 },
  { exam: "Hemograma completo", motivo: "Reagente em falta — atraso", qty: 24, valorUnit: 52 },
  { exam: "Glicemia em jejum", motivo: "Fila de coleta — atraso", qty: 32, valorUnit: 28 },
  { exam: "TSH", motivo: "Jejum inadequado — cancelado", qty: 11, valorUnit: 68 },
];

export const LABFIN_ORCAMENTO = [
  { categoria: "Receita", previsto: 520000, realizado: 0, tipo: "receita" },
  { categoria: "Reagentes", previsto: 118000, realizado: 132400, tipo: "custo" },
  { categoria: "Pessoal", previsto: 168000, realizado: 171200, tipo: "custo" },
  { categoria: "Equipamentos", previsto: 42000, realizado: 38100, tipo: "custo" },
  { categoria: "Apoio (exames enviados)", previsto: 58000, realizado: 64300, tipo: "custo" },
];

export const LABFIN_INVESTIMENTOS = [
  { item: "Analisador L-02", tipo: "Equipamento", valor: 185000, vidaUtilAnos: 8, depreciado: 46250, detalhe: "Amplia a capacidade de Bioquímica e reduz fila de análise." },
  { item: "Centrífuga C-06", tipo: "Equipamento", valor: 68000, vidaUtilAnos: 8, depreciado: 12750, detalhe: "Substitui a centrífuga com vibração acima do padrão." },
  { item: "Autoclave A-04", tipo: "Equipamento", valor: 96000, vidaUtilAnos: 10, depreciado: 14400, detalhe: "Backup da autoclave principal para evitar parada total." },
  { item: "Reforma — sala de coleta", tipo: "Estrutura", valor: 42000, vidaUtilAnos: 10, depreciado: 6300, detalhe: "Nova sala de coleta para reduzir tempo de espera." },
  { item: "Ultrassom — sonda adicional", tipo: "Equipamento", valor: 54000, vidaUtilAnos: 6, depreciado: 13500, detalhe: "Sonda de reserva para exames de imagem." },
];
