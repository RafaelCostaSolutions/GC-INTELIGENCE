// Tipos compartilhados — setor Clínica
type PredictiveLevel = "Alto" | "Médio" | "Baixo";

export type PredictiveAlert = { id: string; category: string; title: string; detail: string; reason: string; probability: number; level: PredictiveLevel; actionLabel: string; actionOptions?: string[]; patientId?: string };

type HistoryItem = { date: string; type: string; professional: string; result: string; detail: string };

type DocItem = { name: string; type: string; date: string; size: string };

type FamilyItem = { name: string; relation: string; phone: string; emergency?: boolean };

type TimelineItem = { date: string; type: string; title: string; detail: string };

export type Rectification = { id: string; date: string; by: string; reason: string; newText: string };

export type Consultation = { id: string; date: string; professional: string; specialty: string; kind: "Consulta" | "Evolução"; complaint: string; historyText: string; physicalExam: string; hypothesis: string; conduct: string; signed?: boolean; signedBy?: string; signedAt?: string; locked?: boolean; rectifications: Rectification[] };

export type Vital = { id: string; date: string; weight: number; height: number; bmi: number; systolic: number; diastolic: number; heartRate: number; temp: number; saturation: number; glucose: number };

export type Diagnosis = { id: string; code: string; description: string; date: string; status: "Ativo" | "Resolvido" };

export type ProcedureItem = { id: string; name: string; date: string; professional: string; material: string; notes: string };

export type CareGoal = { id: string; title: string; deadline: string; progress: number; status: "Em andamento" | "Atingida" | "Atrasada" };

export type PrescriptionItem = { med: string; dose: string; via: string; frequency: string; duration: string; notes: string; allergy?: string; interaction?: string; duplicate?: string; overrideReason?: string; keepAnyway?: boolean };

export type Prescription = { id: string; date: string; professional: string; items: PrescriptionItem[]; special?: { kind: string; justification: string; crm: string; validity: string; number: string } | null; signed?: boolean; signedBy?: string; signedAt?: string; whatsappAt?: string };

export type CareOrder = { id: string; date: string; kind: "Exame laboratorial" | "Exame de imagem" | "Procedimento" | "Encaminhamento"; name: string; specialty?: string; priority: "Rotina" | "Urgente"; notes: string; status: "Solicitado" | "Coletado" | "Em análise" | "Resultado disponível" | "Avaliado"; result?: string; critical?: boolean; signed?: boolean; signedBy?: string; signedAt?: string; whatsappAt?: string };

export type Patient = {
  id: string; name: string; cpf: string; birth: string; sex: string; phone: string; email: string; address: string;
  insurance: string; card: string; guardianName: string; guardianRelation: string; guardianPhone: string; notes: string;
  profile: string; complexity: "Baixa" | "Média" | "Alta" | "Crítica";
  allergies: string[]; comorbidities: string[]; meds: string[];
  history: HistoryItem[]; documents: DocItem[]; family: FamilyItem[]; timeline: TimelineItem[];
  recordId?: string;
  consultations?: Consultation[]; vitals?: Vital[]; diagnoses?: Diagnosis[]; procedures?: ProcedureItem[]; careGoals?: CareGoal[]; prescriptions?: Prescription[]; orders?: CareOrder[];
};
