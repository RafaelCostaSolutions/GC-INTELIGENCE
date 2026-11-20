// Setor Clínica › Equipe e Produtividade
import { type EscalaItem, type MetaItem, type Profissional } from "./tipos";

export const EQUIPE_ESPECIALIDADES = ["Clínica Geral", "Cardiologia", "Pediatria", "Ginecologia", "Ortopedia", "Dermatologia", "Enfermagem", "Nutrição", "Psicologia", "Fisioterapia"];

export const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

export const META_TEMPO: Record<string, number> = { "Clínica Geral": 30, Cardiologia: 28, Pediatria: 22, Ginecologia: 30, Ortopedia: 25, Dermatologia: 20, Enfermagem: 20, Nutrição: 30, Psicologia: 40, Fisioterapia: 30 };

export const SEED_PROFISSIONAIS: Profissional[] = [
  { id: "eq-ana", name: "Dra. Ana Paula", specialty: "Clínica Geral", council: "CRM-SP 123456", vinculo: "CLT", phone: "(11) 98765-4321", email: "ana.paula@gottcured.com.br", valorHora: 180, pctRepasse: 40, ativo: true, modelo: "% sobre produção", valorRepasse: 40, producaoBruta: 48200, consultas: 132, procedimentos: 18, retornos: 34, teleconsultas: 22, tempoMedio: 27, horasContratadas: 160, horasTrabalhadas: 148, satisfacao: 4.8, avaliacoes: 86, comentarios: ["Atendimento atencioso e explicação clara.", "Consulta no horário, muito cuidadosa."] },
  { id: "eq-roberto", name: "Dr. Roberto", specialty: "Cardiologia", council: "CRM-SP 234567", vinculo: "PJ", phone: "(11) 97654-3210", email: "roberto@gottcured.com.br", valorHora: 220, pctRepasse: 45, ativo: true, modelo: "% sobre produção", valorRepasse: 45, producaoBruta: 61400, consultas: 118, procedimentos: 12, retornos: 41, teleconsultas: 14, tempoMedio: 28, horasContratadas: 140, horasTrabalhadas: 138, satisfacao: 4.7, avaliacoes: 74, comentarios: ["Explicou o exame com calma e clareza.", "Muito pontual e objetivo."] },
  { id: "eq-camila", name: "Dra. Camila", specialty: "Pediatria", council: "CRM-SP 345678", vinculo: "CLT", phone: "(11) 96543-2109", email: "camila@gottcured.com.br", valorHora: 170, pctRepasse: 38, ativo: true, modelo: "% sobre produção", valorRepasse: 38, producaoBruta: 39800, consultas: 141, procedimentos: 8, retornos: 29, teleconsultas: 26, tempoMedio: 22, horasContratadas: 150, horasTrabalhadas: 121, satisfacao: 4.9, avaliacoes: 92, comentarios: ["Ótima com crianças, deixou meu filho à vontade.", "Consulta acolhedora e completa."] },
  { id: "eq-juliana", name: "Dra. Juliana", specialty: "Ginecologia", council: "CRM-SP 456789", vinculo: "Cooperado", phone: "(11) 95432-1098", email: "juliana@gottcured.com.br", valorHora: 190, pctRepasse: 42, ativo: true, modelo: "Por consulta", valorRepasse: 95, producaoBruta: 44600, consultas: 104, procedimentos: 21, retornos: 26, teleconsultas: 9, tempoMedio: 30, horasContratadas: 120, horasTrabalhadas: 118, satisfacao: 4.6, avaliacoes: 63, comentarios: ["Atendimento respeitoso e esclarecedor."] },
  { id: "eq-thiago", name: "Dr. Thiago", specialty: "Ortopedia", council: "CRM-SP 567890", vinculo: "PJ", phone: "(11) 94321-0987", email: "thiago@gottcured.com.br", valorHora: 210, pctRepasse: 45, ativo: true, modelo: "% sobre produção", valorRepasse: 45, producaoBruta: 52700, consultas: 96, procedimentos: 34, retornos: 31, teleconsultas: 7, tempoMedio: 25, horasContratadas: 130, horasTrabalhadas: 129, satisfacao: 4.5, avaliacoes: 58, comentarios: ["Explicou a recuperação passo a passo."] },
  { id: "eq-fernanda", name: "Dra. Fernanda", specialty: "Dermatologia", council: "CRM-SP 678901", vinculo: "Autônomo", phone: "(11) 93210-9876", email: "fernanda@gottcured.com.br", valorHora: 200, pctRepasse: 50, ativo: true, modelo: "% sobre produção", valorRepasse: 50, producaoBruta: 38900, consultas: 88, procedimentos: 27, retornos: 18, teleconsultas: 11, tempoMedio: 20, horasContratadas: 100, horasTrabalhadas: 66, satisfacao: 4.7, avaliacoes: 49, comentarios: ["Avaliação detalhada da pele, recomendo."] },
  { id: "eq-ricardo", name: "Enf. Ricardo", specialty: "Enfermagem", council: "COREN-SP 789012", vinculo: "CLT", phone: "(11) 92109-8765", email: "ricardo@gottcured.com.br", valorHora: 65, pctRepasse: 0, ativo: true, modelo: "Fixo", valorRepasse: 6800, producaoBruta: 18400, consultas: 0, procedimentos: 96, retornos: 0, teleconsultas: 0, tempoMedio: 20, horasContratadas: 180, horasTrabalhadas: 172, satisfacao: 4.8, avaliacoes: 71, comentarios: ["Equipe de enfermagem muito atenciosa."] },
  { id: "eq-lucia", name: "Dra. Lúcia", specialty: "Nutrição", council: "CRN-SP 890123", vinculo: "PJ", phone: "(11) 91098-7654", email: "lucia@gottcured.com.br", valorHora: 110, pctRepasse: 40, ativo: true, modelo: "Por consulta", valorRepasse: 70, producaoBruta: 21200, consultas: 62, procedimentos: 4, retornos: 22, teleconsultas: 18, tempoMedio: 30, horasContratadas: 110, horasTrabalhadas: 84, satisfacao: 4.6, avaliacoes: 41, comentarios: ["Plano alimentar claro e possível de seguir."] },
  { id: "eq-marcos", name: "Dr. Marcos", specialty: "Psicologia", council: "CRP-SP 901234", vinculo: "Cooperado", phone: "(11) 90987-6543", email: "marcos@gottcured.com.br", valorHora: 130, pctRepasse: 45, ativo: false, modelo: "% sobre produção", valorRepasse: 45, producaoBruta: 15600, consultas: 48, procedimentos: 0, retornos: 19, teleconsultas: 30, tempoMedio: 40, horasContratadas: 90, horasTrabalhadas: 58, satisfacao: 4.9, avaliacoes: 38, comentarios: ["Escuta atenta, me senti acolhido."] },
];

export const SEED_ESCALA: EscalaItem[] = [
  { id: "esc-1", profissionalId: "eq-ana", dia: "Segunda", inicio: "08:00", fim: "12:00", sala: "Sala 1" },
  { id: "esc-2", profissionalId: "eq-ana", dia: "Quarta", inicio: "08:00", fim: "12:00", sala: "Sala 1" },
  { id: "esc-3", profissionalId: "eq-roberto", dia: "Terça", inicio: "08:00", fim: "12:00", sala: "Sala 2" },
  { id: "esc-4", profissionalId: "eq-roberto", dia: "Quinta", inicio: "14:00", fim: "18:00", sala: "Sala 2" },
  { id: "esc-5", profissionalId: "eq-camila", dia: "Segunda", inicio: "14:00", fim: "18:00", sala: "Sala 3" },
  { id: "esc-6", profissionalId: "eq-camila", dia: "Quinta", inicio: "08:00", fim: "12:00", sala: "Sala 3" },
  { id: "esc-7", profissionalId: "eq-juliana", dia: "Quarta", inicio: "14:00", fim: "18:00", sala: "Sala 4" },
  { id: "esc-8", profissionalId: "eq-thiago", dia: "Sexta", inicio: "08:00", fim: "12:00", sala: "Sala 2" },
  { id: "esc-9", profissionalId: "eq-fernanda", dia: "Terça", inicio: "14:00", fim: "18:00", sala: "Sala 4" },
  { id: "esc-10", profissionalId: "eq-ricardo", dia: "Segunda", inicio: "08:00", fim: "12:00", sala: "Sala 5" },
  { id: "esc-11", profissionalId: "eq-lucia", dia: "Quarta", inicio: "08:00", fim: "12:00", sala: "Sala 5" },
];

export const SEED_METAS: MetaItem[] = [
  { id: "meta-ana", tipo: "Profissional", alvo: "eq-ana", metaMensal: 120 },
  { id: "meta-roberto", tipo: "Profissional", alvo: "eq-roberto", metaMensal: 110 },
  { id: "meta-camila", tipo: "Profissional", alvo: "eq-camila", metaMensal: 130 },
  { id: "meta-juliana", tipo: "Profissional", alvo: "eq-juliana", metaMensal: 100 },
  { id: "meta-thiago", tipo: "Profissional", alvo: "eq-thiago", metaMensal: 90 },
  { id: "meta-cardio", tipo: "Especialidade", alvo: "Cardiologia", metaMensal: 140 },
  { id: "meta-ped", tipo: "Especialidade", alvo: "Pediatria", metaMensal: 150 },
  { id: "meta-clin", tipo: "Especialidade", alvo: "Clínica Geral", metaMensal: 160 },
];
