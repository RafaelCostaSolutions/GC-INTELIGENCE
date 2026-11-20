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

## CI/CD (GitHub Actions)

Workflow em `.github/workflows/ci.yml`:

- Dispara em **push** e **pull request** para `main`
- Instala dependências com cache
- Extrai automaticamente o `App.tsx` e assets do `.tar.gz` (enquanto ainda não estiverem commitados)
- Roda **typecheck** (`tsc --noEmit`)
- Roda **build** (`vite build`)
- Publica o artefato `dist` por 7 dias

Você pode acompanhar as runs em:
https://github.com/RafaelCostaSolutions/GC-INTELIGENCE/actions

### Próximos passos (opcional)

- Deploy automático para **GitHub Pages** ou **Vercel/Netlify**
- Adicionar lint (ESLint) e testes
- Remover o `.tar.gz` depois de commitar `src/App.tsx` + assets

## Estrutura final esperada

```
.
├── .github/workflows/ci.yml
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
        └── ...
```
