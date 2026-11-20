import { useState, useRef, useEffect } from "react";
import { X, Pencil, ChevronDown, ChevronRight, Sparkles, History } from "lucide-react";

export function ProfileMenu({ onNotice, historySaving, onSaveProfile, onSearchQuery }: any) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); } }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);
  async function toggleHistory() { setSaving(true); await onSaveProfile({ historySaving: !historySaving }); setSaving(false); }
  return <div ref={ref} className="relative shrink-0">
    <button onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full text-[13px] font-extrabold text-white shadow-sm" style={{ background: "#C07A8A" }} aria-label="Conta de Mariana Ribeiro — abrir menu" aria-expanded={open} aria-haspopup="menu" title="Mariana Ribeiro">MR</button>
    {open && <div role="menu" aria-label="Menu da conta de Mariana Ribeiro" className="card absolute right-0 top-[calc(100%+10px)] z-[70] max-h-[calc(100vh-var(--safe-area-inset-top)-24px)] w-[min(92vw,400px)] overflow-y-auto p-3 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between px-1 pb-1"><span className="text-[12px] font-bold uppercase tracking-wide text-[var(--muted)]">Conta GottCured</span><button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)]" aria-label="Fechar menu da conta"><X size={16} /></button></div>
      <div className="rounded-2xl p-2">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <span className="grid h-16 w-16 place-items-center rounded-full text-[19px] font-extrabold text-white" style={{ background: "#C07A8A" }}>MR</span>
            <button onClick={() => onNotice("Edição da foto de perfil ainda não está disponível nesta demonstração.")} className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]" aria-label="Editar foto do perfil"><Pencil size={11} /></button>
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="truncate text-[17px] font-extrabold leading-tight">Mariana Ribeiro</p>
            <p className="break-all text-[13px] leading-5 text-[var(--muted)]">mariana.ribeiro@gottcured.com.br</p>
          </div>
          <button onClick={() => setExpanded((v) => !v)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--line)]" aria-label={expanded ? "Recolher informações do usuário" : "Expandir informações do usuário"} aria-expanded={expanded}>{expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button>
        </div>
        {expanded && <div className="mt-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-3)] p-3">
          <dl className="space-y-2 text-[13px] leading-5"><div className="flex justify-between gap-3"><dt className="shrink-0 text-[var(--muted)]">Cargo</dt><dd className="text-right font-bold">Gestora da Clínica e do Laboratório</dd></div></dl>
        </div>}
      </div>
      <button onClick={() => { setOpen(false); onNotice("Gerenciamento da Conta GottCured: nome, e-mail e preferências da conta de Mariana Ribeiro."); }} className="mt-1 flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-[13px] font-bold"><span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--primary)] text-[12px] font-extrabold text-white">G</span>Gerenciar sua Conta GottCured</button>
      <button onClick={() => { setOpen(false); onNotice("Planos da IA GottCured: compare os planos disponíveis para a sua equipe."); }} className="mt-3 flex w-full items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-left text-[13px] font-bold"><Sparkles size={16} className="text-[var(--primary)]" />Assine um plano da IA</button>
      <div className="mt-4 px-1">
        <div className="flex items-center justify-between gap-2"><p className="flex items-center gap-2 text-[13px] font-extrabold"><History size={15} />Histórico de pesquisa</p><button onClick={toggleHistory} disabled={saving} role="switch" aria-checked={historySaving !== false} aria-label="Salvar histórico de pesquisa" className="flex shrink-0 items-center gap-2 disabled:opacity-50"><span className="text-[11px] font-bold text-[var(--primary)]">{historySaving === false ? "Pausado" : "Salvando"}</span><span className={`relative h-6 w-11 rounded-full transition-colors ${historySaving === false ? "bg-[var(--surface-2)]" : "bg-[var(--primary)]"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${historySaving === false ? "left-0.5" : "left-[22px]"}`} /></span></button></div>
      </div>
    </div>}
  </div>;
}
