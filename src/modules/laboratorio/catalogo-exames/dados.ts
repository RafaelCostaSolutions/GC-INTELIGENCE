// Setor Laboratório › Cadastro e Catálogo de Exames
import { type ExamPackage, type SupportLab } from "./tipos";

export const EXAM_AREAS = ["Hematologia", "Bioquímica", "Hormonal", "Imunologia", "Microbiologia", "Urinálise", "Parasitologia", "Imagem"];

export const SEED_LABS: SupportLab[] = [
  { id: "lab-apoio-1", name: "Lab Apoio Hormonal", cnpj: "12.345.678/0001-90", contact: "contato@labhormonal.com.br · (11) 3000-1100", prazo: "72 h", areas: ["Hormonal", "Bioquímica"], cost: 48 },
  { id: "lab-apoio-2", name: "Lab Apoio Sorologia", cnpj: "23.456.789/0001-01", contact: "contato@labsorologia.com.br · (11) 3000-2200", prazo: "48 h", areas: ["Imunologia", "Microbiologia"], cost: 52 },
  { id: "lab-apoio-3", name: "Lab Apoio Imagem", cnpj: "34.567.890/0001-12", contact: "contato@labimagem.com.br · (11) 3000-3300", prazo: "72 h", areas: ["Imagem"], cost: 320 },
];

export const SEED_PACKAGES: ExamPackage[] = [
  { id: "pkg-basico", name: "Check-up Básico", examIds: ["ex-hemograma", "ex-glicemia", "ex-colesterol", "ex-eas"], price: 180 },
  { id: "pkg-completo", name: "Check-up Completo", examIds: ["ex-hemograma", "ex-glicemia", "ex-hba1c", "ex-colesterol", "ex-tsh", "ex-eas", "ex-parasitologico"], price: 340 },
  { id: "pkg-preop", name: "Pré-operatório", examIds: ["ex-hemograma", "ex-glicemia", "ex-colesterol", "ex-pcr", "ex-eas", "ex-raiox"], price: 380 },
  { id: "pkg-hormonal", name: "Hormonal Feminino", examIds: ["ex-tsh", "ex-estradiol", "ex-vitd", "ex-hemograma"], price: 290 },
  { id: "pkg-diabetes", name: "Diabetes", examIds: ["ex-glicemia", "ex-hba1c", "ex-colesterol", "ex-eas"], price: 190 },
];
