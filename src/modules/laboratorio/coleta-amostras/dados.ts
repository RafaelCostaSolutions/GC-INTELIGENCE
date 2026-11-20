// Setor Laboratório › Coleta e Amostras
export const SAMPLE_TYPES = ["Sangue", "Urina", "Fezes", "Swab", "Escarro", "Líquido", "Outro"];

export const TUBE_OPTIONS = ["EDTA", "Soro", "Citrato", "Heparina", "Fluoreto", "Frasco estéril", "Swab"] as const;

export const TUBE_COLOR: Record<string, string> = { EDTA: "#7A3FA0", Soro: "#E4A11B", Citrato: "#2C7FA6", Heparina: "#177E4B", Fluoreto: "#8A959B", "Frasco estéril": "#E9EDEF", Swab: "#E67E22" };

export const SAMPLE_LOCATIONS = ["Bancada 1", "Bancada 2", "Geladeira 2", "Geladeira 1", "Freezer", "Área de análise", "Transporte"];

export const RECEIPT_CONDITIONS = ["Adequada", "Hemolisada", "Volume insuficiente", "Identificação divergente"];

export const RECOLLECT_MOTIVES = ["Hemólise", "Volume insuficiente", "Identificação divergente", "Jejum inadequado", "Outro motivo"];

export const SUPPORT_LABS_SIMPLE = ["Lab Apoio Hormonal", "Lab Apoio Sorologia", "Lab Apoio Imagem"];

export const fmtDT = (iso: string) => { if (!iso) return "—"; const d = new Date(iso); return isNaN(d.getTime()) ? iso : d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); };

export const isoHoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

export const isoDaysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
