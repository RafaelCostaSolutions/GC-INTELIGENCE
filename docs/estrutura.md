# Estrutura do código

Como o front-end está organizado em `src/` e **onde colocar cada coisa nova**.

## Mapa de pastas

```
src/
├─ main.tsx                      ponto de entrada
├─ App.tsx                       "casca": estado global, tema, navegação e abas
├─ index.css                     cores, tema claro/escuro, efeito de vidro
├─ assets/                       logo e imagens
├─ services/
│  └─ api.ts                     ÚNICO acesso ao servidor (POST /actions)
├─ types/                        tipos compartilhados
│  ├─ comum.ts                   usados pelos dois setores
│  ├─ clinica.ts
│  └─ laboratorio.ts
├─ data/                         constantes e dados de exemplo compartilhados
│  ├─ comum.ts · clinica.ts · laboratorio.ts
├─ lib/                          funções utilitárias compartilhadas
│  ├─ comum.ts · clinica.ts
├─ components/                   peças visuais reutilizadas
│  ├─ Topbar · Kpi · Section · ChartCard · sectorIcon
│  └─ AiMode · SectorSearchResults · ProfileMenu
└─ modules/
   ├─ clinica/<modulo>/          10 módulos
   └─ laboratorio/<modulo>/      15 módulos
```

## Anatomia de um módulo

Todas as pastas em `src/modules/` seguem o mesmo molde (arquivos só existem se houver conteúdo):

```
modules/clinica/prescricao/
├─ PrescricaoModule.tsx    a tela (componente React)
├─ dados.ts                constantes e dados de exemplo só deste módulo
├─ tipos.ts                tipos só deste módulo
├─ utils.ts                funções só deste módulo
└─ index.ts                exporta o módulo — é o que o App importa
```

## Onde cada coisa vai

| Eu preciso de… | Vai em… |
|---|---|
| Uma tela/aba nova | `modules/<setor>/<nome>/` com o molde acima + ligar a aba em `App.tsx` |
| Um tipo usado por **um** módulo | `tipos.ts` do módulo |
| Um tipo usado por **vários** módulos | `types/<setor>.ts` (ou `comum.ts`) |
| Dados de exemplo de um módulo | `dados.ts` do módulo |
| Dados usados por vários módulos | `data/<setor>.ts` |
| Função usada por vários módulos | `lib/<setor>.ts` |
| Um botão/cartão visual reutilizável | `components/` |
| Chamada ao servidor | `services/api.ts` — nunca `fetch` direto num módulo |

**Regra de ouro:** começou a ser usado por um segundo módulo? Suba para `types/`, `data/`, `lib/` ou `components/`. Módulos **não importam uns dos outros**; só importam de `types/`, `data/`, `lib/`, `components/` e `services/`.

## Convenções

- Pastas em `minúsculas-com-hifen`; componentes em `PascalCase.tsx`.
- Textos da interface em português; nomes de código sem acento.
- Importações por caminho relativo (não há alias `@/`).

## O que esta organização mudou

O código vivia inteiro em `src/App.tsx` (4.095 linhas). Foi **movido, sem reescrever**:

- 299 declarações movidas com o texto **idêntico** ao original (verificado automaticamente).
- 123 arquivos; nenhum com mais de 265 linhas, exceto `App.tsx` (358).
- Sem dependências circulares.
- Comparação do app antes e depois: **92 telas renderizadas** (as 41 abas dos dois setores, antes e depois de clicar em todos os botões, mais a tela inicial e a busca) com HTML **idêntico**.
- `npm run build` passa; `tsc` caiu de 36 para 28 erros (todos preexistentes; os 8 que saíram eram imports sem uso) e o lint de 87 para 81 avisos.

## O que ainda não foi feito

| Item | Observação |
|---|---|
| Mapa `aba → componente` no `App.tsx` | Hoje a troca de aba é feita por ~40 condições `sectorTab === …` seguidas. Próximo passo natural. |
| Quebrar o estado do `App` | 33 `useState` na raiz; candidatos a `useReducer`/contextos. |
| Formatar o código (Prettier) | Linhas ainda muito longas. Foi deixado de fora de propósito, para este PR ser só "mover". Fazer em PR separado. |
| Corrigir os 28 erros de `tsc` | Preexistentes: 7 erros de tipo (em `EquipeProdutividadeModule`, `ProcedimentosEstruturaModule`, `IntegracaoLabModule` e `pedido-agendamento/utils.ts`) e 21 variáveis sem uso. |
| Testes automatizados | Começar pelas regras de negócio de `lib/` e dos `utils.ts`. |
| Rodar `tsc` no CI | Só depois de zerar os erros acima. |
