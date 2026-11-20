// Setor Laboratório › Entrega de Resultados
import { type DeliveryTrace } from "./tipos";

export function deliveryTrace(reagentLot: string, controlLot: string, equipment: string, operator: string, validator: string, date: string): DeliveryTrace {
  return { reagentLot, controlLot, equipment, calibration: "Calibração válida — verificada em 10/11/2026", operator, validator, steps: [{ etapa: "Coleta", at: `${date}, 08:10`, by: "Téc. Juliana — Coleta" }, { etapa: "Recebimento da amostra", at: `${date}, 08:35`, by: "Téc. Marcos — Coleta" }, { etapa: "Análise", at: `${date}, 09:40`, by: operator }, { etapa: "Validação", at: `${date}, 10:20`, by: validator }, { etapa: "Liberação do laudo", at: `${date}, 10:32`, by: validator }] };
}
