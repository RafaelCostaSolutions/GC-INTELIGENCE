// Setor Laboratório › Tempo e Produtividade
import { type QueueItem, type TempoPrioridade } from "./tipos";

export const TEMPO_PRIORIDADE_RANK: Record<TempoPrioridade, number> = { "Emergência": 0, "Urgente": 1, "Prioritário": 2, "Rotina": 3 };

export const TEMPO_QUEUE_SEED: QueueItem[] = [
  { id: "q1", numero: "LAB-2026-1051", patient: "Rosa Maria Ferreira", exam: "Glicemia em jejum", area: "Bioquímica", priority: "Emergência", stage: "Aguardando validação", wait: "2h 48min", waitMin: 168, professional: "Téc. Juliana — Coleta", patientId: "p7" },
  { id: "q2", numero: "LAB-2026-1052", patient: "Maria Aparecida Silva", exam: "Hemoglobina glicada", area: "Bioquímica", priority: "Urgente", stage: "Aguardando análise", wait: "5h 12min", waitMin: 312, professional: "Téc. Marcos — Coleta", patientId: "p1" },
  { id: "q3", numero: "LAB-2026-1053", patient: "Fernanda Lima Almeida", exam: "Hemograma completo", area: "Hematologia", priority: "Urgente", stage: "Aguardando coleta", wait: "38 min", waitMin: 38, professional: "Enf. Ricardo — Clínica", patientId: "p5" },
  { id: "q4", numero: "LAB-2026-1054", patient: "Carlos Eduardo Oliveira", exam: "Colesterol total e frações", area: "Bioquímica", priority: "Prioritário", stage: "Aguardando validação", wait: "3h 05min", waitMin: 185, professional: "Téc. Juliana — Coleta", patientId: "p4" },
  { id: "q5", numero: "LAB-2026-1055", patient: "Ana Beatriz Costa", exam: "Urina tipo I (EAS)", area: "Urinálise", priority: "Prioritário", stage: "Aguardando liberação", wait: "1h 18min", waitMin: 78, professional: "Enf. Paula — Coleta", patientId: "p3" },
  { id: "q6", numero: "LAB-2026-1056", patient: "João Pedro Santos", exam: "TSH", area: "Hormonal", priority: "Rotina", stage: "Aguardando análise", wait: "8h 40min", waitMin: 520, professional: "Téc. Marcos — Coleta", patientId: "p2" },
  { id: "q7", numero: "LAB-2026-1057", patient: "Lucas Gabriel Martins", exam: "Raio-X de tórax", area: "Imagem", priority: "Rotina", stage: "Aguardando coleta", wait: "52 min", waitMin: 52, professional: "Enf. Ricardo — Clínica", patientId: "p8" },
  { id: "q8", numero: "LAB-2026-1058", patient: "Juliana Pereira Rocha", exam: "Proteína C reativa (PCR)", area: "Imunologia", priority: "Rotina", stage: "Aguardando validação", wait: "2h 10min", waitMin: 130, professional: "Téc. Juliana — Coleta", patientId: "p9" },
  { id: "q9", numero: "LAB-2026-1059", patient: "Pedro Henrique Souza", exam: "Parasitológico de fezes", area: "Parasitologia", priority: "Rotina", stage: "Aguardando análise", wait: "6h 02min", waitMin: 362, professional: "Enf. Paula — Coleta", patientId: "p6" },
  { id: "q10", numero: "LAB-2026-1060", patient: "Maria Aparecida Silva", exam: "Urocultura com antibiograma", area: "Microbiologia", priority: "Prioritário", stage: "Aguardando liberação", wait: "54 min", waitMin: 54, professional: "Téc. Marcos — Coleta", patientId: "p1" },
];
