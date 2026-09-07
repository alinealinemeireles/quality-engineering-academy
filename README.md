# Quality Engineering Academy

[![LinkedIn](https://img.shields.io/badge/LinkedIn-alinemeireles-35A0BA?style=flat-square&logo=linkedin&logoColor=white&labelColor=10161A)](https://www.linkedin.com/in/alinemeireles/)
[![Live site](https://img.shields.io/badge/Live_site-alinealinemeireles.github.io-35A0BA?style=flat-square&logo=googlechrome&logoColor=white&labelColor=10161A)](https://alinealinemeireles.github.io/quality-engineering-academy/)

Plataforma de formação em Engenharia da Qualidade, Lean Six Sigma, Melhoria Contínua e Data
Analytics, em HTML/CSS/JS puro, baseada no *Manual de Engenharia da Qualidade, Lean Six Sigma e
Quality Analytics — 4ª edição (2026)*.

Não é um e-book com menus: o manual é a **fonte de conhecimento**, e a aplicação é a **estrutura
de aprendizagem** — trilhas, módulos, aulas, avaliação, Practice Lab e mapa de competências.

**Abrir:** `site/index.html` em qualquer navegador. Não precisa de servidor, não precisa de
instalação, funciona offline.

> **⚠️ Direitos reservados sobre o conteúdo.** O código-fonte da plataforma (`site/assets/`,
> `tools/`) está sob licença MIT — ver [`LICENSE`](LICENSE). O **conteúdo didático** (capítulos,
> banco de questões, figuras e o manual de origem) é obra autoral de **Aline Meireles**, com
> **todos os direitos reservados**: não é autorizada a cópia, reprodução, redistribuição ou
> reutilização deste conteúdo, total ou parcial, sem autorização expressa da autora.

---

## O que está lá dentro

| | |
|---|---|
| Capítulos | 182 (153 do manual + 29 escritos de raiz) |
| Percursos (trilhas) | 6 |
| Módulos | 62 |
| Blocos de código (Python/R/SQL/DAX) | 233 |
| Figuras e diagramas | 256 |
| Gráficos interativos (Plotly) | 21 figuras (composições registadas em `figs.js`; cada figura pode ter mais de uma série — 65 séries no total: 34 scatter, 14 bar, 14 line, 2 log, 1 contour), com hover e deslizadores |
| Questões de certificação | 119 (60 CQE + 59 CSSBB, autorais) |
| Tradução para inglês | 100% dos capítulos (182/182) e do banco de questões (119/119) |

### Percursos

1. **Engenharia da Qualidade** — alinhado ao BoK do ASQ CQE
2. **Lean Six Sigma** — pensamento Lean, ferramentas de fluxo, ciclo DMAIC completo
3. **Estatística e Experimentação** — da análise gráfica ao DOE e à modelação
4. **Quality Analytics e Quality 4.0** — Minitab, SQL, engenharia de dados, ML, governança de IA
5. **Laboratório Avançado e Risk Engineering** — inferência moderna, causalidade, risco quantitativo
6. **Aplicações Setoriais** — biblioteca de consulta por setor

### Funcionalidades

- **Avaliação por módulo** com feedback imediato e análise dos distratores; mínimo recomendado 70%.
- **Mapa de competências** — mostra o que ainda falta, não só o que foi feito.
- **Progresso** guardado no navegador, com exportação/importação em JSON.
- **Busca** em todos os capítulos, tema claro/escuro, leitura em telemóvel, impressão limpa.
- **Lupa** em qualquer figura (diagramas BPMN, VSM e cartas de controlo abrem em ecrã inteiro).
- **Gráficos interativos** pré-calculados e servidos como JSON: hover com valores, deslizadores,
  zoom e exportação em PNG — sem qualquer dependência de execução no navegador.
- **Infográficos com tooltip**: passar o rato sobre um elemento do diagrama de tartaruga, por
  exemplo, mostra a cláusula da norma e o que o auditor procura ali.
- **Código lado a lado** em separadores: Python · R · Excel · DAX/Power BI, com botão de copiar.

### Capítulos escritos de raiz para a edição web

**Lote 1 (cap-154 a cap-165, 12 capítulos)**

| Nº | Título | Módulo | Porquê |
|---|---|---|---|
| 154 | BPMN 2.0 e Bizagi Modeler na prática | `lss-05` | O manual só tinha BPMN em imagens, sem texto |
| 155 | Esparguete, Makigami e Tartaruga | `lss-05` | Três ferramentas de mapeamento ausentes |
| 156 | Estúdio de Capabilidade | `eq-10` | Laboratório interativo de Cp/Cpk/Pp/Ppk |
| 157 | Voz do Cliente, Satisfação e o Elo com Lean Six Sigma | `eq-05` | Liga VoC → ISO 9001 → Lean → Six Sigma → DMAIC/PDCA num ciclo fechado |
| 158 | OEE Avançado — Decomposição de Perdas, Maturidade Digital | `lss-04` | Aprofunda o OEE do Capítulo 25 com cascata de perdas e maturidade digital |
| 159 | 5S e Gestão Visual de Chão de Fábrica | `lss-01` | Disciplina de Sustain e ferramentas de gestão visual, além do 5S introdutório |
| 160 | Resolução Estruturada de Problemas — 5 Porquês, 8D e CAPA | `eq-03` | Aprofunda o 5 Porquês do Capítulo 9 com o fluxo completo até o 8D e o CAPA |
| 161 | Análise de Clusters — Hierárquica e K-Means | `est-07` | Técnica de agrupamento não supervisionado ausente do manual original |
| 162 | Barreiras à Melhoria da Qualidade | `eq-04` | Cobre o tópico I.I do BoK CQE, sem capítulo dedicado na edição original |
| 163 | MSA por Atributos — Kappa e Percentual de Concordância | `eq-06` | MSA do manual cobria só variáveis; faltava atributos |
| 164 | Análise Multivariada II — Fatorial, Discriminante e MANOVA | `est-07` | Aprofunda a análise multivariada além do PCA/T² do Capítulo 56 |
| 165 | Delineamentos de Um Fator — Blocos Aleatorizados e Quadrado Latino | `est-08` | DOE de um fator ausente entre os delineamentos fatoriais do manual |

**Lote 2 (cap-166 a cap-182, 17 capítulos)** — resultado do diagnóstico de alinhamento com o
projeto prático `manufacturing-performance-analytics`.

| Nº | Título | Módulo | Porquê |
|---|---|---|---|
| 166 | MTBF, MTTR e Indicadores Básicos de Confiabilidade | `eq-13` | Degrau intermediário de confiabilidade ausente entre o TPM/OEE (nível 2) e Weibull/Kaplan-Meier (nível 3) |
| 167 | Confundimento: Por Que a ANOVA Sozinha Pode Enganar | `est-05` | Ponte conceptual antes do confundimento causal, hoje só tratado no capstone (lab-04) |
| 168 | Teste de Bartlett: Verificando a Pressuposição de Variâncias Iguais | `est-05` | Pressuposto de variâncias iguais da ANOVA nunca era testado explicitamente |
| 169 | Métricas de Classificação sob Desbalanceamento e Threshold de Decisão Econômico | `qa-05` | Precision/Recall/F1/PR-AUC e custo assimétrico FP/FN ausentes do capítulo de ML |
| 170 | Validação Cruzada Temporal e Busca de Hiperparâmetros | `qa-05` | `TimeSeriesSplit`/`GridSearchCV` ausentes; splits aleatórios vazam informação temporal |
| 171 | Modelos de Árvore: Random Forest e Gradient Boosting (XGBoost) | `qa-05` | Nenhum modelo de árvore era ensinado; maior gap de uso no projeto prático |
| 172 | Interpretabilidade com SHAP | `qa-05` | Interpretabilidade de modelos de árvore ausente |
| 173 | Decomposição Sazonal e Modelos ARIMA/SARIMA | `est-07` | ARIMA/SARIMA nunca eram nomeados no capítulo de séries temporais |
| 174 | Correlação Cruzada e Indicadores Antecedentes | `est-07` | Cross-correlation entre séries e leading indicators ausentes |
| 175 | Gage R&R por ANOVA: o Método Recomendado pela AIAG MSA | `eq-06` | O método gráfico/manual hoje ensinado é tratado como legado pela norma AIAG MSA 4ª ed. |
| 176 | Conectando Python a Bancos de Dados: SQLAlchemy, pyodbc e Carga em Massa | `qa-03` | SQL puro (SELECT/joins) já coberto; faltava acesso via Python/ORM em produção |
| 177 | Modelagem Dimensional: Fato, Dimensão e Star Schema | `qa-04` | Modelagem dimensional (Kimball) era só conceitual, sem exercício hands-on |
| 178 | Arquitetura Medalhão: Bronze, Silver, Gold | `qa-04` | Padrão Databricks de estágios de refinamento, complementar ao star schema |
| 179 | Engenharia de Pipeline em Pandas: groupby/transform, Matching de Intervalos e Sequenciamento Stateful | `qa-04` | ETL era conceitual, com pouquíssimo código pandas |
| 180 | Métricas de Rendimento Six Sigma: DPU, DPMO, Nível Sigma, FPY/FTY e RTY | `eq-10` | Cluster de métricas de rendimento (ASQ BoK) nunca era ensinado junto |
| 181 | Testes Automatizados de Pipeline: da Lógica pytest ao dbt tests/Great Expectations | `qa-04` | Nenhum conteúdo de testes automatizados de dados/análises existia |
| 182 | Teoria das Restrições (TOC): os 5 Focusing Steps | `lss-15` (módulo novo) | TOC não existia em nenhum track; só citada de forma genérica |

---

## Estrutura do repositório

```
.
├── site/                     ← a aplicação (é isto que se publica)
│   ├── index.html
│   ├── assets/
│   │   ├── app.css  app.js   ← núcleo: router, progresso, quiz, busca
│   │   ├── viz.js            ← Plotly, tooltips de infográfico, separadores de código
│   │   ├── hl.js             ← realce de sintaxe (4 KB, offline)
│   │   └── vendor/           ← KaTeX + Mermaid + Plotly locais (sem CDN)
│   └── content/
│       ├── manifest.js       ← trilhas, módulos, índice de busca
│       ├── bank.js  bank_en.js  ← banco de questões (PT/EN)
│       ├── figs.js           ← gráficos interativos pré-calculados
│       └── ch/cap-NNN.js, cap-NNN.en.js  ← um par de ficheiros por capítulo
├── manual.ipynb               ← FONTE ÚNICA dos 182 capítulos em português (não
│                                 versionado no git — ver .gitignore, só existe localmente)
├── i18n/en/                   ← tradução EN capítulo a capítulo (cap-NNN.md) + bank.json
├── tools/
│   ├── parse.py               ← lê o notebook e deteta partes/capítulos
│   ├── curriculum.py          ← matriz trilha → módulo → capítulo → competência
│   ├── build.py               ← pipeline manual.ipynb (+ i18n/en/*.md) → site/content/
│   ├── enrich_bank.js         ← adiciona bokTopic/cognitiveLevel/chapterRef ao banco
│   ├── build_bank_en.js       ← gera content/bank_en.js a partir de bank.js + i18n/en/bank.json
│   ├── check_i18n.js          ← verifica paridade PT/EN e rastreabilidade do banco (roda em CI)
│   ├── figures.py             ← gera os gráficos Plotly (JSON, sem imagens)
│   ├── mk_bpmn_svg.py         ← gera o diagrama BPMN autoral
│   └── assessment_overrides.json
├── CITATION.cff
└── LICENSE
```

### Editar o manual: sempre pelo notebook

**A partir de agora, qualquer alteração ou capítulo novo é feito no `manual.ipynb`, nunca
editando diretamente os ficheiros em `site/content/ch/`.** Os capítulos 154–182 (antes em
`extra/*.md`) e a abertura do site (antes em `extra/abertura.md`) já foram fundidos no próprio
notebook — a PARTE XVIII e a célula marcada `## Abertura da edição web...`, respetivamente — e
`tools/build.py` lê-os dali diretamente. `extra/` deixou de existir.

```bash
pip install -r requirements.txt
python3 tools/build.py               # regenera manifest.js e content/ch/*.js a partir do notebook
node tools/enrich_bank.js            # reaplica bokTopic/cognitiveLevel/chapterRef ao banco
node tools/build_bank_en.js          # gera bank_en.js (tradução EN) a partir de bank.js + i18n/en/bank.json
node tools/check_i18n.js             # confirma paridade PT/EN 182/182 antes de publicar
```

A tradução para inglês continua em `i18n/en/*.md` (um ficheiro por capítulo) — o notebook é a
fonte em português; ao adicionar ou alterar um capítulo, atualize também a tradução
correspondente em `i18n/en/cap-NNN.md`, senão `check_i18n.js` falha.

---

## Publicar no GitHub Pages

O workflow em `.github/workflows/pages.yml` publica a pasta `site/` automaticamente a cada push
para `main`. Depois do primeiro push:

1. **Settings → Pages → Source: GitHub Actions**
2. O site fica em `https://<utilizador>.github.io/<repositorio>/`
3. **Antes de publicar em domínio próprio**: configure `canonical`, `og:url` e `sitemap.xml` para o
   domínio final em `site/robots.txt`, `site/sitemap.xml` e nas tags `canonical` / `og:url` /
   `twitter:url` de `site/index.html`.

---

## Notas técnicas

**Offline.** Tudo é servido de ficheiros locais — KaTeX, Mermaid e Plotly estão em
`assets/vendor/`, não em CDN. Não há qualquer dependência de rede depois da primeira carga.

**PWA / instalação.** `site/manifest.webmanifest` + `site/sw.js` tornam o site instalável
("Adicionar ao ecrã inicial" em telemóvel, ou o botão de instalar que aparece na barra superior
quando o browser sinaliza `beforeinstallprompt`). O service worker pré-carrega o essencial do
manual (app shell, banco de questões, figuras) e cacheia dinamicamente `assets/` e `content/` à
medida que o utilizador navega, para leitura offline dos capítulos já visitados. Para testar
localmente, sirva `site/` por HTTP (não `file://` — service workers exigem `http(s)`) e verifique
em DevTools → Application → Service Workers.

**Simuladores.** Em `#/simuladores`, três ferramentas interativas construídas em
`assets/lab.js` (independente de `app.js`, ligado por uma pequena ponte pública
`window.ACADEMY_APP`): um simulador de cartas de controlo X̄/R (gera subgrupos aleatórios e calcula
os limites a partir dos próprios dados), uma calculadora de capacidade Cp/Cpk/Ppk com PPM e nível
sigma, e uma calculadora de OEE com referências classe mundial. Todos usam Plotly com hover e
controlos ao vivo (sem recarregar a página) e não têm ligação ao banco de questões.

**Python, R, Excel e Power BI.** Aparecem lado a lado em separadores, com botão de copiar, como
referência para correr no VSCode, no RStudio, no Excel ou no Power BI. Nenhum código é executado no
navegador — os gráficos e resultados numéricos já estão pré-calculados no texto e em `figs.js`.

**Paleta.** Cinza chumbo → azul petróleo. As trilhas usam uma **rampa ordinal de petróleo**
validada (`--ordinal`: monotonia de luminosidade, gaps ≥ 0,06, extremo claro acima de 2:1 sobre a
superfície) e os gráficos usam uma **paleta categórica** separada, validada para daltonismo
(ΔE CVD ≥ 8 em pares adjacentes, nos dois temas). Para trocar as trilhas para a paleta categórica,
basta pôr `data-tp="cat"` no elemento `<html>`.

**Gráficos.** Guardados como JSON de Plotly em `site/content/figs.js`. As cores saem como tokens
(`"@series-1"`) que o `viz.js` resolve a partir das variáveis CSS — por isso o mesmo gráfico serve
o tema claro e o escuro sem duplicação.

**Armazenamento.** O progresso usa `localStorage` com fallback silencioso para memória (modo
privado, `file://` restrito). A página *Progresso e backup* avisa quando o armazenamento não está
disponível e permite exportar em JSON.

---

## Propriedade intelectual

O **código** (`site/assets`, `site/index.html`, `tools/`, `i18n/` enquanto infraestrutura) está
sob licença MIT — ver [`LICENSE`](LICENSE).

O **conteúdo didático** — capítulos, banco de questões, figuras e o manual de origem — não está
coberto por essa licença. É obra autoral da Aline Meireles, com todos os direitos reservados. O
conteúdo dos capítulos vem do manual da autora. O banco de questões é **autoral** e não reproduz
itens publicados pela ASQ.

Esta plataforma é **preparatória**. Não emite certificação ASQ nem Lean Six Sigma reconhecida — os
certificados oficiais são emitidos exclusivamente pelos organismos certificadores.

## Referências verificadas

- BPMN 2.0.2 (janeiro de 2014) continua a ser a versão formal vigente — [OMG](https://www.omg.org/spec/BPMN/2.0.2/About-BPMN)
- Bizagi Modeler: nível gratuito com modelos ilimitados e exportação para Word/PDF — [Bizagi Help](https://help.bizagi.com/platform/en/free_getting_started_with.htm)
