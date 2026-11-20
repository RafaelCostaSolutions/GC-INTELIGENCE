# GC Intelligence · GottCured

Dashboard inteligente de gestão clínica e laboratorial com:

- Previsão de demanda e absenteísmo
- Alertas preditivos de equipamentos e processos
- Visão por setores (Clínica e Laboratório)
- Simulações e insights operacionais

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React (ícones)
- Recharts (gráficos)
- Vercel (deploy)

## Setup rápido (importante)

O arquivo principal `App.tsx` (~1.1 MB) e as imagens ainda estão no arquivo `Gottcured+Home+Limpa.tar.gz` (mantido temporariamente).

Extraia-os assim:

```bash
# Na raiz do repositório
tar -xzf Gottcured+Home+Limpa.tar.gz

# Mova para a estrutura correta
mkdir -p src/assets
mv App.tsx src/
mv assets/* src/assets/

# Corrija o import do logo (se ainda tiver o caminho antigo)
# Abra src/App.tsx e troque a linha do logoUrl para:
# import logoUrl from "./assets/55d9576ebcfb89df-gottcured_logo_transparente.png";
```

Depois:

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

## Scripts

| Comando            | Descrição                    |
|--------------------|------------------------------|
| `npm run dev`      | Servidor de desenvolvimento  |
| `npm run build`    | Typecheck + build de produção|
| `npm run preview`  | Preview do build             |
| `npm run typecheck`| Apenas verificação de tipos  |

## CI/CD

### GitHub Actions (Build)

- `.github/workflows/ci.yml` → typecheck + build em todo push/PR para `main`
- Acompanhe: https://github.com/RafaelCostaSolutions/GC-INTELIGENCE/actions

### Vercel (Deploy)

Já está preparado para Vercel:

1. **`vercel.json`** — configuração SPA (Vite + rewrites)
2. **`.github/workflows/deploy.yml`** — deploy automático via Actions (opcional)

#### Forma recomendada (mais simples)

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **Add New Project** → importe este repositório
3. Framework Preset: **Vite** (ou deixe o `vercel.json` detectar)
4. Root Directory: `./`
5. Clique em **Deploy**

A partir daí todo push na `main` gera um deploy automático no Vercel.

#### Forma avançada (via GitHub Actions)

Se preferir controlar o deploy pelo Actions:

1. No Vercel → Project Settings → General → copie:
   - **Project ID**
   - **Org / Team ID**
2. Crie um token em [vercel.com/account/tokens](https://vercel.com/account/tokens)
3. No GitHub do repositório → **Settings → Secrets and variables → Actions** adicione:

| Secret             | Valor              |
|--------------------|--------------------|
| `VERCEL_TOKEN`     | Token gerado       |
| `VERCEL_ORG_ID`    | ID da organização  |
| `VERCEL_PROJECT_ID`| ID do projeto     |

Depois disso o workflow `Deploy to Vercel` passa a publicar automaticamente.

## Estrutura

```
.
├── .github/workflows/
│   ├── ci.yml          # Build + typecheck
│   └── deploy.yml      # Deploy Vercel (opcional)
├── vercel.json         # Configuração Vercel
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    └── assets/
```
