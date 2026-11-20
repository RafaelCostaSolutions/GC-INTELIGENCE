// Acesso ao servidor de dados (POST /actions). Ver docs/arquitetura-frontend.md
export async function api(action: string, args: Record<string, unknown>) {
  const res = await fetch("actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, args }) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.error) throw new Error(json?.error || `Falha na operação (${res.status})`);
  return json.data;
}
