export function Section({ title, sub, children, icon }: any) {
  return <section className="card p-4 sm:p-6"><div className="mb-4 flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">{icon}</div><div><h2 className="text-[20px] font-extrabold leading-tight tracking-tight">{title}</h2><p className="mt-1 text-sm text-[var(--muted)]">{sub}</p></div></div>{children}</section>;
}
