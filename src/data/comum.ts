// Dados e constantes compartilhados — comuns aos dois setores
import { type AiSuggestion, type AlertItem, type SectorStatus } from "../types/comum";

export const SECTORS = [
  { id: "clinica", name: "Clínica", desc: "Consultas, agendamentos e qualidade", kpis: [["Consultas hoje", "312"], ["Absenteísmo", "7,1%"], ["Satisfação", "4,7 / 5"], ["Aguardando", "18"]], color: "#B07A19" },
  { id: "laboratorio", name: "Laboratório", desc: "Exames, paradas e reagendados", kpis: [["Exames hoje", "1.284"], ["Reagendados", "18"], ["Tempo médio", "42 min"], ["Equip. parados", "2"]], color: "#2C7FA6" },
] as const;

export const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

export const SECTOR_DETAILS: Record<string, { status: SectorStatus; quick: [string, string][]; general: { label: string; value: string; note: string }[]; ai: AiSuggestion[] }> = {
  clinica: { status: "Ativo", quick: [["Consultas hoje", "312"], ["Satisfação", "4,7 / 5"], ["Alertas ativos", "1"]], general: [{ label: "Saúde do setor", value: "93 / 100", note: "Operação estável" }, { label: "Chamados abertos", value: "7", note: "Baixa complexidade" }, { label: "SLA no prazo", value: "95%", note: "Acima da meta" }, { label: "Alertas ativos (críticos)", value: "1 · 0 críticos", note: "Calibração do ultrassom em verificação" }, { label: "Custo do mês", value: "R$ 198 mil", note: "Consultas e suporte" }, { label: "Disponibilidade / Produtividade", value: "98,1%", note: "Disponibilidade do parque" }], ai: [{ title: "Reduzir absenteísmo com lembrete de consulta", detail: "O absenteísmo está em 7,1%. Reforçar a confirmação das consultas do dia seguinte.", sectorId: "clinica" }, { title: "Revisar fluxo de atendimento nas consultas", detail: "Manter o fluxo revisado e liberar a próxima sala disponível para a fila de 18 pacientes.", sectorId: "clinica" }, { title: "Antecipar calibração do ultrassom U-02", detail: "A calibração está próxima do prazo. Agendar a verificação antes do pico de consultas.", sectorId: "clinica" }] },
  laboratorio: { status: "Atenção", quick: [["Exames hoje", "1.284"], ["Reagendados", "18"], ["Alertas ativos", "2"]], general: [{ label: "Saúde do setor", value: "84 / 100", note: "Atenção à esterilização" }, { label: "Chamados abertos", value: "18", note: "2 equipamentos parados" }, { label: "SLA no prazo", value: "89%", note: "Abaixo da meta" }, { label: "Alertas ativos (críticos)", value: "2 · 0 críticos", note: "Preventiva da autoclave próxima" }, { label: "Custo do mês", value: "R$ 312 mil", note: "Exames e suporte técnico" }, { label: "Disponibilidade / Produtividade", value: "95,4%", note: "Disponibilidade do parque" }], ai: [{ title: "Antecipar preventiva da autoclave A-03", detail: "A janela ideal termina em 48 horas. Alinhar a parada com o horário de menor demanda de exames.", sectorId: "laboratorio" }, { title: "Remanejar exames da tarde com antecedência", detail: "Antecipar o remanejamento reduz reagendamentos quando um equipamento para sem aviso.", sectorId: "laboratorio" }, { title: "Conferir kit de vedação reservado", detail: "Confirmar o estoque do kit da autoclave para a próxima janela de preventiva.", sectorId: "laboratorio" }] },
};

export const GLOBAL_AI: AiSuggestion[] = [
  { title: "Antecipar preventiva da autoclave em 48 horas", detail: "A janela ideal termina em 48 horas e as peças já estão reservadas para a preventiva.", sectorId: "laboratorio" },
  { title: "Reduzir absenteísmo com lembrete de consulta", detail: "O absenteísmo está em 7,1%. Reforçar a confirmação das consultas do dia seguinte.", sectorId: "clinica" },
  { title: "Remanejar exames da tarde com antecedência", detail: "Antecipar o remanejamento reduz reagendamentos quando um equipamento para sem aviso.", sectorId: "laboratorio" },
  { title: "Revisar calibração do ultrassom da Clínica", detail: "O ultrassom U-02 está próximo do prazo de calibração. Antecipar a verificação das demais salas.", sectorId: "clinica" },
  { title: "Priorizar reposição dos itens críticos do Laboratório", detail: "Separar os itens com menor cobertura e confirmar a entrega antes da próxima janela.", sectorId: "laboratorio" },
  { title: "Acompanhar fila de 18 pacientes aguardando", detail: "Priorizar a fila por horário marcado e liberar a próxima sala disponível.", sectorId: "clinica" },
];

export const INITIAL_ALERTS: AlertItem[] = [
  { id: "a1", title: "Preventiva de autoclave próxima do prazo", sector: "Laboratório", severity: "Alto", time: "há 2 h", detail: "Janela ideal termina em 48 horas. Kit de vedação já reservado para a preventiva.", equipment: "Autoclave A-03" },
  { id: "a2", title: "Ultrassom com calibração próxima do prazo", sector: "Clínica", severity: "Alto", time: "há 1 h", detail: "Calibração vence em 3 dias. Verificação programada antes do pico de consultas.", equipment: "Ultrassom U-02" },
  { id: "a3", title: "Centrífuga com vibração acima do padrão", sector: "Laboratório", severity: "Médio", time: "há 4 h", detail: "Vibração acima do padrão em rotação alta. Verificação programada para o próximo intervalo.", equipment: "Centrífuga C-05" },
  { id: "a4", title: "Absenteísmo acima do esperado nas consultas", sector: "Clínica", severity: "Médio", time: "há 5 h", detail: "Absenteísmo de 7,1% no dia. Reforçar a confirmação das consultas do dia seguinte.", equipment: "Agenda da Clínica" },
  { id: "a5", title: "Analisador com reagente abaixo do nível ideal", sector: "Laboratório", severity: "Médio", time: "há 6 h", detail: "Nível de reagente abaixo do ideal. Reposição sugerida antes da próxima leva de exames.", equipment: "Analisador L-01" },
  { id: "a6", title: "Fila de espera acima do padrão", sector: "Clínica", severity: "Médio", time: "ontem", detail: "18 pacientes aguardando. Priorizar a fila por horário marcado e liberar a próxima sala.", equipment: "Recepção da Clínica" },
];

const trend = [{ m: "Jan", chamados: 212, resolvidos: 198, sla: 89 }, { m: "Fev", chamados: 198, resolvidos: 191, sla: 91 }, { m: "Mar", chamados: 236, resolvidos: 219, sla: 88 }, { m: "Abr", chamados: 221, resolvidos: 214, sla: 92 }, { m: "Mai", chamados: 248, resolvidos: 233, sla: 90 }, { m: "Jun", chamados: 231, resolvidos: 224, sla: 91 }];

export const COLORS = ["#0F5F5C", "#2C8D84", "#E4A11B", "#8BA9AB", "#5B7183"];

export const money = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const tipStyle: any = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--ink)", fontSize: 12 };
