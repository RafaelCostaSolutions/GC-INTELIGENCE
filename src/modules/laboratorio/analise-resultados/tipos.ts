// Setor Laboratório › Análise e Resultados
export type LabFlag = "Normal" | "Alterado" | "Crítico";

type LabResultHistory = { label: string; date: string; value: number };

type LabReport = { model: string; methodology: string; observations: string; issuedAt: string; signed?: boolean; signedBy?: string; signedAt?: string };

export type LabResult = { id: string; patientId: string; patientName: string; sample: string; exam: string; area: string; date: string; value: number; unit: string; refMin: number; refMax: number; refText: string; flag: LabFlag; status: "Aguardando validação" | "Validado"; validatedAt?: string; validator?: string; notes?: string; history: LabResultHistory[]; report?: LabReport; inpatient?: { unit: string; bed: string; priority: "Rotina" | "Urgente" | "Emergência"; delivered?: boolean; deliveredBy?: string; deliveredAt?: string; notified?: boolean; notifiedAt?: string }; recordId?: string };
