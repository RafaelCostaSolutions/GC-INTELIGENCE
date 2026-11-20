// Setor Clínica › Cadastro de Pacientes
export const CID_LIST = [
  { code: "I10", description: "Hipertensão essencial (primária)" },
  { code: "E11", description: "Diabetes mellitus tipo 2" },
  { code: "J45", description: "Asma" },
  { code: "M17", description: "Gonartrose [artrose do joelho]" },
  { code: "E78", description: "Distúrbios do metabolismo de lipoproteínas / Dislipidemia" },
  { code: "I25", description: "Doença isquêmica crônica do coração" },
  { code: "N18", description: "Doença renal crônica" },
  { code: "K29", description: "Gastrite e duodenite" },
  { code: "M54", description: "Dorsalgia" },
  { code: "J44", description: "Outras doenças pulmonares obstrutivas crônicas" },
  { code: "F41", description: "Outros transtornos ansiosos" },
  { code: "L40", description: "Psoríase" },
  { code: "M75", description: "Lesões do ombro" },
  { code: "N39", description: "Outros transtornos do trato urinário" },
  { code: "E03", description: "Outros hipotireoidismos" },
  { code: "I83", description: "Varizes dos membros inferiores" },
];

export const SPECIALTY_TEMPLATES: Record<string, { complaint: string; historyText: string; physicalExam: string; hypothesis: string; conduct: string }> = {
  "Clínica Geral": { complaint: "Consulta de rotina / acompanhamento clínico.", historyText: "Paciente relata evolução dos sintomas nas últimas semanas, sem febre. Nega dor torácica, dispneia ou sangramento. Mantém medicação de uso contínuo conforme prescrição.", physicalExam: "Estado geral bom, corado, hidratado. Ausculta cardíaca e pulmonar sem alterações significativas. Abdome sem dor à palpação.", hypothesis: "Acompanhamento clínico — quadro estável, sem sinais de descompensação.", conduct: "Manter medicação atual, solicitar exames de rotina e retorno em 90 dias. Orientações sobre hábitos saudáveis." },
  "Cardiologia": { complaint: "Acompanhamento cardiológico / controle da pressão arterial.", historyText: "Paciente refere pressão arterial com variações em domicílio. Nega dor torácica, palpitações ou síncope. Mantém uso de anti-hipertensivo.", physicalExam: "PA aferida em repouso. Frequência cardíaca regular. Ausculta cardíaca com bulhas rítmicas, sem sopros. Membros inferiores sem edema significativo.", hypothesis: "Hipertensão arterial em acompanhamento — CID I10.", conduct: "Ajustar medicação se necessário, solicitar ECG e exames laboratoriais, orientar redução de sódio e retorno em 60 dias." },
  "Pediatria": { complaint: "Consulta pediátrica de rotina / acompanhamento do crescimento.", historyText: "Responsável relata desenvolvimento dentro do esperado, alimentação regular e sono adequado. Vacinação em dia. Nega febre ou vômitos recentes.", physicalExam: "Criança ativa, hidratada. Peso e altura aferidos e registrados na curva de crescimento. Ausculta cardíaca e pulmonar normais.", hypothesis: "Crescimento e desenvolvimento adequados para a idade.", conduct: "Manter acompanhamento semestral, reforçar calendário vacinal e orientações de alimentação e higiene." },
  "Ginecologia": { complaint: "Consulta ginecológica de rotina / acompanhamento.", historyText: "Paciente relata ciclo menstrual regular, sem dor intensa. Nega corrimento, sangramento fora do ciclo ou queixas urinárias.", physicalExam: "Exame físico geral sem alterações. Exame ginecológico conforme rotina, sem achados relevantes no momento.", hypothesis: "Acompanhamento ginecológico de rotina.", conduct: "Solicitar exames de rotina, orientar retorno anual ou antes se surgirem sintomas e reforçar medidas preventivas." },
  "Ortopedia": { complaint: "Dor articular / acompanhamento ortopédico.", historyText: "Paciente relata dor articular com piora ao esforço e melhora com repouso. Nega trauma recente, febre ou inchaço acentuado.", physicalExam: "Articulação com mobilidade preservada, sem deformidade. Dor à palpação local. Sem sinais de instabilidade.", hypothesis: "Artrose / dor articular em acompanhamento — avaliar CID M17 quando joelho.", conduct: "Orientar fisioterapia, analgesia conforme prescrição, controle de peso e retorno para reavaliação." },
  "Dermatologia": { complaint: "Lesão de pele / acompanhamento dermatológico.", historyText: "Paciente relata lesão de pele com evolução nas últimas semanas, com coceira leve. Nega febre, secreção ou sangramento.", physicalExam: "Lesão localizada, sem sinais de infecção secundária. Pele ao redor sem alterações relevantes.", hypothesis: "Dermatose em avaliação — definir conduta após exame da lesão.", conduct: "Orientar cuidados com a pele, evitar automedicação, solicitar avaliação complementar se necessário e retorno em 30 dias." },
};

export const COMPLEXITY_STYLE: Record<string, string> = { "Baixa": "bg-[var(--primary-soft)] text-[var(--primary)]", "Média": "bg-[#FFF0C5] text-[#7A5600]", "Alta": "bg-[#FFE0C2] text-[#7A3A00]", "Crítica": "bg-[#F8DEDC] text-[#8B2626]" };

export const EMPTY_FORM = { name: "", cpf: "", birth: "", sex: "Feminino", phone: "", email: "", address: "", insurance: "SUS", card: "", guardianName: "", guardianRelation: "", guardianPhone: "", notes: "" };
