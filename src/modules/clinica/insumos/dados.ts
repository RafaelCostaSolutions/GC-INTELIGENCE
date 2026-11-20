// Setor Clínica › Controle de Insumos
import { type InsumoItem, type InsumoMov } from "./tipos";

const daysFromNow = (d: number) => { const t = new Date(); t.setDate(t.getDate() + d); return t.toISOString().slice(0, 10); };

export const INSUMO_ITEMS: InsumoItem[] = [
  { id: "i-gaze", barcode: "789100100001", name: "Gaze estéril", unit: "pacote", unitCost: 4.2, lot: "L-2481", expiry: daysFromNow(180), room: "Consultório 1", cabinet: "Armário A", stock: 42, min: 20 },
  { id: "i-soro", barcode: "789100100002", name: "Soro fisiológico 500 ml", unit: "frasco", unitCost: 8.9, lot: "L-3310", expiry: daysFromNow(240), room: "Sala de Procedimentos", cabinet: "Armário B", stock: 18, min: 15 },
  { id: "i-fio", barcode: "789100100003", name: "Fio de sutura", unit: "unidade", unitCost: 12.5, lot: "L-1190", expiry: daysFromNow(300), room: "Sala de Procedimentos", cabinet: "Armário B", stock: 9, min: 10 },
  { id: "i-agulha", barcode: "789100100004", name: "Agulha descartável", unit: "unidade", unitCost: 1.8, lot: "L-5520", expiry: daysFromNow(365), room: "Sala de Procedimentos", cabinet: "Armário B", stock: 64, min: 30 },
  { id: "i-lamina", barcode: "789100100005", name: "Lâmina de bisturi", unit: "unidade", unitCost: 3.4, lot: "L-9081", expiry: daysFromNow(-10), room: "Sala de Procedimentos", cabinet: "Armário B", stock: 14, min: 12 },
  { id: "i-luva", barcode: "789100100006", name: "Luva de procedimento", unit: "par", unitCost: 2.1, lot: "L-7742", expiry: daysFromNow(90), room: "Consultório 2", cabinet: "Armário A", stock: 120, min: 60 },
  { id: "i-seringa", barcode: "789100100007", name: "Seringa 10 ml", unit: "unidade", unitCost: 2.6, lot: "L-6613", expiry: daysFromNow(12), room: "Consultório 3", cabinet: "Armário C", stock: 28, min: 20 },
  { id: "i-curativo", barcode: "789100100008", name: "Curativo adesivo", unit: "unidade", unitCost: 5.8, lot: "L-4029", expiry: daysFromNow(200), room: "Consultório 1", cabinet: "Armário A", stock: 11, min: 15 },
  { id: "i-anestesico", barcode: "789100100009", name: "Anestésico local", unit: "ampola", unitCost: 18.4, lot: "L-2155", expiry: daysFromNow(150), room: "Sala de Procedimentos", cabinet: "Armário B", stock: 16, min: 8 },
  { id: "i-antisseptico", barcode: "789100100010", name: "Antisséptico", unit: "frasco", unitCost: 11.2, lot: "L-8834", expiry: daysFromNow(120), room: "Consultório 2", cabinet: "Armário A", stock: 7, min: 10 },
];

export const INSUMO_KITS: { name: string; procedure: string; items: { itemId: string; qty: number }[] }[] = [
  { name: "Kit Curativo", procedure: "Curativo", items: [{ itemId: "i-gaze", qty: 2 }, { itemId: "i-soro", qty: 1 }, { itemId: "i-curativo", qty: 1 }, { itemId: "i-luva", qty: 2 }] },
  { name: "Kit Sutura", procedure: "Sutura", items: [{ itemId: "i-fio", qty: 1 }, { itemId: "i-agulha", qty: 1 }, { itemId: "i-lamina", qty: 1 }, { itemId: "i-luva", qty: 2 }, { itemId: "i-antisseptico", qty: 1 }] },
  { name: "Kit Biópsia", procedure: "Coleta / Biópsia de pele", items: [{ itemId: "i-lamina", qty: 1 }, { itemId: "i-seringa", qty: 1 }, { itemId: "i-gaze", qty: 2 }, { itemId: "i-luva", qty: 2 }, { itemId: "i-curativo", qty: 1 }] },
  { name: "Kit Infiltração", procedure: "Infiltração", items: [{ itemId: "i-seringa", qty: 1 }, { itemId: "i-agulha", qty: 1 }, { itemId: "i-anestesico", qty: 1 }, { itemId: "i-gaze", qty: 1 }, { itemId: "i-luva", qty: 2 }] },
];

export const INSUMO_SEED_SAIDAS: InsumoMov[] = [
  { id: "seed-s1", kind: "saida", itemId: "i-gaze", itemName: "Gaze estéril", qty: 2, unitCost: 4.2, total: 8.4, professional: "Enf. Ricardo — Clínica", patientId: "p1", patientName: "Maria Aparecida Silva", consultationId: "c-seed-1", consultationLabel: "12/05/2026 · Clínica Geral", procedure: "Curativo", specialty: "Clínica Geral", room: "Consultório 1", dateTime: "12/05/2026, 10:40" },
  { id: "seed-s2", kind: "saida", itemId: "i-soro", itemName: "Soro fisiológico 500 ml", qty: 1, unitCost: 8.9, total: 8.9, professional: "Enf. Ricardo — Clínica", patientId: "p1", patientName: "Maria Aparecida Silva", consultationId: "c-seed-1", consultationLabel: "12/05/2026 · Clínica Geral", procedure: "Curativo", specialty: "Clínica Geral", room: "Consultório 1", dateTime: "12/05/2026, 10:40", kitName: "Kit Curativo" },
  { id: "seed-s3", kind: "saida", itemId: "i-luva", itemName: "Luva de procedimento", qty: 2, unitCost: 2.1, total: 4.2, professional: "Dra. Ana Paula — Clínica Geral", patientId: "p4", patientName: "Carlos Eduardo Oliveira", consultationId: "", consultationLabel: "Atendimento do dia", procedure: "Consulta", specialty: "Cardiologia", room: "Consultório 2", dateTime: "22/05/2026, 09:15" },
];

export const INSUMO_TREND = [{ m: "Jan", custo: 1240, itens: 312 }, { m: "Fev", custo: 1380, itens: 341 }, { m: "Mar", custo: 1290, itens: 318 }, { m: "Abr", custo: 1520, itens: 372 }, { m: "Mai", custo: 1680, itens: 398 }, { m: "Jun", custo: 1840, itens: 421 }];

export const INSUMO_PROFISSIONAIS = ["Dra. Ana Paula — Clínica Geral", "Dr. Roberto — Cardiologia", "Dra. Camila — Pediatria", "Dr. Thiago — Ortopedia", "Enf. Ricardo — Clínica"];
