// Setor Laboratório › Tempo e Produtividade
export type TempoPrioridade = "Rotina" | "Prioritário" | "Urgente" | "Emergência";

export type FilaEtapa = "Aguardando coleta" | "Aguardando análise" | "Aguardando validação" | "Aguardando liberação";

export type QueueItem = { id: string; numero: string; patient: string; exam: string; area: string; priority: TempoPrioridade; stage: FilaEtapa; wait: string; waitMin: number; professional: string; patientId?: string };
