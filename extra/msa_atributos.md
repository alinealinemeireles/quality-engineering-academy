<a id="capitulo-909"></a>
## Capítulo 61-A: MSA por Atributos — Kappa e Percentual de Concordância

### A pergunta de engenharia

*O inspetor A aprovou a peça. O inspetor B reprovou a mesma peça. Qual dos dois está certo — e como medir isso sem simplesmente assumir que um deles é o padrão?*

Quando a característica inspecionada é binária — conforme ou não conforme, passa ou não passa —, não existe desvio-padrão de instrumento para calcular um %GRR como no Capítulo 61. O que existe é a taxa com que diferentes avaliadores (ou o mesmo avaliador, em momentos diferentes) chegam à mesma decisão sobre a mesma peça. Medir e melhorar essa taxa é o objeto do MSA por atributos.

### Por que percentual de concordância simples não basta

A medida mais direta é o **percentual de concordância** — a proporção de peças em que todos os avaliadores concordaram:

$$\%\text{Concordância} = \frac{\text{Peças com decisão idêntica em todas as avaliações}}{\text{Total de peças avaliadas}} \times 100$$

O problema é que essa medida não desconta a concordância que aconteceria só por acaso. Se 95% das peças de uma amostra são claramente boas, dois avaliadores aleatórios já vão concordar na maior parte das vezes só porque a maioria das peças é fácil de julgar — mesmo que, nas peças realmente ambíguas (as que importam), eles discordem sistematicamente. É exatamente esse viés que o coeficiente kappa corrige.

### Kappa de Cohen (dois avaliadores)

O kappa de Cohen mede a concordância **além** do que se esperaria pelo acaso:

$$\kappa = \frac{P_o - P_e}{1 - P_e}$$

onde $P_o$ é a proporção de concordância observada (a soma das células da diagonal de uma tabela de contingência avaliador A × avaliador B, dividida pelo total), e $P_e$ é a proporção de concordância esperada só pelo acaso, calculada a partir das distribuições marginais de cada avaliador:

$$P_e = \sum_{i} \frac{(\text{total da linha } i) \times (\text{total da coluna } i)}{n^2}$$

**Interpretação (critério AIAG):** $\kappa \geq 0{,}75$ indica concordância boa a excelente; $0{,}40 \leq \kappa < 0{,}75$ indica concordância moderada, aceitável apenas condicionalmente; $\kappa < 0{,}40$ indica concordância fraca — o sistema de medição por atributo não deve ser liberado. $\kappa = 1$ é concordância perfeita; $\kappa = 0$ equivale ao acaso; $\kappa < 0$ é pior do que o acaso (mais raro, mas indica um problema sério, como critérios de decisão invertidos entre avaliadores).

### Kappa de Fleiss (mais de dois avaliadores) e as três comparações do estudo

Quando o estudo envolve mais de dois avaliadores, usa-se o **kappa de Fleiss**, uma generalização do kappa de Cohen para múltiplos avaliadores classificando as mesmas peças nas mesmas categorias — a lógica de corrigir a concordância observada pela concordância esperada ao acaso é a mesma, apenas estendida a mais colunas.

Um estudo completo de MSA por atributos normalmente reporta três comparações distintas, cada uma respondendo a uma pergunta diferente:

- **Repetibilidade dentro do avaliador** — o mesmo avaliador, avaliando a mesma peça em momentos diferentes (às cegas, sem saber que é repetição), chega à mesma decisão? Mede a consistência interna de cada avaliador.
- **Reprodutibilidade entre avaliadores** — avaliadores diferentes, avaliando a mesma peça, chegam à mesma decisão entre si? Mede se o critério de decisão está de facto padronizado entre pessoas.
- **Exatidão avaliador vs. padrão** — quando existe um padrão de referência conhecido (por exemplo, peças pré-classificadas por um especialista ou por medição objetiva), cada avaliador concorda com esse padrão? Esta é a única das três comparações que mede exatidão, não apenas consistência — um grupo de avaliadores pode ser perfeitamente consistente entre si e, ainda assim, estar todo errado em relação ao padrão.

### Exemplo resolvido: dois avaliadores, uma característica binária

```py-r
--- python
import numpy as np
import pandas as pd

rng = np.random.default_rng(2026)

# 50 pecas, avaliadas duas vezes por dois avaliadores (A e B), decisao binaria
# 1 = conforme, 0 = nao conforme. O "padrao" e a classificacao de referencia.
n = 50
padrao = rng.choice([0, 1], size=n, p=[0.30, 0.70])

def avaliar(padrao, taxa_erro, rng):
    ruido = rng.random(len(padrao)) < taxa_erro
    return np.where(ruido, 1 - padrao, padrao)

A1 = avaliar(padrao, 0.08, rng)
A2 = avaliar(padrao, 0.08, rng)     # repeticao do avaliador A
B1 = avaliar(padrao, 0.14, rng)     # avaliador B, mais inconsistente

def kappa_cohen(x, y):
    tab = pd.crosstab(x, y)
    tab = tab.reindex(index=[0, 1], columns=[0, 1], fill_value=0)
    n_tot = tab.values.sum()
    Po = np.trace(tab.values) / n_tot
    marg_l = tab.sum(axis=1).values / n_tot
    marg_c = tab.sum(axis=0).values / n_tot
    Pe = (marg_l * marg_c).sum()
    kappa = (Po - Pe) / (1 - Pe) if Pe != 1 else np.nan
    return Po, Pe, kappa

def classificar(k):
    if k >= 0.75:
        return "boa a excelente"
    if k >= 0.40:
        return "moderada (condicional)"
    return "fraca -- rever criterio ou treinamento"

print("PASSO 1 -- Repetibilidade dentro do avaliador A (A1 vs A2):")
Po, Pe, k = kappa_cohen(A1, A2)
print(f"  %Concordancia = {Po*100:.1f}%  |  Kappa = {k:.3f}  ({classificar(k)})\n")

print("PASSO 2 -- Reprodutibilidade entre avaliadores (A1 vs B1):")
Po, Pe, k = kappa_cohen(A1, B1)
print(f"  %Concordancia = {Po*100:.1f}%  |  Kappa = {k:.3f}  ({classificar(k)})\n")

print("PASSO 3 -- Exatidao vs. padrao de referencia:")
for nome, aval in [("A1", A1), ("A2", A2), ("B1", B1)]:
    Po, Pe, k = kappa_cohen(aval, padrao)
    print(f"  {nome} vs. padrao: %Concordancia = {Po*100:.1f}%  |  Kappa = {k:.3f}  ({classificar(k)})")

print("\nDIAGNOSTICO:")
print("  O avaliador B pode ser internamente consistente com A na maior parte das pecas,")
print("  mas se o kappa vs. padrao for sistematicamente mais baixo, o problema nao e")
print("  concordancia entre pessoas -- e exatidao: B esta a aplicar um criterio errado,")
print("  nao apenas um criterio diferente de A.")
```

**Leitura de engenharia.** Repare que as três comparações podem contar histórias diferentes: é perfeitamente possível que A e B concordem muito bem entre si (reprodutibilidade alta) e, ainda assim, ambos discordem do padrão (exatidão baixa) — nesse caso, o problema não é treinar B para "pensar como A", é corrigir o critério de decisão dos dois, provavelmente via revisão do padrão visual ou da instrução de trabalho.

### Ferramentas: Excel, Power BI e Minitab

**Excel 365.** Não existe uma função nativa para kappa. Monte a tabela de contingência com `=CONT.SES` (COUNTIFS) cruzando as decisões dos dois avaliadores, some a diagonal para $P_o$, calcule os totais marginais de linha e coluna para $P_e$, e aplique a fórmula $\kappa = (P_o - P_e)/(1 - P_e)$ numa célula — é um cálculo de poucas linhas, mas manual; para Fleiss com mais de dois avaliadores, a montagem fica trabalhosa demais para valer a pena fora do Python/R ou de um software dedicado.

**Power BI (DAX).** Útil para o painel de acompanhamento contínuo do sistema de medição — uma medida de percentual de concordância por período (`% Concordancia = DIVIDE(CALCULATE(COUNTROWS(Avaliacoes), Avaliacoes[Decisao_A]=Avaliacoes[Decisao_B]), COUNTROWS(Avaliacoes))`) é simples; o próprio kappa, como no Excel, não tem função nativa e deve ser calculado fora e importado como valor.

**Minitab** (versão atual — conferir em minitab.com): **Stat → Quality Tools → Attribute Agreement Analysis**. É a ferramenta correta e dedicada para este estudo — Minitab pede as colunas de avaliador, peça, réplica e (opcionalmente) padrão de referência, e devolve automaticamente o percentual de concordância e o kappa de Fleiss para as três comparações (dentro do avaliador, entre avaliadores, e vs. padrão), já com os gráficos de barra correspondentes. Para este tópico específico, ao contrário do Gage R&R variável, o Minitab tende a ser mais direto do que montar tudo manualmente em Excel.

### Exercício proposto

Usando o conjunto de dados do exemplo resolvido acima, substitua 10 das decisões do avaliador B por valores aleatórios (simulando um avaliador que "adivinha" nas peças ambíguas) e recalcule o kappa entre A1 e B1. Observe como o kappa cai de forma muito mais acentuada do que o percentual de concordância bruto — e discuta por que essa diferença de sensibilidade é exatamente a razão para preferir kappa a percentual de concordância na liberação de um sistema de medição por atributos.

### Erros comuns

1. **Reportar apenas percentual de concordância, sem kappa.** Em amostras dominadas por peças fáceis de julgar, a concordância bruta é enganosamente alta.
2. **Não incluir repetições cegas do mesmo avaliador.** Sem repetição, não há como separar inconsistência do avaliador de discordância real entre avaliadores.
3. **Avaliar apenas peças claramente boas ou claramente más.** Um bom estudo de atributos deliberadamente inclui peças ambíguas, próximas do limite de decisão — é aí que os sistemas de medição falham.
4. **Confundir reprodutibilidade alta com exatidão.** Avaliadores podem estar de acordo entre si e, ainda assim, sistematicamente errados face ao padrão de referência.
5. **Usar kappa de Cohen com mais de dois avaliadores.** Nesse caso, use o kappa de Fleiss — a fórmula de dois avaliadores não generaliza diretamente.

*Fonte principal: AIAG, Measurement Systems Analysis (MSA), 4ª edição — critérios de aceitação de kappa. Cross-check: Minitab Support, "Kappa Statistics for Attribute Agreement Analysis"; SixSigma.us, "Everything about Attribute Agreement Analysis in Lean Six Sigma". Verificado via pesquisa na web em 22/08/2026.*

### Revisão técnica 2026 — Capítulo 909

**Status:** Capítulo novo, escrito para cobrir a lacuna do tópico IV.F (MSA por atributos) do BOK do CQE e V.C.1 do BOK do CSSBB, identificada em auditoria de conteúdo de agosto de 2026.
