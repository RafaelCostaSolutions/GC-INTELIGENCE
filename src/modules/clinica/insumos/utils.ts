// Setor Clínica › Controle de Insumos
import { fmtDate } from "../../../data/clinica";

export function expiryStatus(expiry: string) { const today = new Date(); today.setHours(0, 0, 0, 0); const exp = new Date(expiry + "T00:00:00"); const diff = Math.ceil((exp.getTime() - today.getTime()) / 86400000); if (diff < 0) return { label: "Vencido - Bloqueado", cls: "bg-[#F8DEDC] text-[#8B2626]", blocked: true, days: diff }; if (diff <= 30) return { label: `Vence em ${diff} dia(s)`, cls: "bg-[#FFF0C5] text-[#7A5600]", blocked: false, days: diff }; return { label: `Validade ${fmtDate(expiry)}`, cls: "bg-[var(--surface-2)] text-[var(--muted)]", blocked: false, days: diff }; }
