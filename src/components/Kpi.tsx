export function Kpi({ label, value, note, icon }: any) {
  return <div className="card p-4"><div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[var(--muted)]">{icon}{label}</div><div className="kpi-num mt-3">{value}</div><p className="mt-2 text-[13px] leading-5 text-[var(--muted)]">{note}</p></div>;
}
