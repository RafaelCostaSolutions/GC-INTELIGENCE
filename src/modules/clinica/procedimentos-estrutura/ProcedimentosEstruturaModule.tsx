// Setor Clínica › Procedimentos e Estrutura
import { useState, useRef, useEffect } from "react";
import { dPlus, fmtDate } from "../../../data/clinica";
import { api } from "../../../services/api";
import { type Patient } from "../../../types/clinica";
import { CLEAN_ITEMS, CONSENT_TEMPLATES, ESTRUTURA_EQUIP, ESTRUTURA_PROC_TYPES, ESTRUTURA_ROOMS, ESTRUTURA_SLOTS } from "./dados";
import { type CleaningRec, type ClinicEquipmentRec, type ClinicProcedureRec, type ConsentRec, type EquipmentTicketRec, type IncidentRec, type ReservationRec, type RoomRec, type RoomStatus, type SterilizationRec } from "./tipos";
import { effSterilizationStatus, overlaps } from "./utils";

export function ProcedimentosEstruturaModule({ patients, onUpdatePatient, onNotice, onOpenPatient }: { patients: Patient[]; onUpdatePatient: (p: Patient) => Promise<void>; onNotice: (m: string) => void; onOpenPatient: (id: string) => void }) {
  const [sub, setSub] = useState("Agenda");
  const [rooms, setRooms] = useState<RoomRec[]>([
    { id: "room-1", name: "Consultório 1", status: "Livre" }, { id: "room-2", name: "Consultório 2", status: "Livre" },
    { id: "room-3", name: "Consultório 3", status: "Ocupada" }, { id: "room-4", name: "Sala de Procedimentos", status: "Livre" },
    { id: "room-5", name: "Sala de Curativos", status: "Em limpeza" },
  ]);
  const [reservations, setReservations] = useState<ReservationRec[]>([
    { id: "res-1", room: "Sala de Procedimentos", equipment: "Dermatoscópio D-01", patientId: "p1", procedure: "Retirada de lesão", date: dPlus(0), start: "09:00", end: "10:00", status: "Agendada" },
    { id: "res-2", room: "Consultório 3", equipment: "Ultrassom U-02", patientId: "p8", procedure: "Infiltração", date: dPlus(0), start: "10:00", end: "11:00", status: "Agendada" },
    { id: "res-3", room: "Sala de Curativos", equipment: "Nenhum", patientId: "p7", procedure: "Curativo complexo", date: dPlus(0), start: "08:00", end: "09:00", status: "Agendada" },
  ]);
  const [procedures, setProcedures] = useState<ClinicProcedureRec[]>([
    { id: "cp-1", type: "Sutura", patientId: "p8", room: "Sala de Procedimentos", professional: "Dr. Thiago — Ortopedia", team: "Enf. Ricardo — Clínica", date: dPlus(-1), start: "10:00", end: "10:40", material: "Fio de sutura, gaze estéril", anesthesia: "Local", notes: "Evolução satisfatória, sem intercorrência." },
    { id: "cp-2", type: "Curativo complexo", patientId: "p1", room: "Sala de Curativos", professional: "Enf. Ricardo — Clínica", team: "Téc. Enfermagem — Clínica", date: dPlus(-2), start: "09:00", end: "09:30", material: "Curativo PCT-002", anesthesia: "Sem anestesia", notes: "Lesão com boa evolução." },
  ]);
  const [sterilizations, setSterilizations] = useState<SterilizationRec[]>([
    { id: "st-1", code: "PCT-001", lot: "Lote 2410", item: "Kit sutura", sterilizedDate: dPlus(-2), expiry: dPlus(12), status: "Esterilizado" },
    { id: "st-2", code: "PCT-002", lot: "Lote 2411", item: "Kit curativo", sterilizedDate: dPlus(-5), expiry: dPlus(5), status: "Em uso", usedByPatientId: "p1", usedByProcedure: "Curativo complexo" },
    { id: "st-3", code: "PCT-003", lot: "Lote 2408", item: "Kit biópsia", sterilizedDate: dPlus(-20), expiry: dPlus(-2), status: "Esterilizado" },
    { id: "st-4", code: "PCT-004", lot: "Lote 2412", item: "Kit infiltração", sterilizedDate: dPlus(-1), expiry: dPlus(30), status: "Esterilizado" },
  ]);
  const [cleanings, setCleanings] = useState<CleaningRec[]>([
    { id: "cl-1", room: "Sala de Curativos", responsible: "Equipe de higienização — Clínica", type: "Concorrente", date: dPlus(0), time: "09:05", items: [...CLEAN_ITEMS], status: "Em limpeza" },
    { id: "cl-2", room: "Sala de Procedimentos", responsible: "Equipe de higienização — Clínica", type: "Terminal", date: dPlus(-1), time: "17:20", items: [...CLEAN_ITEMS], status: "Concluída" },
  ]);
  const [equipments, setEquipments] = useState<ClinicEquipmentRec[]>([
    { id: "eq-1", name: "Ultrassom U-02", status: "Operacional", lastMaintenance: dPlus(-40), nextMaintenance: dPlus(50), location: "Consultório 3" },
    { id: "eq-2", name: "Eletrocardiógrafo E-03", status: "Operacional", lastMaintenance: dPlus(-25), nextMaintenance: dPlus(65), location: "Consultório 1" },
    { id: "eq-3", name: "Dermatoscópio D-01", status: "Operacional", lastMaintenance: dPlus(-15), nextMaintenance: dPlus(75), location: "Sala de Procedimentos" },
    { id: "eq-4", name: "Autoclave — Clínica", status: "Operacional", lastMaintenance: dPlus(-10), nextMaintenance: dPlus(35), location: "Sala de Procedimentos" },
    { id: "eq-5", name: "Monitor M-09", status: "Em manutenção", lastMaintenance: dPlus(-60), nextMaintenance: dPlus(5), location: "Consultório 2" },
    { id: "eq-6", name: "Foco cirúrgico", status: "Operacional", lastMaintenance: dPlus(-20), nextMaintenance: dPlus(70), location: "Sala de Procedimentos" },
  ]);
  const [tickets, setTickets] = useState<EquipmentTicketRec[]>([
    { id: "tk-1", equipmentId: "eq-5", equipmentName: "Monitor M-09", description: "Bateria em verificação — teste de autonomia.", status: "Em atendimento", createdAt: dPlus(-1) },
  ]);
  const [consents, setConsents] = useState<ConsentRec[]>([
    { id: "ct-1", patientId: "p1", procedure: "Retirada de lesão", model: "Procedimento", text: CONSENT_TEMPLATES["Procedimento"].text, signedPatient: true, signedProfessional: true, signedAt: `${fmtDate(dPlus(-1))}, 09:15`, preDelivered: true, postDelivered: true },
  ]);
  const [incidents, setIncidents] = useState<IncidentRec[]>([
    { id: "in-1", patientId: "p8", procedure: "Sutura", type: "Intercorrência", severity: "Leve", description: "Sangramento leve durante o procedimento, controlado no local.", conduct: "Compressão local e curativo compressivo. Observação por 30 minutos.", notified: "Equipe da Clínica", status: "Concluído", date: dPlus(-1) },
  ]);
  const recIds = useRef<Record<string, string>>({});
  const [resForm, setResForm] = useState({ room: "Sala de Procedimentos", equipment: "Dermatoscópio D-01", patientId: patients[0]?.id || "p1", procedure: "Sutura", date: dPlus(0), start: "11:00", end: "12:00" });
  const [procForm, setProcForm] = useState({ type: "Sutura", patientId: patients[0]?.id || "p1", room: "Sala de Procedimentos", professional: "Dr. Thiago — Ortopedia", team: "Enf. Ricardo — Clínica", date: dPlus(0), start: "11:00", end: "11:40", material: "", anesthesia: "Local", notes: "" });
  const [sterForm, setSterForm] = useState({ code: "", lot: "", item: "Kit sutura", sterilizedDate: dPlus(0), expiry: dPlus(30) });
  const [useForm, setUseForm] = useState<{ pkgId: string; patientId: string; procedure: string } | null>(null);
  const [cleanForm, setCleanForm] = useState({ room: "Sala de Procedimentos", responsible: "Equipe de higienização — Clínica", type: "Concorrente" as "Terminal" | "Concorrente" });
  const [ticketForm, setTicketForm] = useState({ equipmentId: "eq-1", description: "" });
  const [showTicketsFor, setShowTicketsFor] = useState<string | null>(null);
  const [consentForm, setConsentForm] = useState({ patientId: patients[0]?.id || "p1", procedure: "Sutura", model: "Procedimento" as ConsentRec["model"], text: CONSENT_TEMPLATES["Procedimento"].text });
  const [incForm, setIncForm] = useState({ patientId: patients[0]?.id || "p1", procedure: "Sutura", type: "Intercorrência" as IncidentRec["type"], severity: "Leve" as IncidentRec["severity"], description: "", conduct: "", notified: "Equipe da Clínica" });
  const [incSeverity, setIncSeverity] = useState("Todas");
  const [incStatus, setIncStatus] = useState("Todos");
  const [agendaDate, setAgendaDate] = useState(dPlus(0));
  const today = dPlus(0);
  const inputCls = "w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none";
  const labelCls = "block text-sm font-bold";
  const pname = (id: string) => patients.find(p => p.id === id)?.name || id;
  async function persist(kind: string, entity: any) {
    const key = `${kind}:${entity.id}`;
    try {
      const value = { kind, ...entity };
      if (recIds.current[key]) await api("records.replace", { collection: "gottcured_procedimentos_estrutura", id: recIds.current[key], value });
      else { const created: any = await api("records.create", { collection: "gottcured_procedimentos_estrutura", value, idempotency_key: `gottcured-estrut-${kind}-${entity.id}` }); if (created?.id) recIds.current[key] = created.id; }
    } catch { /* mantém na sessão; sincronização será tentada novamente */ }
  }
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data: any = await api("records.list", { collection: "gottcured_procedimentos_estrutura" });
        if (!alive || !data?.records?.length) return;
        const byKind: Record<string, any[]> = {};
        for (const r of data.records) { const v = r.value || {}; if (v.kind) { (byKind[v.kind] = byKind[v.kind] || []).push(v); recIds.current[`${v.kind}:${v.id}`] = r.id; } }
        const merge = <T extends { id: string }>(prev: T[], loaded: any[]): T[] => { const m = new Map(prev.map(x => [x.id, x])); for (const x of loaded) m.set(x.id, { ...(m.get(x.id) || {}), ...x } as T); return Array.from(m.values()); };
        if (byKind.room) setRooms(p => merge(p, byKind.room));
        if (byKind.reservation) setReservations(p => merge(p, byKind.reservation));
        if (byKind.clinic_procedure) setProcedures(p => merge(p, byKind.clinic_procedure));
        if (byKind.sterilization) setSterilizations(p => merge(p, byKind.sterilization));
        if (byKind.cleaning) setCleanings(p => merge(p, byKind.cleaning));
        if (byKind.clinic_equipment) setEquipments(p => merge(p, byKind.clinic_equipment));
        if (byKind.equipment_ticket) setTickets(p => merge(p, byKind.equipment_ticket));
        if (byKind.consent) setConsents(p => merge(p, byKind.consent));
        if (byKind.incident) setIncidents(p => merge(p, byKind.incident));
      } catch { }
    })();
    return () => { alive = false; };
  }, []);
  function setRoomStatus(name: string, status: RoomStatus) {
    setRooms(prev => { const next = prev.map(r => r.name === name ? { ...r, status } : r); const changed = next.find(r => r.name === name); if (changed) persist("room", changed); return next; });
  }
  function conflictsFor(room: string, equipment: string, date: string, start: string, end: string, excludeId?: string) {
    return reservations.filter(r => r.date === date && r.id !== excludeId && r.status === "Agendada" && overlaps(start, end, r.start, r.end) && (r.room === room || (equipment !== "Nenhum" && r.equipment === equipment)));
  }
  const liveConflicts = conflictsFor(resForm.room, resForm.equipment, resForm.date, resForm.start, resForm.end);
  async function saveReservation() {
    if (!resForm.procedure.trim()) { onNotice("Informe o procedimento da reserva."); return; }
    if (resForm.start >= resForm.end) { onNotice("O horário de início precisa ser antes do fim."); return; }
    const conflicts = conflictsFor(resForm.room, resForm.equipment, resForm.date, resForm.start, resForm.end);
    if (conflicts.length) { onNotice(`Conflito: ${conflicts.map(c => `${c.room} · ${c.start}–${c.end} · ${c.procedure}`).join(" | ")} — escolha outro horário, sala ou equipamento.`); return; }
    const rec: ReservationRec = { id: `res-${Date.now()}`, room: resForm.room, equipment: resForm.equipment, patientId: resForm.patientId, procedure: resForm.procedure.trim(), date: resForm.date, start: resForm.start, end: resForm.end, status: "Agendada" };
    setReservations(prev => [...prev, rec]); persist("reservation", rec);
    onNotice(`Reserva criada: ${rec.room} · ${fmtDate(rec.date)} · ${rec.start}–${rec.end} · ${rec.procedure} — ${pname(rec.patientId)}${rec.equipment !== "Nenhum" ? ` · Equipamento: ${rec.equipment}` : ""}.`);
  }
  async function cancelReservation(r: ReservationRec) { const next = { ...r, status: "Cancelada" }; setReservations(prev => prev.map(x => x.id === r.id ? next : x)); persist("reservation", next); onNotice("Reserva cancelada."); }
  async function saveProcedure() {
    if (!procForm.material.trim() && !procForm.notes.trim()) { /* material/observação opcionais */ }
    if (procForm.start >= procForm.end) { onNotice("O início do procedimento precisa ser antes do fim."); return; }
    const rec: ClinicProcedureRec = { id: `cp-${Date.now()}`, type: procForm.type, patientId: procForm.patientId, room: procForm.room, professional: procForm.professional.trim() || "Equipe da Clínica", team: procForm.team.trim(), date: procForm.date, start: procForm.start, end: procForm.end, material: procForm.material.trim() || "—", anesthesia: procForm.anesthesia, notes: procForm.notes.trim() || "—" };
    setProcedures(prev => [...prev, rec]); persist("clinic_procedure", rec);
    setRoomStatus(rec.room, "Ocupada");
    const p = patients.find(x => x.id === rec.patientId);
    if (p) {
      const todayLabel = fmtDate(rec.date);
      await onUpdatePatient({ ...p, procedures: [...(p.procedures || []), { id: rec.id, name: rec.type, date: todayLabel, professional: rec.professional, material: rec.material, notes: `${rec.room} · ${rec.start}–${rec.end} · Equipe: ${rec.team} · Anestesia: ${rec.anesthesia}. ${rec.notes}` }], history: [{ date: todayLabel, type: "Procedimento", professional: rec.professional, result: `${rec.type} — ${rec.room}`, detail: `${rec.type} · ${rec.start}–${rec.end} · Equipe: ${rec.team} · Anestesia: ${rec.anesthesia} · Material: ${rec.material}. ${rec.notes}` }, ...p.history], timeline: [{ date: todayLabel, type: "Procedimento", title: `${rec.type} — ${rec.room}`, detail: `${rec.start}–${rec.end} · ${rec.professional} · ${rec.notes}` }, ...p.timeline] });
    }
    onNotice(`Procedimento ${rec.type} registrado no prontuário de ${pname(rec.patientId)} e na ocupação da ${rec.room}.`);
    setProcForm(prev => ({ ...prev, material: "", notes: "" }));
  }
  async function saveSterilization() {
    if (!sterForm.code.trim() || !sterForm.lot.trim()) { onNotice("Informe o código e o lote do pacote esterilizado."); return; }
    const rec: SterilizationRec = { id: `st-${Date.now()}`, code: sterForm.code.trim(), lot: sterForm.lot.trim(), item: sterForm.item, sterilizedDate: sterForm.sterilizedDate, expiry: sterForm.expiry, status: "Esterilizado" };
    setSterilizations(prev => [...prev, rec]); persist("sterilization", rec);
    setSterForm(prev => ({ ...prev, code: "", lot: "" })); onNotice(`Esterilização registrada: ${rec.code} · ${rec.item} · Lote ${rec.lot} · validade ${fmtDate(rec.expiry)}.`);
  }
  function confirmUse() {
    if (!useForm) return;
    const pkg = sterilizations.find(s => s.id === useForm.pkgId); if (!pkg) return;
    if (effSterilizationStatus(pkg, today) === "Vencido") { onNotice("Pacote vencido — não pode ser usado. Envie para reprocessamento."); return; }
    const next = { ...pkg, status: "Em uso" as const, usedByPatientId: useForm.patientId, usedByProcedure: useForm.procedure.trim() || "Procedimento" };
    setSterilizations(prev => prev.map(x => x.id === pkg.id ? next : x)); persist("sterilization", next);
    setUseForm(null); onNotice(`Uso registrado: ${pkg.code} usado em ${next.usedByProcedure} — ${pname(next.usedByPatientId!)}. Rastreabilidade atualizada.`);
  }
  async function setSterilizationStatus(s: SterilizationRec, status: SterilizationRec["status"]) { const next = { ...s, status, ...(status !== "Em uso" ? { usedByPatientId: undefined, usedByProcedure: undefined } : {}) }; setSterilizations(prev => prev.map(x => x.id === s.id ? next : x)); persist("sterilization", next); onNotice(`${s.code} marcado como ${status}.`); }
  async function startCleaning() {
    const existing = cleanings.find(c => c.room === cleanForm.room && c.status === "Em limpeza");
    if (existing) { onNotice(`${cleanForm.room} já está em limpeza.`); return; }
    const rec: CleaningRec = { id: `cl-${Date.now()}`, room: cleanForm.room, responsible: cleanForm.responsible.trim() || "Equipe de higienização — Clínica", type: cleanForm.type, date: dPlus(0), time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), items: [], status: "Em limpeza" };
    setCleanings(prev => [rec, ...prev]); persist("cleaning", rec); setRoomStatus(rec.room, "Em limpeza");
    onNotice(`Limpeza iniciada em ${rec.room} (${rec.type}). A sala fica “Em limpeza” até concluir o checklist.`);
  }
  async function toggleCleanItem(c: CleaningRec, item: string) {
    const next = { ...c, items: c.items.includes(item) ? c.items.filter(i => i !== item) : [...c.items, item] };
    setCleanings(prev => prev.map(x => x.id === c.id ? next : x)); persist("cleaning", next);
  }
  async function finishCleaning(c: CleaningRec) {
    const missing = CLEAN_ITEMS.filter(i => !c.items.includes(i));
    if (missing.length) { onNotice(`Conclua o checklist antes de liberar a sala. Faltam: ${missing.join(", ")}.`); return; }
    const next = { ...c, status: "Concluída" as const };
    setCleanings(prev => prev.map(x => x.id === c.id ? next : x)); persist("cleaning", next); setRoomStatus(c.room, "Livre");
    onNotice(`Limpeza concluída em ${c.room}. Sala liberada.`);
  }
  function toggleRoom(r: RoomRec) {
    if (r.status === "Manutenção") { setRoomStatus(r.name, "Livre"); onNotice(`${r.name} liberada.`); }
    else { setRoomStatus(r.name, "Manutenção"); onNotice(`${r.name} bloqueada para manutenção. Novas reservas ficam suspensas até liberar.`); }
  }
  async function openTicket() {
    const eq = equipments.find(e => e.id === ticketForm.equipmentId); if (!eq) return;
    if (!ticketForm.description.trim()) { onNotice("Descreva o problema do equipamento antes de abrir o chamado."); return; }
    const rec: EquipmentTicketRec = { id: `tk-${Date.now()}`, equipmentId: eq.id, equipmentName: eq.name, description: ticketForm.description.trim(), status: "Aberto", createdAt: dPlus(0) };
    setTickets(prev => [rec, ...prev]); persist("equipment_ticket", rec);
    const nextEq = { ...eq, status: "Em manutenção" as const };
    setEquipments(prev => prev.map(x => x.id === eq.id ? nextEq : x)); persist("clinic_equipment", nextEq);
    setTicketForm(prev => ({ ...prev, description: "" })); setShowTicketsFor(eq.id);
    onNotice(`Chamado de manutenção aberto para ${eq.name}. O equipamento ficou “Em manutenção” e o chamado aparece no histórico do equipamento.`);
  }
  async function advanceTicket(t: EquipmentTicketRec) {
    const nextStatus = t.status === "Aberto" ? "Em atendimento" : t.status === "Em atendimento" ? "Concluído" : "Concluído";
    const next = { ...t, status: nextStatus }; setTickets(prev => prev.map(x => x.id === t.id ? next : x)); persist("equipment_ticket", next);
    if (nextStatus === "Concluído") { const othersOpen = tickets.some(x => x.equipmentId === t.equipmentId && x.id !== t.id && x.status !== "Concluído"); if (!othersOpen) { const eq = equipments.find(e => e.id === t.equipmentId); if (eq) { const nEq = { ...eq, status: "Operacional" as const }; setEquipments(prev => prev.map(x => x.id === eq.id ? nEq : x)); persist("clinic_equipment", nEq); } } }
    onNotice(`Chamado de ${t.equipmentName}: ${nextStatus}.`);
  }
  function applyConsentModel(model: ConsentRec["model"]) { setConsentForm(prev => ({ ...prev, model, text: CONSENT_TEMPLATES[model].text })); }
  async function generateConsent() {
    if (!consentForm.procedure.trim()) { onNotice("Informe o procedimento do termo."); return; }
    const rec: ConsentRec = { id: `ct-${Date.now()}`, patientId: consentForm.patientId, procedure: consentForm.procedure.trim(), model: consentForm.model, text: consentForm.text.trim(), signedPatient: false, signedProfessional: false, preDelivered: false, postDelivered: false };
    setConsents(prev => [rec, ...prev]); persist("consent", rec);
    onNotice(`Termo de ${rec.model.toLowerCase()} gerado para ${pname(rec.patientId)} — ${rec.procedure}.`);
  }
  async function signConsent(c: ConsentRec, who: "patient" | "professional") {
    const next = { ...c, ...(who === "patient" ? { signedPatient: true } : { signedProfessional: true }) };
    if (next.signedPatient && next.signedProfessional) next.signedAt = new Date().toLocaleString("pt-BR");
    setConsents(prev => prev.map(x => x.id === c.id ? next : x)); persist("consent", next);
    onNotice(next.signedPatient && next.signedProfessional ? `Termo assinado por paciente e profissional em ${next.signedAt}.` : who === "patient" ? "Assinatura do paciente registrada. Falta a assinatura do profissional." : "Assinatura do profissional registrada. Falta a assinatura do paciente.");
  }
  async function toggleConsentDelivery(c: ConsentRec, field: "preDelivered" | "postDelivered") { const next = { ...c, [field]: !c[field] }; setConsents(prev => prev.map(x => x.id === c.id ? next : x)); persist("consent", next); }
  async function saveIncident() {
    if (!incForm.description.trim() || !incForm.conduct.trim()) { onNotice("Descreva a intercorrência/evento adverso e a conduta adotada."); return; }
    const rec: IncidentRec = { id: `in-${Date.now()}`, patientId: incForm.patientId, procedure: incForm.procedure.trim() || "Procedimento", type: incForm.type, severity: incForm.severity, description: incForm.description.trim(), conduct: incForm.conduct.trim(), notified: incForm.notified.trim() || "Equipe da Clínica", status: "Aberto", date: dPlus(0) };
    setIncidents(prev => [rec, ...prev]); persist("incident", rec);
    const p = patients.find(x => x.id === rec.patientId);
    if (p) { const label = fmtDate(rec.date); await onUpdatePatient({ ...p, history: [{ date: label, type: rec.type, professional: "Equipe da Clínica", result: `${rec.type} — ${rec.severity} · ${rec.status}`, detail: `${rec.procedure}. ${rec.description} Conduta: ${rec.conduct} Notificação: ${rec.notified}.` }, ...p.history], timeline: [{ date: label, type: rec.type, title: `${rec.type} — ${rec.severity}`, detail: `${rec.procedure}. ${rec.description}` }, ...p.timeline] }); }
    setIncForm(prev => ({ ...prev, description: "", conduct: "" }));
    onNotice(`${rec.type} registrado (${rec.severity}) para ${pname(rec.patientId)} e adicionado ao histórico do paciente.`);
  }
  async function setIncidentStatus(i: IncidentRec, status: IncidentRec["status"]) { const next = { ...i, status }; setIncidents(prev => prev.map(x => x.id === i.id ? next : x)); persist("incident", next); onNotice(`${i.type} — ${i.procedure}: ${status}.`); }
  const dayReservations = reservations.filter(r => r.date === agendaDate && r.status === "Agendada").sort((a, b) => a.start.localeCompare(b.start));
  const expired = sterilizations.filter(s => effSterilizationStatus(s, today) === "Vencido");
  const filteredIncidents = incidents.filter(i => (incSeverity === "Todas" || i.severity === incSeverity) && (incStatus === "Todos" || i.status === incStatus));
  const roomStatusStyle = (s: RoomStatus) => s === "Livre" ? "bg-[#D9EEDD] text-[#1E5B2A]" : s === "Ocupada" ? "bg-[#FFF0C5] text-[#7A5600]" : s === "Em limpeza" ? "bg-[#E0EAFB] text-[#1D4E8A]" : "bg-[#F8DEDC] text-[#8B2626]";
  const tabs = ["Agenda", "Procedimentos", "Esterilização", "Limpeza", "Salas", "Equipamentos", "Termos", "Intercorrências"];
  return <div>
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">{tabs.map(t => <button key={t} onClick={() => setSub(t)} className={`pill shrink-0 px-3.5 py-2 text-[13px] font-semibold ${sub === t ? "chip-active" : ""}`}>{t}</button>)}</div>
    {sub === "Agenda" && <div className="mt-4">
      <div className="flex flex-wrap items-end gap-2"><label className={labelCls}>Data da grade<input type="date" value={agendaDate} onChange={e => setAgendaDate(e.target.value)} className={`${inputCls} mt-1`} /></label><p className="pb-2 text-sm text-[var(--muted)]">{dayReservations.length} bloco(s) agendado(s) neste dia.</p></div>
      <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left text-sm"><thead><tr><th className="border-b border-[var(--line)] px-2 py-2 text-[var(--muted)]">Sala</th>{ESTRUTURA_SLOTS.map(s => <th key={s} className="border-b border-[var(--line)] px-2 py-2 text-center text-[12px] text-[var(--muted)]">{s}</th>)}</tr></thead><tbody>{ESTRUTURA_ROOMS.map(room => <tr key={room}><td className="border-b border-[var(--line)] px-2 py-2 font-bold">{room}<span className={`mt-1 block w-fit rounded-full px-2 py-0.5 text-[11px] font-bold ${roomStatusStyle(rooms.find(r => r.name === room)?.status || "Livre")}`}>{rooms.find(r => r.name === room)?.status}</span></td>{ESTRUTURA_SLOTS.map(slot => { const block = dayReservations.find(r => r.room === room && r.start <= slot && slot < r.end); return <td key={slot} className="border-b border-[var(--line)] px-1 py-1 text-center">{block ? <div className="rounded-lg bg-[var(--primary-soft)] px-1.5 py-1.5 text-left text-[11px] leading-4 text-[var(--primary)]"><strong>{block.procedure}</strong><span className="block">{pname(block.patientId)}</span><span className="block">{block.start}–{block.end}{block.equipment !== "Nenhum" ? ` · ${block.equipment}` : ""}</span></div> : <span className="text-[var(--muted-2)]">—</span>}</td>; })}</tr>)}</tbody></table></div>
      <h4 className="mt-5 font-extrabold">Reservar sala / equipamento</h4>
      {liveConflicts.length > 0 && <div role="alert" className="mt-3 rounded-2xl bg-[#F8DEDC] px-4 py-3 text-sm font-bold text-[#8B2626]">⚠ Conflito: {liveConflicts.map(c => `${c.room} · ${c.start}–${c.end} · ${c.procedure}${c.equipment !== "Nenhum" ? ` · ${c.equipment}` : ""}`).join(" | ")} — a sala ou o equipamento já está ocupado neste horário.</div>}
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><label className={labelCls}>Sala<select value={resForm.room} onChange={e => setResForm({ ...resForm, room: e.target.value })} className={`${inputCls} mt-1`}>{ESTRUTURA_ROOMS.map(r => <option key={r}>{r}</option>)}</select></label><label className={labelCls}>Equipamento<select value={resForm.equipment} onChange={e => setResForm({ ...resForm, equipment: e.target.value })} className={`${inputCls} mt-1`}>{ESTRUTURA_EQUIP.map(r => <option key={r}>{r}</option>)}</select></label><label className={labelCls}>Paciente<select value={resForm.patientId} onChange={e => setResForm({ ...resForm, patientId: e.target.value })} className={`${inputCls} mt-1`}>{patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className={labelCls}>Procedimento<select value={resForm.procedure} onChange={e => setResForm({ ...resForm, procedure: e.target.value })} className={`${inputCls} mt-1`}>{ESTRUTURA_PROC_TYPES.map(r => <option key={r}>{r}</option>)}</select></label><label className={labelCls}>Data<input type="date" value={resForm.date} onChange={e => setResForm({ ...resForm, date: e.target.value })} className={`${inputCls} mt-1`} /></label><label className={labelCls}>Horário<div className="mt-1 flex items-center gap-2"><input type="time" value={resForm.start} onChange={e => setResForm({ ...resForm, start: e.target.value })} className={inputCls} aria-label="Início" /><span>até</span><input type="time" value={resForm.end} onChange={e => setResForm({ ...resForm, end: e.target.value })} className={inputCls} aria-label="Fim" /></div></label></div>
      <button onClick={saveReservation} className="mt-3 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white">Reservar sala / equipamento</button>
      <div className="mt-5 space-y-2">{reservations.slice().sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start)).map(r => <div key={r.id} className="soft flex flex-wrap items-center justify-between gap-2 p-3"><p className="text-sm"><strong>{r.procedure}</strong> · {r.room} · {fmtDate(r.date)} · {r.start}–{r.end}{r.equipment !== "Nenhum" ? ` · ${r.equipment}` : ""} · {pname(r.patientId)}</p><span className="flex gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${r.status === "Agendada" ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "bg-[var(--surface-2)] text-[var(--muted)]"}`}>{r.status}</span>{r.status === "Agendada" && <button onClick={() => cancelReservation(r)} className="pill px-3 py-1 text-xs font-bold">Cancelar</button>}</span></div>)}</div>
    </div>}
    {sub === "Procedimentos" && <div className="mt-4">
      <div className="grid gap-2 sm:grid-cols-3"><label className={labelCls}>Procedimento<select value={procForm.type} onChange={e => setProcForm({ ...procForm, type: e.target.value })} className={`${inputCls} mt-1`}>{ESTRUTURA_PROC_TYPES.map(r => <option key={r}>{r}</option>)}</select></label><label className={labelCls}>Paciente<select value={procForm.patientId} onChange={e => setProcForm({ ...procForm, patientId: e.target.value })} className={`${inputCls} mt-1`}>{patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className={labelCls}>Sala<select value={procForm.room} onChange={e => setProcForm({ ...procForm, room: e.target.value })} className={`${inputCls} mt-1`}>{ESTRUTURA_ROOMS.map(r => <option key={r}>{r}</option>)}</select></label><label className={labelCls}>Profissional<input value={procForm.professional} onChange={e => setProcForm({ ...procForm, professional: e.target.value })} className={`${inputCls} mt-1`} /></label><label className={labelCls}>Equipe<input value={procForm.team} onChange={e => setProcForm({ ...procForm, team: e.target.value })} className={`${inputCls} mt-1`} placeholder="Ex.: Enf. Ricardo — Clínica" /></label><label className={labelCls}>Data<input type="date" value={procForm.date} onChange={e => setProcForm({ ...procForm, date: e.target.value })} className={`${inputCls} mt-1`} /></label><label className={labelCls}>Início<input type="time" value={procForm.start} onChange={e => setProcForm({ ...procForm, start: e.target.value })} className={`${inputCls} mt-1`} /></label><label className={labelCls}>Fim<input type="time" value={procForm.end} onChange={e => setProcForm({ ...procForm, end: e.target.value })} className={`${inputCls} mt-1`} /></label><label className={labelCls}>Anestesia<select value={procForm.anesthesia} onChange={e => setProcForm({ ...procForm, anesthesia: e.target.value })} className={`${inputCls} mt-1`}><option>Local</option><option>Sem anestesia</option><option>Local + sedação</option><option>Tópica</option></select></label><label className={labelCls}>Material usado<input value={procForm.material} onChange={e => setProcForm({ ...procForm, material: e.target.value })} className={`${inputCls} mt-1`} placeholder="Ex.: fio de sutura, gaze estéril" /></label><label className={`${labelCls} sm:col-span-2`}>Observação<textarea value={procForm.notes} onChange={e => setProcForm({ ...procForm, notes: e.target.value })} rows={2} className={`${inputCls} mt-1`} placeholder="Observação do procedimento…" /></label></div>
      <button onClick={saveProcedure} className="mt-3 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white">Salvar procedimento</button>
      <p className="mt-2 text-xs text-[var(--muted)]">Ao salvar, o procedimento entra no prontuário do paciente e a sala fica marcada como Ocupada.</p>
      <div className="mt-4 space-y-2">{procedures.slice().sort((a, b) => b.date.localeCompare(a.date)).map(p => <article key={p.id} className="soft p-3"><div className="flex flex-wrap justify-between gap-2"><p className="font-bold text-sm">{p.type} · {p.room} · {fmtDate(p.date)} · {p.start}–{p.end}</p><button onClick={() => onOpenPatient(p.patientId)} className="text-[13px] font-bold text-[var(--primary)]">Ver paciente →</button></div><p className="mt-1 text-sm text-[var(--muted)]">{pname(p.patientId)} · {p.professional} · Equipe: {p.team} · Anestesia: {p.anesthesia}</p><p className="mt-1 text-sm">Material: {p.material} · {p.notes}</p></article>)}</div>
    </div>}
    {sub === "Esterilização" && <div className="mt-4">
      {expired.length > 0 && <div role="alert" className="mb-3 rounded-2xl bg-[#F8DEDC] px-4 py-3 text-sm font-bold text-[#8B2626]">⚠ {expired.length} pacote(s) vencido(s): {expired.map(s => `${s.code} · ${s.item} (validade ${fmtDate(s.expiry)})`).join(" · ")} — não usar. Envie para reprocessamento.</div>}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5"><label className={labelCls}>Código<input value={sterForm.code} onChange={e => setSterForm({ ...sterForm, code: e.target.value })} placeholder="Ex.: PCT-005" className={`${inputCls} mt-1`} /></label><label className={labelCls}>Lote<input value={sterForm.lot} onChange={e => setSterForm({ ...sterForm, lot: e.target.value })} placeholder="Ex.: Lote 2413" className={`${inputCls} mt-1`} /></label><label className={labelCls}>Material<select value={sterForm.item} onChange={e => setSterForm({ ...sterForm, item: e.target.value })} className={`${inputCls} mt-1`}><option>Kit sutura</option><option>Kit biópsia</option><option>Kit curativo</option><option>Kit infiltração</option><option>Kit retirada de lesão</option></select></label><label className={labelCls}>Data de esterilização<input type="date" value={sterForm.sterilizedDate} onChange={e => setSterForm({ ...sterForm, sterilizedDate: e.target.value })} className={`${inputCls} mt-1`} /></label><label className={labelCls}>Validade<input type="date" value={sterForm.expiry} onChange={e => setSterForm({ ...sterForm, expiry: e.target.value })} className={`${inputCls} mt-1`} /></label></div>
      <button onClick={saveSterilization} className="mt-3 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white">Registrar esterilização</button>
      <div className="mt-4 space-y-2">{sterilizations.map(s => { const eff = effSterilizationStatus(s, today); return <article key={s.id} className="soft p-3"><div className="flex flex-wrap justify-between gap-2"><p className="font-bold text-sm">{s.code} · {s.item} · {s.lot}</p><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${eff === "Esterilizado" ? "bg-[var(--primary-soft)] text-[var(--primary)]" : eff === "Em uso" ? "bg-[#FFF0C5] text-[#7A5600]" : eff === "Vencido" ? "bg-[#F8DEDC] text-[#8B2626]" : "bg-[var(--surface-2)] text-[var(--muted)]"}`}>{eff}</span></div><p className="mt-1 text-[13px] text-[var(--muted)]">Esterilizado em {fmtDate(s.sterilizedDate)} · Validade {fmtDate(s.expiry)}</p>{s.usedByPatientId && <p className="mt-1 text-sm font-bold">Rastreabilidade: usado em {s.usedByProcedure} — {pname(s.usedByPatientId)}</p>}<div className="mt-2 flex flex-wrap gap-2"><button onClick={() => setUseForm({ pkgId: s.id, patientId: patients[0]?.id || "p1", procedure: "Sutura" })} className="pill px-3 py-1.5 text-xs font-bold">Registrar uso</button><button onClick={() => setSterilizationStatus(s, "Reprocessar")} className="pill px-3 py-1.5 text-xs font-bold">Enviar para reprocessar</button>{s.status === "Em uso" && <button onClick={() => setSterilizationStatus(s, "Esterilizado")} className="pill px-3 py-1.5 text-xs font-bold">Voltar para Esterilizado</button>}</div></article>; })}</div>
      {useForm && <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4"><h4 className="font-extrabold">Registrar uso do pacote {sterilizations.find(s => s.id === useForm.pkgId)?.code}</h4><div className="mt-3 grid gap-2 sm:grid-cols-2"><label className={labelCls}>Paciente<select value={useForm.patientId} onChange={e => setUseForm({ ...useForm, patientId: e.target.value })} className={`${inputCls} mt-1`}>{patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className={labelCls}>Procedimento<select value={useForm.procedure} onChange={e => setUseForm({ ...useForm, procedure: e.target.value })} className={`${inputCls} mt-1`}>{ESTRUTURA_PROC_TYPES.map(r => <option key={r}>{r}</option>)}</select></label></div><div className="mt-3 flex gap-2"><button onClick={confirmUse} className="rounded-full bg-[var(--primary)] px-4 py-2 text-[13px] font-bold text-white">Confirmar uso</button><button onClick={() => setUseForm(null)} className="pill px-4 py-2 text-[13px] font-bold">Cancelar</button></div></div>}
    </div>}
    {sub === "Limpeza" && <div className="mt-4">
      <div className="grid gap-2 sm:grid-cols-3"><label className={labelCls}>Sala<select value={cleanForm.room} onChange={e => setCleanForm({ ...cleanForm, room: e.target.value })} className={`${inputCls} mt-1`}>{ESTRUTURA_ROOMS.map(r => <option key={r}>{r}</option>)}</select></label><label className={labelCls}>Responsável<input value={cleanForm.responsible} onChange={e => setCleanForm({ ...cleanForm, responsible: e.target.value })} className={`${inputCls} mt-1`} /></label><label className={labelCls}>Tipo<select value={cleanForm.type} onChange={e => setCleanForm({ ...cleanForm, type: e.target.value as any })} className={`${inputCls} mt-1`}><option>Concorrente</option><option>Terminal</option></select></label></div>
      <button onClick={startCleaning} className="mt-3 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white">Iniciar limpeza</button>
      <p className="mt-2 text-xs text-[var(--muted)]">Ao iniciar, a sala fica “Em limpeza”. Conclua todos os itens do checklist para liberar a sala.</p>
      <div className="mt-4 space-y-3">{cleanings.slice().sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)).map(c => <article key={c.id} className="soft p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-bold">{c.room} · {c.type} · {fmtDate(c.date)} · {c.time}</p><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${c.status === "Em limpeza" ? "bg-[#E0EAFB] text-[#1D4E8A]" : "bg-[#D9EEDD] text-[#1E5B2A]"}`}>{c.status === "Em limpeza" ? "Em limpeza" : "Liberada — Concluída"}</span></div><p className="mt-1 text-[13px] text-[var(--muted)]">Responsável: {c.responsible} · {c.items.length}/{CLEAN_ITEMS.length} itens marcados</p><div className="mt-2 grid gap-1.5 sm:grid-cols-2">{CLEAN_ITEMS.map(item => <label key={item} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={c.items.includes(item)} disabled={c.status === "Concluída"} onChange={() => toggleCleanItem(c, item)} /> {item}</label>)}</div>{c.status === "Em limpeza" && <button onClick={() => finishCleaning(c)} className="mt-3 rounded-full bg-[var(--primary)] px-4 py-2 text-[13px] font-bold text-white">Concluir limpeza e liberar sala</button>}</article>)}</div>
    </div>}
    {sub === "Salas" && <div className="mt-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{rooms.map(r => { const next = reservations.filter(x => x.room === r.name && x.status === "Agendada" && x.date >= today).sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`))[0]; return <article key={r.id} className="soft p-4"><div className="flex items-start justify-between gap-2"><h4 className="font-extrabold">{r.name}</h4><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${roomStatusStyle(r.status)}`}>{r.status}</span></div><p className="mt-2 text-sm text-[var(--muted)]">Próxima reserva: {next ? `${fmtDate(next.date)} · ${next.start}–${next.end} · ${next.procedure} — ${pname(next.patientId)}` : "Nenhuma reserva agendada"}</p><p className="mt-1 text-sm text-[var(--muted)]">Limpezas registradas: {cleanings.filter(c => c.room === r.name).length} · Procedimentos: {procedures.filter(p => p.room === r.name).length}</p><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => toggleRoom(r)} className={`rounded-full px-4 py-2 text-[13px] font-bold text-white ${r.status === "Manutenção" ? "bg-[var(--primary)]" : "bg-[#C83E3E]"}`}>{r.status === "Manutenção" ? "Liberar sala" : "Bloquear sala"}</button><button onClick={() => { setCleanForm(prev => ({ ...prev, room: r.name })); setSub("Limpeza"); }} className="pill px-4 py-2 text-[13px] font-bold">Iniciar limpeza</button></div></article>; })}</div>
    </div>}
    {sub === "Equipamentos" && <div className="mt-4">
      <div className="grid gap-2 sm:grid-cols-2"><label className={labelCls}>Equipamento<select value={ticketForm.equipmentId} onChange={e => setTicketForm({ ...ticketForm, equipmentId: e.target.value })} className={`${inputCls} mt-1`}>{equipments.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></label><label className={labelCls}>Descrição do problema<input value={ticketForm.description} onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })} placeholder="Ex.: bateria descarrega rápido" className={`${inputCls} mt-1`} /></label></div>
      <button onClick={openTicket} className="mt-3 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white">Abrir chamado</button>
      <div className="mt-4 space-y-3">{equipments.map(eq => { const eqTickets = tickets.filter(t => t.equipmentId === eq.id); return <article key={eq.id} className="soft p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-extrabold">{eq.name}</p><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${eq.status === "Operacional" ? "bg-[#D9EEDD] text-[#1E5B2A]" : eq.status === "Em manutenção" ? "bg-[#FFF0C5] text-[#7A5600]" : "bg-[#F8DEDC] text-[#8B2626]"}`}>{eq.status}</span></div><p className="mt-1 text-sm text-[var(--muted)]">{eq.location} · Última manutenção: {fmtDate(eq.lastMaintenance)} · Próxima: {fmtDate(eq.nextMaintenance)} · Chamados: {eqTickets.length} ({eqTickets.filter(t => t.status !== "Concluído").length} em aberto)</p><div className="mt-2 flex flex-wrap gap-2"><button onClick={() => { setTicketForm(prev => ({ ...prev, equipmentId: eq.id })); window.scrollTo({ top: 0 }); }} className="rounded-full bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white">Abrir chamado</button><button onClick={() => setShowTicketsFor(showTicketsFor === eq.id ? null : eq.id)} className="pill px-3 py-1.5 text-xs font-bold">{showTicketsFor === eq.id ? "Ocultar chamados" : "Ver chamados do equipamento"}</button></div>{showTicketsFor === eq.id && <div className="mt-3 space-y-2">{eqTickets.map(t => <div key={t.id} className="rounded-xl bg-[var(--surface)] p-3"><p className="text-sm"><strong>{t.status}</strong> · {fmtDate(t.createdAt)} — {t.description}</p>{t.status !== "Concluído" && <button onClick={() => advanceTicket(t)} className="mt-2 rounded-full bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white">{t.status === "Aberto" ? "Iniciar atendimento" : "Concluir chamado"}</button>}</div>)}{!eqTickets.length && <p className="text-sm text-[var(--muted)]">Nenhum chamado para este equipamento.</p>}</div>}</article>; })}</div>
    </div>}
    {sub === "Termos" && <div className="mt-4">
      <div className="grid gap-2 sm:grid-cols-3"><label className={labelCls}>Modelo<select value={consentForm.model} onChange={e => applyConsentModel(e.target.value as any)} className={`${inputCls} mt-1`}><option>Procedimento</option><option>Anestesia</option><option>Uso de imagem</option></select></label><label className={labelCls}>Paciente<select value={consentForm.patientId} onChange={e => setConsentForm({ ...consentForm, patientId: e.target.value })} className={`${inputCls} mt-1`}>{patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className={labelCls}>Procedimento<select value={consentForm.procedure} onChange={e => setConsentForm({ ...consentForm, procedure: e.target.value })} className={`${inputCls} mt-1`}>{ESTRUTURA_PROC_TYPES.map(r => <option key={r}>{r}</option>)}</select></label></div>
      <label className={`${labelCls} mt-3`}>Texto do termo (editável)<textarea value={consentForm.text} onChange={e => setConsentForm({ ...consentForm, text: e.target.value })} rows={4} className={`${inputCls} mt-1`} /></label>
      <button onClick={generateConsent} className="mt-3 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white">Gerar termo</button>
      <div className="mt-4 space-y-3">{consents.map(c => <article key={c.id} className="soft p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-bold text-sm">Termo de {c.model.toLowerCase()} · {c.procedure} · {pname(c.patientId)}</p><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${c.signedPatient && c.signedProfessional ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "bg-[#FFF0C5] text-[#7A5600]"}`}>{c.signedPatient && c.signedProfessional ? `Assinado · ${c.signedAt}` : "Aguardando assinatura"}</span></div><p className="mt-2 text-sm leading-6">{c.text}</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-[var(--surface)] p-3"><p className="font-bold text-sm">Orientações pré-procedimento</p><ul className="mt-1 list-disc pl-5 text-sm leading-6">{CONSENT_TEMPLATES[c.model].pre.map((o, i) => <li key={i}>{o}</li>)}</ul></div><div className="rounded-xl bg-[var(--surface)] p-3"><p className="font-bold text-sm">Orientações pós-procedimento</p><ul className="mt-1 list-disc pl-5 text-sm leading-6">{CONSENT_TEMPLATES[c.model].post.map((o, i) => <li key={i}>{o}</li>)}</ul></div></div><div className="mt-3 flex flex-wrap gap-2"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={c.preDelivered} onChange={() => toggleConsentDelivery(c, "preDelivered")} /> Orientações pré entregues ao paciente</label><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={c.postDelivered} onChange={() => toggleConsentDelivery(c, "postDelivered")} /> Orientações pós entregues ao paciente</label></div><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => signConsent(c, "patient")} disabled={c.signedPatient} className="rounded-full bg-[var(--primary)] px-4 py-2 text-[13px] font-bold text-white disabled:opacity-50">{c.signedPatient ? "✓ Paciente assinou" : "Assinar — paciente"}</button><button onClick={() => signConsent(c, "professional")} disabled={c.signedProfessional} className="rounded-full bg-[var(--primary)] px-4 py-2 text-[13px] font-bold text-white disabled:opacity-50">{c.signedProfessional ? "✓ Profissional assinou" : "Assinar — profissional"}</button></div></article>)}</div>
    </div>}
    {sub === "Intercorrências" && <div className="mt-4">
      <div className="grid gap-2 sm:grid-cols-3"><label className={labelCls}>Paciente<select value={incForm.patientId} onChange={e => setIncForm({ ...incForm, patientId: e.target.value })} className={`${inputCls} mt-1`}>{patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className={labelCls}>Procedimento<select value={incForm.procedure} onChange={e => setIncForm({ ...incForm, procedure: e.target.value })} className={`${inputCls} mt-1`}>{ESTRUTURA_PROC_TYPES.map(r => <option key={r}>{r}</option>)}</select></label><label className={labelCls}>Tipo<select value={incForm.type} onChange={e => setIncForm({ ...incForm, type: e.target.value as any })} className={`${inputCls} mt-1`}><option>Intercorrência</option><option>Evento adverso</option></select></label><label className={labelCls}>Gravidade<select value={incForm.severity} onChange={e => setIncForm({ ...incForm, severity: e.target.value as any })} className={`${inputCls} mt-1`}><option>Leve</option><option>Moderada</option><option>Grave</option><option>Crítica</option></select></label><label className={labelCls}>Notificação<input value={incForm.notified} onChange={e => setIncForm({ ...incForm, notified: e.target.value })} className={`${inputCls} mt-1`} placeholder="Ex.: Equipe da Clínica" /></label><label className={`${labelCls} sm:col-span-2`}>Descrição<textarea value={incForm.description} onChange={e => setIncForm({ ...incForm, description: e.target.value })} rows={2} className={`${inputCls} mt-1`} placeholder="O que aconteceu…" /></label><label className={`${labelCls} sm:col-span-2`}>Conduta<textarea value={incForm.conduct} onChange={e => setIncForm({ ...incForm, conduct: e.target.value })} rows={2} className={`${inputCls} mt-1`} placeholder="Conduta adotada…" /></label></div>
      <button onClick={saveIncident} className="mt-3 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white">Registrar intercorrência / evento adverso</button>
      <div className="mt-4 flex flex-wrap gap-2"><select value={incSeverity} onChange={e => setIncSeverity(e.target.value)} className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm" aria-label="Filtrar por gravidade"><option>Todas</option><option>Leve</option><option>Moderada</option><option>Grave</option><option>Crítica</option></select><select value={incStatus} onChange={e => setIncStatus(e.target.value)} className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm" aria-label="Filtrar por status"><option>Todos</option><option>Aberto</option><option>Em análise</option><option>Concluído</option></select><span className="self-center text-sm text-[var(--muted)]">{filteredIncidents.length} registro(s) · {incidents.filter(i => i.status !== "Concluído").length} em aberto/em análise</span></div>
      <div className="mt-3 space-y-3">{filteredIncidents.map(i => <article key={i.id} className="soft p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-bold text-sm">{i.type} · {i.procedure} · {pname(i.patientId)} · {fmtDate(i.date)}</p><span className="flex gap-1.5"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${i.severity === "Crítica" || i.severity === "Grave" ? "bg-[#F8DEDC] text-[#8B2626]" : i.severity === "Moderada" ? "bg-[#FFF0C5] text-[#7A5600]" : "bg-[var(--primary-soft)] text-[var(--primary)]"}`}>{i.severity}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${i.status === "Concluído" ? "bg-[#D9EEDD] text-[#1E5B2A]" : "bg-[#FFF0C5] text-[#7A5600]"}`}>{i.status}</span></span></div><p className="mt-2 text-sm"><strong>Descrição:</strong> {i.description}</p><p className="mt-1 text-sm"><strong>Conduta:</strong> {i.conduct}</p><p className="mt-1 text-sm text-[var(--muted)]">Notificação: {i.notified}</p><div className="mt-3 flex flex-wrap gap-2">{i.status === "Aberto" && <button onClick={() => setIncidentStatus(i, "Em análise")} className="pill px-3 py-1.5 text-xs font-bold">Iniciar análise</button>}{i.status !== "Concluído" && <button onClick={() => setIncidentStatus(i, "Concluído")} className="rounded-full bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white">Concluir análise</button>}<button onClick={() => onOpenPatient(i.patientId)} className="pill px-3 py-1.5 text-xs font-bold">Ver paciente</button></div></article>)}{!filteredIncidents.length && <p className="text-sm text-[var(--muted)]">Nenhuma intercorrência ou evento adverso com esses filtros.</p>}</div>
    </div>}
  </div>;
}
