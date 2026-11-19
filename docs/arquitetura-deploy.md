# Arquitetura de deploy e CI/CD: GC-INTELIGENCE

## Visão geral

O sistema é formado por três partes, cada uma hospedada separadamente.

| Componente | Tecnologia | Hospedagem |
|---|---|---|
| Front-end | React + Vite + TypeScript | Vercel |
| Back-end (API) | Python | A definir |
| Banco de dados | PostgreSQL (a confirmar) | A definir |

Fluxo de uso:

## Ambientes

| Ambiente | Origem | Quando atualiza | URL |
|---|---|---|---|
| dev | Máquina local e preview de cada Pull Request | A cada push no PR | URL de preview da Vercel |
| staging | Branch `main` | Automático a cada merge | gc-inteligence-staging.vercel.app |
| prod | A definir | Manual, a partir de tag `v*` | A definir |

Cada ambiente deve ter seu próprio banco e sua própria API. Staging nunca usa dados de produção.

## Fluxo de branches

1. Criar uma branch `feature/<nome>` a partir da `main`.
2. Abrir um Pull Request para a `main`.
3. O pipeline de CI roda e precisa estar verde para permitir o merge.
4. A Vercel cria uma URL de preview para o PR, para revisão.
5. Revisão e aprovação (Rafael).
6. Merge na `main`.
7. O CI roda na `main` e a Vercel publica automaticamente no staging.
8. Quando for necessário publicar em produção, criar uma tag `v*` (ainda não implementado).

## Pipeline de CI (GitHub Actions)

Arquivo: `.github/workflows/ci.yml`

- Gatilhos: Pull Request, e push nas branches `main` e `develop`.
- Passos atuais: checkout, instalação das dependências (`npm ci`) e build (`npm run build`).

Passos planejados:
- Front-end: lint e checagem de tipos (`npm run typecheck`).
- Back-end Python: testes e lint.
- Deploy do back-end e do banco, conforme a hospedagem escolhida.

## Deploy do front-end (Vercel)

- Projeto conectado ao repositório GitHub.
- Production Branch: `main` (funciona como staging por enquanto).
- Variáveis de ambiente configuradas na Vercel, separadas por ambiente:
  - `VITE_APP_ENV`: nome do ambiente (ex.: `staging`).
  - `VITE_API_URL`: endereço da API daquele ambiente.
- Opção "Wait for CI" ativada, quando disponível, para publicar só após o CI passar.

## Comunicação entre front-end e back-end

- O front-end lê o endereço da API na variável `VITE_API_URL`.
- A API precisa liberar CORS para o domínio da Vercel (staging e previews).
- Autenticação e regras de negócio ficam no back-end. Nunca colocar segredos no front-end.

## Segredos e configuração

- Nunca commitar arquivos `.env`. O arquivo `.env.example` contém apenas os nomes das variáveis, sem valores.
- GitHub: Settings > Environments (dev, staging, prod), com os secrets de cada ambiente.
- Vercel: Environment Variables, por ambiente.
- Back-end e banco: segredos configurados na hospedagem escolhida.

## Pendências

- [ ] Definir a hospedagem do back-end Python.
- [ ] Definir a hospedagem do PostgreSQL.
- [ ] Definir como e quando a produção é publicada.
- [ ] Criar o pipeline do back-end (testes, build e deploy).
- [ ] Corrigir os erros de TypeScript do `App.tsx` e ativar o `typecheck` no CI.
- [ ] Decidir se a branch `develop` será usada, ou removê-la dos gatilhos do CI.

## Histórico de decisões

- 17/11/2026: back-end em Python, confirmado pelo Rafael Costa.
- 18/11/2026: front-end na Vercel, decidido com o Rafael Costa. Hospedagem do back-end e do banco ainda em aberto.