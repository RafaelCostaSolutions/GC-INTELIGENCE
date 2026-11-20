// Setor Laboratório › Pedido e Agendamento
import { SEED_EXAMS } from "../../../data/laboratorio";

export function labEligibility(convenio: string, examNames: string[]) {
  const carencia = convenio === "SUS" ? "Sem carência" : convenio === "Particular" ? "Sem carência" : convenio === "Amil" ? "Carência de 30 dias para exames de imagem" : "Carência cumprida";
  const perExam = examNames.map(name => {
    const ex = SEED_EXAMS.find(e => e.name === name);
    const price = ex?.price || 0;
    const coverage: "Coberto" | "Parcial" | "Não coberto" = convenio === "Particular" ? "Coberto" : convenio === "SUS" && ex?.area === "Imagem" ? "Parcial" : convenio === "Amil" && ex?.area === "Hormonal" ? "Parcial" : "Coberto";
    const covered = coverage === "Coberto" ? price : coverage === "Parcial" ? Math.round(price * 0.6 * 100) / 100 : 0;
    const copart = Math.round((price - covered) * 100) / 100;
    return { name, price, coverage, covered, copart, area: ex?.area || "—" };
  });
  const total = perExam.reduce((s, x) => s + x.price, 0);
  const coveredTotal = perExam.reduce((s, x) => s + x.covered, 0);
  const copartTotal = Math.round((total - coveredTotal) * 100) / 100;
  const needsAuth = perExam.some(x => x.area === "Imagem" || x.price >= 400) || convenio === "SUS";
  const overall: "Coberto" | "Parcial" | "Não coberto" = perExam.some(x => x.coverage === "Não coberto") ? "Não coberto" : perExam.some(x => x.coverage === "Parcial") ? "Parcial" : "Coberto";
  return { perExam, total, coveredTotal, copartTotal, carencia, needsAuth, overall };
}
