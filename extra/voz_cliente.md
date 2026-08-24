<a id="capitulo-903"></a>
## Capítulo 14-A: Voz do Cliente, Satisfação e o Elo com Lean Six Sigma

### A pergunta de engenharia

*A pesquisa de satisfação anual deu 87%. A diretoria está contente. Isso significa que a empresa
está ouvindo o cliente?*

Não necessariamente. E a distinção entre as duas coisas — **o que o cliente diz** e **como o
cliente avalia o que recebeu** — é o ponto de partida de todo este capítulo.

---

## 1 · A diferença fundamental

> **Voz do Cliente = o que o cliente diz, espera, precisa e valoriza.**
> **Satisfação = como o cliente avalia a experiência ou o resultado que recebeu.**

Imagine uma indústria que fabrica embalagens para cosméticos. O cliente diz:

> "Preciso receber as embalagens sem riscos, na quantidade acordada e dentro do prazo."

Isso é **Voz do Cliente**. A empresa transforma isso em requisitos mensuráveis:

| Voz do Cliente | Requisito mensurável |
|---|---|
| "Sem riscos" | ≤ X defeitos por milhão |
| "Quantidade correta" | 100% da quantidade encomendada |
| "Dentro do prazo" | OTIF ≥ 98% |
| "Boa aparência" | Critérios de inspeção visual |
| "Resposta rápida" | Reclamações respondidas ≤ 48 h |

Depois de receber o produto, o cliente responde: *"Estou satisfeito com o atendimento e com a
qualidade."* Isso é **satisfação** — uma avaliação posterior, sobre uma experiência já vivida.

<div class="kpi-row">
<div class="kpi"><div class="kpi-k">VoC</div><div class="kpi-v">Antes</div><div class="kpi-s">o que é importante para o cliente</div></div>
<div class="kpi"><div class="kpi-k">Satisfação</div><div class="kpi-v">Depois</div><div class="kpi-s">avaliação do cliente sobre o que recebeu</div></div>
</div>

As duas alimentam o mesmo sistema: **requisitos → indicadores → análise → melhoria contínua**. Mas
são medidas em momentos diferentes, por instrumentos diferentes, e confundi-las é o erro mais comum
em sistemas de gestão da qualidade.

---

## 2 · Como isso aparece na ISO 9001

Há uma diferença conceitual que vale registar: a **ISO 9001 não exige** um processo formalmente
chamado "Voz do Cliente". O que ela exige é que a organização **determine e monitorize a percepção
dos clientes** sobre o grau em que as suas necessidades e expectativas foram atendidas, e que
**determine os requisitos** relacionados a produtos e serviços, monitorizando o desempenho face a
eles.

Daí sai a cadeia lógica que a norma pressupõe, mais importante do que qualquer questionário isolado:

**Necessidades/expectativas do cliente → requisitos do produto/serviço → processos capazes de
atender aos requisitos → resultados → percepção/satisfação do cliente → análise → melhoria.**

### O erro comum

Uma empresa que reporta "pesquisa de satisfação anual: 87%" pode achar que está a cumprir bem o
requisito. Mas isso não significa necessariamente que esteja a ouvir o cliente — porque pode haver,
em paralelo e sem qualquer ligação à análise de satisfação: reclamações, devoluções, atrasos,
problemas de qualidade, pedidos de alteração, perda de clientes, reclamações comerciais e problemas
de assistência técnica. Um sistema maduro **cruza** todas estas fontes; um sistema burocrático só
arquiva a pesquisa.

---

## 3 · VoC é muito maior do que pesquisa de satisfação

A Voz do Cliente industrial tem três famílias de fontes, e a pesquisa de satisfação é apenas **uma**
das entradas da primeira:

| Fontes diretas | Fontes indiretas | Dados comportamentais |
|---|---|---|
| Entrevistas | Reclamações | Frequência de compra |
| Reuniões com clientes | Devoluções | Volume comprado |
| Pesquisas e questionários | Não conformidades | Abandono |
| Visitas | Garantias acionadas | Redução de pedidos |
| Workshops | Assistência técnica | Prazo médio de pagamento |
| Feedback comercial | Auditorias de cliente | Reincidência de reclamações |
| Reuniões de desenvolvimento | Rejeições e perda de clientes | — |

**VoC ≠ pesquisa de satisfação.** A pesquisa é uma das fontes; tratá-la como a fonte única é como
julgar a saúde de um processo só pelo Cpk, ignorando a carta de controlo.

---

## 4 · Onde entra o Lean Manufacturing

No Lean existe o conceito de **valor para o cliente** (*customer value*). A pergunta central —
*o que é valor para o cliente?* — muda completamente a abordagem à melhoria.

O cliente valoriza qualidade, prazo, disponibilidade, preço, flexibilidade. A fábrica, entretanto,
tem excesso de inspeções, esperas, retrabalho, movimentação, estoques e processos duplicados. O
Lean pergunta: *quais destas atividades realmente agregam valor para o cliente?* — e a VoC é o que
responde a essa pergunta, não a intuição de quem desenha o processo.

### Exemplo

O cliente diz: *"Preciso receber o produto em 5 dias."* O processo atual é:

**Pedido → espera → programação → espera → produção → inspeção → espera → expedição**, com lead
time de 12 dias.

O cliente não está interessado em saber que a fábrica tem excelente taxa de utilização das máquinas.
Ele quer produto correto, com qualidade, no prazo. A VoC define **o que é valor**; o Lean elimina os
desperdícios que impedem a entrega desse valor. É a mesma lógica do Capítulo 27 (VSM) e do Capítulo
40-B (Makigami) — aqui aplicada especificamente à voz do cliente como ponto de partida.

---

## 5 · Onde entra o Six Sigma: VOC → CTQ

O Six Sigma formaliza esta tradução com um vocabulário próprio: **Voice of Customer → Critical to
Quality**. O cliente diz *"quero receber rapidamente"* — subjetivo. Transforma-se em *"pedido
entregue em até 5 dias"* — um **CTQ**. Depois: **CTQ → especificação → indicador → capacidade do
processo**, encadeando diretamente com o Capítulo 71-A (Cp/Cpk).

| VoC | CTQ | Métrica |
|---|---|---|
| Quero entrega rápida | Lead time | ≤ 5 dias |
| Quero produto sem defeitos | Qualidade | ≤ 500 ppm |
| Quero quantidade correta | Quantidade | 100% |
| Quero resposta rápida | Atendimento | ≤ 24 h |
| Quero produto consistente | Variabilidade | Cp/Cpk |

Esta é uma das maiores forças do Six Sigma: **transformar uma necessidade subjetiva do cliente numa
característica mensurável do processo.** É também exatamente a definição de CTQ do Capítulo 6 — este
capítulo mostra de onde o CTQ *vem*.

---

## 6 · A satisfação decomposta

A satisfação entra depois na cadeia — mas nunca é uma coisa só. Um cliente pode estar satisfeito com
a qualidade e insatisfeito com o prazo; satisfeito com o produto e insatisfeito com o atendimento ou
com o preço. Uma média única esconde isso. Uma pesquisa de satisfação madura **decompõe a
experiência** por dimensão:

```plotly
voc-dimensoes
```

A média geral de 7,9 parece confortável. Decomposta, ela revela que **documentação** e **prazo** são
as dimensões mais fracas — informação que a média sozinha nunca daria, e que aponta exatamente para
onde investigar primeiro.

> **Satisfação não é sinônimo de "qualidade".** É a soma de várias avaliações independentes, e cada
> uma delas pode ter uma causa raiz completamente diferente.

---

## 7 · Juntando ISO 9001 + Lean + Six Sigma: o ciclo fechado

Esta é a arquitetura central do capítulo. Passe o rato sobre cada etapa:

<figure class="figure2026">
<svg role="img" aria-label="Ciclo fechado da Voz do Cliente: da voz do cliente aos requisitos, CTQs, processos, desempenho, satisfacao, analise de gap, melhoria e de volta a uma nova voz do cliente" viewBox="0 0 1000 720" style="width:100%;height:auto;display:block;background:var(--surface-1);border:1px solid var(--line);border-radius:10px" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="vc-ar" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7c8f99"/></marker>
<marker id="vc-ar2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)"/></marker>
</defs>
<style>
.vc-box { fill: var(--surface-2); stroke: var(--line); stroke-width: 1.6; }
.vc-t { font-family: "Segoe UI", Inter, system-ui, sans-serif; }
.vc-h { font-family: "Segoe UI", Inter, system-ui, sans-serif; fill: var(--accent-ink); font-weight: 700; font-size: 12.5px; }
.vc-l { stroke: #7c8f99; stroke-width: 1.6; fill: none; }
</style>

<path class="vc-l" d="M 591,76 A 300,300 0 0,1 657,106" marker-end="url(#vc-ar)"/>
<path class="vc-l" d="M 756,205 A 300,300 0 0,1 797,321" marker-end="url(#vc-ar)"/>
<path class="vc-l" d="M 797,403 A 300,300 0 0,1 756,519" marker-end="url(#vc-ar)"/>
<path class="vc-l" d="M 657,618 A 300,300 0 0,1 591,648" marker-end="url(#vc-ar)"/>
<path class="vc-l" d="M 409,648 A 300,300 0 0,1 343,618" marker-end="url(#vc-ar)"/>
<path class="vc-l" d="M 244,519 A 300,300 0 0,1 203,403" marker-end="url(#vc-ar)"/>
<path class="vc-l" d="M 203,321 A 300,300 0 0,1 244,205" marker-end="url(#vc-ar)"/>
<path class="vc-l" d="M 343,106 A 300,300 0 0,1 409,76" marker-end="url(#vc-ar2)" stroke-dasharray="5 4"/>
<text class="vc-t" x="500" y="18" text-anchor="middle" font-size="11" fill="var(--accent-ink)">novo ciclo →</text>

<g data-tip="<b>Voz do Cliente.</b> Necessidades, expectativas e reclamações, vindas de fontes diretas (entrevistas, pesquisas), indiretas (reclamações, devoluções) e comportamentais (abandono, reincidência). Não é só a pesquisa anual.">
  <rect class="vc-box" x="414" y="33" width="172" height="58" rx="10"/>
  <text class="vc-h" x="500" y="56" text-anchor="middle">VOZ DO CLIENTE</text>
  <text class="vc-t" x="500" y="75" text-anchor="middle" font-size="10.5" fill="var(--ink-3)">necessidades · expectativas · reclamações</text>
</g>

<g data-tip="<b>Requisitos e CTQs.</b> A voz subjetiva vira especificação mensuravel. 'Quero rapidez' torna-se 'lead time ≤ 5 dias'. É a ponte entre marketing e engenharia — ver Capítulo 6.">
  <rect class="vc-box" x="626" y="121" width="172" height="58" rx="10"/>
  <text class="vc-h" x="712" y="144" text-anchor="middle">REQUISITOS / CTQs</text>
  <text class="vc-t" x="712" y="163" text-anchor="middle" font-size="10.5" fill="var(--ink-3)">especificação mensurável</text>
</g>

<g data-tip="<b>Processos.</b> O que precisa de mudar para entregar o que o cliente valoriza — a sexta dimensão que este capítulo acrescenta às cinco clássicas (ISO, VoC, Lean, Six Sigma, satisfação).">
  <rect class="vc-box" x="714" y="333" width="172" height="58" rx="10"/>
  <text class="vc-h" x="800" y="356" text-anchor="middle">PROCESSOS</text>
  <text class="vc-t" x="800" y="375" text-anchor="middle" font-size="10.5" fill="var(--ink-3)">capazes de atender ao requisito</text>
</g>

<g data-tip="<b>Desempenho real.</b> O que o processo de facto entrega — PPM, OTIF, tempo de resposta. Indicador objetivo, não perceção.">
  <rect class="vc-box" x="626" y="545" width="172" height="58" rx="10"/>
  <text class="vc-h" x="712" y="568" text-anchor="middle">DESEMPENHO REAL</text>
  <text class="vc-t" x="712" y="587" text-anchor="middle" font-size="10.5" fill="var(--ink-3)">PPM · OTIF · tempo de resposta</text>
</g>

<g data-tip="<b>Perceção / satisfação.</b> Como o cliente avalia o que recebeu, decomposta por dimensão (qualidade, prazo, atendimento...). Indicador de satisfação ≠ indicador de desempenho — precisa dos dois.">
  <rect class="vc-box" x="414" y="633" width="172" height="58" rx="10"/>
  <text class="vc-h" x="500" y="656" text-anchor="middle">PERCEÇÃO / SATISFAÇÃO</text>
  <text class="vc-t" x="500" y="675" text-anchor="middle" font-size="10.5" fill="var(--ink-3)">decomposta por dimensão</text>
</g>

<g data-tip="<b>Análise de gap.</b> Onde o desempenho real e a perceção divergem do requisito. Pareto nas reclamações, causa raiz nos desvios — ver secção 9 abaixo.">
  <rect class="vc-box" x="202" y="545" width="172" height="58" rx="10"/>
  <text class="vc-h" x="288" y="568" text-anchor="middle">ANÁLISE DE GAP</text>
  <text class="vc-t" x="288" y="587" text-anchor="middle" font-size="10.5" fill="var(--ink-3)">Pareto · causa raiz</text>
</g>

<g data-tip="<b>Melhoria.</b> DMAIC quando o problema é reduzir variação ou defeitos; Lean quando é eliminar desperdício e lead time; PDCA quando é o ciclo de gestão que fecha tudo isto. Os três cabem aqui, não competem entre si.">
  <rect class="vc-box" x="114" y="333" width="172" height="58" rx="10"/>
  <text class="vc-h" x="200" y="356" text-anchor="middle">MELHORIA</text>
  <text class="vc-t" x="200" y="375" text-anchor="middle" font-size="10.5" fill="var(--ink-3)">Lean · Six Sigma · PDCA</text>
</g>

<g data-tip="<b>Novo padrão.</b> A melhoria vira o novo modo de operar — instrução de trabalho, plano de controlo, limite de carta atualizados. A partir daqui, o ciclo mede de novo e gera uma nova Voz do Cliente.">
  <rect class="vc-box" x="202" y="121" width="172" height="58" rx="10"/>
  <text class="vc-h" x="288" y="144" text-anchor="middle">NOVO PADRÃO</text>
  <text class="vc-t" x="288" y="163" text-anchor="middle" font-size="10.5" fill="var(--ink-3)">→ nova medição → nova VoC</text>
</g>

<text class="vc-t" x="500" y="708" text-anchor="middle" font-size="11.5" fill="var(--ink-3)">passe o rato (ou toque) em cada elemento do ciclo</text>
</svg>
<figcaption>O ciclo fechado da Voz do Cliente. O ponto central: não termina em "satisfação" — a
satisfação alimenta uma análise que gera melhoria, e a melhoria gera uma nova Voz do Cliente.</figcaption>
</figure>

O erro que este diagrama evita nomear é comum e caro: tratar **Pesquisa de satisfação → relatório →
arquivo** como se fosse o sistema completo. Isso é burocracia disfarçada de conformidade. Um sistema
realmente maduro fecha o ciclo — e é essa diferença que separa um SGQ tradicional de um **Quality
Management System orientado por dados e por cliente**.

---

## 8 · Como transformar isto em processos dentro de uma indústria

Em vez de um único "Procedimento de Satisfação do Cliente" — que fica estreito demais — a
arquitetura recomendada tem cinco processos distintos, encadeados:

| Processo | Objetivo | Define |
|---|---|---|
| **P-01 · Gestão da Voz do Cliente** | Identificar, recolher, analisar e transformar necessidades e expectativas em requisitos e oportunidades | Fontes, responsabilidades, periodicidade, coleta, classificação, análise |
| **P-02 · Gestão dos Requisitos do Cliente** | Traduzir VoC em requisitos mensuráveis | Especificações, CTQs, critérios de aceitação, gestão de alterações |
| **P-03 · Monitorização da Satisfação** | Medir a perceção do cliente | Metodologia de pesquisa, indicadores, amostragem, análise, metas |
| **P-04 · Gestão de Reclamações** | Tratar a reclamação como fonte estruturada de VoC, não como incidente isolado | Registo, classificação, investigação, causa raiz, CAPA, retorno ao cliente |
| **P-05 · Melhoria Contínua** | Converter os quatro processos anteriores em mudança sustentável | Inputs de VoC, satisfação, reclamações, auditorias, riscos e oportunidades |

Os cinco alimentam a **Análise pela Gestão**, que recebe VoC + satisfação + desempenho +
reclamações + riscos + melhorias — não cada um isolado, mas os cinco cruzados. É o requisito 9.3 da
ISO 9001 (Capítulo 93) na prática, não na teoria.

---

## 9 · Gestão de reclamações: a fonte mais desperdiçada de VoC

Uma reclamação não é *"problema do cliente"* — é uma fonte estruturada e gratuita de informação
sobre a Voz do Cliente. O erro mais comum é tratá-la caso a caso, sem agregar. Cem reclamações de
uma fábrica de embalagens, agregadas por causa:

```plotly
voc-pareto
```

O Pareto mostra o que a análise caso a caso nunca mostraria: **69% das reclamações vêm de apenas
duas causas** — embalagem danificada e atraso. Repare na coincidência com o gráfico da secção 6: a
satisfação por dimensão já tinha sinalizado **prazo** como uma das notas mais baixas. Duas fontes de
VoC completamente diferentes — uma perceptiva (pesquisa), outra objetiva (reclamação) — apontam para
o mesmo problema. Isso não é coincidência, é o sistema a funcionar: quando fontes independentes
convergem, a prioridade fica óbvia.

> **Indicador de satisfação ≠ indicador de desempenho.** OTIF de 98% é desempenho. "Cliente
> satisfeito com o prazo" é perceção. Um processo pode ter bom desempenho e má perceção — ou o
> inverso, quando o cliente não percebe uma melhoria real. Precisa dos dois, sempre.

---

## 10 · NPS, CSAT e CES: as três métricas que faltavam

As seções 6 e 9 mostraram *que* a satisfação precisa de ser decomposta e *que* as reclamações
precisam de ser agregadas. Faltam os três instrumentos que a indústria de facto usa para
transformar "perceção do cliente" num número que se acompanha mês a mês: **NPS**, **CSAT** e
**CES**. São complementares, não concorrentes — cada um responde a uma pergunta diferente.

### As três, lado a lado

| | **NPS** | **CSAT** | **CES** |
|---|---|---|---|
| **Nome completo** | Net Promoter Score | Customer Satisfaction Score | Customer Effort Score |
| **Criado por** | Fred Reichheld (Bain & Company), com Satmetrix | Sem autor único — deriva da pesquisa de marketing dos anos 1970-80; formalizado no índice ACSI (Claes Fornell, Universidade de Michigan) | Matthew Dixon, Karen Freeman e Nicholas Toman (CEB, hoje Gartner) |
| **Quando** | 2003, artigo *"The One Number You Need to Grow"*, *Harvard Business Review* | ACSI lançado em 1994; a pergunta de CSAT já era comum antes disso | 2010, artigo *"Stop Trying to Delight Your Customers"*, *Harvard Business Review* |
| **Pergunta típica** | "De 0 a 10, qual a probabilidade de recomendar [empresa/produto] a um colega?" | "Qual o seu nível de satisfação com [produto/atendimento/pedido]?" | "A empresa facilitou a resolução do meu problema?" (CES 2.0, escala de concordância) |
| **O que mede** | Lealdade e propensão a recomendar — uma leitura de **relação**, não de um episódio isolado | Satisfação com uma **experiência ou episódio específico** (uma compra, um atendimento, uma entrega) | O **esforço** que o cliente teve de fazer para resolver algo — não se ficou feliz, se foi fácil |

A diferença que mais gera confusão: CSAT pergunta "você gostou?"; CES pergunta "foi fácil?"; NPS
pergunta "você nos recomendaria?". Um cliente pode responder sim às três, ou sim a uma e não às
outras — e é exatamente essa divergência que carrega a informação útil.

### Como se calcula cada uma

**NPS.** Os respondentes (escala 0-10) dividem-se em três grupos:

| Grupo | Nota | Interpretação |
|---|---|---|
| **Detratores** | 0-6 | Insatisfeitos; podem prejudicar a marca por indicação negativa |
| **Neutros** | 7-8 | Satisfeitos mas indiferentes; vulneráveis à concorrência |
| **Promotores** | 9-10 | Leais e entusiastas; promovem a marca ativamente |

$$NPS = \%\text{Promotores} - \%\text{Detratores}$$

O resultado varia entre **−100** e **+100** e **não é uma percentagem**, apesar de ser calculado a
partir de percentagens — é a diferença entre duas. Exemplo: 200 respostas, 110 promotores (55%),
60 neutros (30%), 30 detratores (15%). $NPS = 55 - 15 = 40$.

**CSAT.** Escala mais comum é 1-5 (ou 1-10); "satisfeito" costuma ser definido como as duas notas
mais altas da escala:

$$CSAT = \frac{\text{nº de respostas satisfeitas}}{\text{nº total de respostas}} \times 100\%$$

Exemplo: 200 respostas numa escala de 1-5, das quais 150 marcaram 4 ou 5. $CSAT =
150/200 \times 100\% = 75\%$.

**CES.** A versão CES 2.0 (2013, a mais usada hoje) pede concordância com *"A empresa facilitou a
resolução do meu problema"*, numa escala de 1 (discordo totalmente) a 7 (concordo totalmente) —
nesta versão, **maior é melhor** (mais fácil). A métrica é a média simples das respostas:

$$CES = \frac{\sum \text{notas de esforço}}{\text{nº de respondentes}}$$

Exemplo: 50 respostas somando 285 pontos. $CES = 285/50 = 5{,}7$ — perto do teto da escala,
indicando processo de baixo esforço.

> **Cuidado com a versão original de CES.** O artigo de 2010 usava escala 1-5 onde 1 = "muito
> esforço" e 5 = "pouco esforço" (ou o inverso, dependendo da adaptação) — **confirme sempre a
> direção da escala** antes de comparar CES entre pesquisas ou fornecedores diferentes. É o erro
> de interpretação mais comum com esta métrica.

### Quando usar cada uma

| Situação | Métrica recomendada | Porquê |
|---|---|---|
| Medir saúde da relação de longo prazo com a marca | **NPS** | Captura lealdade, não só o último episódio |
| Avaliar uma entrega, atendimento ou transação específica | **CSAT** | Pergunta direta sobre aquele episódio |
| Avaliar um processo de suporte, troca ou resolução de problema | **CES** | O que prediz retenção em pós-venda é o esforço, não o encantamento |
| Priorizar entre três, com recurso limitado | **CES primeiro** | Estudos do CEB/Gartner mostram que reduzir esforço tem mais impacto na retenção do que tentar "encantar" o cliente |

### Onde encaixam no que este capítulo já cobriu

NPS, CSAT e CES **não substituem** a arquitetura VoC → CTQ → processo já construída nas seções
1-9 — são **instrumentos de medição da perceção**, o mesmo papel que a "Perceção / Satisfação" já
ocupa no ciclo fechado da seção 7:

- **CTQ ↔ CES.** Um CTQ mal definido ("resposta rápida") costuma aparecer primeiro como CES baixo
  — o cliente sente o atrito antes de a empresa medir o tempo de resposta.
- **Dimensões de satisfação (seção 6) ↔ CSAT por dimensão.** A tabela de satisfação decomposta é,
  na prática, um CSAT aplicado a cada dimensão separadamente em vez de uma pergunta única.
- **Pareto de reclamações (seção 9) ↔ Detratores do NPS.** Peça sempre o motivo da nota a quem
  responde 0-6 — transforma-se automaticamente em dados de entrada para o mesmo Pareto.
- **Matriz de ligação (seção 14) ↔ coluna "Satisfação".** É exatamente onde um valor de CSAT ou
  CES por linha se encaixa.

### Evolução ao longo de um ciclo de melhoria

```plotly
voc-nps-csat-ces
```

Repare no atraso: a melhoria (implementada entre M4 e M5) aparece **primeiro** no CES — o cliente
sente o processo mais fácil quase de imediato — **depois** no CSAT, e só **depois** no NPS, que é a
métrica mais lenta a reagir porque mede uma relação construída ao longo de várias interações, não
um episódio isolado. Julgar um projeto de melhoria pelo NPS no mês seguinte é o erro mais comum
nesta área: o NPS é o último a subir, não o primeiro.

### Interpretando como KPI

<div class="kpi-row">
<div class="kpi bad"><div class="kpi-k">NPS &lt; 0</div><div class="kpi-v">Crítico</div><div class="kpi-s">mais detratores que promotores</div></div>
<div class="kpi warn"><div class="kpi-k">NPS 0-30</div><div class="kpi-v">Aceitável</div><div class="kpi-s">típico da maioria das indústrias B2B</div></div>
<div class="kpi ok"><div class="kpi-k">NPS 30-70</div><div class="kpi-v">Bom a excelente</div><div class="kpi-s">acima disso é incomum em qualquer setor</div></div>
<div class="kpi ok"><div class="kpi-k">CSAT ≥ 80%</div><div class="kpi-v">Boa referência</div><div class="kpi-s">varia por setor — sempre comparar com a própria série histórica</div></div>
</div>

> **Faixas de referência são pontos de partida, não metas universais.** O número absoluto de NPS
> varia enormemente por país, setor e forma de perguntar. O que importa mais do que o valor
> isolado é a **tendência da própria série ao longo do tempo** — por isso as três métricas devem
> ser acompanhadas em carta de tendência (como o gráfico acima), com a mesma disciplina de
> subgrupo racional e periodicidade fixa usada em qualquer indicador de processo (Capítulo 66).

**Cuidados de interpretação — os três erros mais caros:**

1. **Viés de quem responde.** Pesquisas de satisfação sofrem de *non-response bias*: clientes
   muito insatisfeitos ou muito satisfeitos respondem mais; o cliente "neutro e ocupado" fica de
   fora. Uma taxa de resposta baixa (< 10-15%) exige cautela redobrada antes de tratar o número
   como representativo.
2. **Tamanho de amostra pequeno por período.** NPS com 15 respostas num mês oscila muito só por
   ruído amostral — antes de reagir a uma queda, verifique se a diferença é maior do que a
   variação natural esperada para aquele *n* (a mesma lógica de limites de controlo do Capítulo 67
   aplica-se aqui, ainda que informalmente).
3. **Comparar números de pesquisas com metodologias diferentes.** Mudar a escala, a pergunta, o
   canal (e-mail vs. SMS vs. presencial) ou o momento da pesquisa (logo após a compra vs. 30 dias
   depois) já muda o número, independentemente de qualquer melhoria real no processo.

---

## 11 · Onde entra o DMAIC

O cliente reclama: *"O produto chega atrasado."* Eis o mesmo problema, agora conduzido pelo DMAIC
(Capítulos 34 a 38):

| Fase | O que acontece |
|---|---|
| **Define** | VoC: "preciso receber no prazo." CTQ: OTIF ≥ 98%. |
| **Measure** | Mede-se lead time, tempo de produção, espera, transporte, atrasos por fornecedor e por planeamento. |
| **Analyze** | Descoberta: 63% dos atrasos vêm da espera entre produção e expedição. |
| **Improve** | Redução de lote, nivelamento, alteração do fluxo, kanban, melhoria de programação. |
| **Control** | OTIF semanal, com limite e meta, monitorizado em carta. |

O resultado é a cadeia **VoC → CTQ → DMAIC → KPI → Controlo** — uma integração que nenhuma das
partes, isolada, produziria.

---

## 12 · Onde entra o PDCA

O PDCA fecha o sistema num nível acima do DMAIC — é o ciclo de gestão, não o ciclo de projeto:

**Plan** — identificar a necessidade do cliente. **Do** — implementar a melhoria. **Check** —
verificar KPI, satisfação, reclamações, qualidade e prazo, todos juntos. **Act** — padronizar ou
corrigir. E recomeça.

O DMAIC resolve *um* problema específico com rigor estatístico; o PDCA é o batimento cardíaco que
mantém o sistema inteiro a girar entre projetos.

---

## 13 · Exemplo completo: fábrica de embalagens

O cliente diz: *"Preciso de embalagens visualmente perfeitas e entregues no prazo."*

**VoC:** aparência, prazo, quantidade, consistência.

| Necessidade | CTQ |
|---|---|
| Aparência perfeita | Defeitos visuais ≤ 300 ppm |
| Prazo | OTIF ≥ 98% |
| Quantidade | 100% |
| Consistência | Variação dimensional ≤ especificação |

**Processo:** produção → inspeção → embalagem → expedição. **Dados iniciais:** PPM = 850, OTIF =
91%, satisfação = 7,3/10. Aplica-se Six Sigma (DMAIC para reduzir defeitos) e Lean (VSM para reduzir
lead time), sob monitorização ISO 9001 da perceção do cliente.

```plotly
voc-antes-depois
```

<div class="kpi-row">
<div class="kpi bad"><div class="kpi-k">PPM antes</div><div class="kpi-v">850</div><div class="kpi-s">defeitos por milhão</div></div>
<div class="kpi ok"><div class="kpi-k">PPM depois</div><div class="kpi-v">180</div><div class="kpi-s">−79%, via DMAIC</div></div>
<div class="kpi warn"><div class="kpi-k">OTIF antes → depois</div><div class="kpi-v">91% → 98,7%</div><div class="kpi-s">via Lean / VSM</div></div>
<div class="kpi ok"><div class="kpi-k">Satisfação</div><div class="kpi-v">7,3 → 9,0</div><div class="kpi-s">evidência de que a melhoria chegou ao cliente</div></div>
</div>

O ponto que fecha o exemplo: a satisfação subir de 7,3 para 9,0 **depois** de PPM e OTIF melhorarem
é a evidência de que a melhoria do processo realmente impactou o cliente — não apenas os indicadores
internos.

---

## 14 · A matriz de ligação

Uma ferramenta simples e poderosa para o SGQ: ligar, numa única linha, a Voz do Cliente à ação que a
resolve.

| VoC | Requisito | CTQ | Processo | KPI | Meta | Fonte | Satisfação | Ação |
|---|---|---|---|---|---|---|---|---|
| Produto sem defeito | Especificação | PPM | Produção | PPM | < 300 | Reclamações/inspeção | 9,1 | DMAIC |
| Entrega rápida | Prazo acordado | OTIF | Logística | OTIF | > 98% | ERP | 8,7 | Lean |
| Resposta rápida | Atendimento | T. resposta | Comercial | horas | < 24 h | CRM | 8,4 | PDCA |
| Documentação correta | Requisito documental | Erros | Qualidade | % erros | < 1% | Reclamações | 8,9 | CAPA |

A matriz cria uma ligação explícita entre **cliente → qualidade → processo → dados → melhoria** —
exatamente o que um auditor procura ao entrar pela pata "Quanto?" do diagrama de tartaruga
(Capítulo 40-B).

---

## 15 · Seis perguntas, seis abordagens

| Conceito | Pergunta principal |
|---|---|
| **ISO 9001** | Estamos a determinar requisitos e a monitorizar a perceção do cliente? |
| **VoC** | O que o cliente realmente precisa e valoriza? |
| **Lean** | O que realmente agrega valor ao cliente, e onde estamos a desperdiçar? |
| **Six Sigma** | Como transformar a necessidade do cliente em CTQs mensuráveis e reduzir variação? |
| **Satisfação** | Como o cliente avalia aquilo que recebeu? |
| **Gestão de processos** | Que processo precisa de mudar para entregar o que o cliente valoriza? |

A sexta linha não é decorativa: sem ela, as cinco primeiras ficam no diagnóstico e nunca chegam à
mudança real.

---

## 16 · O ponto mais importante

Evite construir um sistema em que **Pesquisa de satisfação → relatório → arquivo**. Isso é
burocracia. Um sistema maduro é:

**VoC → requisitos → CTQ → indicadores → processos → desempenho → satisfação → gaps → Pareto →
causa raiz → Lean / Six Sigma / PDCA → melhoria → novo padrão → nova medição → nova VoC.**

Esse é o verdadeiro *feedback loop* do SGQ — e é o que permite a uma indústria evoluir de um sistema
de gestão da qualidade tradicional para um **Quality Management System orientado por dados e
centrado no cliente**, integrando ISO 9001, Lean Manufacturing, Six Sigma e gestão de processos numa
única arquitetura, em vez de quatro iniciativas paralelas que nunca se falam.

---

### Erros comuns

1. **Confundir VoC com pesquisa de satisfação.** A pesquisa é uma fonte entre muitas.
2. **Reportar satisfação como número único.** Sem decompor por dimensão, o dado esconde exatamente
   o que seria acionável.
3. **Tratar reclamação como incidente, não como dado.** Sem Pareto agregado, cada reclamação é
   resolvida isoladamente e o padrão nunca aparece.
4. **Parar no relatório.** Satisfação sem ligação a Pareto, causa raiz e projeto de melhoria é
   conformidade de papel.
5. **Medir só desempenho, ou só perceção.** OTIF alto com satisfação baixa (ou o inverso) é sinal de
   que algo não está a ser medido — não uma contradição a ignorar.

### Ligações

- **Capítulo 6** — CTQ e CTC: a diferença entre o que é crítico para a qualidade e crítico para o cliente.
- **Capítulo 14** — Relações com Clientes e QFD: como traduzir VoC em requisitos técnicos, em detalhe.
- **Capítulos 34–38** — DMAIC completo: Define, Measure, Analyze, Improve, Control.
- **Capítulo 27** — VSM: como o Lean elimina o que não agrega valor para o cliente.
- **Capítulo 93** — Auditorias da Qualidade e o diagrama de tartaruga (Capítulo 40-B).
- **Capítulo 71-A** — Cp/Cpk: o destino estatístico de um CTQ de variabilidade.
