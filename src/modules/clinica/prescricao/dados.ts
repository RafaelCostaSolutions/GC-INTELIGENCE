// Setor Clínica › Prescrição e Solicitações
import { type PrescriptionItem } from "../../../types/clinica";

export const DRUG_CATALOG: { name: string; cls: string }[] = [
  { name: "Losartana", cls: "ARA II" }, { name: "Metformina", cls: "Antidiabético" }, { name: "Amoxicilina", cls: "Antibiótico beta-lactâmico" }, { name: "Penicilina", cls: "Antibiótico beta-lactâmico" }, { name: "Dipirona", cls: "Analgésico" }, { name: "Omeprazol", cls: "Inibidor de bomba de prótons" }, { name: "Atorvastatina", cls: "Estatina" }, { name: "Clopidogrel", cls: "Antiagregante" }, { name: "Amlodipina", cls: "Bloqueador de cálcio" }, { name: "Salbutamol", cls: "Broncodilatador" }, { name: "Levotiroxina", cls: "Hormônio tireoidiano" }, { name: "Furosemida", cls: "Diurético" }, { name: "Insulina", cls: "Antidiabético" }, { name: "Azitromicina", cls: "Antibiótico macrolídeo" },
];

export const MODEL_PRESCRIPTIONS: Record<string, PrescriptionItem[]> = {
  "Hipertensão": [{ med: "Losartana", dose: "50 mg", via: "Oral", frequency: "1x ao dia", duration: "Uso contínuo", notes: "Manter controle da pressão." }, { med: "Amlodipina", dose: "5 mg", via: "Oral", frequency: "1x ao dia", duration: "Uso contínuo", notes: "Se pressão acima da meta." }],
  "Diabetes": [{ med: "Metformina", dose: "850 mg", via: "Oral", frequency: "2x ao dia", duration: "Uso contínuo", notes: "Após as refeições." }],
  "Infecção respiratória": [{ med: "Amoxicilina", dose: "500 mg", via: "Oral", frequency: "3x ao dia", duration: "7 dias", notes: "Completar o tratamento mesmo com melhora." }, { med: "Dipirona", dose: "500 mg", via: "Oral", frequency: "Se dor ou febre", duration: "3 dias", notes: "Se necessário." }],
};

export const EXAM_OPTIONS: Record<string, string[]> = {
  "Exame laboratorial": ["Hemograma", "Glicemia", "Colesterol", "TSH", "Urina (EAS)", "Potássio", "Creatinina", "Hemoglobina glicada"],
  "Exame de imagem": ["Raio-X", "Ultrassom", "Tomografia", "Ressonância", "Mamografia", "Eletrocardiograma"],
  "Procedimento": ["Curativo", "Sutura", "Infiltração", "Retirada de pontos", "Drenagem de abscesso", "Imobilização", "Cauterização"],
  "Encaminhamento": ["Cardiologia", "Ortopedia", "Dermatologia", "Pediatria", "Ginecologia", "Endocrinologia", "Neurologia"],
};
