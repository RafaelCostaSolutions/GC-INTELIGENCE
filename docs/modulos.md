# Guia dos módulos

Cada aba de um setor é um módulo em `src/modules/`. Este guia diz **o que cada um faz** e **em qual arquivo está**. As descrições vêm dos textos da própria tela e da leitura do código.

Todos os caminhos abaixo são relativos a `src/`. Como cada pasta de módulo é organizada: [`estrutura.md`](estrutura.md).

## Componentes compartilhados (`components/`)

| Arquivo | Função |
|---|---|
| `Topbar.tsx` | Barra superior |
| `Kpi.tsx`, `Section.tsx`, `ChartCard.tsx` | Blocos visuais usados em todas as abas |
| `sectorIcon.tsx` | Ícone de cada setor |
| `AiMode.tsx` | **Modo IA**: respostas por palavras-chave; exibe os painéis de IA do Laboratório |
| `SectorSearchResults.tsx` | Resultado da busca por setor |
| `ProfileMenu.tsx` | Menu do perfil e preferência de histórico |

## Setor Clínica — `modules/clinica/`

| Aba | Pasta | Componente | O que faz |
|---|---|---|---|
| Atendimento e Consulta | `atendimento/` | `AtendimentoModule` | Painel do médico: pacientes do dia, chamada, consulta com cronômetro |
| Cadastro de Pacientes | `pacientes/` | `PatientsModule` (usa `ProntuarioModule`) | Cadastro completo, prevenção de duplicidade, prontuário, histórico, documentos, família |
| Prescrição e Solicitações | `prescricao/` | `PrescricaoModule` | Prescrição eletrônica com alertas de alergia, interação e duplicidade; solicitação de exames |
| Sugestões para o Gestor | `sugestoes-gestor/` | `SugestoesGestorModule` | Resumo e sugestões ao gestor e apoio ao profissional |
| Controle de Insumos | `insumos/` | `InsumosClinicaModule` | Retirada por código de barras, vínculo com paciente/consulta/procedimento, validade |
| Acompanhamento e Continuidade | `continuidade/` | `ContinuityModule` | Programas de crônicos, linhas de cuidado, protocolos e prevenção |
| Procedimentos e Estrutura | `procedimentos-estrutura/` | `ProcedimentosEstruturaModule` | Agenda de salas e equipamentos, procedimentos, limpeza, termos de consentimento |
| Equipe e Produtividade | `equipe-produtividade/` | `EquipeProdutividadeModule` | Cadastro de profissionais, escala semanal, produtividade, tempo e repasse |
| Finanças da Clínica | `financas/` | `FinancasClinicaModule` | Receita, custo e margem, faturamento por convênio, glosas, pacotes, contas |
| Relatórios e Visualização | `relatorios/` | `RelatoriosVisualizacaoModule` | Dashboard da Clínica, filtros, tendências, exportação CSV |
| Chamados, Equipamentos, Preventiva, Disponibilidade, Financeiro, Qualidade, Agendamentos | — | direto em `App.tsx` | Abas gerais, ainda dentro do `App` |

## Setor Laboratório — `modules/laboratorio/`

| Aba | Pasta | Componente | O que faz |
|---|---|---|---|
| Modo IA | `inteligencia/` + `components/AiMode.tsx` | `SugestoesGestorLaboratorioPanel`, `PrevisoesIALaboratorioPanel` | Sugestões ao gestor e previsões do Laboratório (dados fixos) |
| Cadastro e Catálogo de Exames | `catalogo-exames/` | `CatalogoExamesModule` | Catálogo por área, valores de referência, preparo, convênios, laboratórios de apoio, pacotes |
| Pedido e Agendamento | `pedido-agendamento/` | `PedidoAgendamentoModule` | Registro de pedido, pedido digital, agendamento de coleta, elegibilidade |
| WhatsApp e Comunicação | `whatsapp/` | `WhatsAppLabModule` | Conversa simulada, lembrete com preparo, consentimento, pesquisas |
| Pedidos e Exames | `pedidos-exames/` | `LabOrdersModule` | Pedidos recebidos da Clínica: pendentes, coleta, análise |
| Coleta e Amostras | `coleta-amostras/` | `ColetaAmostrasModule` (+ `Barcode`) | Etiquetas com código de barras, registro de coleta, rastreabilidade, transporte, descarte, recoleta |
| Análise e Resultados | `analise-resultados/` | `AnaliseResultadosModule` | Validação de resultados, confirmação dupla para críticos, modelos de laudo |
| Entrega de Resultados | `entrega-resultados/` | `EntregaResultadosModule` | Entrega por canal, confirmação, 2ª via |
| Qualidade e Rastreabilidade | `qualidade/` | `ControleQualidadeModule` | Rastreabilidade por lote, controles de qualidade |
| Controle de Insumos e Reagentes | `insumos-reagentes/` | `ControleInsumosLabModule` | Cadastro de reagentes, entrada e retirada, lotes, compras |
| Tempo e Produtividade | `tempo-produtividade/` | `TempoProdutividadeModule` | Tempos e TAT, volume, exames por hora, produtividade por profissional |
| Finanças do Laboratório | `financas/` | `FinancasLaboratorioModule` | Receita, custo e margem por exame, exames com prejuízo, orçamento, investimentos |
| Integração com Outros Módulos | `integracao/` | `IntegracaoLabModule` | Chamado de manutenção pelo laboratório, pedidos vindos da Clínica |
| Segurança e Conformidade | `seguranca/` | `SegurancaLabModule` | Trilha de auditoria de pedidos, resultados e retificações |
| Relatórios e Visualização | `relatorios/` | `RelatoriosLabModule` | Dashboard do Laboratório, filtros, exportação |
| Chamados, Equipamentos, Preventiva, Disponibilidade, Financeiro, Qualidade, Exames | — | direto em `App.tsx` | Abas gerais, ainda dentro do `App` |

## Itens compartilhados

| Pasta | Conteúdo |
|---|---|
| `types/` | Tipos usados por mais de um módulo (`Patient`, `Prescription`, `CareOrder`, `AlertItem`, `PredictiveAlert`…) |
| `data/` | Constantes e dados de exemplo usados por mais de um módulo (`SECTORS`, `INITIAL_ALERTS`, `PREDICTIVE_ALERTS`, `SEED_PATIENTS`, `norm`, `money`…) |
| `lib/` | Funções usadas por mais de um módulo (`sectorIdForQuery`, `isAllSectorsQuery`, `buildAiAnswer`, `pickSuggestions`…) |
| `services/api.ts` | Acesso ao servidor |
