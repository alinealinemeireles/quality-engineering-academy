# Quality Engineering Academy

[Português](README.md) · **English**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-alinemeireles-35A0BA?style=flat-square&logo=linkedin&logoColor=white&labelColor=10161A)](https://www.linkedin.com/in/alinemeireles/)
[![Live site](https://img.shields.io/badge/Live_site-alinealinemeireles.github.io-35A0BA?style=flat-square&logo=googlechrome&logoColor=white&labelColor=10161A)](https://alinealinemeireles.github.io/quality-engineering-academy/)

A training platform for Quality Engineering, Lean Six Sigma, Continuous Improvement and Data
Analytics, built in plain HTML/CSS/JS and based on the *Handbook of Quality Engineering, Lean Six
Sigma and Quality Analytics — Original Edition (2026)*.

It is not an e-book with menus: the handbook is the **knowledge source**, and the application is
the **learning structure** — tracks, modules, lessons, assessment, Practice Lab and competency map.
The whole interface and content are bilingual (Portuguese/English).

**Open:** `site/index.html` in any browser. No server, no installation, works offline.

> **⚠️ Content rights reserved.** The platform source code (`site/assets/`, `tools/`) is under the
> MIT license — see [`LICENSE`](LICENSE). The **educational content** (chapters, question bank,
> figures and the source handbook) is the original work of **Aline Meireles**, with **all rights
> reserved**: copying, reproducing, redistributing or reusing this content, in whole or in part,
> is not permitted without the author's express authorization.

---

## What's inside

| | |
|---|---|
| Chapters | 182 |
| Tracks | 6 |
| Modules | 62 |
| Code blocks (Python/R/SQL/DAX) | 233 |
| Figures and diagrams | 256 |
| Interactive charts (Plotly) | 21 figures (compositions registered in `figs.js`; each figure may have more than one series — 65 series in total: 34 scatter, 14 bar, 14 line, 2 log, 1 contour), with hover and sliders |
| Certification questions | 310 (160 CQE + 150 CSSBB, original, with the real exam's distribution by domain) |
| English translation | 100% of chapters (182/182) and of the question bank (310/310) |

### Tracks

1. **Quality Engineering** — aligned to the ASQ CQE Body of Knowledge
2. **Lean Six Sigma** — Lean thinking, flow tools and the complete DMAIC cycle
3. **Statistics and Experimentation** — from graphical analysis to DOE and modeling
4. **Quality Analytics and Quality 4.0** — Minitab, SQL, data engineering, ML, AI governance
5. **Advanced Lab and Risk Engineering** — modern inference, causality, quantitative risk
6. **Sector Applications** — a reference library by sector

### Features

- **Module assessments** with immediate feedback and distractor analysis; recommended minimum 70%.
- **Practice Lab (ASQ CQE and CSSBB)** — a question bank with the same number of questions per
  domain as the real exam, in three modes:
  - **Study** — immediate feedback, with a filter by BoK domain;
  - **Practice exam** — 25 or 50 questions or the full exam, in random order with a sample
    stratified by each domain's weight; a timer at the target pace (1.8 min/question for CQE,
    1.7 for CSSBB) with checkpoints at 25/50/75%, scoring only at the end and results by domain;
  - **Review mistakes** — redo only the questions whose latest answer was wrong.

  The dashboard shows the **exam blueprint with a diagnosis by domain** (accuracy and reading:
  consolidated, acceptable, real gap, top priority), an **exam strategy** section and a **CSSBB
  BoK study map** with the *Six Sigma Study Guide* notes; the same notes appear as "further
  reading" in the question explanations.
- **Competency map** — shows what is still missing, not just what has been done.
- **Progress** saved in the browser, with JSON export/import.
- **Search** across all chapters, light/dark theme, mobile reading, clean printing.
- **Magnifier** on any figure (BPMN diagrams, VSMs and control charts open full screen).
- **Interactive charts** precomputed and served as JSON: hover values, sliders, zoom and PNG
  export — with no code executed in the browser.
- **Infographics with tooltips**: hovering over an element of the turtle diagram, for example,
  shows the standard's clause and what the auditor looks for there.
- **Side-by-side code** in tabs: Python · R · Excel · DAX/Power BI, with a copy button.

### PART XVIII — Complementary Topics and Applications (cap-154 to cap-182)

| No. | Title | Module |
|---|---|---|
| 154 | BPMN 2.0 and Bizagi Modeler in Practice | `lss-05` |
| 155 | Spaghetti Diagram, Makigami and Turtle Diagram | `lss-05` |
| 156 | Capability Studio — Cp, Cpk, Pp, Ppk in Practice | `eq-10` |
| 157 | Voice of the Customer, Satisfaction and the Link to Lean Six Sigma | `eq-05` |
| 158 | Advanced OEE — Loss Decomposition, Digital Maturity and Real-Time Data | `lss-04` |
| 159 | 5S and Visual Management on the Shop Floor | `lss-01` |
| 160 | Structured Problem Solving — 5 Whys, 8D and CAPA | `eq-03` |
| 161 | Cluster Analysis — Hierarchical and K-Means in Quality | `est-07` |
| 162 | Barriers to Quality Improvement | `eq-04` |
| 163 | Attribute MSA — Kappa and Percent Agreement | `eq-06` |
| 164 | Multivariate Analysis II — Factor Analysis, Discriminant Analysis, and MANOVA | `est-07` |
| 165 | One-Factor Designs — Randomized Blocks and Latin Squares | `est-08` |
| 166 | MTBF, MTTR, and Basic Reliability Indicators | `eq-13` |
| 167 | Confounding: Why ANOVA Alone Can Mislead You | `est-05` |
| 168 | Bartlett's Test: Checking the Equal-Variance Assumption | `est-05` |
| 169 | Classification Metrics Under Class Imbalance and Economic Decision Thresholds | `qa-05` |
| 170 | Temporal Cross-Validation and Hyperparameter Search | `qa-05` |
| 171 | Tree Models: Random Forest and Gradient Boosting (XGBoost) | `qa-05` |
| 172 | Interpretability with SHAP | `qa-05` |
| 173 | Seasonal Decomposition and ARIMA/SARIMA Models | `est-07` |
| 174 | Cross-Correlation and Leading Indicators | `est-07` |
| 175 | ANOVA Gage R&R: the Method the AIAG MSA Recommends | `eq-06` |
| 176 | Connecting Python to Databases: SQLAlchemy, pyodbc, and Bulk Loading | `qa-03` |
| 177 | Dimensional Modeling: Fact, Dimension, and Star Schema | `qa-04` |
| 178 | Medallion Architecture: Bronze, Silver, Gold | `qa-04` |
| 179 | Data Pipeline Engineering in Pandas: groupby/transform, Interval Matching, and Stateful Sequencing | `qa-04` |
| 180 | Six Sigma Yield Metrics: DPU, DPMO, Sigma Level, FPY/FTY, and RTY | `eq-10` |
| 181 | Automated Pipeline Testing: from pytest Logic to dbt tests/Great Expectations | `qa-04` |
| 182 | Theory of Constraints (TOC): the Five Focusing Steps | `lss-15` |

---

## Repository structure

```
.
├── site/                     ← the application (this is what gets published)
│   ├── index.html
│   ├── assets/
│   │   ├── app.css  app.js   ← core: router, progress, quiz, search
│   │   ├── exam.js           ← exam blueprints and Practice Lab study map
│   │   ├── viz.js            ← Plotly, infographic tooltips, code tabs
│   │   ├── hl.js             ← syntax highlighting (4 KB, offline)
│   │   └── vendor/           ← local KaTeX + Mermaid + Plotly (no CDN)
│   └── content/
│       ├── manifest.js       ← tracks, modules, search index
│       ├── bank.js  bank_en.js  ← question bank (PT/EN)
│       ├── figs.js           ← precomputed interactive charts
│       └── ch/cap-NNN.js, cap-NNN.en.js  ← one pair of files per chapter
├── manual.ipynb               ← SINGLE SOURCE of the 182 chapters in Portuguese (not
│                                 tracked in git — see .gitignore, exists only locally)
├── i18n/en/                   ← English translation chapter by chapter (cap-NNN.md) + bank.json
├── tools/
│   ├── parse.py               ← reads the notebook and detects parts/chapters
│   ├── curriculum.py          ← track → module → chapter → competency matrix
│   ├── build.py               ← pipeline manual.ipynb (+ i18n/en/*.md) → site/content/
│   ├── enrich_bank.js         ← adds bokTopic/cognitiveLevel/chapterRef to the bank
│   ├── build_bank_en.js       ← generates content/bank_en.js from bank.js + i18n/en/bank.json
│   ├── check_i18n.js          ← checks PT/EN parity and bank traceability (runs in CI)
│   ├── figures.py             ← generates the Plotly charts (JSON, no images)
│   ├── mk_bpmn_svg.py         ← generates the original BPMN diagram
│   └── assessment_overrides.json
├── CITATION.cff
└── LICENSE
```

### Editing the handbook: always through the notebook

**Any change or new chapter is made in `manual.ipynb`, never by editing the files in
`site/content/ch/` directly.** Chapters 154–182 are in PART XVIII of the notebook and the site's
opening page is in the cell marked `## Abertura do site...`; `tools/build.py` reads them from
there directly.

```bash
pip install -r requirements.txt
python3 tools/build.py               # regenerates manifest.js and content/ch/*.js from the notebook
node tools/enrich_bank.js            # reapplies bokTopic/cognitiveLevel/chapterRef to the bank
node tools/build_bank_en.js          # generates bank_en.js (EN translation) from bank.js + i18n/en/bank.json
node tools/check_i18n.js             # confirms 182/182 PT/EN parity before publishing
```

The English translation lives in `i18n/en/*.md` (one file per chapter) — the notebook is the
Portuguese source; when adding or changing a chapter, also update the matching translation in
`i18n/en/cap-NNN.md`, otherwise `check_i18n.js` fails.

---

## Publishing on GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the `site/` folder automatically on every
push to `main`. After the first push:

1. **Settings → Pages → Source: GitHub Actions**
2. The site will be at `https://<user>.github.io/<repository>/`
3. **Before publishing on a custom domain**: set `canonical`, `og:url` and `sitemap.xml` to the
   final domain in `site/robots.txt`, `site/sitemap.xml` and in the `canonical` / `og:url` /
   `twitter:url` tags of `site/index.html`.

---

## Technical notes

**Offline.** Everything is served from local files — KaTeX, Mermaid and Plotly are in
`assets/vendor/`, not on a CDN. There is no network dependency after the first load.

**PWA / installation.** `site/manifest.webmanifest` + `site/sw.js` make the site installable
("Add to home screen" on mobile, or the install button shown in the top bar when the browser
fires `beforeinstallprompt`). The service worker precaches the handbook's essentials (app shell,
question bank, figures) and dynamically caches `assets/` and `content/` as the user browses, for
offline reading of chapters already visited. To test locally, serve `site/` over HTTP (not
`file://` — service workers require `http(s)`) and check DevTools → Application → Service Workers.

**Simulators.** At `#/simuladores`, three interactive tools built in `assets/lab.js`
(independent of `app.js`, connected through a small public bridge, `window.ACADEMY_APP`): an
X̄/R control chart simulator (generates random subgroups and computes the limits from the data
itself), a Cp/Cpk/Ppk capability calculator with PPM and sigma level, and an OEE calculator with
world-class references. All use Plotly with hover and live controls (no page reload) and are not
connected to the question bank.

**Python, R, Excel and Power BI.** Shown side by side in tabs, with a copy button, as a reference
to run in VSCode, RStudio, Excel or Power BI. No code runs in the browser — charts and numerical
results are already precomputed in the text and in `figs.js`.

**Palette.** Graphite gray → petrol blue. Tracks use a validated **ordinal petrol ramp**
(`--ordinal`: monotonic lightness, gaps ≥ 0.06, light end above 2:1 against the surface) and charts
use a separate **categorical palette**, validated for color blindness (CVD ΔE ≥ 8 on adjacent
pairs, in both themes). To switch the tracks to the categorical palette, set `data-tp="cat"` on
the `<html>` element.

**Charts.** Stored as Plotly JSON in `site/content/figs.js`. Colors are emitted as tokens
(`"@series-1"`) that `viz.js` resolves from the CSS variables — so the same chart serves the light
and dark themes without duplication.

**Storage.** Progress uses `localStorage` with a silent fallback to memory (private mode,
restricted `file://`). The *Progress & Backup* page warns when storage is unavailable and allows
exporting to JSON.

---

## Intellectual property

The **code** (`site/assets`, `site/index.html`, `tools/`, `i18n/` as infrastructure) is under the
MIT license — see [`LICENSE`](LICENSE).

The **educational content** — chapters, question bank, figures and the source handbook — is not
covered by that license. It is the original work of Aline Meireles, with all rights reserved. The
chapter content comes from the author's handbook. The question bank is **original** and does not
reproduce items published by ASQ.

This platform is **preparatory only**. It does not issue ASQ or recognized Lean Six Sigma
certification — official certificates are issued exclusively by the certifying bodies.

## Verified references

- BPMN 2.0.2 (January 2014) remains the current formal version — [OMG](https://www.omg.org/spec/BPMN/2.0.2/About-BPMN)
- Bizagi Modeler: free tier with unlimited models and export to Word/PDF — [Bizagi Help](https://help.bizagi.com/platform/en/free_getting_started_with.htm)
