// Setor Clínica › Cadastro de Pacientes
import { onlyDigits } from "../../../data/clinica";
import { norm } from "../../../data/comum";
import { type Patient } from "../../../types/clinica";

export function findDuplicatePatient(list: Patient[], name: string, cpf: string, birth: string, excludeId?: string) {
  const cpfD = onlyDigits(cpf);
  if (cpfD.length >= 11) { const byCpf = list.find(p => onlyDigits(p.cpf) === cpfD && p.id !== excludeId); if (byCpf) return byCpf; }
  if (name.trim() && birth) { const byName = list.find(p => norm(p.name) === norm(name) && p.birth === birth && p.id !== excludeId); if (byName) return byName; }
  return null;
}
