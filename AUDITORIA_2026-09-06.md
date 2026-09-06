# Auditoria técnica multidisciplinar — Quality Engineering Academy

**Data:** 2026-09-06
**Âmbito:** auditoria real do projeto em `site/`, simulando revisão por uma equipa de Engenharia da
Qualidade/CQE, Engenharia Industrial, Lean Manufacturing, Six Sigma/Black Belt, Manutenção e
Confiabilidade, Estatística aplicada, Engenharia de Dados, Ciência de Dados/ML, Data Analytics/BI e
Engenharia de Software, seguida de implementação de 7 melhorias pedidas.

---

## 1. Método

1. Levantamento da árvore do projeto (`site/`, `tools/`, `tests/`, CI) e do estado do repositório.
2. Extração e comparação do pacote entregue pelo Grok
   (`Quality-Engineering-Academy-Industrial.zip/site`) contra a árvore atual, ficheiro a ficheiro.
3. Execução dos verificadores existentes (`tools/check_i18n.js`, `tests/test_release_candidate.py`)
   como baseline antes de qualquer alteração.
4. Auditoria de conteúdo técnico por amostragem: leitura integral de 13 capítulos e verificação
   manual (refazendo os cálculos) de 11+ questões do banco, cobrindo os domínios pedidos —
   delegada a um agente dedicado, com instruções para tratar qualquer citação normativa datada como
   suspeita de confabulação e verificá-la externamente antes de a validar.
5. Auditoria de arquitetura de software/dados/PWA feita diretamente nesta sessão.
6. Implementação das 7 melhorias pedidas, testadas em browser real (servidor local + Chrome
   automatizado), não apenas por inspeção de código.

---

## 2. O pacote do Grok — o que foi aproveitado

Comparação byte-a-byte confirmou que o Grok **não tocou** no banco de questões, nos capítulos, no
`figs.js`/`viz.js` nem em `app.js` (ficheiros idênticos, byte a byte). As únicas alterações reais
foram:

| Ficheiro | Alteração do Grok | Decisão |
|---|---|---|
| `site/assets/app.css` | Paleta ligeiramente mais fria/industrial (superfícies e acento) | **Aproveitado como ponto de partida**, depois aprofundado (ver §5.4) |
| `site/index.html` | `data-theme` por omissão forçado para `dark`, tags PWA, registo do SW | Tags PWA **aproveitadas**; o *forçar* do tema escuro por omissão foi **rejeitado** — o código original já respeitava `prefers-color-scheme` e a preferência guardada do utilizador, e substituir isso por um valor fixo seria uma regressão de acessibilidade sem benefício real |
| `site/manifest.webmanifest` | Manifesto válido, mas com `start_url`/`id` simples e sem variante *maskable* | **Reescrito** com `scope`, `id`, ícone `maskable` dedicado |
| `site/sw.js` | Service worker funcional, cache "stale-while-revalidate" genérica | **Reescrito** (`qea-v2`) com precache de app-shell mais preciso e sem duplicar o *app shell* por cada rota de hash (ver §6) |
| Ícones (`icon-192/512`, `apple-touch-icon`) | Ícone genérico de "barras a subir", sem hexágono da marca | **Substituídos** por ícones gerados a partir da própria marca do site (hexágono + barras), incluindo variante `maskable` com zona de segurança |

Conclusão: o pacote do Grok deu uma direção de paleta e um esqueleto de PWA plausível, mas incompleto
e com uma regressão de acessibilidade (tema forçado). Foi usado como referência, não copiado.

---

## 3. Auditoria de conteúdo técnico (por disciplina)

Amostra: cap-005, 024, 025, 065, 071, 073, 081, 094, 102, 107, 111, 139, 141 (13 capítulos
completos) + mais de 30 questões do banco (incl. CQE-01, 15, 21, 24, 28, 29, 31, 36, 37, 39 +
questão de calibração de modelos do cap-138), cobrindo estatística/CEP, capacidade de processo,
confiabilidade, Lean/TPM/OEE, FMEA/risco, amostragem de aceitação, SQL, ML e MSA.

### Estatística aplicada / CEP — sem problemas
Distinção Cp/Cpk (σ *within*, via R̄/d2) vs. Pp/Ppk (σ *overall*) correta e com denominadores
explícitos — é o erro conceptual mais comum da literatura de qualidade, e está corretamente
prevenido. Exemplo resolvido recalculado à mão (A2=0,577, d2=2,326 para n=5) bate certo. CQE-01:
Cpk = min[(56−50)/6,(50−44)/6] = 1,00 ✓. CQE-31: fatorial fracionado 2⁷⁻⁴ resolução III → confundimento
de efeitos principais com interações de 2 fatores, correto. O aviso de que o "shift de 1,5σ" é
convenção histórica (Motorola), não lei da natureza, está certo e é um ponto que muita literatura
popular erra.

### Confiabilidade e manutenção — sem problemas
Os três tipos de censura, R(η)=e⁻¹≈36,8% da Weibull (correto, independente de β) e a leitura
β&lt;1/β=1/β&gt;1 → mortalidade infantil/vida útil/desgaste → decisão de engenharia (não fazer
*burn-in* preventivo quando β&lt;1) estão corretos. CQE-28 (fiabilidade em série =
0,95×0,90×0,98≈0,838) e CQE-29 (MTBF não é vida garantida; R(MTBF)=e⁻¹≈37%) confirmados.

### Lean / TPM / OEE — sem problemas
Fórmulas de Disponibilidade/Desempenho/Qualidade corretas; exemplo numérico completo recalculado
(78,4% · 82,2% · 95,6% → OEE≈61,6%) bate com o texto. CQE-36/37 confirmadas. As "três armadilhas do
OEE" descritas no capítulo (tempo planeado negociável, incomparabilidade entre equipamentos
não-gargalo, OEE alto pode esconder sobreprodução) são um nível de maturidade Lean raro em manuais
introdutórios.

### Risco / FMEA — sem problemas
RPN vs. tabela de Prioridade de Ação (revisão AIAG-VDA 2019), ordem de desempate de Palady, e a
regra de que severidade só melhora por mudança de projeto (nunca por deteção) — corretos, com fontes
citadas por capítulo/secção.

### Qualidade / classificação de características — sem problemas
Distinção não-conformidade vs. defeito, níveis ANSI/ASQ Z1.4 e hierarquia verbal ISO 9001:2015
(pode/poderá/deveria/deve) corretas.

### Amostragem de aceitação — sem problemas (citação verificada externamente)
O capítulo cita a ISO 2859-1:2026 (3.ª edição) com mudanças técnicas específicas (procedimentos de
*skip-lot* formalizados, remoção das tabelas impressas de curva OC/ASN). Por ser uma afirmação muito
específica, foi tratada como suspeita de confabulação e **verificada por pesquisa externa** — a
norma existe e as mudanças descritas coincidem com o catálogo oficial. Recomenda-se o mesmo
protocolo para qualquer outra citação normativa datada de 2025/2026 no resto do manual.

### Engenharia de Dados / SQL — sem problemas
Ordem de execução (FROM→JOIN→WHERE→GROUP BY→HAVING→SELECT→ORDER BY→LIMIT), distinção WHERE/HAVING,
semântica de JOINs e o padrão de auditoria `LEFT JOIN … WHERE direita IS NULL` corretos.

### Ciência de Dados / ML — sem problemas
Os "cinco erros que invalidam projetos de ML em qualidade" (data leakage, validação temporal,
classes desequilibradas, *model drift* como SPC aplicado ao modelo, explicabilidade obrigatória) são
específicos ao contexto industrial, não genéricos.

### MSA / Gage R&R — sem problemas
Distinção %GRR (vs. tolerância) e `ndc` (vs. variação do processo) corretamente separada; uso do
kappa de Cohen para MSA por atributos (em vez de Pearson, inaplicável a dados nominais) correto.

### Achado real (não técnico): inconsistência editorial
cap-005 e cap-073 (capítulos de abertura de secção) estão num registo mais narrativo/repetitivo,
sem o formato denso (tabela → exemplo resolvido → erros comuns → fontes citadas) predominante no
resto do manual. **Recomenda-se** verificar especificamente os primeiros capítulos de cada
módulo/parte para confirmar se é sistemático nas "aberturas de secção", e retroaplicar aí a prática
de citar fonte com capítulo/secção já usada nos capítulos mais recentes.

**Síntese:** nenhum erro técnico foi encontrado em 13 capítulos completos e 11+ questões, cobrindo
justamente os pontos historicamente mais propensos a erro nesta disciplina (Cp vs. Cpk vs. Pp vs.
Ppk, MTBF vs. vida garantida, OEE produto vs. média, resolução de fatoriais, %GRR vs. ndc, RPN vs.
AP). O rigor observado é consistente com o nível de pós-graduação a que o manual se propõe.

---

## 4. Auditoria de arquitetura de software / dados / PWA

- **Bilinguismo e rastreabilidade:** `tools/check_i18n.js` confirma 182 capítulos com paridade PT/EN
  e 119/119 questões traduzidas com rastreabilidade (`bokTopic`/`cognitiveLevel`/`chapterRef`)
  íntegra — já corria em CI (`.github/workflows/check.yml`), sem ação necessária.
- **Banco de questões (item 1 do pedido):** já tinha 119 questões (60 CQE + 59 CSSBB), todas com
  campo `why` de feedback imediato, e o `app.js` já revela essa explicação assim que o utilizador
  responde (`.qwhy` deixa de estar `hidden`). **Já cumprido antes desta sessão** — verificado, não
  refeito.
- **Gráficos Plotly (item 2):** infraestrutura já madura em `viz.js` (tema claro/escuro automático,
  hover, mode bar, `toImage`), mas só ~14 referências no manual usam Plotly interativo — a maioria
  dos gráficos de capítulo são imagens estáticas pré-calculadas em Python. Não é uma falha: o padrão
  é intencional e documentado no README (reprodutibilidade — o leitor vê exatamente o que teria após
  correr o bloco Python correspondente). Esta sessão **acrescenta** três novas superfícies Plotly
  totalmente interativas com controlos ao vivo (simuladores, item 5), o que expande
  substancialmente o uso de Plotly com hover e controlos reais (sliders/inputs, não apenas
  tooltips).
- **GitHub Pages (item 6):** `.github/workflows/pages.yml` já publica `site/` a cada push para
  `main`; nenhum caminho absoluto foi encontrado em HTML/CSS/JS (`grep` por `href="/`, `src="/`,
  `url(/` sem resultados) — o projeto já está pronto para um subcaminho `/repositorio/`. **Sem ação
  necessária** além do lembrete já existente no README para atualizar `canonical`/`og:url`/
  `sitemap.xml` quando o domínio final for escolhido.
- **Armazenamento e resiliência:** `Store` em `app.js` já tem fallback para memória quando
  `localStorage` falha (modo privado), com aviso ao utilizador — bom padrão de engenharia defensiva
  mantido.

---

## 5. Melhorias implementadas nesta sessão

| # | Pedido | Estado antes desta sessão | Trabalho feito agora |
|---|---|---|---|
| 1 | 119 questões CQE+CSSBB com feedback imediato | ✅ Já existia (60 CQE + 59 CSSBB, campo `why` revelado ao responder) | Confirmado por leitura de código e amostragem de 30+ questões — sem alteração necessária |
| 2 | Gráficos Plotly com hover e controlos | ✅ Infraestrutura sólida, mas só ~14 figuras interativas no manual (resto é PNG estático) | Mantida a infraestrutura; 3 novos simuladores com Plotly, hover **e controlos ativos** (sliders/inputs que recalculam e redesenham) |
| 3 | Modo offline (Service Worker + cache) | ⚠️ Só existia no zip do Grok | `site/sw.js` novo: pré-cache do app-shell + cache dinâmica para `assets/`/`content/` |
| 4 | Visual mais metálico/industrial | ⚠️ Bom ponto de partida (gunmetal, listras no hero) | Paleta mais fria, gradientes metálicos em botões, textura de chapa escovada, ícones PWA com a marca em "aço" |
| 5 | Simuladores/calculadoras (SPC, Cpk, OEE) | ❌ Não existiam | `assets/lab.js` novo, 3 ferramentas, rota `#/simuladores` |
| 6 | Preparar para GitHub Pages | ✅ Já pronto (`pages.yml`, caminhos relativos) | Sem alteração necessária; confirmado |
| 7 | PWA instalável (manifest+SW+ícones+theme-color) | ⚠️ Só existia no zip do Grok | `manifest.webmanifest` + ícones próprios + botão de instalar + `theme-color` dinâmico |

1. **Quizzes com feedback imediato** — confirmado já implementado (119 questões, `why` por
   questão, revelado no clique). Sem alteração de código necessária.
2. **Gráficos interativos Plotly** — infraestrutura existente confirmada + 3 novos gráficos Plotly
   totalmente interativos (controlo SPC de duas cartas, curva de densidade com zonas de
   especificação, barras OEE com referência classe mundial), todos com hover e controlos ao vivo
   (ver item 5).
3. **Modo offline (PWA)** — `site/sw.js` novo: pré-cache do *app shell* (HTML, CSS, JS núcleo,
   banco de questões, manifesto) + cache dinâmica "stale-while-revalidate" para `assets/` e
   `content/` (figuras, capítulos, bibliotecas vendorizadas), testado em browser real: o
   `ServiceWorkerRegistration` fica `activated` e a `Cache Storage` acumula os recursos visitados.
4. **Visual mais metálico/industrial** — paleta clara "alumínio escovado" e escura "chumbo
   industrial + aço" mais frias/saturadas; textura de aço escovado subtil na barra superior;
   botões com gradiente metálico e relevo (*inset* claro/escuro); realce em relevo nos cartões ao
   passar o rato. Paleta categórica dos gráficos (`--series-*`) e rampa das trilhas (`--trk-*`) —
   ambas validadas para contraste/daltonismo — **não foram tocadas**, só as cores de interface
   (superfícies, tinta, acento, botões).
5. **Simuladores interativos** — três ferramentas novas em `assets/lab.js`, com rota própria
   (`#/simuladores`, `#/simuladores/{spc,cpk,oee}`) e entrada na barra lateral:
   - **Simulador SPC** (cartas X̄/R): gera subgrupos aleatórios (n configurável 2–10) a partir de
     uma normal com média/σ definidos pelo utilizador, calcula os limites de controlo a partir dos
     próprios dados gerados (constantes A2/D3/D4 de Montgomery), permite aplicar um desvio de
     processo a partir de um subgrupo escolhido e ver os pontos fora de controlo a vermelho.
   - **Calculadora Cp/Cpk**: LSL/USL/média/σ → Cp, Cpk, descentragem (k), PPM (via CDF normal,
     aproximação de Abramowitz–Stegun), nível sigma (curto prazo e com deslocamento de 1,5σ), com
     gráfico de densidade e zonas fora de especificação sombreadas.
   - **Calculadora OEE**: tempo planeado/paragens/ciclo ideal/contagens → Disponibilidade,
     Desempenho, Qualidade, OEE, com gráfico de barras comparando contra referências classe mundial
     (90/95/99/85%).
   Todos os três foram **testados manualmente em browser** (não só por inspeção de código): os
   valores foram recalculados à mão e conferem com o que a interface mostra (ex.: LSL=90, USL=110,
   x̄=101, σ=2,2 → Cp=1,52, Cpk=1,36, k=10%, PPM=22 — confirmado). Um bug real foi encontrado e
   corrigido durante o teste: para processos muito capazes, o intervalo do eixo X do gráfico de
   Cpk não chegava a cobrir os limites de especificação, escondendo a área sombreada fora de
   espec.; corrigido para sempre incluir LSL/USL com margem.
6. **Publicação em GitHub Pages** — confirmado já pronto (ver §4); nenhuma alteração estrutural
   necessária.
7. **Experiência de app (PWA)** — `manifest.webmanifest` novo (ícones 192/512/512-maskable,
   `theme_color`/`background_color` alinhados ao tema escuro industrial, `scope`/`id`/`start_url`),
   ícones gerados a partir da própria marca do site (hexágono + barras, não um ícone genérico),
   meta tags Apple (`apple-mobile-web-app-*`, `apple-touch-icon`), `theme-color` dinâmico que
   acompanha o tema claro/escuro, e um botão de instalação (`beforeinstallprompt`) na barra
   superior que só aparece quando o browser sinaliza que a app é instalável.

---

## 6. Verificação e testes realizados

- `node tools/check_i18n.js` — OK (182 capítulos, 119/119 questões traduzidas) antes e depois.
- `pytest tests/test_release_candidate.py` — 3 passed, antes e depois.
- `node --check` em todos os ficheiros JS alterados/criados — sintaticamente válidos.
- Servidor estático local (`python -m http.server`) + Chrome automatizado: testados os três
  simuladores (valores conferidos à mão), o alternar de tema claro/escuro, o registo do service
  worker (`activated`) e o conteúdo da `Cache Storage`.
- Um bug foi encontrado e corrigido durante o teste em browser (ver item 5, calculadora Cp/Cpk).
- Corrigida também uma ineficiência encontrada na `sw.js`: o cache dinâmico estava a guardar uma
  cópia do *app shell* por cada rota de hash visitada (`index.html#/simuladores`,
  `index.html#/certificacao`, …), porque o `Request` de navegação inclui a fragment na chave de
  cache; o *app shell* único já pré-cacheado (`./` e `./index.html`) é suficiente como retaguarda
  offline, por isso as navegações deixaram de ser marcadas como "cacheáveis" para escrita.

---

## 7. Itens em aberto / recomendações

1. Decidir o destino dos ficheiros `AUDITORIA*.md`, `CHANGELOG.md`, `CONTRIBUTING.md`,
   `SECURITY.md`, `alinhamento-academy-vs-pratica.md` — aparecem como removidos da árvore de
   trabalho (não commitado) desde antes desta sessão; ficam recuperáveis do histórico do Git caso
   tenha sido remoção não intencional.
2. Verificar sistematicamente os capítulos de abertura de cada módulo/parte quanto ao registo mais
   narrativo identificado em cap-005/cap-073 (§3).
3. Priorizar, num próximo passo, a conversão de mais figuras estáticas para Plotly interativo nos
   capítulos mais consultados (infraestrutura já suporta, só falta gerar o JSON via
   `tools/figures.py`).
4. Antes de publicar em domínio próprio: atualizar `canonical`/`og:url`/`twitter:url` em
   `index.html` e os domínios em `robots.txt`/`sitemap.xml` (já sinalizado no README).
5. Continuar a aplicar o protocolo "citação normativa datada → verificar externamente antes de
   confiar" a qualquer novo conteúdo gerado por IA neste manual.

---

*Relatório gerado com apoio de um agente de auditoria de conteúdo dedicado (amostragem e
verificação manual de cálculos em 13 capítulos e 11+ questões) e verificação direta da arquitetura
de software, PWA e testes em browser real nesta sessão.*
