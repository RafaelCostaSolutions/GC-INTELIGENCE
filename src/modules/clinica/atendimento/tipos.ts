// Setor Clínica › Atendimento e Consulta
export type ApptStatus = "Aguardando" | "Chamado" | "Em atendimento" | "Atendido" | "Ausente" | "Intercorrência";

type ApptType = "Presencial" | "Telemedicina" | "Retorno" | "Teleorientação";

export type DayAppt = { id: string; patientId: string; time: string; type: ApptType; specialty: string; status: ApptStatus; durationMin?: number };

export type Referral = { id: string; patientId: string; specialty: string; motive: string; priority: string; professional: string; status: "Aguardando" | "Recebido" | "Respondido"; response: string; createdAt: string };

export type GenDoc = { id: string; patientId: string; type: string; days: string; text: string; createdAt: string };

export type TeamEntry = { id: string; patientId: string; area: string; professional: string; record: string; time: string };
