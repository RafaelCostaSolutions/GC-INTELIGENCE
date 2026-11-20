# GC-INTELIGENCE — Visão geral

**Painel de gestão da GottCured**: um sistema web que reúne, em uma só tela, a operação de uma **Clínica** e de um **Laboratório** — atendimento, pedidos de exames, finanças, estoque, equipe, qualidade, alertas e previsões.

> **Estado atual: protótipo de interface.** Os dados exibidos são de exemplo, as "previsões de IA" são listas fixas e não há login. O que isso significa está em [Estado atual](#estado-atual).

## Para quem é

| Pessoa | O que faz no sistema |
|---|---|
| Gestor | Acompanha indicadores, alertas, finanças e sugestões por setor |
| Médico / profissional | Chama pacientes, registra consulta, prescreve e solicita exames |
| Recepção | Cadastra pacientes, agenda consultas e coletas |
| Equipe do laboratório | Recebe pedidos, coleta amostras, valida e entrega resultados |

## O que o sistema faz

A tela inicial tem **busca**, **alertas** (sino) e **sugestões**. Buscando por "clínica" ou "laboratório" abre-se o setor, que é organizado em **abas**.

**Clínica** — Atendimento e Consulta · Cadastro de Pacientes (com prontuário) · Prescrição e Solicitações · Sugestões para o Gestor · Controle de Insumos · Acompanhamento e Continuidade · Procedimentos e Estrutura · Equipe e Produtividade · Finanças da Clínica · Relatórios e Visualização · mais abas gerais (Chamados, Equipamentos, Preventiva, Disponibilidade, Financeiro, Qualidade, Agendamentos).

**Laboratório** — Modo IA · Cadastro e Catálogo de Exames · Pedido e Agendamento · WhatsApp e Comunicação · Pedidos e Exames · Coleta e Amostras · Análise e Resultados · Entrega de Resultados · Qualidade e Rastreabilidade · Controle de Insumos e Reagentes · Tempo e Produtividade · Finanças do Laboratório · Integração com Outros Módulos · Segurança e Conformidade · Relatórios e Visualização · mais abas gerais.

**Recursos gerais** — tema claro/escuro · alertas (marcar como lido, adiar, ignorar, resolver) · exportação de relatórios em CSV · preferência de histórico de busca.

Guia aba por aba, com o arquivo de cada uma: [`modulos.md`](modulos.md).

## Como rodar

```bash
npm install
npm run dev       # abre o app localmente
npm run build     # gera a versão de produção
```

O CI (`.github/workflows/ci.yml`) roda `npm ci` e `npm run build` a cada Pull Request. Detalhes de deploy: [`arquitetura-deploy.md`](arquitetura-deploy.md).

## Tecnologias

React 19 + TypeScript · Vite · Tailwind CSS 3 · lucide-react (ícones) · recharts (gráficos) · fontes Fraunces e Public Sans.

## Estado atual

- **Dados de exemplo.** Pacientes, valores e alertas são fictícios (ex.: CPF `123.456.789-01`).
- **"IA" simulada.** Previsões e sugestões são listas fixas e respostas por palavras-chave; não há chamada a modelo de IA.
- **Sem login nem perfis de acesso.**
- **Persistência não conectada ao backend.** O app grava em `POST /actions`, que **não é a API** da branch `feat/database`. Ver [`arquitetura-frontend.md`](arquitetura-frontend.md#4-persistência-e-integração-com-o-backend). Sem servidor, os dados duram só a sessão.
- **Exportação "PDF" simulada.** Gera texto puro, não um PDF válido. O CSV é real.

## Dados pessoais e privacidade

São **dados de saúde**, sensíveis pela LGPD. Antes de usar com pacientes reais é preciso, no mínimo: login e perfis de acesso, HTTPS, trilha de auditoria no servidor, backup e política de retenção.

## Glossário

| Termo | Significado |
|---|---|
| **Setor** | Clínica ou Laboratório |
| **Módulo / aba** | Cada funcionalidade dentro de um setor |
| **Glosa** | Cobrança recusada por um convênio |
| **TAT** | Tempo entre o pedido do exame e a entrega do resultado |
| **Preventiva** | Manutenção programada de equipamento |
| **Insumos / reagentes** | Materiais consumidos no atendimento e nas análises |
| **Seed** | Dados de exemplo embutidos no código |
| **Coleção** | "Gaveta" de dados que o front pede ao servidor (ex.: `gottcured_patients`) |
