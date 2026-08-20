# Academy · Qualidade, Lean Six Sigma e Quality Analytics

Plataforma de formação em HTML/CSS/JS gerada a partir do *Manual de Engenharia da Qualidade,
Lean Six Sigma e Quality Analytics — 4ª edição (2026)*.

Não é um e-book com menus: o manual é a **fonte de conhecimento**, e a aplicação é a **estrutura
de aprendizagem** — trilhas, módulos, aulas, laboratório, avaliação e mapa de competências.

**Abrir:** `site/index.html` em qualquer navegador. Não precisa de servidor, não precisa de
instalação, funciona offline.

---

## O que está lá dentro

| | |
|---|---|
| Capítulos | 152 |
| Percursos (trilhas) | 6 |
| Módulos | 62 |
| Blocos Python executáveis | 140 |
| Figuras e diagramas | 192 |
| Questões de certificação | 112 (CQE + CSSBB, autorais) |

### Percursos

1. **Engenharia da Qualidade** — alinhado ao BoK do ASQ CQE
2. **Lean Six Sigma** — pensamento Lean, ferramentas de fluxo, ciclo DMAIC completo
3. **Estatística e Experimentação** — da análise gráfica ao DOE e à modelação
4. **Quality Analytics e Quality 4.0** — Minitab, SQL, engenharia de dados, ML, governança de IA
5. **Laboratório Avançado e Risk Engineering** — inferência moderna, causalidade, risco quantitativo
6. **Aplicações Setoriais** — biblioteca de consulta por setor

### Funcionalidades

- **Laboratório Python real no navegador** (Pyodide/WebAssembly): numpy, pandas, scipy,
  matplotlib carregam por omissão; statsmodels e scikit-learn a pedido. Os blocos de código dos
  capítulos são **editáveis e executáveis** — clique em `Executar`.
- **Avaliação por módulo** com feedback imediato e análise dos distratores; mínimo recomendado 70%.
- **Mapa de competências** — mostra o que ainda falta, não só o que foi feito.
- **Progresso** guardado no navegador, com exportação/importação em JSON.
- **Busca** em todos os capítulos, tema claro/escuro, leitura em telemóvel, impressão limpa.
- **Lupa** em qualquer figura (diagramas BPMN, VSM e cartas de controlo abrem em ecrã inteiro).

---

## Estrutura do repositório

```
.
├── site/                     ← a aplicação (é isto que se publica)
│   ├── index.html
│   ├── assets/
│   │   ├── app.css  app.js   ← núcleo: router, progresso, quiz, busca
│   │   ├── lab.js            ← laboratório Pyodide
│   │   ├── hl.js             ← realce de sintaxe (4 KB, offline)
│   │   └── vendor/           ← KaTeX + Mermaid locais (sem CDN)
│   └── content/
│       ├── manifest.js       ← trilhas, módulos, índice de busca
│       ├── bank.js           ← banco de questões
│       └── ch/cap-NNN.js     ← um ficheiro por capítulo
├── extra/
│   └── bpmn.md               ← capítulo 40-A, escrito de raiz para a edição web
├── tools/
│   ├── parse.py              ← lê o notebook e deteta partes/capítulos
│   ├── curriculum.py         ← matriz trilha → módulo → capítulo → competência
│   ├── build.py              ← pipeline notebook → site
│   ├── mk_bpmn_svg.py        ← gera o diagrama BPMN autoral
│   └── check.js check2.js    ← testes de navegador (Playwright)
├── manual.ipynb              ← fonte (não é publicado)
└── AUDITORIA.md              ← o que foi encontrado no manual
```

### Reconstruir o site a partir do notebook

```bash
pip install markdown pymdown-extensions
python3 tools/build.py
```

O `build.py` extrai as 192 imagens embutidas para ficheiros (o notebook tinha ~5 MB de base64
inline), converte o markdown em HTML, protege as fórmulas para o KaTeX, transforma os blocos
` ```mermaid ` em diagramas renderizáveis e gera um ficheiro `.js` por capítulo.

Para alterar a organização curricular, edite **`tools/curriculum.py`** — é a única coisa que
define trilhas, módulos e competências.

### Testar

```bash
cd site && python3 -m http.server 8899   # noutro terminal:
node tools/check.js && node tools/check2.js
```

---

## Publicar no GitHub Pages

O workflow em `.github/workflows/pages.yml` publica a pasta `site/` automaticamente a cada push
para `main`. Depois do primeiro push:

1. **Settings → Pages → Source: GitHub Actions**
2. O site fica em `https://<utilizador>.github.io/<repositorio>/`

O repositório tem cerca de 8 MB (3,6 MB de conteúdo + 3,8 MB de imagens + vendor), dentro do
confortável para o Pages.

---

## Notas técnicas

**Offline.** Tudo é servido de ficheiros locais — KaTeX e Mermaid estão em `assets/vendor/`, não em
CDN. A **única** dependência de rede é o Pyodide, que só é descarregado quando se executa código
Python pela primeira vez (~15 MB, depois fica em cache do navegador).

**R.** O manual não traz código R. Os exemplos em R que forem acrescentados aparecem lado a lado com
o Python, com botão de copiar, para correr no RStudio — executar R no navegador exigiria o webR, que
é consideravelmente mais pesado que o Pyodide.

**Paleta.** As cores das trilhas usam uma paleta categórica validada para daltonismo
(ΔE CVD ≥ 8 em pares adjacentes, nos dois temas), com rótulos diretos em todos os elementos
coloridos.

**Armazenamento.** O progresso usa `localStorage` com fallback silencioso para memória (modo
privado, `file://` restrito). A página *Progresso e backup* avisa quando o armazenamento não está
disponível e permite exportar em JSON.

---

## Propriedade intelectual

O conteúdo dos capítulos vem do manual da autora. O banco de questões é **autoral** e não reproduz
itens publicados pela ASQ.

Esta plataforma é **preparatória**. Não emite certificação ASQ nem Lean Six Sigma reconhecida — os
certificados oficiais são emitidos exclusivamente pelos organismos certificadores.

Antes de tornar o repositório público, reveja o aviso de propriedade intelectual na abertura do
manual e confirme que todas as figuras reutilizadas têm origem compatível com publicação aberta.

## Referências verificadas

- BPMN 2.0.2 (janeiro de 2014) continua a ser a versão formal vigente — [OMG](https://www.omg.org/spec/BPMN/2.0.2/About-BPMN)
- Bizagi Modeler: nível gratuito com modelos ilimitados e exportação para Word/PDF — [Bizagi Help](https://help.bizagi.com/platform/en/free_getting_started_with.htm)
