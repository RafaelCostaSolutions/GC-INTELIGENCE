// Setor Clínica › Atendimento e Consulta
import { type ApptStatus, type DayAppt } from "./tipos";

export const APPT_STATUS_STYLE: Record<ApptStatus, string> = { "Aguardando": "bg-[#FFF0C5] text-[#7A5600]", "Chamado": "bg-[#E0EAFB] text-[#1D4E8A]", "Em atendimento": "bg-[var(--primary-soft)] text-[var(--primary)]", "Atendido": "bg-[#D9EEDD] text-[#1E5B2A]", "Ausente": "bg-[#F8DEDC] text-[#8B2626]", "Intercorrência": "bg-[#FFE0C2] text-[#7A3A00]" };

export const SEED_APPTS: DayAppt[] = [
  { id: "ap-1", patientId: "p1", time: "08:00", type: "Presencial", specialty: "Clínica Geral", status: "Aguardando" },
  { id: "ap-2", patientId: "p2", time: "08:30", type: "Retorno", specialty: "Clínica Geral", status: "Aguardando" },
  { id: "ap-3", patientId: "p3", time: "09:00", type: "Telemedicina", specialty: "Pediatria", status: "Aguardando" },
  { id: "ap-4", patientId: "p4", time: "09:30", type: "Presencial", specialty: "Cardiologia", status: "Aguardando" },
  { id: "ap-5", patientId: "p5", time: "10:00", type: "Presencial", specialty: "Obstetrícia", status: "Aguardando" },
  { id: "ap-6", patientId: "p6", time: "10:30", type: "Teleorientação", specialty: "Pediatria", status: "Aguardando" },
  { id: "ap-7", patientId: "p7", time: "11:00", type: "Presencial", specialty: "Clínica Geral", status: "Aguardando" },
  { id: "ap-8", patientId: "p8", time: "11:30", type: "Retorno", specialty: "Ortopedia", status: "Aguardando" },
  { id: "ap-9", patientId: "p9", time: "13:00", type: "Telemedicina", specialty: "Clínica Geral", status: "Aguardando" },
];
