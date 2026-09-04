# Auditoria do manual — o que foi encontrado ao converter para a plataforma

Registo do que a conversão expôs. Nada aqui foi alterado no `manual.ipynb` original — as correções
estão apenas na plataforma web, para que possa decidir o que passar de volta para o notebook.

---

## 1. A PARTE IV não existe

O manual declara 17 partes, mas o cabeçalho da **PARTE IV** não está presente em nenhuma célula.
O resultado é que os **capítulos 32 a 43** — que são o núcleo do DMAIC — ficam pendurados dentro
da **PARTE III (Lean)**.

```
PARTE III — Lean          caps 17 a 31   ← Lean propriamente dito
                          caps 32 a 43   ← DMAIC, orfãos: deviam ser a PARTE IV
PARTE V  — Estatística    cap 44 em diante
```

**Correção na plataforma.** Os capítulos 32–43 foram atribuídos aos módulos `lss-07` a `lss-14`
da trilha Lean Six Sigma, com o DMAIC dividido por fase (Definir, Medir, Analisar, Melhorar,
Controlar), como está no BoK.

**Correção sugerida no notebook.** Inserir antes do capítulo 32 uma célula com
`# PARTE IV — DMAIC e Melhoria de Processos`.

---

## 2. As PARTES XV e XVI não têm capítulos numerados

- **PARTE XV — Preparação para Certificação**: tem 112 questões excelentes, mas nenhuma célula
  `## Capítulo N:`. Qualquer índice automático (incluindo o do próprio notebook) salta esta parte.
- **PARTE XVI — Metodologia, Fontes e Bibliografia**: só tem o cabeçalho; os capítulos 132 e 133
  que lhe pertencem estão fisicamente depois, sob o cabeçalho `APÊNDICE`.

**Correção na plataforma.** O banco de questões foi extraído por parsing directo dos blocos
`#### CQE-nn ·` / `#### CSSBB-nn ·` e transformado em avaliação interactiva, sem depender da
numeração de capítulos.

---

## 3. O conteúdo BPMN / Bizagi estava presente só como imagem

Esta foi a lacuna que motivou o trabalho. O **Capítulo 40 — Mapas de Processo** está bem escrito
para fluxograma e swimlane, mas a parte BPMN reduz-se a **duas células que contêm apenas imagens**:

| Célula | Conteúdo |
|---|---|
| 387 | `<img alt="Nota sobre a notacao BPMN/Bizagi">` — sem texto associado |
| 388 | `<img alt="Diagrama em raia estilo Bizagi Modeler…">` — sem texto associado |

Ou seja: existem 5 ocorrências da string "BPMN" no manual inteiro, todas dentro de atributos de
imagem. **Não há texto que explique** os elementos da notação, as regras de sintaxe, a diferença
entre pool e lane, ou quando usar BPMN em vez de fluxograma. Quem estuda pela versão em texto
(ou por leitor de ecrã) não recebe nada.

O mesmo se aplica, em menor grau, à **legenda das 20 formas de mapa de processo** (célula 382) e à
figura do **caminho no Excel** (célula 383): a informação está lá, mas dependente de imagem.

**Correção na plataforma.** Foi escrito de raiz o **Capítulo 40-A — BPMN 2.0 e Bizagi Modeler na
prática** (`extra/bpmn.md`, ~2 300 palavras), que cobre:

- a matriz de escolha SIPOC / fluxograma / BPMN / VSM
- os quatro grupos de elementos da norma, com figura autoral
- os oito tipos de evento e a distinção entre evento no fluxo e evento de fronteira
- os quatro gateways e as três regras de sintaxe que se violam sistematicamente
- a regra de ouro pool/lane e por que ela expõe o lead time entre organizações
- um exemplo resolvido completo — tratamento de não conformidade — em diagrama BPMN autoral
- os quatro níveis de simulação do Bizagi e para que serve cada um num projeto Six Sigma
- as quatro métricas que se extraem de um mapa (handoffs, decisões, rácio VA, loops)
- sete erros comuns

Está posicionado no módulo `lss-05` (Mapeamento de processos e fluxo de valor), a seguir ao
Capítulo 40 e antes do Capítulo 27 (VSM).

---

## 4. O que **não** estava em falta

Vale registar, porque a suspeita inicial era mais ampla:

- **SIPOC** está bem coberto — 52 ocorrências, com tratamento próprio no Capítulo 5 e na fase Definir.
- **VSM** está completo no Capítulo 27, incluindo simbologia, os sete fluxos, os passos de
  construção e o mapa do estado futuro (~4 000 palavras).
- **Fluxograma e swimlane** estão bem tratados no Capítulo 40, incluindo a lista de formas e o
  exemplo passo a passo.

O que faltava era mesmo só a camada BPMN/Bizagi.

---

## 5. Lacunas menores, para consideração futura

| Tema | Estado | Nota |
|---|---|---|
| Diagrama de esparguete (*spaghetti*) | **resolvido** | Capítulo 40-B, com gráfico interativo e cálculo de distância |
| Makigami | **resolvido** | Capítulo 40-B, com as 7 camadas e gráfico de rácio VA |
| Diagrama de tartaruga (*turtle*) | **resolvido** | Capítulo 40-B, com infográfico e mapa de auditoria |
| Código R | **parcial** | 40-B e 71-A trazem R (e Excel/DAX) ao lado do Python; falta nos restantes |
| Datasets | inline no código | Ficheiros CSV separados permitiriam exercícios abertos |

Os três primeiros foram escritos no **Capítulo 40-B**, no módulo `lss-05`, a seguir ao 40-A.
O código em R foi acrescentado aos capítulos 40-B e 71-A em separadores lado a lado com o Python;
os restantes 140 blocos do manual continuam só em Python.

---

## 6. Qualidade técnica geral

Alta. Em particular:

- O manual traz **60 figuras SVG inline** desenhadas de raiz, com `aria-label` e `figcaption` — o
  que é raro e permitiu que a conversão preservasse tudo sem perda.
- A **PARTE XV** foi reconstruída na 4ª edição depois de a versão anterior ter um banco de questões
  em que a resposta certa era sempre a alternativa A. Essa correção está documentada no próprio
  manual e o banco actual tem análise de distratores questão a questão — é material bom.
- O **APÊNDICE de validação** executa identidades matemáticas contra implementações independentes.
  É mais rigor do que a maioria dos manuais desta área tem.

---

## 7. Auditoria de agosto de 2026 — bilinguismo e rastreabilidade do banco

Auditoria externa (ChatGPT) mais verificação e correção direta no repositório. O que foi encontrado
e corrigido:

- **8 capítulos sem tradução EN** (`cap-900`–`cap-907`: BPMN, Esparguete/Makigami/Tartaruga,
  Estúdio de Capabilidade, Voz do Cliente, OEE Avançado, 5S, RCA/8D/CAPA, Cluster Analysis).
  **Corrigido**: escritas as 8 traduções em `i18n/en/`, compiladas pelo `build.py`. Paridade PT/EN
  agora é 163/163 (100%), verificada por `tools/check_i18n.js`.
- **Bug real, mais grave do que o relatado**: o aviso "conteúdo disponível apenas em português"
  aparecia em **todos** os capítulos em modo inglês, incluindo os já corretamente traduzidos — o
  campo `d._isEnglish` que controlava o aviso nunca era definido em lado nenhum do código. Corrigido
  adicionando `"lang": "en"` ao payload gerado por `build.py` e trocando a condição em `app.js` para
  o usar. `check_i18n.js` agora falha o build se este campo faltar.
- **O banco de questões (112 perguntas, `bank.js`) nunca teve tradução EN** — em modo inglês, o
  Practice Lab mostrava o enunciado, alternativas e explicações inteiramente em português, sem
  qualquer aviso (ao contrário dos capítulos, que já tinham fallback visível). **Corrigido por
  completo**: as 112 questões (enunciado, alternativas e explicação/análise de distratores) foram
  traduzidas para inglês em `i18n/en/bank.json`, e `tools/build_bank_en.js` gera
  `site/content/bank_en.js` a partir daí, reaproveitando id/domínio/resposta/rastreabilidade do
  PT. `app.js` troca para a versão EN por questão (`localizeQuestion`), sem alterar a lógica de
  seleção/contagem — que continua a operar sobre o banco PT, preservando o comportamento hoje
  existente do quiz por módulo. O aviso de idioma (`bankLangNote()`) só aparece agora se
  `bank_en.js` estiver mesmo em falta — deixou de aparecer sempre, incondicionalmente.
  `check_i18n.js` verifica as 112 entradas (texto presente, `ans` consistente com o PT).
- **Afirmação falsa de proporcionalidade ao BoK**: o capítulo de preparação (cap-131, PARTE XV do
  manual) e a descrição do banco na interface afirmavam que a distribuição de questões era
  "aproximadamente proporcional" ao peso oficial do BoK. Não é — Risk Management (CQE) está
  sub-representado. Corrigido na fonte (`manual.ipynb`, células 1283/1285/1293/1303) e em
  `i18n.js` (`bank.cqe.desc`), sem reequilibrar o banco em si (fora do escopo desta rodada).
  A distribuição real está agora descrita com precisão, não escondida.
- **Rastreabilidade do banco**: adicionados `bokTopic`, `chapterRef` e `cognitiveLevel` a cada uma
  das 112 questões, extraídos mecanicamente do texto de rastreabilidade já existente em cada questão
  (`tools/enrich_bank.js` — corre depois de cada `build.py`, que regenera `bank.js` do zero).
- **README desatualizado**: 155→163 capítulos, 62→60 módulos, 140→202 blocos de código, 192→256
  figuras, 12→21 gráficos interativos. Números agora vêm do `manifest.js` gerado, não são digitados
  à mão.
- **Disclaimer "não afiliado à ASQ"** só existia no Capítulo 0; adicionado também de forma visível
  na home (`home.disclaimer` em `i18n.js`).
- **`check.js`/`check2.js`** tinham `executablePath` e diretório de screenshots hardcoded para o
  ambiente de outra máquina (`/opt/pw-browsers/chromium`, `/root/academy/shots/`). Corrigido para
  usar o Chromium do Playwright por omissão e `shots/` relativo ao repositório.
- **IDs de separadores de código não determinísticos**: `tools/build.py` usava `hash()` do Python
  (aleatório por processo) para gerar o `id` dos separadores Python/R/Excel/DAX, o que fazia todo o
  repositório "mudar" a cada rebuild sem nenhuma alteração de conteúdo. Trocado por `hashlib.md5`.
- **Novo**: `tools/check_i18n.js`, um teste Node puro (sem browser, corre em CI) que falha se algum
  capítulo ficar sem tradução EN carregável, alguma questão do banco perder a rastreabilidade, ou
  `bank_en.js` ficar incompleto ou dessincronizado do PT (`ans` divergente, texto em falta).
  Ligado a `.github/workflows/check.yml`, a correr em cada push/PR.
- **SEO básico**: adicionados `site/robots.txt`, `site/sitemap.xml`, meta tags Open Graph/Twitter
  Card e JSON-LD (`EducationalOrganization` + `Course` por trilha) em `site/index.html`. O domínio
  usado nos três é um placeholder (`example.github.io/...`) — README documenta onde trocar pelo
  domínio real antes de publicar. O `sitemap.xml` lista só a página raiz porque a aplicação é uma
  SPA com routing por hash (`#/aula/cap-001`), que motores de busca não indexam como URLs distintos.

**Ainda fora do escopo**: página dedicada de requisitos/elegibilidade ASQ CQE/CSSBB (excluída
explicitamente pelo utilizador); Mock Exam cronometrado; dashboard de pontos fracos — funcionalidades
novas (P1), não correções.

---

## 8. Reequilíbrio parcial do banco pelo peso do BoK (agosto de 2026, rodada 3)

O banco (112 questões) estava fixo em 56 CQE + 56 CSSBB desde a 4ª edição, com **Risk Management
(CQE, domínio VII)** e **Control (CSSBB, domínio VIII)** claramente sub-representados face ao peso
oficial do respetivo BoK 2022 — o ponto identificado na auditoria de agosto de 2026 (secção 7).

Reequilibrar por remoção (apagar questões de domínios sobre-representados para forçar a proporção
exata) foi rejeitado: destruiria conteúdo já revisto e de boa qualidade só para acertar uma
proporção. Em vez disso, o banco **cresceu por adição**, escrito primeiro em português no
`manual.ipynb` (mesma convenção do resto do banco: enunciado, 4 alternativas, análise dos
distratores, rastreabilidade BoK/capítulo) e só depois traduzido:

- **CQE domínio VII — Risk Management**: 4 → **8** questões (CQE-57 a CQE-60). Temas novos: matriz
  de risco probabilidade×impacto (Capítulo 85), PDPC/planeamento de contingência (Capítulo 86),
  estratégias de tratamento de risco — transferência vs. aceitação (Capítulo 84), FMECA vs. FMEA
  (Capítulo 83). Nenhum repete o conteúdo das 4 questões já existentes (ISO 9001, AP vs. RPN,
  residual vs. inerente, FTA).
- **CSSBB domínio VIII — Control**: 4 → **7** questões (CSSBB-57 a CSSBB-59). Temas novos:
  frequência de verificação por classificação de risco da característica (Capítulo 65), OCAP —
  Out-of-Control Action Plan (Capítulo 38), carta de pré-controlo vs. Shewhart (Capítulo 68).

**Banco total: 112 → 119 questões** (60 CQE + 59 CSSBB). Gabarito (A/B/C/D) mantido o mais
equilibrado possível: exatamente 15/15/15/15 no CQE (60 é múltiplo de 4); 15/14/15/15 no CSSBB (59
não é múltiplo de 4, por isso não há uniformidade perfeita possível). O texto editorial do banco
(cap-131, secção "Gabarito equilibrado") foi corrigido para descrever isto com precisão, em vez de
afirmar "14 em cada posição" de forma agora desatualizada.

As 7 questões novas foram traduzidas para inglês (`i18n/en/bank.json`) no mesmo passo, mantendo a
paridade PT/EN a 100% (`tools/check_i18n.js` verifica as 119/119).

**Pesos oficiais usados como referência** — CQE 2022 (160 pontuados): I=17, II=18, III=21, IV=23,
V=26, VI=34, VII=21. CSSBB 2022 (150 pontuados): I=12, II=12, III=15, IV=20, V=25, VI=22, VII=21,
VIII=17, IX=6 (fonte: qualitygurus.com, cross-verificada por somar exatamente ao total oficial de
150; sem confirmação num documento primário da ASQ). Isto é uma aproximação prática, não uma
alegação de proporcionalidade exata — o texto do site já não afirma proporcionalidade (secção 7).

---

## 9. Segunda auditoria externa (agosto de 2026, rodada 4) — bilinguismo funcional

Nova auditoria externa (ChatGPT), desta vez sobre a versão já corrigida pela rodada 3 (119
questões, paridade 163/163). Concluiu que a estrutura estava sólida mas encontrou vários restos de
português onde o texto visível já tinha sido traduzido — exatamente o tipo de bug que escapa a uma
revisão que só olha para o que se vê no ecrã. Corrigido:

- **`PARTE IV` continuava sem existir no `manual.ipynb`** (capítulos 32–43 pendurados na PARTE III),
  apesar de a correção estar documentada na secção 1 desde a rodada anterior. Inserido o cabeçalho
  `# PARTE IV — DMAIC e Melhoria de Processos` antes do capítulo 32. `tools/parse.py` também tinha
  um bug relacionado: um cabeçalho de parte "solto" (sem capítulo próprio, como a futura PARTE XV)
  não terminava o capítulo anterior, fazendo o **Capítulo 131** absorver todo o texto de regras do
  banco de questões e a tabela "Plano de expansão" — incluindo números desatualizados (112, 56/56)
  que so apareciam por causa deste bug de parsing, não por falta de correção de texto. Corrigido com
  um `cur_chap = None` no limite de parte.
- **Capítulos 132 e 133 (metodologia/fontes e bibliografia) nunca chegavam ao site**: existem no
  `manual.ipynb` mas não estavam listados em nenhum módulo de `tools/curriculum.py`, então
  `tools/build.py` nunca os incluía no build. Adicionados como módulo `set-06` na trilha
  "Aplicações Setoriais", com tradução EN nova (`i18n/en/cap-132.md`, `cap-133.md`).
- **Índice navegável ("Índice navegável" no capítulo de abertura) omitia PARTE IV, XV e XVI**: o
  gerador (`build_toc_html`) salta partes sem capítulos numerados, e a PARTE XV (banco de questões)
  e a PARTE XVI (metodologia/bibliografia) nunca tiveram capítulos numerados no sentido em que
  `tools/parse.py` reconhece. Adicionadas entradas especiais (`TOC_SPECIAL_PARTS`) que apontam para
  o Practice Lab e para os capítulos 132/133 respetivamente.
- **O índice navegável da versão inglesa estava inteiramente em português** — bug mais grave do que
  o relatado pela auditoria, que só falou em "faltam PARTE IV/XV/XVI". `build_toc_html` era chamado
  com a mesma estrutura `parts` (títulos e capítulos em PT) tanto para a abertura PT como para a EN;
  não existia nenhuma tradução dos títulos de parte nem uso do título EN por capítulo. Criado
  `build_toc_html_en` com um dicionário `PART_TITLE_EN` (18 títulos de parte) e uso do título EN de
  cada capítulo quando existe tradução (fallback ao título PT quando não existe, mesma política do
  resto do site).
- **A busca (`MAN.search`) nunca foi bilingue**: o índice de busca (título + palavras-chave) era
  gerado uma única vez, em português, e usado sem distinção de idioma — pesquisar em inglês só
  encontrava capítulos cujo texto PT continha por acaso a palavra pesquisada. Gerado um segundo
  índice (`manifest.searchEn`) a partir das traduções EN, e `viewSearch` em `app.js` agora escolhe o
  índice pelo idioma ativo.
- **O botão "Copiar" dos blocos de código aparecia em português em todos os capítulos, incluindo os
  em inglês**: o texto estava escrito directamente no HTML gerado por `tools/build.py`
  (`<button class="btn-copy">Copiar</button>`), igual para PT e EN, porque o gerador de blocos de
  código não sabe qual vai ser o idioma de leitura. Corrigido no lado do cliente: `enhance()` em
  `app.js` agora define o texto do botão via `T('copy.btn')` no render, chave nova em `i18n.js`
  ("Copiar" / "Copy").
- **`aria-label` e `alt` de figuras em português dentro de capítulos já traduzidos para inglês**:
  não só o eixo vertical da abertura (relatado pela auditoria), mas **194 ocorrências** em 23
  ficheiros de `i18n/en/` — sobretudo capturas de ecrã do Minitab/Excel cuja legenda visível já
  tinha sido traduzida, mas cujo atributo `alt`/`aria-label` continuava colado ao original em
  português. Traduzidas uma a uma (não é um padrão mecânico único: cada `alt` descreve o conteúdo
  específico da imagem).
- **Números desatualizados na abertura do manual** (`extra/abertura.md` e `i18n/en/abertura.md`):
  "112 questões" → "119"; tabela "56 questões / 56 questões" → "60 / 59" (CQE / CSSBB). Estes não
  eram os números do banco em si (já corretos desde a rodada 3) — eram só o texto de apresentação na
  página de abertura, que a rodada anterior não tinha tocado.
- **Secção "Plano de expansão" do banco (dentro do texto do manual)** ainda descrevia o
  reequilíbrio do domínio Risk Management como um plano futuro, quando esse reequilíbrio já tinha
  sido feito na rodada 3. Reescrita para descrever o que já aconteceu, com o número correto (119).

**Ainda não corrigido nesta rodada** (P1, fora do escopo desta sessão): domínio de produção real
nos placeholders de SEO (`example.github.io` em `index.html`, `robots.txt`, `sitemap.xml` —
precisa do domínio definitivo, decisão adiada); campo `difficulty` no banco de questões; aumento da
proporção de questões de nível "Analyze"; trilha explícita de "Data Science Fundamentals" antes do
laboratório avançado.

---

## 10. Padronização PT-PT (agosto de 2026, rodada 4 — continuação)

A auditoria apontava mistura de PT-BR e PT-PT no manual (ex.: "controlo"/"ficheiro"/"ecrã" ao lado
de "controle"/"treinamento"/"usuário"). Como o `lang` declarado no site é `pt-PT`, padronizado para
português europeu em todo o `manual.ipynb`, nos capítulos extra (`extra/*.md`) e na interface
(`i18n.js`):

- **controle/controles → controlo/controlos** (e formas capitalizadas) — 750 ocorrências no
  `manual.ipynb`, 6 nos capítulos extra. Não tocou em `controlar`, `controlado(a)`, `controlador`,
  nem em identificadores de código (`controle_x`, por exemplo) — essas formas são iguais nas duas
  variantes ou são nomes de variável, não texto para o leitor.
- **treinamento/treinamentos → formação/formações** (e formas capitalizadas).
- **usuário/usuários → utilizador/utilizadores** (e formas capitalizadas).
- **Interface de busca** (`i18n.js`, bloco PT): "Buscar no manual" → "Pesquisar no manual", "Busca"
  → "Pesquisa", "caixa de busca" → "caixa de pesquisa" (`search.placeholder`, `search.aria`,
  `search.eyebrow`, `search.title.empty`, `search.hint`).
- **Não tocado, deliberadamente**: o verbo "buscar" no sentido de "procurar/perseguir" em prosa
  corrida (ex. "buscar feedback do cliente", "buscando melhorar o processo") — é uso comum também
  em português europeu, e trocar cegamente por "pesquisar" teria alterado o sentido (pesquisar ≈
  investigar, não ≈ perseguir/procurar). Só a acção de pesquisa da interface foi corrigida.

Após a padronização, o manual foi reconstruído (`tools/build.py` → `enrich_bank.js` →
`build_bank_en.js`) e `tools/check_i18n.js` confirma paridade PT/EN e rastreabilidade do banco
intactas (165/165 capítulos, 119/119 questões).

- **`treinamento` sobrevivia num título de módulo** (`tools/curriculum.py`, `eq-05`), fora do
  alcance do `manual.ipynb` — corrigido para "Cliente, formação e equipes".

---

## 11. Verificação no browser (agosto de 2026, rodada 4 — fecho)

As rodadas anteriores validaram tudo por análise estática de ficheiros. Desta vez o site foi
servido localmente (`python -m http.server`) e testado num Chrome real, o que a própria auditoria
externa não tinha conseguido fazer no seu ambiente. Confirmado a funcionar:

- Abertura do manual em PT e em EN — índice navegável completo (17 partes + APÊNDICE, sem
  duplicação), números corretos (119 questões, 60/59).
- Alternância de idioma no botão do cabeçalho, com o conteúdo, o índice e a barra lateral (título
  de módulos "Formação da Qualidade" em vez de "Treinamento") todos a mudar.
- Pesquisa (`#/busca`) em modo inglês devolve resultados em inglês, com o título em destaque e
  ranking correto (testado com "capability" → 13 capítulos, os três de Capability em primeiro).
- Botão de código muda entre "Copiar" (PT) e "Copy" (EN) ao trocar de idioma, no mesmo capítulo.
- Capítulos 132 e 133 abrem corretamente a partir do link da PARTE XVI no índice, com boa
  atribuição de trilha/módulo na barra lateral e breadcrumb.
- Practice Lab mostra 60 questões CQE / 59 CSSBB e o quiz funciona (testado com rastreabilidade
  visível por questão, ex. "CQE-42 · I — Management and Leadership").

**Um bug real só apareceu neste teste**: os capítulos 132/133, ao serem adicionados a um módulo em
`tools/curriculum.py` (secção 9), passaram a ser construídos normalmente — e como também pertencem
fisicamente à parte "APÊNDICE" no `manual.ipynb` (ver secção 2), apareciam **duplicados** no índice
navegável: uma vez em PARTE XVI (a entrada especial) e outra vez em APÊNDICE (o loop normal, que já
não os filtrava). Corrigido registando os números 132/133 em `seen_num` no momento em que a entrada
especial é escrita, tanto em `build_toc_html` como em `build_toc_html_en`. Ainda não estava
documentado no `check_i18n.js` (que não verifica duplicação no índice) — ficou descoberto só ao
carregar a página a sério, o que reforça o valor de testar no browser antes de publicar.

**Atualização**: `tools/check.js` e `tools/check2.js` foram corridos nesta sessão (Chromium do
Playwright já estava instalado no ambiente) — ambos passam sem erros de consola ou de página,
confirmando programaticamente os números vistos manualmente no browser (165 aulas, lupa de figuras,
progresso a persistir). Continuam a precisar de `npx playwright install` em qualquer ambiente novo
(ex.: CI) onde o Chromium gerido pelo Playwright ainda não exista.

---

## 12. Auditoria multidisciplinar externa (setembro de 2026) — verificação do estado do lote 2

Nova auditoria externa (equipa simulada: Engenharia da Qualidade, Lean Six Sigma, Estatística/
Ciência de Dados, Engenharia de Dados, Analista de Dados/BI), a partir do repositório real, não só
do `README.md`. Achado principal: **o aviso do README sobre os capítulos 166–182 estava
desatualizado e descrevia um risco que já não existia.**

Verificação direta, nesta sessão:

- `extra/mtbf_mttr.md` até `extra/toc_theory_of_constraints.md` (os 17 slugs do lote 2) **já
  existem**, com o cabeçalho `<a id="capitulo-1XX"></a>` / `## Capítulo 1XX: ...` no formato
  esperado por `tools/parse.py`.
- `i18n/en/cap-166.md` até `cap-182.md` **já existem**, com tradução completa.
- `tools/curriculum.py` **já tem** os 17 capítulos registados em `EXTRA_CHAPTERS` (com `source`
  apontando para `extra/*.md`) e distribuídos pelos módulos corretos, incluindo o módulo novo
  `lss-15` (Teoria das Restrições) já inserido na trilha Lean Six Sigma.
- **Rebuild completo executado e verificado**: `python3 tools/build.py && node
  tools/enrich_bank.js && node tools/build_bank_en.js`, seguido de `node tools/check_i18n.js`.
  Resultado: 182 capítulos gerados, 183 traduções EN (182 capítulos + abertura), 119 questões,
  paridade PT/EN confirmada. Comparação byte-a-byte de `manifest.js` e de `site/content/ch/*.js`
  antes/depois do rebuild: conteúdo idêntico (as poucas diferenças de tamanho de ficheiro
  encontradas são terminadores de linha, não conteúdo — confirmado por `difflib` sem diffs de
  texto).

**Conclusão**: o mecanismo `EXTRA_CHAPTERS` (usado desde o lote 1, cap-154–165) já cobre o lote 2
por desenho — não foi preciso migrar nada. O aviso do `README.md` descrevia um estado transitório
que existiu em algum momento anterior a esta sessão e que já tinha sido resolvido, mas a
documentação não foi atualizada quando isso aconteceu. **Corrigido** (`README.md`): removido o
aviso de risco de perda de dados no rebuild, substituído por confirmação verificada com data;
tabela de números atualizada (extra/ = 29 capítulos, não 12; i18n/en/ cobre 001–182, não só até
165); esclarecido que "21 gráficos interativos" conta figuras (chaves em `figs.js`), não séries —
há 65 séries (traces) distribuídas pelas 21 figuras.

**Lição para o processo de manutenção**: um aviso de "não fazer X sem Y" no README, uma vez escrito,
não se autocorrige quando Y deixa de ser necessário. Nas próximas vezes que este tipo de aviso for
resolvido, apagar ou reescrever o aviso no mesmo commit que resolve o problema — não deixá-lo para
uma auditoria externa descobrir que já não se aplica.
