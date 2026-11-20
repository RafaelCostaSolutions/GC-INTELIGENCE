// Setor Laboratório › WhatsApp e Comunicação
export type WaOverride = { status?: string; stage?: string; date?: string; time?: string; cancelMotive?: string; confirmation?: string; called?: boolean; positionNotified?: boolean; reminderSent?: boolean; resultNotified?: boolean; recoletaNotified?: boolean; postSent?: boolean; surveySent?: boolean; rescheduleReason?: string };

type WaConsent = { date: string; channel: string; text: string };

export type WaMsg = { at: string; from: "paciente" | "laboratorio" | "sistema"; text: string; kind: string };

export type WaSurvey = { patientId: string; patientName: string; nota: number; comentario: string; at: string };

export type WaState = { overrides: Record<string, WaOverride>; consents: Record<string, WaConsent>; history: Record<string, WaMsg[]>; surveys: WaSurvey[]; transferred: Record<string, { status: string; atendente: string }>; recoletaDone: Record<string, boolean> };
