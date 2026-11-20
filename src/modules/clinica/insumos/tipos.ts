// Setor Clínica › Controle de Insumos
export type InsumoItem = { id: string; barcode: string; name: string; unit: string; unitCost: number; lot: string; expiry: string; room: string; cabinet: string; stock: number; min: number };

export type InsumoMov = { id: string; kind: "saida" | "perda" | "compra"; itemId: string; itemName: string; qty: number; unitCost: number; total: number; professional: string; patientId: string; patientName: string; consultationId: string; consultationLabel: string; procedure: string; specialty: string; room: string; dateTime: string; kitName?: string; kitBatch?: string; motive?: string };
