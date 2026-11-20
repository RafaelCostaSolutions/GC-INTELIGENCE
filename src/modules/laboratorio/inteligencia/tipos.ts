// Setor Laboratório › Inteligência e Modo IA
export type GestorSug = { id: string; n: number; title: string; reason: string; impact: string; applyLabel: string; applyMessage: string; ignoreMessage: string };

export type LabIntelItem = { id: string; group: string; title: string; detail: string; reason: string; probability: number; level: "Alto" | "Médio" | "Baixo"; prediction: boolean; actionLabel: string; actionOptions?: string[]; secondaryLabel?: string; doneMessage: (choice?: string) => string; secondaryMessage?: string; patientId?: string };
