// Setor Clínica › Acompanhamento e Continuidade
export type ProgStatus = "Controlado" | "Em acompanhamento" | "Descompensado";

export type ChronicProgram = { id: string; name: string; goal: string; adherence: number; members: { patientId: string; status: ProgStatus }[] };

export type Retorno = { id: string; patientId: string; date: string; reason: string; professional: string; reminderSent?: boolean; reminderAt?: string };

export type ActiveItem = { id: string; patientId: string; type: string; detail: string; done?: boolean; doneAt?: string; channel?: string };

export type AdhGoal = { id: string; patientId: string; label: string; target: string; progress: number };

export type AdhLog = { id: string; patientId: string; date: string; med: string; diet: string; activity: string; note: string };

export type VaccineRec = { id: string; patientId: string; name: string; status: "Aplicada" | "Pendente" | "Atrasada"; date: string; lot: string };

export type PrevInvite = { id: string; program: string; patientId: string; status: "Convidado" | "Agendado" | "Realizado" };

export type PostItem = { id: string; patientId: string; dischargeDate: string; procedure: string; contactDate: string; status: "Acompanhando" | "Concluído" | "Intercorrência"; contacts: { date: string; note: string }[] };

export type Quest = { id: string; patientId: string; date: string; pain: number; dyspnea: number; sleep: number; disposition: number; note: string };

export type SharedPlan = { patientId: string; text: string; goalsText: string; orientations: string; sharedAt?: string };
