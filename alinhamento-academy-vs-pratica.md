# Alinhamento de Conteúdo — Quality Engineering Academy vs. Manufacturing Performance Analytics

**Data da análise:** 2026-09-01
**Autor:** Análise assistida (Claude Code), a pedido da mantenedora do projeto
**Status:** Diagnóstico concluído e os 20 itens do plano (Etapa 4/6) **já foram implementados no site** como capítulos `cap-166` a `cap-182` (17 capítulos + módulo novo `lss-15`), em PT e EN, com o `manifest.js` atualizado. **O projeto prático `manufacturing-performance-analytics` não foi alterado** (nem deveria ser — o diagnóstico é unidirecional, da prática para o currículo). Nota de manutenção: estes 17 capítulos existem hoje só como ficheiros já compilados em `site/content/`, sem fonte em `extra/*.md`, `i18n/en/` ou `manual.ipynb` — ver aviso em `README.md` antes de rodar `tools/build.py`.

## Metodologia

1. Inventário completo do projeto prático `manufacturing-performance-analytics` (notebook de 8410 linhas, 4 módulos de biblioteca Python, testes, docs, dependências) — leitura integral, sem qualquer modificação.
2. Inventário completo do currículo `quality-engineering-academy/site` a partir do `content/manifest.js` (5 tracks, ~110 módulos, 150+ capítulos), com verificação de profundidade real por amostragem de ~20 capítulos técnicos.
3. Cruzamento dos dois inventários item a item, classificando cada técnica/conceito do projeto prático como ✅ Coberto, ⚠️ Parcial ou ❌ Não coberto.
4. Verificação de sequenciamento: a ordem em que o currículo ensina cada tópico é compatível com a ordem em que o projeto prático o exige?
5. Plano de correção por item, respeitando a estrutura pedagógica existente (tracks → módulos → capítulos, com o padrão já usado de capítulos "extra" `cap-9xx` para complementar módulos antigos).

Os inventários brutos (mais granulares que este relatório) ficam disponíveis em:
- `manufacturing_inventory.md` (~127 itens catalogados no projeto prático)
- `academy_inventory.md` (currículo completo da Academy, módulo a módulo)

---

## Etapa 3 — Matriz de cobertura (gap analysis)

Legenda de nível exigido pelo projeto: **B**=básico, **I**=intermediário, **A**=avançado.

### ✅ Coberto adequadamente

| Item do projeto prático | Onde aparece no projeto | Nível exigido | Onde é ensinado na Academy |
|---|---|---|---|
| SIPOC | Notebook Parte 0 | B | eq-02 (cap-005) |
| Pareto (regra 80/20) | `stats_lib.pareto_chart`; usado 5x no notebook | B | eq-03 (cap-009) |
| 5 Porquês | Notebook 7.4 | B/I | eq-03 (cap-009, 906) |
| CAPA | Notebook 6.2, 6.8, 9.1b | I | eq-03 (cap-906) |
| Desvio padrão / estatística descritiva | Uso difuso | B | eq-03 (cap-008) |
| Cartas de controle X-barra/R, subgrupo racional | `stats_lib.plot_xbar_chart`; Notebook 5.1, 5.11 | I | eq-08 (cap-065-068) |
| Cp/Cpk/Pp/Ppk/Cpm, nível sigma | `etl_lib.compute_process_capability`; Notebook 5.3 | A | eq-10 (cap-071,072,902) — com código Python |
| FMEA/FMECA/RPN | Notebook 9.1 (M-SOP-007) | A | eq-11 (cap-080-086) |
| Amostragem de aceitação, AQL, Ac=0 | Notebook 5.9 | A | eq-07 (cap-062-064) + lab-08 (cap-141,142, ISO 2859-1) |
| Project Charter, CTQ | Notebook Parte 3B (BQ-072) | I | lss-08 (cap-034) |
| CoQ/COPQ (4 categorias) | Notebook Parte 3B, 6.3 | I | eq-02 (cap-007) |
| OEE, TPM/Six Big Losses | `etl_lib.compute_oee_components/six_big_losses`; Notebook Parte 4 | I/A | lss-04 (cap-024,025,026,904) |
| SMED, Poka-yoke, Jidoka | Notebook 4.15, 9.1d, 9.1e | I/A | lss-04 (cap-024,026) |
| VSM, Lei de Little, Takt time | Notebook 4.14, 4.14b, 4.11 | I | lss-02 (cap-019,020), lss-05 (cap-040,027) |
| Superprodução, NVA | Notebook 4.12, 4.8b | B/I | lss-01 (cap-017,018,905) |
| DMAIC completo (D-M-A-I-C) | Notebook Parte 8 | A | lss-08 a lss-12 (cap-034 a 038) |
| Regressão logística | `ml_lib.tune_classification_models`; Notebook Parte 11 | I | est-06 (cap-052) e qa-05 (cap-111) |
| Feature engineering anti-vazamento / auditoria de leakage | Notebook 10.6, 11.1-11.3 (BQ-079) | A | qa-05 (cap-111) — é literalmente a armadilha demonstrada no capítulo |
| Bootstrap (intervalo de confiança) | Notebook 5.7 | A | lab-02 (cap-135) |
| Múltiplos testes de hipótese / FDR | Notebook 12.0b | A | lab-02 (cap-135) |
| Pseudorreplicação | Notebook 6.8 (CAPA vs NC) | A | lab-01 (cap-134) — competência nomeada literalmente |
| Weibull (conceito, forma β) | Notebook 4.6b, 9.4 | A | est-02 (cap-047) nível básico, aprofundado em lab-06 (cap-139) |
| DOE fatorial, Pareto de efeitos | Notebook 9.3 | A | est-08 (cap-073,074,911) |
| Scorecard de fornecedor | Notebook 6.1, 6.4 | I | eq-14 (cap-099-101, gestão de fornecedores) |

### ⚠️ Coberto parcialmente (nível mais raso, ou conceito disperso/não amarrado ao contexto de uso)

| Item do projeto prático | Onde aparece | Nível exigido | O que a Academy ensina hoje | Gap específico |
|---|---|---|---|---|
| Regras de sequência de carta de controle (Western Electric, 4 zonas) | `stats_lib.apply_western_electric_rules`; Notebook 5.2 | A | eq-08/09 ensina "regras de Nelson" (superset relacionado, mas com numeração/critérios diferentes) | Western Electric não é nomeado explicitamente; aluno que só viu Nelson pode não reconhecer a implementação do projeto |
| ANOVA com blocking para isolar confundimento (efeito máquina vs. mix de produto) | Notebook 5.4, 5.20 | A | est-05 ensina ANOVA 1-via; est-08 ensina blocos aleatorizados — mas separadamente, sem ponte | "Confundimento" como conceito nunca é nomeado fora do track LAB (lab-04, causalidade) |
| Gage R&R via ANOVA em Python | Notebook 9.2, 9.2b | A | eq-06 ensina Gage R&R só por método gráfico/manual | Falta implementação em código (statsmodels/scipy) |
| MTBF/MTTR (nível básico/intermediário) | Notebook 4.6, 4.6b | I | Confiabilidade só aparece em eq-13 (nível 3) e lab-06 (nível 3, Kaplan-Meier) | Métricas intermediárias de confiabilidade (MTBF/MTTR simples) não têm degrau — currículo pula do zero direto para avançado |
| Split treino/teste cronológico / validação out-of-sample | `ml_lib.split_by_date`; Notebook 10.1 | I | lab-05 fala de "validação de modelos, calibração e drift" de forma genérica | Não amarrado especificamente a dados temporais/produção |
| Threshold de decisão por custo econômico assimétrico | `ml_lib.economic_threshold`; Notebook Parte 11 | A | lab-05 nomeia "limiar de decisão" como competência | Falta o componente de custo econômico assimétrico FP/FN com código |
| Métricas de classificação sob desbalanceamento de classe | `ml_lib.classification_metrics`; Notebook 11.2 | A | qa-05 cobre "armadilhas" de ML de forma genérica | Precision/Recall/F1/PR-AUC vs. ROC-AUC sob desbalanceamento não é detalhado |
| Teste de proporção de duas amostras (z-test) | `stats_lib.two_sample_proportion_test` | I | est-04 ensina teste de hipóteses genérico (erro I/II, poder) | O teste específico de proporção não é nomeado |
| Modelagem dimensional (fato/dimensão, star schema), arquitetura medalhão | Notebook Parte 3.2/3.3 (22 fatos, 15 dimensões) | I | qa-02 ("Quality 4.0 e arquitetura de dados") é conceitual | Sem exercício hands-on de modelagem dimensional |
| SQL — DDL e views | Notebook Parte 3.1-3.11 | I | qa-03 (cap-107) é o capítulo mais denso em código SQL, mas focado em SELECT/joins/agregação | DDL (CREATE TABLE/VIEW), views parametrizadas não confirmadas no conteúdo |
| Ishikawa nomeado explicitamente | Notebook 7.4 | B | lss-10 (DMAIC Analisar) cobre "causa-raiz, análise gráfica" de forma genérica | Diagrama de Ishikawa provavelmente implícito, não nomeado como ferramenta própria |
| Regra causal vs. associação (rigor de comunicação estatística) | README Seção 13; ao longo do notebook | I | lab-04 (causalidade, DAG, DiD) é o track mais próximo | Não é apresentado como prática de comunicação/redação, só como teoria de inferência causal |

### ❌ Não coberto (gap real)

| Item do projeto prático | Onde aparece | Nível exigido | Observação |
|---|---|---|---|
| Decomposição de sazonalidade nomeada + ARIMA/SARIMA | Notebook 10.4 (`statsmodels`) | A | est-07 cobre autocorrelação/tendência/previsão mas nunca nomeia ARIMA/SARIMA/Prophet nem `seasonal_decompose` |
| Correlação cruzada em diferentes defasagens (lag) | Notebook 10.4b | A | Nenhum capítulo cobre cross-correlation entre séries |
| Indicador antecedente (leading indicator) testado formalmente | Notebook 10.2, 9.1e, 9.5 | I/A | Não coberto |
| Random Forest e XGBoost (regressão e classificação) | `ml_lib.tune_regression_models/tune_classification_models`; Notebook Parte 11 | A | Nenhuma competência do manifest cita modelos de árvore; qa-05 só usa regressão logística |
| Feature importance de modelos de árvore | Notebook Parte 11 | I | Depende do gap acima |
| SHAP (interpretabilidade) | `requirements.txt`; Notebook Parte 11 | A | Não aparece em nenhum capítulo |
| `TimeSeriesSplit` / validação cruzada respeitando ordem cronológica | `ml_lib.tune_*_models` | A | Não coberto |
| Split hierárquico (train/val interno + test externo intocado) | `ml_lib._chrono_inner_split` | A | Não coberto — vai além do que qa-05 demonstra |
| `GridSearchCV` / busca de hiperparâmetros | `ml_lib.tune_*_models` | I/A | Não coberto |
| `class_weight="balanced"` | `ml_lib.tune_classification_models` | I | Não coberto |
| Teste de Bartlett (homogeneidade de variância) | Notebook 5.5 | A | Nenhum capítulo cobre testes de homogeneidade de variância (est-02 cobre testes de aderência à distribuição, que é outra coisa) |
| Taxa de falso alarme empírica de carta de controle (validação por simulação) | Notebook 5.2 | A | Não coberto — nem em eq-09 (SPC avançado) nem em lab-07 (Monte Carlo) |
| FPY / RTY (First Pass Yield / Rolled Throughput Yield) | Notebook 5.17, 5.17b | B/I | Não nomeados em nenhum capítulo do manifest |
| Teoria das Restrições (TOC) — restrição, starvation, exploit/elevate | Notebook 7.7-7.8 | A | Não existe em nenhum track; só citada de forma genérica em "Outros Métodos" (cap-004) sem desenvolvimento |
| Conexão programática a banco de dados (SQLAlchemy, pyodbc), bulk load, scripting T-SQL multi-batch (`GO`) | `db_lib.py` inteiro | A | qa-03 cobre SQL puro (consulta), não acesso via Python/ORM nem operações administrativas |
| Engenharia de pipeline em pandas avançado: `groupby().transform()`, matching de intervalo temporal com desempate, sequenciamento stateful | `etl_lib.py` (várias funções) | A | qa-04 é conceitual (ETL/linhagem), com pouquíssimo código |
| Testes unitários (pytest) para invariantes analíticos | `tests/test_analytics_invariants.py` | I | Não coberto em nenhum lugar — não há conteúdo de testes automatizados de dados/análises |
| Data Quality Scorecard como prática formal | Notebook Parte 2 | I | qa-04 fala de "qualidade dos dados" conceitualmente, sem essa prática específica |

### Não aplicável ao currículo (justificado)

Itens muito específicos do projeto/dataset simulado, não generalizáveis como conceito de ensino:

- Regras de calendário do projeto (semana ISO, cálculo de turno em 3 turnos), construção do `LotId`, rollover de meia-noite — regras de negócio hiper-específicas do dataset simulado.
- `.env`/`python-dotenv`, `pyproject.toml`, Jupytext — packaging/tooling genérico de engenharia de software, não é conteúdo de domínio (qualidade/lean/dados) e já é coberto implicitamente pelo fato de os capítulos técnicos já usarem Python.
- `compare_models`, persistência de modelo via `joblib` — padrões de engenharia de software específicos do projeto, não conceito de domínio a ensinar.
- Índice de Priorização Operacional (ranking composto customizado), Glossário Lean com limites explícitos de escopo — artefatos de comunicação específicos deste projeto.
- Benchmark interno da planta, custo de indisponibilidade (downtime cost) — cálculos de negócio triviais uma vez que CoQ e OEE já são ensinados; não justificam conteúdo dedicado.

---

## Etapa 5 — Sequenciamento

A ordem recomendada de navegação da Academy é **EQ → LSS → EST → QA → LAB** (essa é a ordem dos tracks no manifest, e o track LAB é declarado nível 3 em todos os módulos — pensado como capstone). O projeto prático, porém, **não segue essa progressão linearmente**: ele intercala conteúdo de nível "capstone" (LAB) logo nas primeiras partes da análise. Isso gera 3 inconsistências de sequenciamento reais, independente dos gaps de conteúdo já listados:

1. **Bootstrap (lab-02) e pseudorreplicação (lab-01) aparecem cedo no projeto** (Notebook Partes 5.7 e 6.8 — logo após o SPC básico), mas pedagogicamente pertencem ao track LAB, que a Academy posiciona como o *último* track, após EQ, LSS, EST e QA inteiros. Um aluno que segue a ordem recomendada da Academy chegaria a esses conceitos só muito depois de precisar deles no projeto prático.
   → **Correção:** referenciar/adiantar esses dois capítulos (ou um resumo deles) já perto do módulo eq-09 (SPC avançado) e est-05 (ANOVA), com link cruzado para o conteúdo completo em lab-01/02.

2. **MTBF/MTTR é exigido em nível intermediário logo depois do módulo de OEE/TPM** (lss-04, nível 2), mas a única cobertura de confiabilidade do currículo pula direto para nível avançado (eq-13 e lab-06, ambos nível 3, com Weibull/Kaplan-Meier). Falta um degrau intermediário no ponto exato em que o projeto prático o exige.
   → **Correção:** inserir um capítulo "extra" de nível 2 (MTBF/MTTR básico) próximo a lss-04 ou eq-10, antes do salto para eq-13/lab-06.

3. **Confundimento em ANOVA (est-05/est-08) é exigido em nível avançado logo na Parte 5 do projeto** (SPC avançado), mas o único lugar do currículo que trata desse raciocínio (mistura de confundimento com causalidade) é lab-04, também posicionado como capstone.
   → **Correção:** adicionar uma ponte conceitual curta em est-05 (logo após ANOVA 1-via) explicando confundimento como motivação para blocking, remetendo a est-08 e, para o tratamento causal completo, a lab-04.

Os gaps de ML (Random Forest/XGBoost, TimeSeriesSplit, GridSearchCV) não geram problema de sequenciamento — eles simplesmente não existem em lugar nenhum do currículo, então a ordem é irrelevante até serem criados. Ao criá-los, a posição correta é dentro de qa-05 (ML aplicado), que já vem depois de todo o track EST (regressão/estatística) e antes do track LAB (validação avançada) — ordem coerente com o uso no projeto (Parte 11, depois de todo o SPC/DOE).

---

## Validação com fontes externas (atualização 2026-09-01)

A pedido da mantenedora, cada posicionamento proposto foi confrontado com as melhores fontes disponíveis (normas de indústria, livros-texto de referência e documentação oficial das bibliotecas usadas no projeto prático). A pesquisa foi feita em 4 frentes paralelas e mudou a posição, o escopo ou a prioridade de **13 dos 17 itens originais**. O achado mais relevante: o item P9 (Gage R&R) não é apenas um "gap" — o **método hoje ensinado na Academy (gráfico/manual) é tratado pela própria norma da indústria automotiva (AIAG MSA, 4ª edição) como método legado**, superado pelo método ANOVA que o projeto prático já usa. Isso eleva P9 de prioridade Média para Alta.

O plano abaixo (Etapa 4 e Etapa 6) já incorpora todos os ajustes. Os relatórios de pesquisa completos, com citação de fonte por item, ficam disponíveis em:
- `research_bloco1_spc_confiabilidade.md` (P1, P2, P3, P9, P13, P16 — fontes: Western Electric Handbook 1956, Nelson JQT 1984, ASQ CRE BoK, Montgomery *Design and Analysis of Experiments*, AIAG MSA 4ª ed., NIST/SEMATECH e-Handbook)
- `research_bloco2_ml.md` (P4, P5, P6, P7 — fontes: scikit-learn User Guide, *Applied Predictive Modeling* de Kuhn & Johnson, *An Introduction to Statistical Learning*, documentação SHAP, MachineLearningMastery)
- `research_bloco3_series_temporais.md` (P8 — fonte: Hyndman & Athanasopoulos, *Forecasting: Principles and Practice* 3ª ed., documentação statsmodels)
- `research_bloco4_dados_toc.md` (P10, P11, P12, P14, P15, P17 — fontes: Kimball & Ross *The Data Warehouse Toolkit*, documentação Databricks sobre arquitetura medalhão, SQLAlchemy/pyodbc, ASQ CSSYB/CSSGB BoK, Eliyahu Goldratt *The Goal*, literatura "TLS Continuum")

---

## Etapa 4 — Plano de correção (ajustado com fontes externas)

Seguindo o padrão já estabelecido na Academy de adicionar capítulos "extra" (`cap-9xx`) a módulos existentes — usado 11 vezes no currículo atual — a maioria das correções deve ser feita por **extensão de módulos existentes**, não por módulos novos. Uma única exceção justificada (Teoria das Restrições) é proposta como módulo novo.

### Bloco 1 — Ponte estatística (resolve os 3 gaps de sequenciamento, prioridade alta)

**P1. Subseção curta em eq-09 (cap-069) — "Regras de Western Electric ↔ Regras de Nelson"** *(escopo reduzido pela pesquisa)*
- **Fonte:** Western Electric SQC Handbook (1956); Nelson, *JQT* v.16 n.4 (1984). As regras de Nelson **não são um sistema independente** — 7 das 8 regras vêm diretamente do manual de 1956; Nelson só adicionou regras e reequilibrou probabilidades. eq-09 já ensina o conteúdo técnico das 4 regras de zona sob o nome "Nelson" — o gap real é só de **nomenclatura**, não de conceito.
- Conteúdo: tabela de correspondência histórica Western Electric ↔ número da regra de Nelson, deixando claro que o código do projeto (`apply_western_electric_rules`) usa a nomenclatura mais antiga para o mesmo fenômeno.
- **Não precisa ser capítulo `cap-9xx` inteiro** — cabe como subseção dentro do cap-069 existente.

**P2. Capítulo de abertura (nível 2) em eq-13 — "MTBF, MTTR e indicadores básicos de confiabilidade"** *(módulo ajustado de lss-04 para eq-13)*
- **Fonte:** ASQ Certified Reliability Engineer (CRE) BoK — trata MTBF/MTTR como termos fundacionais de confiabilidade (módulo "Reliability Modeling and Predictions"), separados e anteriores à modelagem por distribuições (Weibull). Tematicamente pertence a eq-13 (o módulo de confiabilidade da Academy), não a lss-04 (TPM/OEE).
- Tópicos: definição de MTBF/MTTR, matriz de criticidade MTBF×MTTR, diferença para a confiabilidade de Weibull (que já abre eq-13/lab-06 em nível 3).
- Exercício: calcular MTBF/MTTR a partir de um log de paradas e classificar equipamentos em uma matriz de criticidade.
- Manter referência cruzada curta em lss-04 ("para aprofundar MTBF/MTTR, ver eq-13") já que o projeto usa a métrica logo após OEE.

**P3. Extra em est-05 — "Confundimento: por que a ANOVA sozinha pode enganar"** *(posição confirmada, conteúdo enriquecido)*
- **Fonte:** Montgomery, *Design and Analysis of Experiments*, Cap. 7. A pesquisa revelou uma nuance importante: "confounding" tem **dois sentidos técnicos distintos** — (1) confundimento de delineamento experimental (Montgomery, efeito confundido deliberadamente com bloco em fatorial fracionado — sentido de est-09) e (2) confundimento observacional (variável latente em dados não-experimentais — sentido causal/epidemiológico, o que o projeto realmente usa, tratado em profundidade em lab-04).
- O capítulo extra deve funcionar como **hub que distingue os dois sentidos explicitamente** e aponta cada um para o módulo correto (est-09 para o sentido de DOE, lab-04 para o sentido causal) — sem essa distinção, o aluno que só viu "confounding" em est-09 pode se confundir ao encontrar o termo usado de forma diferente no projeto.
- Exercício: dataset onde duas variáveis estão confundidas (sentido observacional); mostrar que a conclusão muda ao controlar pela segunda variável.

### Bloco 2 — Machine Learning aplicado (prioridade alta — maior volume de gaps ❌; **ordem interna corrigida pela pesquisa**)

A ordem originalmente proposta (árvores → validação → métricas → SHAP) foi invertida pela pesquisa: ISLR e *Applied Predictive Modeling* (Kuhn & Johnson) tratam resampling/validação e métricas como **pré-requisito formal antes de qualquer capítulo de modelo específico** — "cornerstone concepts that should be well understood before attempting to model any data" (Kuhn & Johnson). A ordem final dentro de qa-05 é:

**P6 (1º). Extra em qa-05 — "Métricas de classificação sob desbalanceamento e threshold de decisão econômico"**
- Estende diretamente o cap-111 já existente (regressão logística), sem precisar de modelo novo — por isso vem primeiro.
- Tópicos: Precision/Recall/F1/PR-AUC vs. Accuracy/ROC-AUC sob desbalanceamento; `class_weight="balanced"`; threshold por custo assimétrico FP/FN (ligar com "limiar de decisão" já citado em lab-05). Ordem interna confirmada pela fonte (MachineLearningMastery, threshold-moving): métrica certa antes de threshold.
- Exercício: dado um problema com 5-10% de classe positiva, mostrar como Accuracy engana e como escolher o threshold ótimo por custo.

**P5 (2º). Extra em qa-05 — "Validação cruzada temporal e busca de hiperparâmetros"**
- **Fonte:** confirmado como técnica de metodologia de validação (scikit-learn User Guide, seção "Model Selection"), não de modelagem de série temporal — por isso permanece em qa-05, não migra para est-07.
- Tópicos: por que split aleatório vaza informação temporal; `TimeSeriesSplit`; divisão hierárquica (treino/val interna/teste externo intocado); `GridSearchCV`.
- Exercício: comparar `TimeSeriesSplit` com split aleatório no mesmo dataset, mostrando o viés otimista do split aleatório.

**P4 (3º). Extra em qa-05 — "Modelos de árvore: Random Forest e Gradient Boosting (XGBoost)"**
- Agora vem depois de já saber validar e avaliar corretamente (P6, P5) — evita o erro metodológico de treinar modelos sem saber julgar se o resultado é confiável.
- Tópicos: quando preferir árvores a modelos lineares; hiperparâmetros-chave; feature importance nativa; risco de overfitting; comparação com baseline linear (Ridge/regressão logística de est-06).
- Exercício: treinar RF e XGBoost, comparar com o modelo linear usando as métricas e a validação já ensinadas nos capítulos anteriores.

**P7 (4º). Extra em qa-05 — "Interpretabilidade com SHAP"**
- **Fonte:** documentação SHAP — o `TreeExplainer` exige um modelo de árvore já treinado; por isso obrigatoriamente vem depois de P4.
- Tópicos: intuição de valores de Shapley, gráfico summary, comparação com feature importance de árvore, cuidado para não interpretar SHAP como causalidade.

### Bloco 3 — Séries temporais (**dividido em 2 capítulos pela pesquisa**, prioridade alta para o primeiro)

**P8a. Extra em est-07, logo após cap-055 — "Decomposição sazonal e modelos ARIMA/SARIMA"**
- **Fonte:** Hyndman & Athanasopoulos, *Forecasting: Principles and Practice* (3ª ed.) — ordem canônica: gráficos/ACF → decomposição (Cap. 3) → suavização exponencial → **ARIMA (Cap. 9)**, sempre depois da análise exploratória. `statsmodels` usa `seasonal_decompose` como etapa exploratória antes de `SARIMAX` do mesmo jeito.
- Tópicos, nessa ordem: decomposição (STL/clássica) → estacionariedade/diferenciação → ARIMA → SARIMA.
- Peso técnico comparável a cap-907/cap-910 — capítulo extra denso e autônomo.

**P8b. Extra em est-07, posicionado após cap-907/cap-910 — "Correlação cruzada e indicadores antecedentes"**
- **Fonte:** mesma referência — FPP3 trata cross-correlation e séries relacionadas (VAR, Cap. 12) como tópico avançado de análise **multivariada**, bem depois do ARIMA univariado. Por isso vira capítulo separado, não uma seção do P8a.
- Tópicos: lag features vs. média móvel, indicador antecedente testado formalmente, correlação cruzada entre duas séries em diferentes defasagens.

### Bloco 4 — Engenharia de dados / SQL (**posições ajustadas pela pesquisa**)

**P9. Extra em eq-06 — "Gage R&R via ANOVA em Python"** — ⚠️ **prioridade elevada de Média para Alta**
- **Fonte:** AIAG *Measurement Systems Analysis* (MSA), 4ª edição. O manual recomenda **ANOVA como método primário**, não o método gráfico/Average-and-Range hoje ensinado em eq-06 — o método Range é descrito na literatura como técnica legada (criada só por falta de computador). O projeto prático, ao usar ANOVA, já está alinhado com a prática atual da indústria; é a Academy que está desatualizada neste ponto.
- Ação recomendada: reordenar eq-06 para apresentar **ANOVA como método primário/recomendado**, mantendo o método gráfico só como contexto histórico.
- Tópicos: ANOVA de 2 fatores para R&R, interpretação de %R&R, como um R&R ruim contamina a leitura de Cpk (ligação com eq-10).

**P10. Extra em qa-03 (ajustado de "qa-03 ou qa-04" para qa-03 apenas) — "Conectando Python a bancos de dados: SQLAlchemy, pyodbc e carga em massa"**
- **Fonte:** práticas confirmadas pela própria comunidade SQLAlchemy/pyodbc (`fast_executemany` via event listener é a técnica padrão recomendada, não escolha idiossincrática do projeto).
- Posição: extensão natural de qa-03 (SQL denso) — "agora que você sabe escrever a query, como uma aplicação Python a executa em produção, inclusive em volume" — não é tópico de governança/arquitetura (qa-04).
- Tópicos: engine SQLAlchemy, autenticação, `fast_executemany`/bulk load, criação condicional de banco fora de transação, execução de script multi-batch (`GO`).

**P11a. Extra em qa-04 — "Modelagem dimensional: fato, dimensão e star schema" (Kimball)** *(dividido em 2 capítulos pela pesquisa)*
- **Fonte:** Kimball & Ross, *The Data Warehouse Toolkit* (3ª ed.) — a referência canônica e mais antiga (1996). Deve vir primeiro por ser o fundamento mais estável.

**P11b. Extra em qa-04, após P11a — "Arquitetura medalhão: bronze, silver, gold" (Databricks)**
- **Fonte:** documentação Databricks — padrão mais recente (~2019-2020), conceitualmente diferente (estágios de refinamento de pipeline, não esquema de tabelas). Referenciar P11a explicitamente ("as dimensões/fatos do capítulo anterior tipicamente vivem na camada gold").

**P12. Extra em qa-04 — "Engenharia de pipeline em pandas: `groupby().transform()`, matching de intervalos e sequenciamento stateful"** *(confirmado, conteúdo ajustado)*
- **Fonte:** documentação pandas trata `.groupby()` explicitamente como o análogo de `PARTITION BY` do SQL — ponte pedagógica natural com qa-03/P10 (SQL já ensinado). O capítulo deve abrir com essa ponte explícita.
- Tópicos: quando um loop é necessário em vez de vetorização; preenchimento de lacunas por grupo; casamento de evento a janela temporal com desempate; Data Quality Scorecard como prática formal.

**P13. Extra em est-05 (posição fixada — descartada a opção qa-04) — "Teste de Bartlett e homogeneidade de variância"**
- **Fonte:** NIST/SEMATECH e-Handbook — Bartlett é teste de **verificação de pressuposto da ANOVA** (variâncias iguais entre grupos), não teste de aderência à distribuição (que é o que est-02 já cobre). Pertence tematicamente a est-05, não a qa-04.
- Tópicos: diferença entre testar médias (ANOVA) e testar variâncias (Bartlett/Levene); por que variabilidade de operador pode ser um problema mesmo sem diferença de média.

**P14. Extra em eq-10 (escopo ampliado de "nota sobre FPY/RTY" para cluster completo) — "Métricas de rendimento Six Sigma: DPU, DPMO, sigma, FPY/FTY e RTY"**
- **Fonte:** ASQ Certified Six Sigma Yellow Belt e Green Belt BoK tratam **DPU, DPMO, FPY/FTY, RTY, nível sigma e COPQ como um cluster único**, sempre ensinados juntos, nunca em capítulos separados. A pesquisa revelou que DPU/DPMO também não constam nomeados nas competências do manifest — o gap é maior do que só FPY/RTY.
- Tópicos, na ordem da literatura ASQ: DPU → DPMO → nível sigma (já parcialmente coberto em eq-10) → FPY/FTY → RTY.

**P15. Extra em qa-04 (confirmado) — "Testes automatizados de pipeline: da lógica pytest ao dbt tests/Great Expectations"**
- **Fonte:** dbt tests responde "a transformação funcionou?" (equivalente aos testes pytest do projeto validando invariantes como "Performance/OEE ≤ 1"); Great Expectations responde "o dado é bom o suficiente?" (mais próximo do Data Quality Scorecard, já coberto em P12). Ambas pertencem ao mesmo domínio conceitual de qa-04.
- Nomear o capítulo citando o vocabulário da indústria (dbt tests/Great Expectations), mesmo ensinando pytest, para o aluno reconhecer o padrão em outras ferramentas.

**P16. Dividido em 2 partes — "Taxa de falso alarme / Average Run Length (ARL) de uma carta de controle"**
- **Fonte:** Montgomery, *Introduction to Statistical Quality Control*. Para uma carta Shewhart padrão com uma única regra, o ARL tem **fórmula fechada** (ARL₀ = 1/α ≈ 370 para 3σ) — não precisa de simulação. Monte Carlo só é necessário quando **múltiplas regras são combinadas** (o caso do projeto, que aplica as regras de zona simultaneamente) ou há autocorrelação.
- **P16a** (fórmula fechada) → extensão de eq-09, junto com P1 (regras combinadas).
- **P16b** (validação por simulação quando regras se combinam) → lab-07 (Monte Carlo), com link cruzado explícito a partir de eq-09.

### Bloco 5 — Novo módulo (única exceção ao padrão de extensão)

**P17. Novo módulo lss-15 — "Teoria das Restrições (TOC)"** *(confirmado, com ajuste de enquadramento)*
- **Fonte:** Eliyahu Goldratt, *The Goal* (1984); Theory of Constraints Institute; literatura do "TLS Continuum" (Theory of Constraints + Lean + Six Sigma), que trata os três como **paradigmas complementares e operacionalmente distintos** — TOC tolera inventário no ponto certo para maximizar throughput, enquanto Lean busca eliminar desperdício e minimizar inventário em toda parte. Confirma que TOC não é sub-técnica de Lean.
- Posição: `lss-15`, ao final do track LSS (o track já concentra "paradigmas de melhoria de processo").
- **Ajuste de enquadramento:** o capítulo deve abrir **contrastando explicitamente TOC com Lean** (não apresentá-la como "mais uma ferramenta Lean"), para evitar a leitura errada de subordinação.
- Tópicos: os 5 Focusing Steps (Identificar, Explorar, Subordinar, Elevar, Repetir), tambor-pulmão-corda, medidas de Throughput/Inventory/Operating Expense, diferença entre "candidato a restrição" e restrição comprovada (ecoando o rigor metodológico do próprio projeto).
- Exercício: identificar o candidato a gargalo em uma linha de produção simulada e propor uma ação de "elevar" a restrição.

---

## Etapa 6 — Lista priorizada de ações (ajustada com fontes externas)

Ordem de execução recomendada — itens de sequenciamento crítico primeiro, depois o bloco de ML na ordem pedagógica corrigida pela pesquisa, depois os demais:

### Prioridade Alta
1. **P3** — Extra em est-05: confundimento em ANOVA, com distinção observacional vs. delineamento (pré-requisito conceitual, resolve gap de sequenciamento)
2. **P2** — Capítulo de abertura em eq-13: MTBF/MTTR nível 2 (resolve gap de sequenciamento)
3. **P9** — Extra em eq-06: Gage R&R via ANOVA em Python — **elevado de Média para Alta**: a norma AIAG MSA 4ª ed. trata o método atualmente ensinado como legado
4. **P6** — Extra em qa-05: métricas de classificação sob desbalanceamento + threshold econômico (1º do bloco ML, ordem corrigida)
5. **P5** — Extra em qa-05: TimeSeriesSplit e GridSearchCV (2º do bloco ML)
6. **P4** — Extra em qa-05: Random Forest e XGBoost (3º do bloco ML, maior gap em volume de uso no projeto)
7. **P8a** — Extra em est-07: decomposição sazonal + ARIMA/SARIMA (núcleo do bloco de séries temporais)
8. **P17** — Novo módulo lss-15: Teoria das Restrições

### Prioridade Média
9. **P7** — Extra em qa-05: SHAP (4º/último do bloco ML, depende de P4)
10. **P1** — Subseção em eq-09: Western Electric ↔ Nelson — **escopo reduzido** de capítulo para subseção curta
11. **P16a** — Extra em eq-09: fórmula fechada de ARL (junto com P1)
12. **P12** — Extra em qa-04: engenharia de pipeline em pandas, com ponte explícita a SQL
13. **P10** — Extra em qa-03 (não mais qa-04): SQLAlchemy, pyodbc, bulk load
14. **P11a** — Extra em qa-04: modelagem dimensional (Kimball)
15. **P14** — Extra em eq-10: cluster DPU/DPMO/sigma/FPY/RTY — **escopo ampliado**
16. **P13** — Extra em est-05 (posição fixada): teste de Bartlett

### Prioridade Baixa
17. **P11b** — Extra em qa-04, após P11a: arquitetura medalhão (Databricks)
18. **P8b** — Extra em est-07, após P8a: correlação cruzada e indicadores antecedentes
19. **P16b** — Extra em lab-07: validação por Monte Carlo da taxa de falso alarme (link a partir de eq-09/P16a)
20. **P15** — Extra em qa-04: testes automatizados (pytest/dbt tests/Great Expectations) para pipelines de dados

---

## Próximos passos

**Atualização 2026-09-01:** os itens 1, 2 e 4 abaixo foram decididos e implementados — os 20 itens do plano (P1 a P17, com P8 e P11 divididos em 2 capítulos cada) viraram os capítulos `cap-166` a `cap-182` mais o módulo novo `lss-15`, na ordem de prioridade da Etapa 6, em PT e EN. O item 3 continua **em aberto**:

3. **Ainda pendente** — a decisão de **reordenar/atualizar o conteúdo já existente em eq-06** (`cap-061`, Gage R&R gráfico/manual) para dar preferência ao método ANOVA. O que foi feito até agora é só a adição do capítulo suplementar `cap-175` ("Gage R&R por ANOVA") — o `cap-061` original não foi reescrito, então o site ainda apresenta o método legado como se fosse o principal, com o método ANOVA recomendado pela norma aparecendo só depois, num capítulo à parte. Decidir isto continua sendo necessário porque é uma mudança de conteúdo já publicado, não só uma adição.

Nota de manutenção separada (não faz parte da decisão editorial acima): os capítulos 166–182 existem hoje só como ficheiros compilados em `site/content/` — não têm fonte em `extra/*.md`, `i18n/en/` nem no `manual.ipynb`. Ver aviso em `README.md` antes de rodar `tools/build.py`, que reconstruiria o site a partir dessas fontes e apagaria esses 17 capítulos por não os conhecer.
