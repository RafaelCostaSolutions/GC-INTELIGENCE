// Setor Laboratório › Entrega de Resultados
export type DeliveryChannel = "Portal" | "WhatsApp" | "E-mail" | "Impresso" | "Na unidade";

type TraceStep = { etapa: string; at: string; by: string };

export type DeliveryTrace = { reagentLot: string; controlLot: string; equipment: string; calibration: string; operator: string; validator: string; steps: TraceStep[] };

export type DeliveryItem = { id: string; patientId: string; patientName: string; exam: string; value: string; releasedAt: string; status: "Pronto para entrega" | "Entregue"; channel?: DeliveryChannel; deliveredAt?: string; deliveredBy?: string; trace: DeliveryTrace; recordId?: string };

export type SecondCopy = { id: string; deliveryId: string; patientName: string; exam: string; requestedBy: string; requesterType: "Paciente" | "Médico" | "Recepção"; motive: string; reissuedAt: string; responsible: string; recordId?: string };
