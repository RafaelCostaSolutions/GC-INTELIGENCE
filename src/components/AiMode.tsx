import { useState } from "react";
import { Sparkles } from "lucide-react";
import { buildAiAnswer } from "../lib/comum";
import { PrevisoesIALaboratorioPanel } from "../modules/laboratorio/inteligencia/index";
import { SugestoesGestorLaboratorioPanel } from "../modules/laboratorio/inteligencia/index";
import { type AiAnswer, type AiSuggestion, type AlertItem } from "../types/comum";

export function AiMode({ suggestions, alerts, onViewAlerts, onOpenSector, onNotice, sectorId }: { suggestions: AiSuggestion[]; alerts: AlertItem[]; onViewAlerts: () => void; onOpenSector: (id: string) => void; onNotice: (msg: string) => void; sectorId?: string }) {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState<AiAnswer | null>(null);
  const [asked, setAsked] = useState("");
  const [hint, setHint] = useState("");
  function submit() {
    const value = prompt.trim();
    if (!value) { setHint("Escreva o problema antes de pedir a sugestão — por exemplo, um equipamento, um setor ou um sintoma."); return; }
    setHint(""); setAsked(value); setAnswer(buildAiAnswer(value, alerts));
  }
  return <section aria-label="IA" className="card mt-4 w-full overflow-hidden p-4 text-left sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--primary)] text-white"><Sparkles size={19} /></span><div><h2 className="text-[16px] font-extrabold leading-tight">IA</h2></div></div><span className="flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--primary)]"><span className="h-1.5 w-1.5 rounded-full bg-[#177E4B]" />Pronto</span></div>
    <textarea id="ai-problem" value={prompt} onChange={(e) => { setPrompt(e.target.value); if (hint) setHint(""); }} placeholder="Descreva o problema..." rows={4} className="mt-4 w-full resize-y rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[15px] leading-6 outline-none focus:border-[var(--primary)] placeholder:text-[var(--muted-2)]" />
    {hint && <p role="alert" className="mt-2 text-[13px] font-semibold text-[var(--danger)]">{hint}</p>}
    {sectorId === "laboratorio" && <PrevisoesIALaboratorioPanel prompt={prompt} onNotice={onNotice} />}
    {sectorId === "laboratorio" && <SugestoesGestorLaboratorioPanel prompt={prompt} onNotice={onNotice} />}
    <div className="mt-4 flex flex-wrap gap-2"><button onClick={submit} className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-[13px] font-bold text-white">Enviar</button></div>
    {answer && <div className="soft mt-5 p-4 sm:p-5"><p className="text-[12px] font-bold uppercase tracking-wide text-[var(--muted)]">Resposta para: “{asked}”</p><h3 className="mt-3 text-[16px] font-extrabold leading-snug">Diagnóstico provável</h3><p className="mt-1 text-[14px] leading-6">{answer.diagnosis}</p><h3 className="mt-4 text-[16px] font-extrabold leading-snug">Sugestão de solução</h3><ol className="mt-2 list-decimal space-y-2 pl-5 text-[14px] leading-6">{answer.steps.map((step, i) => <li key={i}>{step}</li>)}</ol><h3 className="mt-4 text-[16px] font-extrabold leading-snug">Impacto esperado</h3><p className="mt-1 text-[14px] leading-6">{answer.impact}</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => onNotice(`Chamado criado com a solução sugerida para ${answer.sectorName}. A equipe foi notificada.`)} className="rounded-full bg-[var(--primary)] px-4 py-2.5 text-[13px] font-bold text-white">Abrir chamado com essa solução</button><button onClick={() => onOpenSector(answer.sectorId)} className="pill px-4 py-2.5 text-[13px] font-bold">Ver setor relacionado</button><button onClick={() => { setAnswer(null); setAsked(""); }} className="pill px-4 py-2.5 text-[13px] font-bold">Fazer outra pergunta</button></div></div>}
  </section>;
}
