// Setor Clínica › Atendimento e Consulta
export function fmtTimer(sec: number) { const m = Math.floor(sec / 60); const s = sec % 60; return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`; }

export function initials(name: string) { return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase(); }
