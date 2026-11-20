// Funções utilitárias compartilhados — setor Clínica
export function medNameFromContinuous(m: string) { return m.split("—")[0].split("-")[0].trim().split(" ")[0]; }
