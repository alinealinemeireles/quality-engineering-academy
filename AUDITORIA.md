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
| Diagrama de esparguete (*spaghetti*) | ausente | Ferramenta de layout, complementa o VSM |
| Makigami | ausente | Mapeamento de processos administrativos |
| Diagrama de tartaruga (*turtle*) | ausente | Exigido em auditoria IATF 16949 |
| Código R | ausente | 140 blocos Python, zero R |
| Datasets | inline no código | Ficheiros CSV separados permitiriam exercícios abertos |

Os três primeiros são ferramentas de mapeamento que caberiam naturalmente no módulo `lss-05`,
junto ao Capítulo 40-A.

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
