import logoUrl from "../assets/55d9576ebcfb89df-gottcured_logo_transparente.png";
import { Search, Sun, Moon, Bell } from "lucide-react";
import { ProfileMenu } from "./ProfileMenu";

export function Topbar({ theme, onTheme, query, setQuery, onSearch, onHome, unread, onBell, onNotice, historySaving, onSaveProfile, onSearchQuery }: any) {
  return <header data-safe-area-sticky-top style={{ top: "var(--safe-area-inset-top)", background: "var(--bg)" }} className="sticky z-30 border-b border-[var(--line)] bg-[var(--bg)]">
    <div className="mx-auto flex max-w-[1240px] items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-5">
      <button onClick={onHome} style={{ background: "transparent", border: "none", boxShadow: "none" }} className="flex min-w-0 items-center gap-2 bg-transparent py-1" aria-label="Voltar para a página inicial"><img src={logoUrl} alt="GottCured" style={{ background: "transparent" }} className="logo-img h-8 w-auto object-contain sm:h-9" /><span className="sr-only">GottCured</span></button>
      <form onSubmit={(e) => { e.preventDefault(); onSearch(query); }} className="mx-auto flex h-10 w-full max-w-[620px] items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 shadow-sm focus-within:border-[var(--primary)]">
        <Search size={17} className="shrink-0 text-[var(--muted)]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquise..." className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--muted-2)]" aria-label="Pesquise" /><button className="shrink-0 rounded-full bg-[var(--primary)] px-3 py-1 text-[13px] font-bold text-white">Buscar</button>
      </form>
      <div className="flex shrink-0 items-center gap-1.5">
        <button onClick={onTheme} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)]" aria-label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button onClick={onBell} className="relative grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)]" aria-label="Abrir alertas"><Bell size={18} />{unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#C83E3E] px-1 text-[11px] font-bold text-white">{unread}</span>}</button>
        <ProfileMenu onNotice={onNotice} historySaving={historySaving} onSaveProfile={onSaveProfile} onSearchQuery={onSearchQuery} />
      </div>
    </div>
  </header>;
}
