// Setor Laboratório › Entrega de Resultados
import { type DeliveryChannel, type DeliveryItem, type SecondCopy } from "./tipos";
import { deliveryTrace } from "./utils";

export const DELIVERY_CHANNELS: DeliveryChannel[] = ["Portal", "WhatsApp", "E-mail", "Impresso", "Na unidade"];

export const SEED_DELIVERIES: DeliveryItem[] = [
  { id: "del-1", patientId: "p1", patientName: "Maria Aparecida Silva", exam: "Glicemia em jejum", value: "145 mg/dL", releasedAt: "12/11/2026, 10:32", status: "Pronto para entrega", trace: deliveryTrace("GLI-2026-084", "CTL-N-2026-112", "Analisador L-01", "Téc. Marcos — Coleta", "Dra. Beatriz Almeida — Bioquímica", "12/11/2026") },
  { id: "del-2", patientId: "p7", patientName: "Rosa Maria Ferreira", exam: "Creatinina", value: "1,4 mg/dL", releasedAt: "12/11/2026, 11:05", status: "Pronto para entrega", trace: deliveryTrace("CRE-2026-038", "CTL-N-2026-112", "Analisador L-01", "Téc. Marcos — Coleta", "Dr. Carlos Menezes — Bioquímico", "12/11/2026") },
  { id: "del-3", patientId: "p5", patientName: "Fernanda Lima Almeida", exam: "Hemoglobina glicada", value: "5,8%", releasedAt: "10/11/2026, 15:40", status: "Pronto para entrega", trace: deliveryTrace("HBA-2026-041", "CTL-N-2026-110", "Analisador L-02", "Téc. Juliana — Coleta", "Dra. Beatriz Almeida — Bioquímica", "10/11/2026") },
  { id: "del-4", patientId: "p3", patientName: "Ana Beatriz Costa", exam: "TSH", value: "2,1 µUI/mL", releasedAt: "09/11/2026, 14:25", status: "Entregue", channel: "Portal", deliveredAt: "09/11/2026, 15:02", deliveredBy: "Recepção — Lab", trace: deliveryTrace("TSH-2026-057", "CTL-N-2026-108", "Analisador L-02", "Téc. Juliana — Coleta", "Dra. Beatriz Almeida — Bioquímica", "09/11/2026") },
];

export const SEED_SECOND_COPIES: SecondCopy[] = [{ id: "seg-1", deliveryId: "del-4", patientName: "Ana Beatriz Costa", exam: "TSH", requestedBy: "Patrícia Costa", requesterType: "Paciente", motive: "Paciente perdeu a via impressa e solicitou nova cópia para o pediatra.", reissuedAt: "11/11/2026, 09:18", responsible: "Recepção — Lab" }];
