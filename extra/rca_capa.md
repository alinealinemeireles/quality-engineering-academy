<a id="capitulo-906"></a>
## Capítulo 9-A: Resolução Estruturada de Problemas — 5 Porquês, 8D e CAPA

### A pergunta de engenharia

*O 8D foi preenchido, assinado e arquivado. Três semanas depois, o mesmo defeito aparece numa peça
diferente, do mesmo processo. O que faltou?*

Quase sempre, a resposta está na diferença entre **correção** e **ação corretiva**. Correção troca
a peça ruim por uma boa — resolve o problema de hoje. Ação corretiva muda o processo que produziu a
peça ruim — impede o problema de amanhã. Um relatório bem preenchido que só contém correções é um
documento completo sobre um problema que ainda vai voltar.

---

## 1 · O fluxo, do problema detectado ao fechamento

Passe o rato em cada etapa:

<figure class="figure2026">
<svg role="img" aria-label="Fluxo de resolucao estruturada de problemas: deteccao, contencao, confirmacao, avaliacao de risco, causa raiz, plano CAPA, verificacao e fechamento" viewBox="0 0 720 900" style="width:100%;height:auto;display:block;background:var(--surface-1);border:1px solid var(--line);border-radius:10px" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="rc-ar" markerWidth="10" markerHeight="10" refX="4" refY="5" orient="auto"><path d="M0,0 L8,5 L0,10 Z" fill="#7c8f99"/></marker>
</defs>
<style>
.rc-t { font-family: "Segoe UI", Inter, system-ui, sans-serif; }
.rc-h { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-weight: 700; fill: var(--surface-1); font-size: 14.5px; }
.rc-s { font-family: "Segoe UI", Inter, system-ui, sans-serif; fill: var(--surface-1); font-size: 11px; opacity: .92; }
.rc-n { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-weight: 700; fill: var(--ink-3); font-size: 12px; }
</style>

<line x1="360" y1="90" x2="360" y2="120" stroke="#7c8f99" stroke-width="1.8" marker-end="url(#rc-ar)"/>
<line x1="360" y1="190" x2="360" y2="220" stroke="#7c8f99" stroke-width="1.8" marker-end="url(#rc-ar)"/>
<line x1="360" y1="290" x2="360" y2="320" stroke="#7c8f99" stroke-width="1.8" marker-end="url(#rc-ar)"/>
<line x1="360" y1="390" x2="360" y2="420" stroke="#7c8f99" stroke-width="1.8" marker-end="url(#rc-ar)"/>
<line x1="360" y1="490" x2="360" y2="520" stroke="#7c8f99" stroke-width="1.8" marker-end="url(#rc-ar)"/>
<line x1="360" y1="590" x2="360" y2="620" stroke="#7c8f99" stroke-width="1.8" marker-end="url(#rc-ar)"/>
<line x1="360" y1="690" x2="360" y2="720" stroke="#7c8f99" stroke-width="1.8" marker-end="url(#rc-ar)"/>

<text class="rc-n" x="80" y="55" text-anchor="middle">1</text>
<g data-tip="<b>Problema detectado.</b> Defeito, desvio, reclamação ou achado de auditoria. A qualidade do que vem depois começa por descrever o problema em fatos, não em opiniões: o quê, onde, quando, quanto.">
  <rect x="100" y="20" width="520" height="70" rx="10" fill="var(--series-4)"/>
  <text class="rc-h" x="360" y="50" text-anchor="middle">1 · Problema detectado</text>
  <text class="rc-s" x="360" y="70" text-anchor="middle">descrever em fatos: o quê, onde, quando, quanto</text>
</g>

<text class="rc-n" x="80" y="155" text-anchor="middle">2</text>
<g data-tip="<b>Conter o impacto.</b> Ação imediata para parar a propagação — segregar lote, parar linha, 100% de inspeção. Contenção não é solução: é o que compra tempo para investigar direito.">
  <rect x="100" y="120" width="520" height="70" rx="10" fill="var(--bad)"/>
  <text class="rc-h" x="360" y="150" text-anchor="middle">2 · Conter o impacto</text>
  <text class="rc-s" x="360" y="170" text-anchor="middle">segregar, parar, inspecionar 100% — compra tempo</text>
</g>

<text class="rc-n" x="80" y="255" text-anchor="middle">3</text>
<g data-tip="<b>Confirmar a não conformidade.</b> Comparar contra o requisito real e documentado. Se o requisito não estava claro, o problema pode ser de especificação — não de processo. Se não há desvio real, documenta-se a observação e não se abre um CAPA por engano.">
  <rect x="100" y="220" width="520" height="70" rx="10" fill="var(--series-3)"/>
  <text class="rc-h" x="360" y="250" text-anchor="middle">3 · Confirmar não conformidade</text>
  <text class="rc-s" x="360" y="270" text-anchor="middle">comparar contra o requisito documentado</text>
</g>

<text class="rc-n" x="80" y="355" text-anchor="middle">4</text>
<g data-tip="<b>Avaliar o risco.</b> Severidade x Ocorrência x Detecção — a mesma lógica do RPN de FMEA (Capítulo 81) — decide a urgência e o nível de investigação exigido. Um desvio crítico não espera a próxima reunião semanal.">
  <rect x="100" y="320" width="520" height="70" rx="10" fill="var(--warn)"/>
  <text class="rc-h" x="360" y="350" text-anchor="middle">4 · Avaliar o risco</text>
  <text class="rc-s" x="360" y="370" text-anchor="middle">S × O × D define urgência e profundidade da investigação</text>
</g>

<text class="rc-n" x="80" y="455" text-anchor="middle">5</text>
<g data-tip="<b>Encontrar a causa raiz.</b> 5 Porquês, Ishikawa ou ambos. O critério de parar: a causa encontrada, se eliminada, impede a recorrência — não apenas explica o sintoma.">
  <rect x="100" y="420" width="520" height="70" rx="10" fill="var(--series-1)"/>
  <text class="rc-h" x="360" y="450" text-anchor="middle">5 · Causa raiz</text>
  <text class="rc-s" x="360" y="470" text-anchor="middle">5 Porquês · Ishikawa · até a causa ser acionável</text>
</g>

<text class="rc-n" x="80" y="555" text-anchor="middle">6</text>
<g data-tip="<b>Plano de ação CAPA.</b> Ação corretiva (elimina a causa do problema atual) e, quando aplicável, ação preventiva (elimina a causa antes de virar problema noutro lugar). Cada ação com dono, prazo e critério de conclusão.">
  <rect x="100" y="520" width="520" height="70" rx="10" fill="var(--series-1)"/>
  <text class="rc-h" x="360" y="550" text-anchor="middle">6 · Plano de ação (CAPA)</text>
  <text class="rc-s" x="360" y="570" text-anchor="middle">corretiva + preventiva, com dono e prazo</text>
</g>

<text class="rc-n" x="80" y="655" text-anchor="middle">7</text>
<g data-tip="<b>Verificar eficácia.</b> Voltar aos dados depois de a ação estar implementada. Se o indicador não melhorou, a causa raiz identificada estava errada — volte ao passo 5, não force o fechamento.">
  <rect x="100" y="620" width="520" height="70" rx="10" fill="var(--good)"/>
  <text class="rc-h" x="360" y="650" text-anchor="middle">7 · Verificar eficácia</text>
  <text class="rc-s" x="360" y="670" text-anchor="middle">o indicador melhorou de verdade?</text>
</g>

<text class="rc-n" x="80" y="755" text-anchor="middle">8</text>
<g data-tip="<b>Fechar e documentar.</b> Atualizar FMEA, plano de controlo e instrução de trabalho. Registar a lição aprendida onde alguém vai procurá-la da próxima vez — não só no relatório arquivado.">
  <rect x="100" y="720" width="520" height="70" rx="10" fill="var(--ink-3)"/>
  <text class="rc-h" x="360" y="750" text-anchor="middle">8 · Fechar e documentar lições</text>
  <text class="rc-s" x="360" y="770" text-anchor="middle">atualizar FMEA, plano de controlo, instrução de trabalho</text>
</g>

<text class="rc-t" x="360" y="830" text-anchor="middle" font-size="11.5" fill="var(--ink-3)">passe o rato (ou toque) em cada etapa</text>
</svg>
<figcaption>Contenção sempre antes de análise. Sintoma não é causa raiz. Nem todo problema exige um
CAPA formal — mas todo CAPA formal exige verificação de eficácia antes de fechar.</figcaption>
</figure>

---

## 2 · Correção rápida vs. causa raiz: o mesmo problema, dois tratamentos

```plotly
capa-recorrencia
```

O gráfico mostra o mesmo defeito tratado de duas formas em organizações comparáveis. **Correção
rápida** (trocar a peça, ajustar na hora) mantém a recorrência oscilando — o problema nunca
desaparece, só é adiado. **Causa raiz** (investigar por que aconteceu e mudar o processo) reduz a
recorrência de forma sustentada, mas leva de dois a três meses para chegar a zero — porque a causa
real quase nunca é óbvia no primeiro Porquê.

---

## 3 · Correção, ação corretiva e ação preventiva não são sinônimos

| | Foco | Objetivo | Exemplo |
|---|---|---|---|
| **Correção** | O efeito imediato | Restabelecer a operação agora | Refazer a peça, substituir o componente |
| **Ação corretiva** | A causa de um problema já ocorrido | Eliminar a causa e evitar recorrência | Revisar procedimento, treinar, ajustar parâmetro |
| **Ação preventiva** | A causa de um problema que ainda não ocorreu | Eliminar o risco antes de virar defeito | Poka-yoke, atualização de FMEA, checklist novo |

> **A frase que resolve a confusão.** Corrigir resolve o problema de hoje. Ação corretiva evita o
> problema de amanhã. Um relatório de qualidade completo tem as duas coisas — e não confunde uma
> pela outra.

---

## 4 · O 5 Porquês ramificado — porque a causa raramente é uma linha reta

O erro mais comum do 5 Porquês é tratá-lo como uma cadeia única. Na prática, cada "porquê" pode ter
mais de uma resposta válida, e cada ramo precisa ser checado no gemba antes de seguir:

| Nível | Pergunta | Resposta encontrada | Confirmado no gemba? |
|---|---|---|---|
| Sintoma | Produto saiu com defeito de dimensão | — | — |
| Porquê 1 | Por que saiu fora da dimensão? | Ferramenta desregulada | ✔ medido na máquina |
| Porquê 2 | Por que a ferramenta estava desregulada? | Não houve verificação no início do turno | ✔ registro de checklist ausente |
| Porquê 3 | Por que não houve verificação? | Operador não sabia que era obrigatória | ✔ confirmado em entrevista |
| Porquê 4 | Por que não sabia? | Não foi treinado no procedimento atual | ✔ ficha de formação sem registro |
| Porquê 5 (causa raiz) | Por que não foi treinado? | Não existe matriz de formação para esse posto | ✔ matriz não contempla o posto |

A causa raiz aqui não é "operador errou" — é "não existe controlo que garanta que qualquer
operador daquele posto seja treinado". A ação corretiva certa mira a matriz de formação, não o
indivíduo.

---

## 5 · Onde investigar primeiro

```plotly
capa-pareto
```

Antes de abrir um 8D para cada não conformidade isoladamente, olhe o Pareto do período: se
"material fora de especificação" e "erro de setup" já respondem por mais da metade das ocorrências,
a causa raiz provavelmente é sistêmica (fornecedor, especificação, ou padrão de setup) — não vale a
pena tratar cada ocorrência como um caso isolado.

---

## 6 · O 8D completo

| Disciplina | Pergunta que responde |
|---|---|
| **D0 — Preparação** | Isto exige um 8D formal, ou uma correção simples resolve? |
| **D1 — Equipe** | Quem tem o conhecimento e a autoridade para investigar e agir? |
| **D2 — Descrição do problema** | O quê, onde, quando, quanto — em fatos, não em opiniões |
| **D3 — Contenção** | O que impede o problema de chegar a mais clientes agora? |
| **D4 — Causa raiz** | Por que aconteceu — e por que não foi detectado antes de sair? |
| **D5 — Ações corretivas propostas** | O que elimina a causa raiz, com prazo e responsável? |
| **D6 — Implementação e validação** | A ação foi implementada e o indicador melhorou de verdade? |
| **D7 — Prevenção de recorrência** | FMEA, plano de controlo e instrução de trabalho foram atualizados? |
| **D8 — Fechamento e reconhecimento** | Lições documentadas onde alguém vai encontrá-las depois? |

---

## 7 · Priorizando com dados: RPN e Pareto juntos

```py-r
--- python
import pandas as pd

# Registro simplificado de nao-conformidades do mes
ncr = pd.DataFrame({
    "categoria": ["Material fora de spec", "Erro de setup", "Falha de treino",
                  "Desvio de procedimento", "Instrumento não calibrado", "Outros"],
    "ocorrencias": [31, 24, 18, 13, 9, 5],
    "severidade": [8, 6, 5, 6, 7, 3],       # 1-10, impacto se chegar ao cliente
})

ncr["pct"] = ncr["ocorrencias"] / ncr["ocorrencias"].sum() * 100
ncr["pct_acum"] = ncr["pct"].cumsum()
ncr["indice_prioridade"] = ncr["ocorrencias"] * ncr["severidade"]   # frequencia x severidade

ncr_ordenado = ncr.sort_values("indice_prioridade", ascending=False)
print(ncr_ordenado[["categoria", "ocorrencias", "pct_acum", "indice_prioridade"]]
      .to_string(index=False))

foco_80 = ncr[ncr["pct_acum"] <= 80]["categoria"].tolist()
print(f"\nCategorias que somam os primeiros 80% das ocorrências: {foco_80}")
print("Investigar essas antes de abrir 8D individual para cada caso isolado.")
--- r
ncr <- data.frame(
  categoria = c("Material fora de spec", "Erro de setup", "Falha de treino",
                "Desvio de procedimento", "Instrumento não calibrado", "Outros"),
  ocorrencias = c(31, 24, 18, 13, 9, 5),
  severidade = c(8, 6, 5, 6, 7, 3)
)

ncr$pct <- ncr$ocorrencias / sum(ncr$ocorrencias) * 100
ncr$pct_acum <- cumsum(ncr$pct)
ncr$indice_prioridade <- ncr$ocorrencias * ncr$severidade

ncr_ordenado <- ncr[order(-ncr$indice_prioridade), ]
print(ncr_ordenado[, c("categoria", "ocorrencias", "pct_acum", "indice_prioridade")])

foco_80 <- ncr$categoria[ncr$pct_acum <= 80]
cat("\nCategorias que somam os primeiros 80% das ocorrências:\n")
print(foco_80)
--- excel
' Categorias em A2:A7, ocorrencias em B2:B7, severidade em C2:C7

% do total          =B2/SOMA($B$2:$B$7)*100
% acumulado         =SOMA($D$2:D2)                  ' arrastar para baixo
Índice de prioridade =B2*C2

' Ordenar por indice de prioridade (maior primeiro) com Dados > Classificar
' Foco imediato: linhas onde % acumulado <= 80%
```

---

### Erros comuns

1. **Pular a contenção e ir direto para a causa raiz.** Enquanto investiga, o problema continua
   saindo pela porta.
2. **Tratar o primeiro "porquê" como a causa raiz.** Cinco níveis é uma heurística, não uma regra
   fixa — pare quando a causa for acionável, não quando contar até cinco.
3. **Fechar o 8D sem D6 (validação).** Ação implementada não é o mesmo que ação eficaz.
4. **Confundir correção com ação corretiva no relatório.** Ver seção 3 — é o erro mais comum e o
   mais caro.
5. **Abrir um 8D para cada ocorrência isolada quando o Pareto mostra causa sistêmica.** Nesse caso,
   um único CAPA bem direcionado resolve mais rápido que dez relatórios paralelos.
6. **Não atualizar o FMEA depois do CAPA (D7).** Se o modo de falha não estava lá, ele vai se
   repetir em outro projeto.

### Ligações

- **Capítulo 9** — Abordando o Problema: 5 Porquês e Pareto na sua forma introdutória.
- **Capítulo 36** — Analisar (DMAIC): onde a causa raiz se conecta ao ciclo formal de melhoria.
- **Capítulo 39** — Ferramentas de Brainstorming: Ishikawa em profundidade.
- **Capítulo 81** — FMEA: a mesma lógica de Severidade × Ocorrência × Detecção usada na etapa 4.
- **Capítulo 89** — Documentação do Sistema da Qualidade: onde o NCR e o registro de CAPA vivem
  formalmente.
- **Capítulo 93** — Auditorias: não conformidades encontradas em auditoria seguem o mesmo fluxo.
