# Auditoria Técnica Integral — Fase 2

**Projeto:** Quality Engineering Academy  
**Data:** 03/09/2026  
**Escopo:** formação e treinamento de engenheiros em Engenharia da Qualidade, Lean Manufacturing, Six Sigma, Estatística, Engenharia de Dados, Data Analytics, Data Science, Confiabilidade e Risk Engineering.

## 1. Veredito executivo

**Estado:** NÃO APROVADO AINDA PARA CLASSIFICAÇÃO "Pronto para Formação Profissional de Engenheiros".

A arquitetura curricular é forte e o projeto apresenta maturidade muito superior à de um e-book/tutorial convencional. A Fase 2, porém, encontrou defeitos que precisam ser tratados porque afetam diretamente a confiabilidade pedagógica, a execução dos exemplos e a reprodutibilidade do material.

### Classificação global

| Dimensão | Nota | Estado |
|---|---:|---|
| Engenharia da Qualidade | 9,0/10 | Aprovado com correções pontuais |
| Lean / Six Sigma | 9,0/10 | Aprovado com correções pontuais |
| Estatística / DOE | 8,5/10 | Forte; elevar rigor em hipóteses e interpretação |
| Confiabilidade / Manutenção | 7,5/10 | Requer correções conceituais |
| Data Engineering / Analytics | 8,0/10 | Forte para formação aplicada; falta camada de produção |
| Data Science / ML | 8,0/10 | Forte; reforçar validação e model risk |
| Pedagogia de Engenharia | 7,5/10 | Conteúdo excelente, avaliação ainda pouco analítica |
| Software / Build | 7,0/10 | Existem defeitos de pipeline e CI |
| Rastreabilidade | 8,5/10 | Boa, mas documentação de auditoria precisa acompanhar o código |
| Normativo 2026 | 7,5/10 | Vários pontos atualizados; AI Act exigia correção |

**Nota global indicativa: 8,1/10.**

A nota não deve ser interpretada como certificação. É uma classificação interna de maturidade do projeto.

---

## 2. Evidências estruturais verificadas

Foram verificados, no artefato entregue:

- 182 capítulos no manifesto;
- 62 módulos;
- 6 trilhas;
- 119 questões;
- 60 questões CQE e 59 CSSBB;
- índice de busca PT e EN com 182 entradas;
- paridade PT/EN aprovada pelo `tools/check_i18n.js`;
- nenhum `chapterRef` do banco apontando para capítulo inexistente;
- nenhum ID duplicado no manifesto;
- 233 blocos de código nos capítulos PT gerados;
- 256 imagens/SVGs nos capítulos PT, excluindo a abertura;
- 21 figuras interativas registradas em `figs.js`;
- 290 blocos `language-python` identificados no site; os blocos iniciados por `%%R` revelaram um problema de classificação na versão EN;
- 18 ficheiros gerados com R contendo markup matemático indevidamente introduzido no código: 9 PT + 9 EN.

O teste `node tools/check_i18n.js` passou integralmente: **182/182 capítulos e 119/119 questões**.

---

# 3. Achados P0 — bloqueadores técnicos

## P0-01 — Parser de matemática pode corromper código R

**Severidade:** CRÍTICA  
**Impacto:** código didático pode deixar de ser executável após o build.

O pipeline aplicava o reconhecimento de `$...$` antes de proteger blocos de código. Como `$` é sintaxe legítima de R (`df$coluna`), partes do código eram interpretadas como matemática.

Foi observado, por exemplo, em capítulos de confiabilidade e séries temporais, código equivalente a:

```r
resumo$Quadrante <- mapply(...)
```

ser transformado em HTML contendo `math-inline` dentro de `language-r`.

**Correção aplicada em `tools/build.py`:**

- blocos fenced são protegidos antes do parser matemático;
- inline code também é protegido;
- matemática só é processada fora de código;
- código é restaurado antes da conversão Markdown.

Também foi adicionada verificação automatizada em `tools/audit_phase2.py`.

**Validação obrigatória pós-build:** executar o build completo e confirmar zero ocorrências de `math-inline`/`math-block` dentro de `language-r`.

---

## P0-02 — Código R na tradução EN podia ser apresentado como Python

**Severidade:** CRÍTICA  
**Impacto:** aluno copia um exemplo R apresentado como Python.

Foram encontrados **38 ocorrências em 24 ficheiros EN** no padrão:

```text
--- python
%%R
```

O gerador interpretava literalmente o primeiro marcador e criava uma aba Python contendo código R.

**Correções aplicadas:**

- as fontes EN foram normalizadas de `--- python + %%R` para `--- r`;
- `codetabs()` passou a reconhecer defensivamente `%%R` mesmo quando o autor classifica o bloco incorretamente;
- o magic `%%R` deixa de ser publicado como parte do código final;
- células R provenientes do notebook também deixam de exibir o magic Jupyter ao aluno.

**Resultado esperado:** código exibido como R deve ser R puro, copiável para um ambiente R.

---

# 4. Achados P1 — alta prioridade

## P1-01 — Referências de capítulos 908–923 ainda existiam

**Severidade:** ALTA  
**Causa:** renumeração dos capítulos extras de 900+ para 154–182 deixou restos editoriais.

Foram encontrados restos como:

- 908 → 162
- 909 → 163
- 910 → 164
- 911 → 165
- 915 → 169
- 916 → 170
- 917 → 171
- 919 → 173
- 920 → 174
- 923 → 177

**Correção aplicada:** todas as referências antigas identificadas foram atualizadas nas fontes EN/PT relevantes.

**Regra permanente:** nenhum número de capítulo fora de 0–182 deve aparecer no conteúdo editorial.

---

## P1-02 — MTBF não deve ser ensinado como se implicasse hazard constante

**Severidade:** ALTA  
**Capítulo:** 166.

A formulação anterior dizia, em essência, que MTBF pressupõe taxa de falha aproximadamente constante e que isso corresponde à distribuição exponencial.

Isso mistura uma **métrica descritiva** com uma **hipótese de modelo**.

Correção conceitual aplicada:

- MTBF é uma média descritiva;
- taxa de falha constante é hipótese/propriedade do modelo exponencial;
- MTBF sozinho não identifica a forma temporal do risco;
- Weibull é necessário quando a decisão depende do comportamento de hazard ao longo da vida.

---

## P1-03 — Disponibilidade inerente não deve ser apresentada como a mesma disponibilidade do OEE

**Severidade:** ALTA  
**Capítulo:** 166.

A fórmula:

`MTBF / (MTBF + MTTR)`

é apropriada para disponibilidade inerente sob as hipóteses e fronteiras temporais definidas.

A disponibilidade do OEE é definida dentro da lógica de tempo de produção planeado/run time. As métricas são relacionadas, mas não devem ser tratadas como sinónimos.

**Correção aplicada no texto.**

---

## P1-04 — RTY: problema não é simplesmente "independência entre estações"

**Severidade:** ALTA  
**Capítulo:** 180.

A versão anterior atribuía ao produto dos FPYs uma pressuposição de independência estatística entre estações.

A correção pedagógica é mais rigorosa: o produto dos FPYs representa a decomposição sequencial da probabilidade de atravessar todas as etapas sem retrabalho quando as definições e populações são consistentes. O risco real está em:

- denominadores incompatíveis;
- loops de retrabalho;
- reinspeção;
- perda de rastreabilidade;
- defeito criado numa estação e detetado noutra;
- definições inconsistentes de first-pass.

**Correção aplicada.**

---

## P1-05 — Benchmark de OEE de 85% precisava de qualificação

**Severidade:** MÉDIA/ALTA  
**Capítulo:** 158.

"85% = World Class" é uma referência histórica muito difundida, mas não deve ser ensinada como limite universal de desempenho.

**Correção aplicada:** passou a ser descrita como referência histórica de benchmarking, não como fronteira universal.

---

## P1-06 — AI Act estava desatualizado no ponto de alto risco

**Severidade:** CRÍTICA NORMATIVA  
**Capítulo:** 152 e abertura.

O texto anterior colocava os sistemas de alto risco do Anexo III na aplicação geral de 02/08/2026 e Anexo I em 02/08/2027.

Após a alteração do AI Omnibus, o calendário aplicável é:

- aplicação geral: 02/08/2026, sujeito às exceções do Art. 113;
- alto risco do Art. 6(2) / Anexo III: 02/12/2027;
- alto risco incorporado em produtos regulados do Art. 6(1) / Anexo I: 02/08/2028.

Fontes oficiais verificadas na Fase 2: EUR-Lex, texto consolidado do Regulamento 2024/1689 atualizado em 27/07/2026; Comissão Europeia, páginas de aplicação/enforcement atualizadas em julho/agosto de 2026.

**Correção aplicada às fontes PT/EN.**

---

## P1-07 — O projeto não tinha dependências de build formalizadas

`tools/build.py` importa `markdown`; `tools/figures.py` importa `numpy`.

Não existia `requirements.txt`.

**Correção aplicada:** criado `requirements.txt` com Markdown e NumPy.

**Nota:** o ambiente desta auditoria não tinha `markdown` instalado e não permitiu download externo. Portanto, o rebuild completo não pôde ser executado nesta sessão.

---

## P1-08 — CI não verificava o pipeline completo

O workflow original verificava apenas paridade PT/EN e banco.

**Correção aplicada:** `check.yml` passou também a executar `tools/audit_phase2.py`.

**Ainda recomendado para a próxima fase:** quando a fonte for tornada reproduzível no GitHub, executar também `build.py` no CI e verificar que o conteúdo gerado não sofre drift.

---

## P1-09 — `manual.ipynb` continua fora da reprodução pública

O `.gitignore` contém `manual.ipynb`.

Se o notebook não estiver efetivamente versionado no Git, o repositório público não contém a fonte de conhecimento dos capítulos 1–153, embora o README descreva o notebook como fonte.

Isto viola o princípio de **reprodutibilidade do build**.

**Não removido nesta fase**, porque é uma decisão arquitetural maior. Recomendação: migrar a fonte para `src/content/pt/*.md` e manter notebooks como laboratório.

---

## P1-10 — Banco de questões ainda tem baixo nível de análise

Distribuição atual:

- Understand: 61 (51,3%)
- Apply: 44 (37,0%)
- Analyze: 14 (11,8%)

Para uma Academy de engenheiros, 11,8% em Analyze é baixo.

**Meta recomendada para a próxima rodada:** pelo menos 25–30% combinados em Analyze + Evaluate, sem reduzir excessivamente Apply.

A diferença essencial é sair de:

> "Qual fórmula uso?"

para:

> "Os dados, hipóteses e condições permitem usar essa fórmula para esta decisão de engenharia?"

---

## P1-11 — README tinha contagem de código incorreta

O README dizia 196 blocos de código.

A auditoria dos capítulos PT gerados encontrou **233**.

**Correção aplicada:** README atualizado para 233.

---

# 5. Achados P2 — melhorias editoriais

## P2-01 — Alguns capítulos possuem headings duplicados

Identificados, entre outros:

- `extra/mapeamento_extra.md`
- `i18n/en/cap-155.md`
- `i18n/en/cap-085.md`
- `i18n/en/cap-086.md`

O gerador não apresentou IDs HTML duplicados nos capítulos auditados, mas headings repetidos degradam a navegação e a leitura.

**Recomendação:** substituir títulos genéricos repetidos por títulos semanticamente específicos.

---

## P2-02 — Proveniência das fontes precisa de uma matriz formal

O projeto já declara fontes e cross-checks, mas uma Academy pública precisa distinguir explicitamente:

1. conteúdo autoral;
2. conteúdo resumido/parafraseado;
3. conteúdo derivado de referência;
4. exercício autoral baseado em referência;
5. figura autoral;
6. figura adaptada;
7. conteúdo sob licença.

Recomendação:

```text
source_id
chapter
section
source_type
author
publication
edition
license
adaptation_level
verification_date
```

---

## P2-03 — Arquitetura pedagógica deve evoluir de "capítulos" para "competências demonstráveis"

A próxima evolução deve ser uma matriz:

**Conhece → Calcula → Interpreta → Diagnostica → Decide → Executa → Valida**

Exemplo para SPC:

- escolher carta;
- definir subgrupo racional;
- distinguir causa comum/especial;
- interpretar sinais;
- definir reação;
- validar eficácia;
- atualizar plano de controlo.

---

# 6. Auditoria por domínio

## Engenharia da Qualidade

**Status: FORTE.**

Pontos fortes:

- MSA;
- SPC;
- capability;
- FMEA/risk;
- auditoria;
- CAPA;
- qualidade de fornecedores;
- Core Tools;
- metrologia.

Ponto de melhoria: aumentar casos de decisão e evidência objetiva.

## Lean Manufacturing

**Status: FORTE.**

A sequência Lean → fluxo → DMAIC → OEE → TOC é boa.

Próxima melhoria: integrar Lean com restrição, lead time, WIP, custo e qualidade, evitando transformar OEE ou 5S em objetivos isolados.

## Six Sigma

**Status: FORTE.**

A cobertura é ampla e a sequência DMAIC está bem estruturada.

Principal lacuna: mais situações em que o aluno precisa decidir se uma ferramenta é apropriada antes de aplicá-la.

## Estatística

**Status: FORTE, com necessidade de maior rigor inferencial.**

Prioridades:

- tamanho de efeito;
- intervalos de confiança;
- pressupostos;
- multiplicidade;
- potência;
- practical significance vs statistical significance;
- estimand.

## Confiabilidade / Manutenção

**Status: BOM, mas precisa revisão de linguagem e definições.**

A distinção MTTF/MTBF e Weibull está presente; o Cap. 166 precisava apenas separar métrica de modelo, já corrigido na fonte.

## Data Engineering

**Status: BOM.**

Os capítulos 176–181 são uma boa expansão.

Próxima camada:

- data contracts;
- schema evolution;
- CDC;
- idempotência;
- observabilidade;
- lineage;
- freshness;
- reconciliation;
- SCD;
- incremental loads.

## Data Science / ML

**Status: BOM/AVANÇADO.**

Random Forest, XGBoost, SHAP, TimeSeriesSplit e threshold económico são boas escolhas.

A próxima camada deve enfatizar:

- leakage;
- drift;
- calibration;
- model monitoring;
- model validation;
- model risk;
- threshold stability;
- false-positive/false-negative economics.

---

# 7. Atualização normativa 2026

Verificações oficiais consideradas na Fase 2:

- **ISO 9001:** a ISO ainda identifica ISO 9001:2015 como edição corrente e indica a publicação da nova edição em setembro de 2026; portanto, em 03/09/2026 o texto da Academy deve continuar distinguindo requisito publicado de revisão iminente.
- **ISO 19011:2026:** edição 4, publicada em maio de 2026.
- **ISO 10012:2026:** edição 2, publicada em fevereiro de 2026.
- **ISO 2859-1:2026:** edição 3, publicada em janeiro de 2026.
- **FSSC 22000 V7:** publicada em maio de 2026; auditorias V6 permitidas até 30/04/2027 e upgrade V7 de 01/05/2027 a 30/04/2028.
- **AI Act:** calendário corrigido nesta Fase 2 conforme texto consolidado e Comissão Europeia.

A regra pedagógica deve ser mantida:

> **Uma referência normativa não deve ser ensinada como requisito contratual vigente sem confirmar a edição e a jurisdição na fonte primária.**

---

# 8. Testes executados

### Aprovados

- `node tools/check_i18n.js` → **PASS**
- paridade 182/182 → **PASS**
- banco 119/119 → **PASS**
- rastreabilidade de questões → **PASS**
- chapterRefs existentes → **PASS**
- IDs de capítulos no manifesto → **PASS**
- sintaxe de `tools/build.py` após correção → **PASS**
- sintaxe de `tools/audit_phase2.py` → **PASS**
- sintaxe de `tools/check_i18n.js` → **PASS**
- 6 blocos Python dos extras executados sem erro → **PASS**
- 290 blocos Python/R classificados no site auditados estruturalmente → **PASS com achados de classificação R**

### Não executados integralmente

- `python tools/build.py` → **BLOQUEADO pelo ambiente**, que não tinha o pacote `markdown` instalado e não permitiu instalação via rede.
- `node tools/check.js` → não executado, pois `playwright` não está instalado.
- `node tools/check2.js` → não executado, pelo mesmo motivo.
- Validação R em ambiente R real → não executada.

Isto é uma limitação da infraestrutura desta sessão, não uma aprovação do build completo.

---

# 9. Correções realizadas nesta Fase 2

1. Proteção de fenced code/inline code contra parser matemático.
2. Normalização de blocos R na tradução EN.
3. Remoção de `%%R` da apresentação final do código.
4. Correção das referências 908–923 remanescentes.
5. Correção conceitual de MTBF.
6. Separação de disponibilidade inerente e disponibilidade OEE.
7. Correção conceitual de RTY.
8. Qualificação do benchmark de OEE 85%.
9. Atualização do AI Act.
10. Atualização do README para 233 blocos de código.
11. Criação de `requirements.txt`.
12. Criação de `tools/audit_phase2.py`.
13. Integração da auditoria estática no CI.

---

# 10. Critério de saída da Fase 2

O projeto poderá avançar para **"Aprovado para Formação de Engenheiros — Release Candidate"** quando os seguintes pontos forem fechados:

- [ ] rebuild completo em ambiente limpo;
- [ ] zero R code com markup matemático;
- [ ] zero R code rotulado como Python;
- [ ] validação R real;
- [ ] Playwright `check.js` e `check2.js` aprovados;
- [ ] fonte pública reproduzível sem depender de arquivo ignorado;
- [ ] matriz de proveniência/licenciamento concluída;
- [ ] banco de questões expandido em Analyze/Evaluate;
- [ ] headings duplicados corrigidos;
- [ ] domínio definitivo substituído nos metadados SEO.

## Veredito final da Fase 2

**CONDIÇÃO: APROVADO PARA CONTINUAR DESENVOLVIMENTO, NÃO PARA RELEASE FINAL.**

A base técnica é suficientemente forte para justificar uma terceira fase. A prioridade agora não é adicionar mais 50 capítulos; é aumentar a **confiabilidade do que já existe**.

A próxima fase ideal é uma **Fase 3 — Validação de Engenharia e Release Candidate**, concentrada em execução real dos exemplos, revisão estatística capítulo a capítulo, QA visual, rastreabilidade normativa, licenciamento e avaliação pedagógica por competência.
