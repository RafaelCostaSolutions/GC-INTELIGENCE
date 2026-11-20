// Setor Clínica › Cadastro de Pacientes
import { useState } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";
import { PROCEDURE_OPTIONS, fmtDate } from "../../../data/clinica";
import { tipStyle } from "../../../data/comum";
import { type CareGoal, type Consultation, type Diagnosis, type Patient, type ProcedureItem, type Rectification, type Vital } from "../../../types/clinica";
import { CID_LIST, SPECIALTY_TEMPLATES } from "./dados";

export function ProntuarioModule({ patient, onUpdatePatient, onNotice }: { patient: Patient; onUpdatePatient: (p: Patient) => Promise<void>; onNotice: (m: string) => void }) {
  const [sub, setSub] = useState("Consulta");
  const [specialty, setSpecialty] = useState("Clínica Geral");
  const [kind, setKind] = useState<"Consulta" | "Evolução">("Consulta");
  const [professional, setProfessional] = useState("Dra. Ana Paula — Clínica Geral");
  const [form, setForm] = useState({ complaint: "", historyText: "", physicalExam: "", hypothesis: "", conduct: "" });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterProf, setFilterProf] = useState("Todos");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [rectForm, setRectForm] = useState<Record<string, { reason: string; newText: string; by: string }>>({});
  const [vital, setVital] = useState({ date: new Date().toISOString().slice(0, 10), weight: "", height: "", systolic: "", diastolic: "", heartRate: "", temp: "", saturation: "", glucose: "" });
  const [cidSearch, setCidSearch] = useState("");
  const [anexo, setAnexo] = useState({ name: "", type: "Documento" });
  const [proc, setProc] = useState({ name: "Curativo", date: new Date().toISOString().slice(0, 10), professional: "Enf. Ricardo — Clínica", material: "", notes: "" });
  const [goal, setGoal] = useState({ title: "", deadline: "", progress: 0 });
  const [goalProgress, setGoalProgress] = useState<Record<string, number>>({});
  const consultations = patient.consultations || [];
  const vitals = [...(patient.vitals || [])].sort((a, b) => a.date.localeCompare(b.date));
  const diagnoses = patient.diagnoses || [];
  const procedures = patient.procedures || [];
  const goals = patient.careGoals || [];
  const bmi = vital.weight && vital.height ? (Number(vital.weight) / Math.pow(Number(vital.height) / 100, 2)) : 0;
  const professionals = ["Todos", ...Array.from(new Set(consultations.map(c => c.professional)))];
  const toISO = (d: string) => d.includes("/") ? d.split("/").reverse().join("-") : d;
  const filteredCons = [...consultations].sort((a, b) => toISO(b.date).localeCompare(toISO(a.date))).filter(c => (filterProf === "Todos" || c.professional.toLowerCase().includes(filterProf.toLowerCase())) && (!filterFrom || toISO(c.date) >= filterFrom) && (!filterTo || toISO(c.date) <= filterTo));
  const cidFiltered = CID_LIST.filter(c => !cidSearch.trim() || c.code.toLowerCase().includes(cidSearch.toLowerCase()) || c.description.toLowerCase().includes(cidSearch.toLowerCase()));
  function applyTemplate(spec: string) { setSpecialty(spec); const t = SPECIALTY_TEMPLATES[spec]; if (t) setForm({ ...t }); }
  async function saveConsultation() {
    if (!form.complaint.trim() || !form.historyText.trim()) { onNotice("Informe queixa principal e história da doença atual antes de salvar."); return; }
    const today = new Date().toLocaleDateString("pt-BR");
    const rec: Consultation = { id: `c-${Date.now()}`, date: today, professional, specialty, kind, complaint: form.complaint.trim(), historyText: form.historyText.trim(), physicalExam: form.physicalExam.trim(), hypothesis: form.hypothesis.trim(), conduct: form.conduct.trim(), rectifications: [] };
    await onUpdatePatient({ ...patient, consultations: [...consultations, rec], history: [{ date: today, type: kind, professional, result: form.hypothesis || "Registro salvo", detail: `${form.complaint} — ${form.conduct}` }, ...patient.history], timeline: [{ date: today, type: kind, title: `${kind} — ${specialty}`, detail: form.complaint }, ...patient.timeline] });
    setForm({ complaint: "", historyText: "", physicalExam: "", hypothesis: "", conduct: "" }); onNotice(`${kind} salva e adicionada ao histórico do paciente.`);
  }
  async function signConsultation(c: Consultation) {
    const now = new Date().toLocaleString("pt-BR");
    await onUpdatePatient({ ...patient, consultations: consultations.map(x => x.id === c.id ? { ...x, signed: true, signedBy: c.professional, signedAt: now, locked: true } : x) });
    onNotice(`Registro assinado digitalmente por ${c.professional} em ${now}. Registro fechado para edição.`);
  }
  async function addRectification(c: Consultation) {
    const r = rectForm[c.id]; if (!r?.reason.trim() || !r?.newText.trim()) { onNotice("Informe o motivo e o novo texto da retificação."); return; }
    const rec: Rectification = { id: `r-${Date.now()}`, date: new Date().toLocaleString("pt-BR"), by: r.by || c.professional, reason: r.reason.trim(), newText: r.newText.trim() };
    await onUpdatePatient({ ...patient, consultations: consultations.map(x => x.id === c.id ? { ...x, rectifications: [...x.rectifications, rec] } : x) });
    setRectForm(prev => ({ ...prev, [c.id]: { reason: "", newText: "", by: "" } })); onNotice("Retificação registrada. O registro original foi mantido.");
  }
  async function saveVital() {
    const w = Number(vital.weight), h = Number(vital.height);
    if (!w || !h || !vital.systolic || !vital.diastolic) { onNotice("Informe peso, altura e pressão arterial."); return; }
    const rec: Vital = { id: `v-${Date.now()}`, date: vital.date, weight: w, height: h, bmi: Math.round((w / Math.pow(h / 100, 2)) * 10) / 10, systolic: Number(vital.systolic), diastolic: Number(vital.diastolic), heartRate: Number(vital.heartRate) || 0, temp: Number(vital.temp) || 0, saturation: Number(vital.saturation) || 0, glucose: Number(vital.glucose) || 0 };
    await onUpdatePatient({ ...patient, vitals: [...(patient.vitals || []), rec] }); onNotice("Sinais vitais salvos. Tabela e gráficos atualizados.");
  }
  async function addDiagnosis(c: { code: string; description: string }) {
    if (diagnoses.some(d => d.code === c.code && d.status === "Ativo")) { onNotice(`${c.code} já está na lista de diagnósticos ativos.`); return; }
    await onUpdatePatient({ ...patient, diagnoses: [...diagnoses, { id: `d-${Date.now()}`, code: c.code, description: c.description, date: new Date().toLocaleDateString("pt-BR"), status: "Ativo" }] }); onNotice(`Diagnóstico ${c.code} — ${c.description} adicionado.`);
  }
  async function toggleDiagnosis(d: Diagnosis) { await onUpdatePatient({ ...patient, diagnoses: diagnoses.map(x => x.id === d.id ? { ...x, status: x.status === "Ativo" ? "Resolvido" : "Ativo" } : x) }); }
  async function addAnexo() {
    if (!anexo.name.trim()) { onNotice("Informe o nome do arquivo para anexar."); return; }
    await onUpdatePatient({ ...patient, documents: [...patient.documents, { name: anexo.name.trim(), type: anexo.type, date: new Date().toLocaleDateString("pt-BR"), size: "—" }] }); setAnexo({ name: "", type: "Documento" }); onNotice("Anexo registrado na lista do paciente. O envio de arquivos ainda não está disponível.");
  }
  async function addProcedure() {
    if (!proc.material.trim() && !proc.notes.trim()) { /* material/obs opcionais */ }
    const rec: ProcedureItem = { id: `pr-${Date.now()}`, name: proc.name, date: fmtDate(proc.date), professional: proc.professional, material: proc.material.trim() || "—", notes: proc.notes.trim() || "—" };
    await onUpdatePatient({ ...patient, procedures: [...procedures, rec], history: [{ date: fmtDate(proc.date), type: "Procedimento", professional: proc.professional, result: rec.name, detail: `${rec.name} — material: ${rec.material}. ${rec.notes}` }, ...patient.history] });
    onNotice(`Procedimento ${rec.name} adicionado ao histórico.`); setProc({ ...proc, material: "", notes: "" });
  }
  async function addGoal() {
    if (!goal.title.trim() || !goal.deadline) { onNotice("Informe a meta e o prazo."); return; }
    await onUpdatePatient({ ...patient, careGoals: [...goals, { id: `g-${Date.now()}`, title: goal.title.trim(), deadline: goal.deadline, progress: Number(goal.progress) || 0, status: "Em andamento" }] }); setGoal({ title: "", deadline: "", progress: 0 }); onNotice("Meta do plano de cuidado criada.");
  }
  async function updateGoalProgress(g: CareGoal) { const p = goalProgress[g.id] ?? g.progress; await onUpdatePatient({ ...patient, careGoals: goals.map(x => x.id === g.id ? { ...x, progress: p, status: p >= 100 ? "Atingida" : x.status === "Atingida" ? "Atingida" : x.status } : x) }); onNotice("Progresso da meta atualizado."); }
  async function completeGoal(g: CareGoal) { await onUpdatePatient({ ...patient, careGoals: goals.map(x => x.id === g.id ? { ...x, progress: 100, status: "Atingida" } : x) }); onNotice("Meta marcada como atingida."); }
  const chartData = vitals.map(v => ({ data: fmtDate(v.date), peso: v.weight, imc: v.bmi, sis: v.systolic, dia: v.diastolic, glicemia: v.glucose }));
  const inputCls = "w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none";
  const labelCls = "block text-sm font-bold";
  return <div>
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">{["Consulta", "Evolução", "Sinais vitais", "Diagnósticos CID", "Anexos", "Procedimentos", "Plano de cuidado"].map(t => <button key={t} onClick={() => setSub(t)} className={`pill shrink-0 px-3.5 py-2 text-[13px] font-semibold ${sub === t ? "chip-active" : ""}`}>{t}</button>)}</div>
    {sub === "Consulta" && <div className="mt-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className={labelCls}>Especialidade — modelo<select value={specialty} onChange={e => applyTemplate(e.target.value)} className={`${inputCls} mt-1`}><option>Clínica Geral</option><option>Cardiologia</option><option>Pediatria</option><option>Ginecologia</option><option>Ortopedia</option><option>Dermatologia</option></select></label>
        <label className={labelCls}>Tipo<select value={kind} onChange={e => setKind(e.target.value as any)} className={`${inputCls} mt-1`}><option>Consulta</option><option>Evolução</option></select></label>
        <label className={labelCls}>Profissional<input value={professional} onChange={e => setProfessional(e.target.value)} className={`${inputCls} mt-1`} /></label>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">Ao trocar a especialidade, o formulário é preenchido com o texto modelo — edite livremente antes de salvar.</p>
      <div className="mt-4 space-y-3">
        <label className={labelCls}>Queixa principal<textarea value={form.complaint} onChange={e => setForm({ ...form, complaint: e.target.value })} rows={2} className={`${inputCls} mt-1`} placeholder="Queixa principal do paciente…" /></label>
        <label className={labelCls}>História da doença atual<textarea value={form.historyText} onChange={e => setForm({ ...form, historyText: e.target.value })} rows={3} className={`${inputCls} mt-1`} placeholder="História da doença atual…" /></label>
        <label className={labelCls}>Exame físico<textarea value={form.physicalExam} onChange={e => setForm({ ...form, physicalExam: e.target.value })} rows={3} className={`${inputCls} mt-1`} placeholder="Exame físico…" /></label>
        <label className={labelCls}>Hipótese diagnóstica<textarea value={form.hypothesis} onChange={e => setForm({ ...form, hypothesis: e.target.value })} rows={2} className={`${inputCls} mt-1`} placeholder="Hipótese diagnóstica…" /></label>
        <label className={labelCls}>Conduta<textarea value={form.conduct} onChange={e => setForm({ ...form, conduct: e.target.value })} rows={3} className={`${inputCls} mt-1`} placeholder="Conduta, prescrição e orientações…" /></label>
      </div>
      <button onClick={saveConsultation} className="mt-4 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white">Salvar consulta</button>
      <p className="mt-2 text-xs text-[var(--muted)]">Ao salvar, o registro aparece em Evolução clínica e no histórico do paciente.</p>
    </div>}
    {sub === "Evolução" && <div className="mt-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <input value={filterProf === "Todos" ? "" : filterProf} onChange={e => setFilterProf(e.target.value || "Todos")} placeholder="Buscar por profissional…" className={inputCls} aria-label="Buscar por profissional" />
        <label className="text-sm">De <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} className={`${inputCls} mt-1`} /></label>
        <label className="text-sm">Até <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} className={`${inputCls} mt-1`} /></label>
      </div>
      <p className="mt-3 text-[13px] text-[var(--muted)]">{filteredCons.length} registro(s) · clique para expandir o registro completo.</p>
      <div className="mt-3 space-y-3">{filteredCons.map(c => <article key={c.id} className="soft p-4">
        <button onClick={() => setExpandedId(expandedId === c.id ? null : c.id)} className="flex w-full flex-wrap items-center justify-between gap-2 text-left"><span><span className="block font-extrabold">{c.kind} — {c.specialty}</span><span className="text-[13px] text-[var(--muted)]">{c.date} · {c.professional}</span><span className="mt-1 block text-sm">{c.complaint}</span></span><span className="flex flex-wrap gap-1.5">{c.signed ? <span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--primary)]">✓ Assinado</span> : null}{c.locked ? <span className="rounded-full bg-[#F8DEDC] px-2.5 py-1 text-[11px] font-bold text-[#8B2626]">Fechado</span> : <span className="rounded-full bg-[#FFF0C5] px-2.5 py-1 text-[11px] font-bold text-[#7A5600]">Aberto</span>}</span></button>
        {expandedId === c.id && <div className="mt-3 border-t border-[var(--line)] pt-3 text-sm leading-6 space-y-2">
          <p><strong>Queixa principal:</strong> {c.complaint}</p><p><strong>História:</strong> {c.historyText}</p><p><strong>Exame físico:</strong> {c.physicalExam}</p><p><strong>Hipótese diagnóstica:</strong> {c.hypothesis}</p><p><strong>Conduta:</strong> {c.conduct}</p>
          {c.signed && <p className="rounded-xl bg-[var(--primary-soft)] p-3 font-bold text-[var(--primary)]">Assinado digitalmente por {c.signedBy} em {c.signedAt} · Selo “Assinado” · Registro fechado para edição.</p>}
          {c.rectifications.length > 0 && <div className="rounded-xl border border-[var(--line)] p-3"><p className="font-extrabold">Histórico de retificações ({c.rectifications.length})</p>{c.rectifications.map(r => <div key={r.id} className="mt-2 text-sm"><p><strong>{r.date} · {r.by}</strong> — Motivo: {r.reason}</p><p>Novo texto: {r.newText}</p><p className="text-[var(--muted)]">Registro original mantido acima.</p></div>)}</div>}
          <div className="flex flex-wrap gap-2">{!c.signed && <button onClick={() => signConsultation(c)} className="rounded-full bg-[var(--primary)] px-4 py-2 text-[13px] font-bold text-white">Assinar digitalmente</button>}{c.locked && <div className="w-full space-y-2"><p className="font-bold">Retificar registro fechado</p><input value={rectForm[c.id]?.reason || ""} onChange={e => setRectForm(prev => ({ ...prev, [c.id]: { ...(prev[c.id] || { reason: "", newText: "", by: "" }), reason: e.target.value } }))} placeholder="Motivo da retificação" className={inputCls} /><textarea value={rectForm[c.id]?.newText || ""} onChange={e => setRectForm(prev => ({ ...prev, [c.id]: { ...(prev[c.id] || { reason: "", newText: "", by: "" }), newText: e.target.value } }))} rows={2} placeholder="Novo texto corrigido" className={inputCls} /><input value={rectForm[c.id]?.by || ""} onChange={e => setRectForm(prev => ({ ...prev, [c.id]: { ...(prev[c.id] || { reason: "", newText: "", by: "" }), by: e.target.value } }))} placeholder="Quem retificou (profissional)" className={inputCls} /><button onClick={() => addRectification(c)} className="rounded-full bg-[var(--primary)] px-4 py-2 text-[13px] font-bold text-white">Retificar</button></div>}</div>
        </div>}
      </article>)}{filteredCons.length === 0 && <p className="text-sm text-[var(--muted)]">Nenhuma evolução registrada. Salve uma consulta na aba Consulta.</p>}</div>
    </div>}
    {sub === "Sinais vitais" && <div className="mt-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className={labelCls}>Data<input type="date" value={vital.date} onChange={e => setVital({ ...vital, date: e.target.value })} className={`${inputCls} mt-1`} /></label>
        <label className={labelCls}>Peso (kg)<input type="number" value={vital.weight} onChange={e => setVital({ ...vital, weight: e.target.value })} className={`${inputCls} mt-1`} placeholder="Ex.: 72,5" /></label>
        <label className={labelCls}>Altura (cm)<input type="number" value={vital.height} onChange={e => setVital({ ...vital, height: e.target.value })} className={`${inputCls} mt-1`} placeholder="Ex.: 168" /></label>
        <label className={labelCls}>IMC (calculado automaticamente)<input readOnly value={bmi ? bmi.toFixed(1) : ""} className={`${inputCls} mt-1 bg-[var(--surface-3)]`} placeholder="—" /></label>
        <label className={labelCls}>Pressão sistólica<input type="number" value={vital.systolic} onChange={e => setVital({ ...vital, systolic: e.target.value })} className={`${inputCls} mt-1`} placeholder="Ex.: 128" /></label>
        <label className={labelCls}>Pressão diastólica<input type="number" value={vital.diastolic} onChange={e => setVital({ ...vital, diastolic: e.target.value })} className={`${inputCls} mt-1`} placeholder="Ex.: 82" /></label>
        <label className={labelCls}>Frequência cardíaca (bpm)<input type="number" value={vital.heartRate} onChange={e => setVital({ ...vital, heartRate: e.target.value })} className={`${inputCls} mt-1`} /></label>
        <label className={labelCls}>Temperatura (°C)<input type="number" step="0.1" value={vital.temp} onChange={e => setVital({ ...vital, temp: e.target.value })} className={`${inputCls} mt-1`} /></label>
        <label className={labelCls}>Saturação (%)<input type="number" value={vital.saturation} onChange={e => setVital({ ...vital, saturation: e.target.value })} className={`${inputCls} mt-1`} /></label>
        <label className={labelCls}>Glicemia (mg/dL)<input type="number" value={vital.glucose} onChange={e => setVital({ ...vital, glucose: e.target.value })} className={`${inputCls} mt-1`} /></label>
      </div>
      <button onClick={saveVital} className="mt-4 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white">Salvar sinais vitais</button>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead><tr className="text-[var(--muted)]"><th className="py-2 pr-3">Data</th><th className="py-2 pr-3">Peso</th><th className="py-2 pr-3">IMC</th><th className="py-2 pr-3">PA</th><th className="py-2 pr-3">FC</th><th className="py-2 pr-3">Temp.</th><th className="py-2 pr-3">Sat.</th><th className="py-2">Glicemia</th></tr></thead><tbody>{vitals.map(v => <tr key={v.id} className="border-t border-[var(--line)]"><td className="py-2 pr-3 font-bold">{fmtDate(v.date)}</td><td className="py-2 pr-3">{v.weight} kg</td><td className="py-2 pr-3">{v.bmi}</td><td className="py-2 pr-3">{v.systolic}/{v.diastolic}</td><td className="py-2 pr-3">{v.heartRate || "—"}</td><td className="py-2 pr-3">{v.temp ? `${v.temp}°C` : "—"}</td><td className="py-2 pr-3">{v.saturation ? `${v.saturation}%` : "—"}</td><td className="py-2">{v.glucose ? `${v.glucose} mg/dL` : "—"}</td></tr>)}</tbody></table>{vitals.length === 0 && <p className="py-3 text-sm text-[var(--muted)]">Nenhum sinal vital registrado.</p>}</div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="soft p-4"><h4 className="font-bold">Peso / IMC ao longo do tempo</h4>{chartData.length ? <div className="mt-2 h-[220px]"><ResponsiveContainer><LineChart data={chartData}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="data" tick={{ fill: "var(--muted)", fontSize: 11 }} /><YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} /><Tooltip contentStyle={tipStyle} /><Line type="monotone" dataKey="peso" stroke="#0F5F5C" strokeWidth={2.5} name="Peso (kg)" /><Line type="monotone" dataKey="imc" stroke="#E4A11B" strokeWidth={2.5} name="IMC" /></LineChart></ResponsiveContainer></div> : <p className="mt-2 text-sm text-[var(--muted)]">Adicione sinais vitais para ver o gráfico.</p>}</div>
        <div className="soft p-4"><h4 className="font-bold">Pressão arterial</h4>{chartData.length ? <div className="mt-2 h-[220px]"><ResponsiveContainer><LineChart data={chartData}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="data" tick={{ fill: "var(--muted)", fontSize: 11 }} /><YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} /><Tooltip contentStyle={tipStyle} /><Line type="monotone" dataKey="sis" stroke="#C83E3E" strokeWidth={2.5} name="Sistólica" /><Line type="monotone" dataKey="dia" stroke="#2C7FA6" strokeWidth={2.5} name="Diastólica" /></LineChart></ResponsiveContainer></div> : <p className="mt-2 text-sm text-[var(--muted)]">Adicione sinais vitais para ver o gráfico.</p>}</div>
        <div className="soft p-4"><h4 className="font-bold">Glicemia</h4>{chartData.length ? <div className="mt-2 h-[220px]"><ResponsiveContainer><LineChart data={chartData}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="data" tick={{ fill: "var(--muted)", fontSize: 11 }} /><YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} /><Tooltip contentStyle={tipStyle} /><Line type="monotone" dataKey="glicemia" stroke="#177E4B" strokeWidth={2.5} name="Glicemia" /></LineChart></ResponsiveContainer></div> : <p className="mt-2 text-sm text-[var(--muted)]">Adicione sinais vitais para ver o gráfico.</p>}</div>
      </div>
    </div>}
    {sub === "Diagnósticos CID" && <div className="mt-4">
      <label className={labelCls}>Buscar CID — código ou descrição<input value={cidSearch} onChange={e => setCidSearch(e.target.value)} placeholder="Ex.: I10, Hipertensão, E11, Asma…" className={`${inputCls} mt-1`} /></label>
      <div className="mt-3 space-y-2">{cidFiltered.map(c => <div key={c.code} className="soft flex flex-wrap items-center justify-between gap-2 p-3"><span className="text-sm"><strong>{c.code}</strong> — {c.description}</span><button onClick={() => addDiagnosis(c)} className="rounded-full bg-[var(--primary)] px-3 py-1.5 text-[12px] font-bold text-white">Adicionar</button></div>)}</div>
      <h4 className="mt-5 font-extrabold">Diagnósticos do paciente ({diagnoses.length})</h4>
      <div className="mt-3 space-y-2">{diagnoses.map(d => <div key={d.id} className="soft flex flex-wrap items-center justify-between gap-2 p-3"><span className="text-sm"><strong>{d.code}</strong> — {d.description} · {d.date}</span><span className="flex gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${d.status === "Ativo" ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "bg-[var(--surface-2)] text-[var(--muted)]"}`}>{d.status}</span><button onClick={() => toggleDiagnosis(d)} className="pill px-3 py-1 text-[12px] font-bold">{d.status === "Ativo" ? "Marcar como resolvido" : "Reativar"}</button></span></div>)}{diagnoses.length === 0 && <p className="text-sm text-[var(--muted)]">Nenhum diagnóstico registrado.</p>}</div>
    </div>}
    {sub === "Anexos" && <div className="mt-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_180px_auto]"><input value={anexo.name} onChange={e => setAnexo({ ...anexo, name: e.target.value })} placeholder="Nome do arquivo — ex.: Foto lesão — braço.jpg" className={inputCls} aria-label="Nome do arquivo" /><select value={anexo.type} onChange={e => setAnexo({ ...anexo, type: e.target.value })} className={inputCls}><option>Documento</option><option>Imagem</option><option>Foto clínica</option><option>Exame externo</option><option>Receita</option><option>Termo</option><option>Relatório</option></select><button onClick={addAnexo} className="rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white">Anexar</button></div>
      <p className="mt-2 text-xs text-[var(--muted)]">Anexo simulado: registra nome, tipo e data. O envio de arquivos ainda não está disponível.</p>
      <div className="mt-4 space-y-2">{patient.documents.map((d, i) => <div key={i} className="soft flex flex-wrap items-center justify-between gap-3 p-3"><div><p className="font-bold text-sm">{d.name}</p><p className="text-xs text-[var(--muted)]">{d.type} · {d.date} · {d.size}</p></div><button onClick={() => onNotice(`Visualização simulada: ${d.name}. O arquivo original fica arquivado no prontuário.`)} className="pill px-3 py-1.5 text-xs font-bold">Visualizar / Baixar</button></div>)}{patient.documents.length === 0 && <p className="text-sm text-[var(--muted)]">Nenhum anexo.</p>}</div>
    </div>}
    {sub === "Procedimentos" && <div className="mt-4">
      <div className="grid gap-3 sm:grid-cols-2"><label className={labelCls}>Procedimento<select value={proc.name} onChange={e => setProc({ ...proc, name: e.target.value })} className={`${inputCls} mt-1`}>{PROCEDURE_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></label><label className={labelCls}>Data<input type="date" value={proc.date} onChange={e => setProc({ ...proc, date: e.target.value })} className={`${inputCls} mt-1`} /></label><label className={labelCls}>Profissional<input value={proc.professional} onChange={e => setProc({ ...proc, professional: e.target.value })} className={`${inputCls} mt-1`} /></label><label className={labelCls}>Material usado<input value={proc.material} onChange={e => setProc({ ...proc, material: e.target.value })} placeholder="Ex.: gaze, fio de sutura, anestésico" className={`${inputCls} mt-1`} /></label><label className={`${labelCls} sm:col-span-2`}>Observação<textarea value={proc.notes} onChange={e => setProc({ ...proc, notes: e.target.value })} rows={2} className={`${inputCls} mt-1`} placeholder="Observação do procedimento…" /></label></div>
      <button onClick={addProcedure} className="mt-4 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white">Adicionar procedimento</button>
      <div className="mt-5 space-y-2">{procedures.map(p => <div key={p.id} className="soft p-3"><p className="font-bold text-sm">{p.name} · {p.date} · {p.professional}</p><p className="mt-1 text-sm text-[var(--muted)]">Material: {p.material} · {p.notes}</p></div>)}{procedures.length === 0 && <p className="text-sm text-[var(--muted)]">Nenhum procedimento registrado no consultório.</p>}</div>
    </div>}
    {sub === "Plano de cuidado" && <div className="mt-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_180px_120px_auto]"><input value={goal.title} onChange={e => setGoal({ ...goal, title: e.target.value })} placeholder="Ex.: Reduzir PA para <130/80 em 90 dias" className={inputCls} aria-label="Meta" /><input type="date" value={goal.deadline} onChange={e => setGoal({ ...goal, deadline: e.target.value })} className={inputCls} aria-label="Prazo" /><input type="number" min={0} max={100} value={goal.progress} onChange={e => setGoal({ ...goal, progress: Number(e.target.value) })} className={inputCls} aria-label="Progresso inicial" /><button onClick={addGoal} className="rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white">Criar meta</button></div>
      <p className="mt-2 text-xs text-[var(--muted)]">Exemplos: perder 4 kg, controlar glicemia, reduzir PA para &lt;130/80 em 90 dias.</p>
      <div className="mt-4 space-y-3">{goals.map(g => <div key={g.id} className="soft p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-bold">{g.title}</p><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${g.status === "Atingida" ? "bg-[var(--primary-soft)] text-[var(--primary)]" : g.status === "Atrasada" ? "bg-[#F8DEDC] text-[#8B2626]" : "bg-[#FFF0C5] text-[#7A5600]"}`}>{g.status}</span></div><p className="mt-1 text-[13px] text-[var(--muted)]">Prazo: {fmtDate(g.deadline)} · Progresso: {g.progress}%</p><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]"><div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{ width: `${Math.min(100, Math.max(0, g.progress))}%` }} /></div><div className="mt-3 flex flex-wrap items-center gap-2"><label className="text-sm">Atualizar progresso <input type="number" min={0} max={100} value={goalProgress[g.id] ?? g.progress} onChange={e => setGoalProgress(prev => ({ ...prev, [g.id]: Number(e.target.value) }))} className="ml-1 w-20 rounded-full border border-[var(--line)] bg-[var(--surface)] px-2 py-1.5 text-sm" /> %</label><button onClick={() => updateGoalProgress(g)} className="pill px-3 py-1.5 text-[12px] font-bold">Atualizar progresso</button>{g.status !== "Atingida" && <button onClick={() => completeGoal(g)} className="rounded-full bg-[var(--primary)] px-3 py-1.5 text-[12px] font-bold text-white">Concluir / Atingida</button>}</div></div>)}{goals.length === 0 && <p className="text-sm text-[var(--muted)]">Nenhuma meta criada. Crie a primeira meta do plano de cuidado acima.</p>}</div>
    </div>}
  </div>;
}
