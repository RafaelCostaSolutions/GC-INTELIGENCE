// Setor Clínica › Procedimentos e Estrutura
export type RoomStatus = "Livre" | "Ocupada" | "Em limpeza" | "Manutenção";

export type RoomRec = { id: string; name: string; status: RoomStatus };

export type ReservationRec = { id: string; room: string; equipment: string; patientId: string; procedure: string; date: string; start: string; end: string; status: string };

export type ClinicProcedureRec = { id: string; type: string; patientId: string; room: string; professional: string; team: string; date: string; start: string; end: string; material: string; anesthesia: string; notes: string };

export type SterilizationRec = { id: string; code: string; lot: string; item: string; sterilizedDate: string; expiry: string; status: "Esterilizado" | "Em uso" | "Vencido" | "Reprocessar"; usedByPatientId?: string; usedByProcedure?: string };

export type CleaningRec = { id: string; room: string; responsible: string; type: "Terminal" | "Concorrente"; date: string; time: string; items: string[]; status: "Em limpeza" | "Concluída" };

export type ClinicEquipmentRec = { id: string; name: string; status: "Operacional" | "Em manutenção" | "Parado"; lastMaintenance: string; nextMaintenance: string; location: string };

export type EquipmentTicketRec = { id: string; equipmentId: string; equipmentName: string; description: string; status: "Aberto" | "Em atendimento" | "Concluído"; createdAt: string };

export type ConsentRec = { id: string; patientId: string; procedure: string; model: "Procedimento" | "Anestesia" | "Uso de imagem"; text: string; signedPatient: boolean; signedProfessional: boolean; signedAt?: string; preDelivered: boolean; postDelivered: boolean };

export type IncidentRec = { id: string; patientId: string; procedure: string; type: "Intercorrência" | "Evento adverso"; severity: "Leve" | "Moderada" | "Grave" | "Crítica"; description: string; conduct: string; notified: string; status: "Aberto" | "Em análise" | "Concluído"; date: string };
