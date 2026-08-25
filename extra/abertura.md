# Manual de Engenharia da Qualidade, Lean Six Sigma e Quality Analytics

**4ª Edição — 2026 · Excel · Minitab · Python · R · Power BI · SQL**

Formação técnica integrada de **Engenheiro da Qualidade (ASQ CQE)** e **Six Sigma Black Belt (ASQ
CSSBB)**, com uma camada adicional de **Lean, engenharia de dados e analytics aplicado à
qualidade**. O núcleo de preparação para certificação segue os *Bodies of Knowledge* públicos de
2022 do CQE e do CSSBB; normas, ferramentas e analytics aparecem como competências profissionais
complementares.

> **Não é material oficial**, aprovado ou endossado pelo ASQ, pela ISO, pela IATF ou pela AIAG, e
> não constitui garantia de aprovação em qualquer exame de certificação. O banco de questões
> (119, Parte XV) é **integralmente autoral** — não reproduz itens publicados pela ASQ.

---

## Como usar este manual

O manual está organizado em 17 partes, cada uma assumindo o conhecimento das anteriores. O eixo
que atravessa tudo — passe o rato em cada etapa:

<figure class="figure2026">
<svg role="img" aria-label="Eixo vertical do manual: cliente, produto e processo, sistema de medicao, analise estatistica, melhoria continua e sistema da qualidade" viewBox="0 0 700 560" style="width:100%;height:auto;display:block;background:var(--surface-1);border:1px solid var(--line);border-radius:10px" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ax-ar" markerWidth="9" markerHeight="9" refX="4" refY="5" orient="auto"><path d="M0,0 L8,5 L0,10 Z" fill="#7c8f99"/></marker></defs>
<style>
.ax-t { font-family: "Segoe UI", Inter, system-ui, sans-serif; }
.ax-h { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-weight: 700; fill: var(--surface-1); font-size: 14px; }
.ax-s { font-family: "Segoe UI", Inter, system-ui, sans-serif; fill: var(--surface-1); font-size: 10.5px; opacity: .92; }
</style>
<line x1="350" y1="80" x2="350" y2="105" stroke="#7c8f99" stroke-width="1.8" marker-end="url(#ax-ar)"/>
<line x1="350" y1="180" x2="350" y2="205" stroke="#7c8f99" stroke-width="1.8" marker-end="url(#ax-ar)"/>
<line x1="350" y1="280" x2="350" y2="305" stroke="#7c8f99" stroke-width="1.8" marker-end="url(#ax-ar)"/>
<line x1="350" y1="380" x2="350" y2="405" stroke="#7c8f99" stroke-width="1.8" marker-end="url(#ax-ar)"/>
<g data-tip="<b>Cliente, Produto, Processo.</b> Voz do Cliente/CTQ/QFD definem o que importa; Design/DFMEA constroem o produto; PFMEA, Plano de Controlo e SPC constroem o processo que o produz.">
<rect x="30" y="20" width="640" height="60" rx="10" fill="var(--series-1)"/>
<text class="ax-h" x="350" y="44" text-anchor="middle">CLIENTE · PRODUTO · PROCESSO</text>
<text class="ax-s" x="350" y="62" text-anchor="middle">VOC/CTQ/QFD · Design/DFMEA · PFMEA/Plano de Controlo/SPC</text>
</g>
<g data-tip="<b>Sistema de medição.</b> Nenhuma decisão estatística vale mais do que a qualidade do sistema que gerou o dado — metrologia, MSA e Gage R&amp;R (Parte VI).">
<rect x="80" y="120" width="540" height="60" rx="10" fill="var(--series-4)"/>
<text class="ax-h" x="350" y="144" text-anchor="middle">SISTEMA DE MEDIÇÃO</text>
<text class="ax-s" x="350" y="162" text-anchor="middle">Metrologia · MSA · Gage R&amp;R</text>
</g>
<g data-tip="<b>Análise estatística.</b> SPC monitoriza estabilidade, DOE otimiza sob restrições, modelação prevê — as três levam a capability, otimização e previsão (Partes V, VII e VIII).">
<rect x="30" y="220" width="640" height="60" rx="10" fill="var(--series-3)"/>
<text class="ax-h" x="350" y="244" text-anchor="middle">ANÁLISE ESTATÍSTICA</text>
<text class="ax-s" x="350" y="262" text-anchor="middle">SPC → Capability · DOE → Otimização · Modelação → Previsão</text>
</g>
<g data-tip="<b>Melhoria contínua.</b> DMAIC quando o problema exige dados e controlo; Lean quando é fluxo e desperdício; Kaizen como cultura de melhoria diária (Partes III e IV).">
<rect x="130" y="320" width="440" height="60" rx="10" fill="var(--series-2)"/>
<text class="ax-h" x="350" y="344" text-anchor="middle">MELHORIA CONTÍNUA</text>
<text class="ax-s" x="350" y="362" text-anchor="middle">DMAIC · Lean · Kaizen</text>
</g>
<g data-tip="<b>Sistema da qualidade.</b> Onde tudo se institucionaliza: ISO 9001, IATF 16949, ISO 19011 (auditoria) e a gestão de risco que atravessa o manual inteiro (Partes IX e X).">
<rect x="30" y="420" width="640" height="60" rx="10" fill="var(--good)"/>
<text class="ax-h" x="350" y="444" text-anchor="middle">SISTEMA DA QUALIDADE</text>
<text class="ax-s" x="350" y="462" text-anchor="middle">ISO 9001 · IATF · ISO 19011 · Gestão de Risco</text>
</g>
<text class="ax-t" x="350" y="530" text-anchor="middle" font-size="11.5" fill="var(--ink-3)">passe o rato (ou toque) em cada etapa</text>
</svg>
</figure>

**Quatro percursos de leitura**, conforme o objetivo:

| Objetivo | Percurso sugerido |
|---|---|
| Preparar o ASQ CSSBB | Partes I → III → IV → V → VII → VIII → IX → XI → banco CSSBB (Parte XV) |
| Preparar o ASQ CQE | Partes I → II → V → VI → VII → IX → X → XI → XII → banco CQE (Parte XV) |
| Trabalhar como Quality Engineer / Data Analyst | Partes I → IV → V → VI → VII → XIII → Lab. avançado (cap. 134-142) |
| Especializar-se em Risk Engineering | Partes I → IX → X → XIII → XIV → Lab. avançado (cap. 143-153) |

Para a trilha interativa e o progresso por módulo, use os **[percursos](#/)** na página inicial ou
o **[mapa de competências](#/competencias)** — mostram o que falta, não só o que já foi lido.

**Como cada capítulo é construído:** pergunta de engenharia → conceito → exemplo resolvido em
Python e R (lado a lado, com botão de copiar) → leitura de engenharia → erros comuns. Os capítulos
134 a 153 (Laboratório Avançado 2026) seguem a mesma estrutura e não são apêndice opcional — são o
núcleo avançado desta edição.

---

## Certificação ASQ — referência de exame

> O termo "Lean Six Sigma" descreve a abordagem integrada usada neste manual; o ASQ não emite uma
> credencial com esse nome. CQE e CSSBB são credenciais distintas, cada uma com o seu próprio
> *Body of Knowledge*.

| | CQE | CSSBB |
|---|---|---|
| **Body of Knowledge** | 2022, 7 domínios | 2022, 9 domínios |
| **Exame** | 175 questões (160 pontuadas), 5h18, *open book* | 165 questões (150 pontuadas), 4h18, *open book* |
| **Banco autoral deste manual** | 60 questões, 7 domínios | 59 questões, 9 domínios |

Cada questão do banco (Parte XV) indica o domínio do BoK e o capítulo onde o tema é desenvolvido.
Verifique sempre as condições atuais do exame na fonte oficial da ASQ antes de se inscrever —
número de questões, duração e elegibilidade mudam periodicamente.

**Três níveis de domínio estatístico** organizam a progressão do manual:

<div class="kpi-row">
<div class="kpi ok"><div class="kpi-k">Nível 1 · Engineer</div><div class="kpi-v">Fundamentos</div><div class="kpi-s">métricas básicas, escolha do teste certo, gráficos e SPC</div></div>
<div class="kpi warn"><div class="kpi-k">Nível 2 · Advanced Quality</div><div class="kpi-v">Aplicação</div><div class="kpi-s">desenho de estudos, ANOVA, DOE, capability, MSA, amostragem, regressão</div></div>
<div class="kpi bad"><div class="kpi-k">Nível 3 · Data Scientist</div><div class="kpi-v">Modelação</div><div class="kpi-s">causal, bootstrap, GLM, mistos, séries temporais, Bayes, incerteza</div></div>
</div>

Regra pedagógica: não se salta para machine learning antes de dominar desenho do estudo,
qualidade da medição, amostragem e inferência — um modelo sofisticado sobre dados enviesados
continua sendo uma análise ruim.

---

## Estado das normas citadas *(verificado em 20 de agosto de 2026)*

| Norma | Estado |
|---|---|
| ISO 9001:2015 + Amd 1:2024 | Vigente; 6ª edição prevista para setembro de 2026 |
| ISO 19011:2026 | 4ª edição (maio/2026); substitui a de 2018 |
| ISO 10012:2026 | 2ª edição (fevereiro/2026); substitui a de 2003 |
| ISO/IEC 42001:2023 · ISO/IEC 23894:2023 | Gestão e risco de IA; vigentes |
| ISO 2859-1:2026 | 3ª edição (janeiro/2026); introduz *skip-lot*. Não existe "ISO 2859-1:2016" |
| ISO 31000:2018 / IEC 31010:2019 / ISO 31073:2022 | Princípios / técnicas / vocabulário de risco; nenhuma é certificável |
| ISO 22301:2019 · ISO 22000:2018 | Continuidade de negócio · segurança alimentar; vigentes |
| FSSC 22000 | V7 introduzida em 2026 — confirmar versão exigida pelo cliente |
| Regulamento (UE) 2024/1689 — AI Act | Em vigor desde 08/2024; regra geral (alto risco Anexo III) a partir de 02/08/2026 (Cap. 152) |
| AIAG Core Tools | APQP 3ª ed. (2024) · Control Plan 1ª ed. (2024) · FMEA Handbook AIAG&amp;VDA · SPC Manual 1ª ed. (2026) |

> Nunca cite um requisito normativo a partir deste manual num documento oficial sem confirmar a
> edição em vigor na fonte primária.

---

## Matriz de escolha de ferramenta

A ferramenta de visualização não é a ferramenta de inferência:

| Tipo de decisão | Excel | Power BI | Minitab | R | Python | SQL |
|---|---|---|---|---|---|---|
| KPI e reporte periódico | 🟢 | 🟢 | 🔴 | 🟡 | 🟡 | 🟡 |
| Dashboard e drill-down | 🟡 | 🟢 | 🔴 | 🟡 | 🟡 | 🔴 |
| Cartas de controlo de rotina | 🟡 | 🟡 | 🟢 | 🟢 | 🟢 | 🔴 |
| Capability para o cliente | 🔴 | 🔴 | 🟢 | 🟢 | 🟢 | 🔴 |
| MSA / Gage R&amp;R | 🔴 | 🔴 | 🟢 | 🟢 | 🟢 | 🔴 |
| Testes de hipóteses e ANOVA | 🟡 | 🔴 | 🟢 | 🟢 | 🟢 | 🔴 |
| DOE | 🔴 | 🔴 | 🟢 | 🟢 | 🟢 | 🔴 |
| Modelação avançada | 🔴 | 🔴 | 🟡 | 🟢 | 🟢 | 🔴 |
| Machine learning | 🔴 | 🟡 | 🟡 | 🟢 | 🟢 | 🔴 |
| Extração e junção de dados | 🔴 | 🟡 | 🔴 | 🟡 | 🟢 | 🟢 |

🟢 adequado · 🟡 possível com limitações · 🔴 inadequado

---

## Índice navegável
