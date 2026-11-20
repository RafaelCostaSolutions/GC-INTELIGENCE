// Setor Clínica › Prescrição e Solicitações
import { INTERACTION_MAP } from "../../../data/clinica";
import { medNameFromContinuous } from "../../../lib/clinica";
import { type Patient } from "../../../types/clinica";
import { DRUG_CATALOG } from "./dados";

function drugClass(name: string) { return DRUG_CATALOG.find(d => d.name === name)?.cls || ""; }

function parseOrderDate(d: string) { if (!d) return null; if (d.includes("/")) { const [dd, mm, yy] = d.split("/"); return new Date(Number(yy), Number(mm) - 1, Number(dd)); } return new Date(d); }

export function daysSince(d: string) { const dt = parseOrderDate(d); if (!dt) return 0; return Math.max(0, Math.floor((Date.now() - dt.getTime()) / 86400000)); }

export function checkDrug(patient: Patient, med: string, others: string[]) {
  let allergy = ""; let interaction = ""; let duplicate = "";
  const lowerAllergies = patient.allergies.map(a => a.toLowerCase());
  if (lowerAllergies.some(a => med.toLowerCase().includes(a) || a.includes(med.toLowerCase()))) allergy = `ALERGIA — paciente alérgico a ${patient.allergies.find(a => med.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(med.toLowerCase())) || med}. Não prescrever sem reavaliar.`;
  if ((med === "Amoxicilina" || med === "Penicilina") && lowerAllergies.includes("penicilina")) allergy = "ALERGIA — paciente alérgico a Penicilina. Amoxicilina é da mesma classe (beta-lactâmico) e pode provocar reação cruzada.";
  const continuous = patient.meds.map(medNameFromContinuous);
  for (const other of [...continuous, ...others]) { if (!other || other === med) continue; const msg = INTERACTION_MAP[`${med}|${other}`] || INTERACTION_MAP[`${other}|${med}`]; if (msg) { interaction = msg; break; } }
  const cls = drugClass(med);
  if (cls && continuous.some(c => drugClass(c) === cls && c !== med)) duplicate = `Duplicidade terapêutica — paciente já usa ${continuous.find(c => drugClass(c) === cls)} da mesma classe (${cls}).`;
  if (continuous.includes(med)) duplicate = `Duplicidade terapêutica — ${med} já está em uso contínuo pelo paciente.`;
  if (cls && others.some(o => drugClass(o) === cls && o !== med)) duplicate = duplicate || `Duplicidade terapêutica — outro medicamento da mesma classe (${cls}) já está nesta prescrição.`;
  return { allergy, interaction, duplicate };
}
