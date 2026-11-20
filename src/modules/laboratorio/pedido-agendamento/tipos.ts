// Setor Laboratório › Pedido e Agendamento
export type LabPriority = "Rotina" | "Prioritário" | "Urgente" | "Emergência";

export type LabOrderStatus = "Solicitado" | "Aguardando autorização" | "Agendado" | "Coletado" | "Cancelado";

type LabHistory = { at: string; action: string; motive: string };

export type LabCollection = { date: string; time: string; type: "No laboratório" | "Domiciliar" | "No leito"; collector: string; room: string; status: "Aguardando" | "Coletado" };

export type LabOrder = { id: string; numero: string; patientId: string; patientName: string; convenio: string; doctor: string; exams: string[]; date: string; notes: string; priority: LabPriority; status: LabOrderStatus; origin: "Laboratório" | "Clínica"; sourceOrderId?: string; collection?: LabCollection; authNeeded: boolean; authStatus: "Não necessária" | "Aguardando autorização" | "Liberada"; history: LabHistory[]; cancelMotive?: string; whatsappAt?: string; printedAt?: string; recordId?: string };
