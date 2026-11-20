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
mv index.css src/   # se quiser sobrescrever (já tem versão organizada)

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

## Build

```bash
npm run build
npm run preview
```

## Estrutura final esperada

```
.
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx          # dashboard completo
    ├── index.css
    └── assets/
        ├── 55d9576ebcfb89df-gottcured_logo_transparente.png
        └── 7a764c67a672826f-Captura_de_tela_2026-11-11_121259.png
```

---

Repositório organizado a partir do dump original. Depois de extrair e testar, você pode remover o `.tar.gz`.
