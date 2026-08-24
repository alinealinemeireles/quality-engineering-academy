<a id="capitulo-911"></a>
## Capítulo 74-A: Delineamentos de Um Fator — Blocos Aleatorizados e Quadrado Latino

### A pergunta de engenharia

*Você quer comparar quatro fornecedores de matéria-prima. Sabe, por experiência, que o turno de produção também afeta o resultado — mas não é o turno que está a ser testado. Como isolar o efeito do fornecedor sem que a variação do turno confunda a conclusão?*

A resposta errada é ignorar o turno e esperar que "a média se resolva sozinha" — isso simplesmente empurra a variação do turno para dentro do erro experimental, tornando mais difícil detectar um efeito real do fornecedor. A resposta certa depende de quantas fontes de variação incômoda existem: uma (o turno) pede um delineamento em blocos aleatorizados; duas simultâneas (por exemplo, turno **e** máquina) podem, sob certas condições, pedir um quadrado latino.

### Delineamento completamente aleatorizado (CRD)

O ponto de partida é o **delineamento completamente aleatorizado**, apropriado quando as unidades experimentais são homogêneas — isto é, quando não há nenhuma fonte de variação incômoda conhecida e relevante para controlar. Os tratamentos são atribuídos às unidades experimentais inteiramente ao acaso, e a análise é o ANOVA de uma via já coberto no Capítulo 50:

$$y_{ij} = \mu + \tau_i + \varepsilon_{ij}$$

onde $\tau_i$ é o efeito do tratamento $i$ e $\varepsilon_{ij}$ é o erro aleatório. A limitação prática do CRD aparece exatamente quando a suposição de homogeneidade falha: se, por exemplo, lotes de matéria-prima diferentes reagem de forma sistematicamente diferente ao mesmo tratamento, essa diferença entra inteira no termo de erro, tornando o teste menos sensível ao efeito real do tratamento — um problema clássico de poder estatístico insuficiente (Capítulo 49).

### Delineamento em blocos aleatorizados (RCBD)

Quando existe **uma** fonte de variação incômoda conhecida — turno, operador, lote de matéria-prima, dia da semana — e essa fonte pode ser organizada em grupos homogêneos (blocos), o delineamento em blocos aleatorizados completo (RCBD) reduz a variabilidade que, de outra forma, cairia inteira no erro experimental. Dentro de cada bloco, todos os tratamentos são aplicados e a ordem é aleatorizada; entre blocos, a variação sistemática é removida estatisticamente, não fisicamente. O modelo estende o CRD com um termo adicional:

$$y_{ij} = \mu + \tau_i + \beta_j + \varepsilon_{ij}$$

onde $\beta_j$ é o efeito do bloco $j$. Um RCBD pode ser lido como uma extensão do CRD para unidades experimentais heterogêneas: em vez de assumir que a heterogeneidade não existe, ela é explicitamente modelada e removida do erro — o que, tipicamente, produz uma estimativa de variância de erro menor e um teste F com mais poder para detectar o efeito real do tratamento.

### Quadrado latino: bloquear duas fontes de variação ao mesmo tempo

Quando existem **duas** fontes de variação incômoda simultâneas — por exemplo, turno e máquina — e ambas podem ser organizadas com o mesmo número de níveis que o fator de tratamento, o delineamento em quadrado latino bloqueia as duas ao mesmo tempo, sem multiplicar o número de corridas necessárias. Um quadrado latino é um arranjo $n \times n$ de $n$ símbolos diferentes, de forma que cada símbolo aparece exatamente uma vez em cada linha e exatamente uma vez em cada coluna. As linhas e as colunas do quadrado correspondem aos dois fatores de bloqueio; os símbolos (A, B, C…) correspondem aos níveis do fator de tratamento.

Um exemplo clássico: testar quatro óleos lubrificantes (o tratamento) usando quatro motoristas e quatro carros (os dois fatores de bloqueio), de forma que cada motorista use cada óleo exatamente uma vez e cada carro receba cada óleo exatamente uma vez — controlando, ao mesmo tempo, o efeito do motorista e o efeito do carro sobre o resultado, sem precisar de $4 \times 4 \times 4 = 64$ corridas (o fatorial completo), apenas 16.

O quadrado latino por isso também é chamado de **delineamento de um fator**, porque, apesar de envolver três variáveis categóricas (tratamento e dois blocos), o objetivo é medir o efeito de apenas uma delas — o tratamento — enquanto as outras duas são apenas neutralizadas estatisticamente. O modelo decompõe a soma de quadrados total em quatro partes:

$$SS_{Total} = SS_{Linha} + SS_{Coluna} + SS_{Tratamento} + SS_{Erro}$$

**A condição essencial, e a limitação central.** Um quadrado latino só é válido quando não há interação esperada entre os fatores de linha, coluna e tratamento — a construção do delineamento explicitamente **impede** a estimativa de qualquer interação, porque não sobram graus de liberdade suficientes para isso. Quando há razão para suspeitar de interação relevante (por exemplo, se o efeito do óleo depende do carro específico), o quadrado latino é a escolha errada, e um fatorial completo (Capítulo 73), capaz de estimar interações, deve ser usado no lugar.

### Exemplo resolvido: RCBD e quadrado latino lado a lado

```py-r
--- python
import numpy as np
import pandas as pd
import statsmodels.api as sm
import statsmodels.formula.api as smf

rng = np.random.default_rng(2026)

# ---------- RCBD: 4 fornecedores (tratamento), 3 turnos (bloco) ----------
fornecedores = ["F1", "F2", "F3", "F4"]
turnos = ["Manha", "Tarde", "Noite"]
efeito_turno = {"Manha": 0.0, "Tarde": -1.2, "Noite": 1.8}
efeito_fornecedor = {"F1": 0.0, "F2": 2.5, "F3": -1.0, "F4": 1.0}

linhas = []
for t in turnos:
    for f in fornecedores:
        resistencia = 100 + efeito_turno[t] + efeito_fornecedor[f] + rng.normal(0, 1.5)
        linhas.append({"turno": t, "fornecedor": f, "resistencia": resistencia})
rcbd = pd.DataFrame(linhas)

modelo_rcbd = smf.ols("resistencia ~ C(fornecedor) + C(turno)", data=rcbd).fit()
anova_rcbd = sm.stats.anova_lm(modelo_rcbd, typ=2)
print("PASSO 1 -- RCBD: fornecedor (tratamento) bloqueado por turno")
print(anova_rcbd.round(4))
print(f"\n  p-valor do fornecedor = {anova_rcbd.loc['C(fornecedor)', 'PR(>F)']:.4f}"
      f"  ({'efeito significativo' if anova_rcbd.loc['C(fornecedor)','PR(>F)'] < 0.05 else 'sem evidencia de efeito'})")
print(f"  p-valor do turno (bloco) = {anova_rcbd.loc['C(turno)', 'PR(>F)']:.4f}"
      f"  (bloquear o turno removeu esta variacao do erro)\n")

# ---------- Quadrado latino: 4 oleos, 4 motoristas, 4 carros ----------
oleos      = ["Oleo_A", "Oleo_B", "Oleo_C", "Oleo_D"]
motoristas = ["Motorista_1", "Motorista_2", "Motorista_3", "Motorista_4"]
carros     = ["Carro_1", "Carro_2", "Carro_3", "Carro_4"]

# quadrado latino padrao 4x4 (cada oleo aparece uma vez por linha e por coluna)
quadrado = [
    ["Oleo_A", "Oleo_B", "Oleo_C", "Oleo_D"],
    ["Oleo_B", "Oleo_C", "Oleo_D", "Oleo_A"],
    ["Oleo_C", "Oleo_D", "Oleo_A", "Oleo_B"],
    ["Oleo_D", "Oleo_A", "Oleo_B", "Oleo_C"],
]
efeito_oleo      = {"Oleo_A": 0.0, "Oleo_B": 1.5, "Oleo_C": -2.0, "Oleo_D": 0.8}
efeito_motorista = {m: rng.normal(0, 1.0) for m in motoristas}
efeito_carro     = {c: rng.normal(0, 1.0) for c in carros}

linhas = []
for i, m in enumerate(motoristas):
    for j, c in enumerate(carros):
        oleo = quadrado[i][j]
        consumo = 10 + efeito_oleo[oleo] + efeito_motorista[m] + efeito_carro[c] + rng.normal(0, 0.6)
        linhas.append({"motorista": m, "carro": c, "oleo": oleo, "consumo": consumo})
ql = pd.DataFrame(linhas)

modelo_ql = smf.ols("consumo ~ C(oleo) + C(motorista) + C(carro)", data=ql).fit()
anova_ql = sm.stats.anova_lm(modelo_ql, typ=2)
print("PASSO 2 -- Quadrado latino: oleo (tratamento), bloqueado por motorista E carro")
print(anova_ql.round(4))
print(f"\n  p-valor do oleo = {anova_ql.loc['C(oleo)', 'PR(>F)']:.4f}"
      f"  ({'efeito significativo' if anova_ql.loc['C(oleo)','PR(>F)'] < 0.05 else 'sem evidencia de efeito'})")
print(f"  Corridas usadas: {len(ql)}  (um fatorial completo 4x4x4 precisaria de {4**3})")
```

**Leitura de engenharia.** No Passo 1, comparar o p-valor do fornecedor com e sem o bloco de turno no modelo (tente remover `C(turno)` da fórmula e recalcular) mostra concretamente o ganho de poder estatístico do bloqueio: a mesma diferença real entre fornecedores fica mais fácil de detectar quando a variação do turno é removida do erro. No Passo 2, o quadrado latino testou o efeito de quatro óleos controlando simultaneamente motorista e carro usando apenas 16 corridas — um quarto do que um fatorial completo exigiria — ao custo de não poder estimar se o efeito do óleo depende do carro específico.

### Ferramentas: Excel, Power BI e Minitab

**Excel 365.** O Analysis ToolPak inclui **Dados → Análise de Dados → Anova: Fator Único** (equivalente ao CRD) e **Anova: Dois Fatores Sem Repetição**, que corresponde exatamente ao RCBD — organize os dados com os tratamentos em colunas e os blocos em linhas (ou vice-versa) e o Excel devolve a tabela ANOVA completa, incluindo o teste F separado para tratamento e para bloco. Não existe suporte nativo para quadrado latino; a forma prática é montar manualmente as três somas de quadrados (linha, coluna, tratamento) a partir das médias marginais e calcular o erro por subtração de $SS_{Total}$, ou recorrer ao Python/R/Minitab.

**Power BI (DAX).** Não calcula ANOVA nativamente; o uso típico é publicar a tabela de resultados já calculada (médias por tratamento, intervalos de confiança) para acompanhamento visual, não para o cálculo em si.

**Minitab** (versão atual — conferir em minitab.com): **Stat → ANOVA → General Linear Model** aceita diretamente fórmulas com múltiplos termos categóricos (`Resposta = Tratamento Bloco` para o RCBD, `Resposta = Tratamento Linha Coluna` para o quadrado latino), devolvendo a mesma decomposição de soma de quadrados calculada no exemplo Python acima — é o caminho mais direto quando não se quer montar a fórmula manualmente.

### Exercício proposto

Usando o conjunto de dados do RCBD do exemplo resolvido, remova o termo `C(turno)` do modelo e recalcule apenas com `resistencia ~ C(fornecedor)` (equivalente a tratar o delineamento como um CRD, ignorando o bloco). Compare o quadrado médio do erro e o p-valor do fornecedor nos dois modelos, e explique, em termos do que o bloqueio faz à soma de quadrados do erro, por que a conclusão sobre o fornecedor pode mudar entre os dois modelos mesmo usando exatamente os mesmos dados.

### Erros comuns

1. **Usar CRD quando existe uma fonte de variação incômoda óbvia e conhecida.** Deixar essa variação cair no erro reduz o poder do teste desnecessariamente — bloqueá-la seria de graça, estatisticamente.
2. **Bloquear um fator que na realidade pode interagir com o tratamento.** O bloqueio assume que o efeito do bloco é aditivo; se a suspeita de interação for razoável, um fatorial que estime a interação é mais apropriado.
3. **Usar quadrado latino sem confirmar que o número de níveis dos dois blocos é igual ao número de níveis do tratamento.** É uma exigência estrutural do delineamento, não uma sugestão.
4. **Interpretar a ausência de termo de interação no quadrado latino como prova de que a interação não existe.** O delineamento simplesmente não tem graus de liberdade para a estimar — ausência de evidência não é evidência de ausência.
5. **Aleatorizar a ordem de execução das corridas dentro do bloco de forma inconsistente ou não documentada.** A validade estatística do bloqueio depende da aleatorização correta dentro de cada bloco, não apenas da estrutura do delineamento no papel.

*Fonte principal: ASQ Certified Six Sigma Black Belt Body of Knowledge (2022), seção VII.A.4 "One-factor experiments". Cross-check: Six Sigma Study Guide, "Other Designed Experiment Types" (sixsigmastudyguide.com); Minitab Support, "What are randomized block designs and Latin square designs?". Verificado via pesquisa na web em 22/08/2026.*

### Revisão técnica 2026 — Capítulo 911

**Status:** Capítulo novo, escrito para cobrir a lacuna do tópico VII.A.4 do BOK do CSSBB (delineamento completamente aleatorizado, blocos aleatorizados e quadrado latino), identificada em auditoria de conteúdo de agosto de 2026.
