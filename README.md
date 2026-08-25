# Quality Engineering Academy

Plataforma de formação em Engenharia da Qualidade, Lean Six Sigma, Melhoria Contínua e Data
Analytics, em HTML/CSS/JS, gerada a partir do *Manual de Engenharia da Qualidade, Lean Six Sigma
e Quality Analytics — 4ª edição (2026)*.

Não é um e-book com menus: o manual é a **fonte de conhecimento**, e a aplicação é a **estrutura
de aprendizagem** — trilhas, módulos, aulas, avaliação, Practice Lab e mapa de competências.

**Abrir:** `site/index.html` em qualquer navegador. Não precisa de servidor, não precisa de
instalação, funciona offline.

---

## O que está lá dentro

| | |
|---|---|
| Capítulos | 165 (153 do manual + 12 escritos de raiz) |
| Percursos (trilhas) | 6 |
| Módulos | 61 |
| Blocos de código (Python/R/SQL/DAX) | 196 |
| Figuras e diagramas | 256 |
| Gráficos interativos (Plotly) | 21, com hover e deslizadores |
| Questões de certificação | 119 (60 CQE + 59 CSSBB, autorais) |
| Tradução para inglês | 100% dos capítulos (165/165) e do banco de questões (119/119) |

Estes números são recalculados a cada `python3 tools/build.py`, a partir do `manifest.js` gerado —
não são mantidos manualmente. Se divergirem do que vê no site, o manifest é que está certo.

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
- **Gráficos interativos** gerados em Python no build e servidos como JSON: hover com valores,
  deslizadores, zoom e exportação em PNG — sem qualquer dependência de execução.
- **Infográficos com tooltip**: passar o rato sobre um elemento do diagrama de tartaruga, por
  exemplo, mostra a cláusula da norma e o que o auditor procura ali.
- **Código lado a lado** em separadores: Python · R · Excel · DAX/Power BI, com botão de copiar.

### Capítulos escritos de raiz para a edição web

| Nº | Título | Módulo | Porquê |
|---|---|---|---|
| **40-A** | BPMN 2.0 e Bizagi Modeler na prática | `lss-05` | O manual só tinha BPMN em imagens, sem texto |
| **40-B** | Esparguete, Makigami e Tartaruga | `lss-05` | Três ferramentas de mapeamento ausentes |
| **71-A** | Estúdio de Capabilidade | `eq-10` | Laboratório interativo de Cp/Cpk/Pp/Ppk |
| **14-A** | Voz do Cliente, Satisfação e o Elo com Lean Six Sigma | `eq-05` | Liga VoC → ISO 9001 → Lean → Six Sigma → DMAIC/PDCA num ciclo fechado |
| **25-A** | OEE Avançado — Decomposição de Perdas, Maturidade Digital | `lss-04` | Aprofunda o OEE do Capítulo 25 com cascata de perdas e maturidade digital |
| **18-A** | 5S e Gestão Visual de Chão de Fábrica | `lss-01` | Disciplina de Sustain e ferramentas de gestão visual, além do 5S introdutório |
| **9-A** | Resolução Estruturada de Problemas — 5 Porquês, 8D e CAPA | `eq-03` | Aprofunda o 5 Porquês do Capítulo 9 com o fluxo completo até o 8D e o CAPA |
| **56-A** | Análise de Clusters — Hierárquica e K-Means | `est-07` | Técnica de agrupamento não supervisionado ausente do manual original |
| **10-A** | Barreiras à Melhoria da Qualidade | `eq-04` | Cobre o tópico I.I do BoK CQE, sem capítulo dedicado na edição original |
| — | MSA por Atributos — Kappa e Percentual de Concordância | `eq-06` | MSA do manual cobria só variáveis; faltava atributos |
| — | Análise Multivariada II — Fatorial, Discriminante e MANOVA | `est-07` | Aprofunda a análise multivariada além do PCA/T² do Capítulo 56 |
| — | Delineamentos de Um Fator — Blocos Aleatorizados e Quadrado Latino | `est-08` | DOE de um fator ausente entre os delineamentos fatoriais do manual |

Todos os 12 têm tradução completa para inglês em `i18n/en/`.

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
│       ├── bank.js           ← banco de questões
│       ├── figs.js           ← gráficos interativos pré-calculados
│       └── ch/cap-NNN.js     ← um ficheiro por capítulo
├── extra/                    ← 12 capítulos escritos de raiz (900-911), ver tabela acima
├── i18n/en/                  ← tradução EN capítulo a capítulo (cap-NNN.md) + bank.json (119 questões), 100% de cobertura
├── tools/
│   ├── parse.py              ← lê o notebook e deteta partes/capítulos
│   ├── curriculum.py         ← matriz trilha → módulo → capítulo → competência
│   ├── build.py              ← pipeline notebook → site (também compila i18n/en/*.md)
│   ├── enrich_bank.js        ← adiciona bokTopic/cognitiveLevel/chapterRef ao banco de questões
│   ├── build_bank_en.js      ← gera content/bank_en.js a partir de bank.js + i18n/en/bank.json
│   ├── check_i18n.js         ← verifica paridade PT/EN de capítulos, banco e traceability
│   ├── figures.py            ← gera os gráficos Plotly (JSON, sem imagens)
│   ├── mk_bpmn_svg.py        ← gera o diagrama BPMN autoral
│   └── check.js check2.js    ← testes de navegador (Playwright)
├── manual.ipynb              ← fonte (não é publicado, não versionado — ver .gitignore)
└── AUDITORIA.md              ← o que foi encontrado no manual
```

### Reconstruir o site a partir do notebook

```bash
pip install markdown pymdown-extensions
python3 tools/build.py
node tools/enrich_bank.js    # bank.js é regenerado a cada build.py: isto reaplica bokTopic/cognitiveLevel/chapterRef
node tools/build_bank_en.js  # gera content/bank_en.js (tradução EN) a partir de bank.js + i18n/en/bank.json
```

O `build.py` extrai as 192 imagens embutidas para ficheiros (o notebook tinha ~5 MB de base64
inline), converte o markdown em HTML, protege as fórmulas para o KaTeX, transforma os blocos
` ```mermaid ` em diagramas renderizáveis, gera um ficheiro `.js` por capítulo e compila as
traduções EN de `i18n/en/*.md` para `content/ch/cap-NNN.en.js`.

Para alterar a organização curricular, edite **`tools/curriculum.py`** — é a única coisa que
define trilhas, módulos e competências.

### Testar

```bash
node tools/check_i18n.js                 # paridade PT/EN + rastreabilidade do banco (sem browser, corre em CI)

cd site && python3 -m http.server 8899   # para os testes de browser, noutro terminal:
node tools/check.js && node tools/check2.js
```

`check_i18n.js` corre automaticamente em CI a cada push/PR (`.github/workflows/check.yml`) e falha
se algum capítulo ficar sem tradução EN ou alguma questão do banco perder a rastreabilidade
(`bokTopic`/`cognitiveLevel`/`chapterRef`, gerados por `tools/enrich_bank.js` após cada
`build.py`). `check.js`/`check2.js` precisam do Chromium do Playwright instalado localmente
(`npx playwright install chromium`) e não correm em CI.

---

## Publicar no GitHub Pages

O workflow em `.github/workflows/pages.yml` publica a pasta `site/` automaticamente a cada push
para `main`. Depois do primeiro push:

1. **Settings → Pages → Source: GitHub Actions**
2. O site fica em `https://<utilizador>.github.io/<repositorio>/`
3. **Antes de tornar público**: substitua `https://example.github.io/quality-engineering-academy/`
   pelo domínio real em `site/robots.txt`, `site/sitemap.xml` e nas tags `canonical` / `og:url` /
   `twitter:url` de `site/index.html` — foram deixadas com um domínio de exemplo porque o
   repositório ainda não tem remote/publicação configurados.

A pasta `site/` tem cerca de 17 MB (7,7 MB de conteúdo — PT + EN —, 3,8 MB de imagens, 5,3 MB de
bibliotecas locais), bem dentro do confortável para o Pages.

---

## Notas técnicas

**Offline.** Tudo é servido de ficheiros locais — KaTeX, Mermaid e Plotly estão em
`assets/vendor/`, não em CDN. Não há qualquer dependência de rede depois da primeira carga.

**Python, R, Excel e Power BI.** Aparecem lado a lado em separadores, com botão de copiar, como
referência para correr no VSCode, no RStudio, no Excel ou no Power BI. Nenhum código é executado no
navegador — os gráficos são pré-calculados em `tools/figures.py` e os resultados numéricos já estão
no texto, exatamente como os teria depois de correr o bloco correspondente.

**Paleta.** Cinza chumbo → azul petróleo. As trilhas usam uma **rampa ordinal de petróleo**
validada (`--ordinal`: monotonia de luminosidade, gaps ≥ 0,06, extremo claro acima de 2:1 sobre a
superfície) e os gráficos usam uma **paleta categórica** separada, validada para daltonismo
(ΔE CVD ≥ 8 em pares adjacentes, nos dois temas). Para trocar as trilhas para a paleta categórica,
basta pôr `data-tp="cat"` no elemento `<html>`.

**Gráficos.** São calculados em `tools/figures.py` e guardados como JSON de Plotly em
`site/content/figs.js`. As cores saem como tokens (`"@series-1"`) que o `viz.js` resolve a partir
das variáveis CSS — por isso o mesmo gráfico serve o tema claro e o escuro sem duplicação.
Nada é executado em Python no navegador para desenhar um gráfico.

**Armazenamento.** O progresso usa `localStorage` com fallback silencioso para memória (modo
privado, `file://` restrito). A página *Progresso e backup* avisa quando o armazenamento não está
disponível e permite exportar em JSON.

---

## Propriedade intelectual

O **código** (`site/assets`, `site/index.html`, `tools/`, `i18n/` enquanto infraestrutura) está sob
licença MIT — ver [`LICENSE`](LICENSE).

O **conteúdo didático** — capítulos, banco de questões, figuras e o manual de origem — não está
coberto por essa licença. É obra autoral da Aline Meireles, com todos os direitos reservados. O
conteúdo dos capítulos vem do manual da autora. O banco de questões é **autoral** e não reproduz
itens publicados pela ASQ.

Esta plataforma é **preparatória**. Não emite certificação ASQ nem Lean Six Sigma reconhecida — os
certificados oficiais são emitidos exclusivamente pelos organismos certificadores.

Antes de tornar o repositório público, reveja o aviso de propriedade intelectual na abertura do
manual e confirme que todas as figuras reutilizadas têm origem compatível com publicação aberta.

## Referências verificadas

- BPMN 2.0.2 (janeiro de 2014) continua a ser a versão formal vigente — [OMG](https://www.omg.org/spec/BPMN/2.0.2/About-BPMN)
- Bizagi Modeler: nível gratuito com modelos ilimitados e exportação para Word/PDF — [Bizagi Help](https://help.bizagi.com/platform/en/free_getting_started_with.htm)
