// Setor Laboratório › WhatsApp e Comunicação
import { type WaSurvey } from "./tipos";

export const WA_DEFAULT_SURVEYS: WaSurvey[] = [
  { patientId: "p1", patientName: "Maria Aparecida Silva", nota: 5, comentario: "Atendimento rápido e explicado.", at: "12/06/2026, 10:20" },
  { patientId: "p5", patientName: "Fernanda Lima Almeida", nota: 4, comentario: "Boa coleta, espera um pouco longa.", at: "12/06/2026, 11:05" },
  { patientId: "p4", patientName: "Carlos Eduardo Oliveira", nota: 5, comentario: "Tudo certo.", at: "11/06/2026, 09:40" },
];

export const WA_CONSENT_TEXT = "Autorizo o Laboratório GottCured a me contatar por WhatsApp para agendamento, lembrete de coleta, confirmação de presença, posição na fila, etapas do exame, resultado, recoleta, orientações pós-coleta e pesquisa de satisfação. Posso revogar este consentimento a qualquer momento (LGPD).";
