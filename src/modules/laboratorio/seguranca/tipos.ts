// Setor Laboratório › Segurança e Conformidade
export type AuditEvent = { id: string; when: string; type: string; patientName: string; exam: string; user: string; before: string; after: string };

export type SignedReport = { id: string; patientName: string; exam: string; signedAt: string; hash: string; code: string; cert: string; version: number; copies: number };
