// Setor Laboratório › Coleta e Amostras
export type SampleStatus = "Coletada" | "Recebida" | "Em análise" | "Resultado" | "Descartada";

type TimelineStep = { stage: string; at: string; by: string; note: string };

export type SampleRec = { id: string; code: string; orderLabel: string; patientId: string; patientName: string; exam: string; sampleType: string; tube: string; tubeColor: string; collector: string; collectedAt: string; location: string; volume: string; fasting: boolean; incident: string; status: SampleStatus; timeline: TimelineStep[]; receipt?: { at: string; by: string; condition: string; note: string }; resultAt?: string; discard?: { at: string; by: string; motive: string }; needsRecollection?: boolean; replacementFor?: string; replacedBy?: string; printedAt?: string; whatsappAt?: string; recordId?: string };

export type ShipmentRec = { id: string; sampleCodes: string[]; destination: string; carrier: string; route: string; tempMin: number; tempMax: number; tempNow: number; departedAt: string; expectedAt: string; arrivedAt?: string; status: "Aguardando transporte" | "Em trânsito" | "Entregue"; recordId?: string };
