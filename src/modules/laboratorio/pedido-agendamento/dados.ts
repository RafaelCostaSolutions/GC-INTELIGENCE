// Setor Laboratório › Pedido e Agendamento
import { type LabOrder, type LabPriority } from "./tipos";

export const LAB_PRIORITY_RANK: Record<LabPriority, number> = { "Emergência": 0, "Urgente": 1, "Prioritário": 2, "Rotina": 3 };

export const LAB_PRIORITY_STYLE: Record<LabPriority, string> = { "Rotina": "bg-[var(--primary-soft)] text-[var(--primary)]", "Prioritário": "bg-[#FFF0C5] text-[#7A5600]", "Urgente": "bg-[#FFE0C2] text-[#7A3A00]", "Emergência": "bg-[#F8DEDC] text-[#8B2626]" };

export const LAB_TARGET: Record<LabPriority, string> = { "Rotina": "Resultado em até 48 h", "Prioritário": "Resultado em até 24 h", "Urgente": "Resultado em 2 h", "Emergência": "Resultado imediato — prioridade máxima" };

export const LAB_COLLECTORS = ["Enf. Ricardo — Clínica", "Téc. Juliana — Coleta", "Téc. Marcos — Coleta", "Enf. Paula — Coleta domiciliar"];

export const LAB_ROOMS = ["Sala de coleta 1", "Sala de coleta 2", "Box 1", "Box 2", "Domicílio do paciente", "Leito — enfermaria"];

export const LAB_CANCEL_MOTIVES = ["Paciente solicitou", "Jejum inadequado", "Problema na coleta", "Exame duplicado", "Convênio não autorizou", "Paciente não compareceu", "Outro motivo"];

export const LAB_RESCHEDULE_MOTIVES = ["Paciente solicitou", "Jejum inadequado", "Problema na coleta", "Sala / coletador indisponível", "Convênio / autorização", "Outro motivo"];

export const LAB_SEED_ORDERS: LabOrder[] = [
  { id: "lab-ped-1", numero: "LAB-2026-1041", patientId: "p5", patientName: "Fernanda Lima Almeida", convenio: "Bradesco", doctor: "Dra. Juliana — Obstetrícia", exams: ["Hemograma completo", "Glicemia em jejum"], date: "2026-06-12", notes: "Pré-natal — coleta preferencial pela manhã.", priority: "Prioritário", status: "Agendado", origin: "Laboratório", collection: { date: new Date().toISOString().slice(0, 10), time: "08:30", type: "No laboratório", collector: "Téc. Juliana — Coleta", room: "Sala de coleta 1", status: "Aguardando" }, authNeeded: false, authStatus: "Não necessária", history: [{ at: "12/06/2026, 08:10", action: "Pedido criado", motive: "Registro no Laboratório" }, { at: "12/06/2026, 08:12", action: "Coleta agendada", motive: "Agendamento de coleta" }] },
  { id: "lab-ped-2", numero: "LAB-2026-1042", patientId: "p1", patientName: "Maria Aparecida Silva", convenio: "Unimed", doctor: "Dra. Ana Paula — Clínica Geral", exams: ["Tomografia de crânio"], date: "2026-06-12", notes: "Avaliação de rotina — aguardar liberação do convênio.", priority: "Rotina", status: "Aguardando autorização", origin: "Laboratório", authNeeded: true, authStatus: "Aguardando autorização", history: [{ at: "12/06/2026, 09:05", action: "Pedido criado", motive: "Registro no Laboratório" }, { at: "12/06/2026, 09:06", action: "Autorização solicitada", motive: "Exame de imagem exige autorização" }] },
  { id: "lab-ped-3", numero: "LAB-2026-1043", patientId: "p7", patientName: "Rosa Maria Ferreira", convenio: "SUS", doctor: "Dra. Ana Paula — Clínica Geral", exams: ["Glicemia em jejum", "Creatinina"], date: "2026-06-12", notes: "Paciente com mobilidade reduzida — coleta domiciliar.", priority: "Emergência", status: "Solicitado", origin: "Laboratório", authNeeded: false, authStatus: "Não necessária", history: [{ at: "12/06/2026, 09:40", action: "Pedido criado", motive: "Registro no Laboratório" }] },
];
