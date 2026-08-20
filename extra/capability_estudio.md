<a id="capitulo-902"></a>
## Capítulo 71-A: Estúdio de Capabilidade — Cp, Cpk, Pp, Ppk na prática

> **Nota editorial.** Capítulo interativo escrito de raiz para a edição web, como laboratório do
> Capítulo 71. Todos os gráficos respondem ao rato; os cálculos aparecem em Python e em R lado a
> lado.

### A pergunta de engenharia

*O cliente exige Cpk ≥ 1,33. O relatório diz Cpk 1,41 e Ppk 0,92. Qual dos dois números é que ele
vai usar para reprovar o lote — e qual é que eu devo usar para decidir o que fazer na segunda-feira?*

Ele vai usar o **Ppk**, porque é o que descreve o que sai pela porta. Você vai usar a **diferença
entre os dois**, porque é ela que diz onde está o problema. Um relatório de capabilidade que
apresenta só um dos quatro índices não é um relatório de capabilidade.

### Os quatro índices, sem confusão

Passe o rato sobre cada linha da tabela para ver o que ela significa na prática.

| Índice | Fórmula | Sigma usado | Responde a |
|---|---|---|---|
| **Cp** | $\frac{LSE - LIE}{6\hat{\sigma}_{curto}}$ | curto prazo | O processo **cabe** na tolerância? |
| **Cpk** | $\min\!\left(\frac{LSE-\mu}{3\hat{\sigma}_{curto}}, \frac{\mu-LIE}{3\hat{\sigma}_{curto}}\right)$ | curto prazo | E está **centrado** nela? |
| **Pp** | $\frac{LSE - LIE}{6 s}$ | longo prazo | Cabe, **considerando tudo** o que aconteceu? |
| **Ppk** | $\min\!\left(\frac{LSE-\mu}{3s}, \frac{\mu-LIE}{3s}\right)$ | longo prazo | É o que o **cliente recebe** |

A distinção que resolve 90% das dúvidas:

- $\hat{\sigma}_{curto}$ vem **de dentro dos subgrupos** — pela amplitude média ($\bar{R}/d_2$) ou
  pela amplitude móvel ($\overline{MR}/1{,}128$ para individuais). É a variação que o processo tem
  quando nada muda.
- $s$ é o **desvio-padrão de toda a amostra** ($\sqrt{\sum(x_i-\bar{x})^2/(n-1)}$). Inclui as
  mudanças de turno, de lote de matéria-prima, de operador, o desgaste da ferramenta.

Daí a leitura que vale ouro:

<div class="kpi-row">
<div class="kpi ok"><div class="kpi-k">Cp ≈ Cpk ≈ Pp ≈ Ppk</div><div class="kpi-v">Estável</div><div class="kpi-s">centrado e sob controlo — o caso raro</div></div>
<div class="kpi warn"><div class="kpi-k">Cp &gt;&gt; Cpk</div><div class="kpi-v">Fora do alvo</div><div class="kpi-s">tem tolerância de sobra, está no sítio errado — ajuste de setup</div></div>
<div class="kpi warn"><div class="kpi-k">Cpk &gt;&gt; Ppk</div><div class="kpi-v">Instável</div><div class="kpi-s">há causas especiais entre subgrupos — vá ao SPC, não à máquina</div></div>
<div class="kpi bad"><div class="kpi-k">Cp baixo</div><div class="kpi-v">Disperso</div><div class="kpi-s">variação intrínseca alta — exige mudar o processo, não afiná-lo</div></div>
</div>

---

## 1 · Estúdio: mova a média e veja o índice responder

O deslizador desloca a média do processo mantendo o sigma constante. Repare em **duas coisas**: o
Cp não se move (a dispersão não mudou) e o número de peças fora de especificação cresce muito mais
depressa do que a intuição sugere.

```plotly
cap-studio
```

*A área azul é a fração dentro da especificação; a vermelha, a que sai fora. A linha tracejada é a
média; as verticais vermelhas são LIE e LSE.*

O que este gráfico ensina e a fórmula não ensina: entre Cpk 1,33 e Cpk 1,00 a distância parece
pequena no papel — 25% — mas em peças rejeitadas é a diferença entre **63 PPM e 2 700 PPM**. É um
fator de 43.

---

## 2 · Porque é que 1,33 não é um número arbitrário

```plotly
cap-cpk-ppm
```

A escala é logarítmica porque tem de ser: cada 0,33 de Cpk vale aproximadamente **uma ordem de
grandeza** em peças defeituosas. Isto é o que está por trás dos requisitos que aparecem nos
contratos:

- **Cpk ≥ 1,00** — o processo "cabe", com 2 700 PPM. Já não é aceite em quase lado nenhum.
- **Cpk ≥ 1,33** — 63 PPM. O requisito de referência em fornecimento industrial.
- **Cpk ≥ 1,67** — 0,3 PPM. Característica de segurança, automóvel, aeronáutica.
- **Cpk ≥ 2,00** — o "seis sigma" em sentido estrito, antes do deslocamento de 1,5σ.

> **Cuidado com o deslocamento de 1,5σ.** A conversão clássica "6σ = 3,4 DPMO" já inclui um
> deslocamento assumido de 1,5σ na média a longo prazo. Os PPM do gráfico acima são calculados
> **sem** esse deslocamento — são o desempenho instantâneo. Misturar as duas convenções no mesmo
> relatório é a origem mais comum de discussões estéreis em reuniões de qualidade.

---

## 3 · Mesmo Cp, Cpk muito diferente

Quatro processos, a mesma tolerância. Passe o rato em cada curva:

```plotly
cap-cp-vs-cpk
```

O caso **B** é o mais frequente na indústria e o mais fácil de resolver: a máquina é capaz, está só
mal centrada. Um ajuste de setup devolve o Cpk. O caso **C** é o mais caro: nenhum ajuste ajuda,
porque a variação é intrínseca — exige mudar ferramenta, fixação, material ou método.

**A regra de decisão que daqui sai:**

1. Calcule Cp. Se Cp < 1,33, **não perca tempo a centrar** — a tolerância não cabe. Ataque a
   dispersão.
2. Se Cp ≥ 1,33 mas Cpk < 1,33, é **centragem**. É o problema barato. Resolva-o primeiro.
3. Só depois compare Cpk com Ppk para saber se há instabilidade a tratar.

---

## 4 · Onde ganhar Cpk: centrar ou reduzir variação?

O mapa abaixo mostra o Cpk em função de duas grandezas normalizadas pela meia-tolerância: quanto o
processo está fora do alvo (eixo horizontal) e quanto ele varia (eixo vertical).

```plotly
cap-cpk-heat
```

Leia-o como um mapa topográfico. Se estiver num ponto com **curvas de nível quase horizontais**,
mover-se para os lados (centrar) quase não sobe o Cpk — tem de descer (reduzir σ). Se as curvas
estiverem quase verticais, centrar resolve. Na maior parte da região prática, **descer custa mais
mas rende mais**.

---

## 5 · Cpk vs Ppk: a diferença tem sempre um nome

Cento e vinte peças, quatro turnos. Dentro de cada turno o processo é estável; entre turnos, não é.

```plotly
cap-curto-longo
```

O sigma de curto prazo só "vê" a variação dentro do turno, por isso o Cpk é otimista. O sigma de
longo prazo vê os degraus entre turnos, e o Ppk cai. **A diferença entre os dois índices é o custo
da instabilidade** — e neste caso ela tem nome, hora e responsável.

O erro clássico é reportar o Cpk ao cliente porque é o número maior. O erro simétrico, e mais grave,
é reportar o Ppk e fechar o assunto — perdendo a informação de que o processo *é capaz*, só não está
sob controlo.

> **Regra de ouro.** Capabilidade só significa alguma coisa depois de o processo estar em **controlo
> estatístico**. Calcular Cpk num processo instável é medir a temperatura média de um doente que
> alterna entre 35 °C e 41 °C: o número existe, e não descreve ninguém.

---

## 6 · O cálculo completo, em Python e em R

Este é o bloco que deve ir para o relatório: os quatro índices, os dois sigmas, os PPM e o teste de
normalidade — porque **todos os índices acima pressupõem distribuição normal**.

```py-r
--- python
import numpy as np
from scipy import stats

# Diametro de eixo (mm). Especificacao 35.00 +/- 0.50
rng = np.random.default_rng(11)
turno = np.repeat(np.arange(4), 30)
x = 35.0 + np.array([0.0, 0.10, -0.06, 0.16])[turno] + rng.normal(0, 0.09, 120)

LIE, LSE, ALVO = 34.50, 35.50, 35.00

# --- os dois sigmas ---------------------------------------------------------
MR = np.abs(np.diff(x))
sigma_curto = MR.mean() / 1.128          # d2 = 1.128 para n = 2
sigma_longo = x.std(ddof=1)
mu = x.mean()

def indices(mu, s):
    Cp  = (LSE - LIE) / (6 * s)
    Cpk = min(LSE - mu, mu - LIE) / (3 * s)
    Cpm = (LSE - LIE) / (6 * np.sqrt(s**2 + (mu - ALVO)**2))   # penaliza desvio ao alvo
    ppm = (stats.norm.cdf(LIE, mu, s) + stats.norm.sf(LSE, mu, s)) * 1e6
    return Cp, Cpk, Cpm, ppm

Cp, Cpk, Cpm, ppm_c = indices(mu, sigma_curto)
Pp, Ppk, _,   ppm_l = indices(mu, sigma_longo)

# --- normalidade: sem isto, os indices nao valem ----------------------------
ad = stats.anderson(x, dist="norm")
normal = ad.statistic < ad.critical_values[2]          # nivel 5%

print(f"n = {len(x)}   media = {mu:.4f} mm   alvo = {ALVO}")
print(f"sigma curto = {sigma_curto:.4f}   sigma longo = {sigma_longo:.4f}   "
      f"racio = {sigma_longo/sigma_curto:.2f}")
print()
print(f"  Cp  = {Cp:5.2f}      Cpk = {Cpk:5.2f}      Cpm = {Cpm:5.2f}   (curto prazo)")
print(f"  Pp  = {Pp:5.2f}      Ppk = {Ppk:5.2f}                        (longo prazo)")
print()
print(f"  PPM esperado (curto) = {ppm_c:9.1f}")
print(f"  PPM esperado (longo) = {ppm_l:9.1f}   <- o que o cliente recebe")
print(f"  PPM observado        = {((x < LIE) | (x > LSE)).mean()*1e6:9.1f}")
print()
print(f"Anderson-Darling A2 = {ad.statistic:.3f} "
      f"(critico 5% = {ad.critical_values[2]:.3f}) -> "
      f"{'normal' if normal else 'NAO normal: use metodo de Clements ou Johnson'}")
print()
if Cp - Cpk > 0.15:
    print(f"DIAGNOSTICO: descentrado. Cp - Cpk = {Cp-Cpk:.2f}. "
          f"Ajustar a media em {ALVO - mu:+.3f} mm devolve Cpk = {Cp:.2f}.")
if Cpk - Ppk > 0.15:
    print(f"DIAGNOSTICO: instavel. Cpk - Ppk = {Cpk-Ppk:.2f}. "
          f"Ha causas especiais entre subgrupos - va ao SPC antes de mexer na maquina.")
--- r
library(nortest)   # install.packages("nortest")

# Diametro de eixo (mm). Especificacao 35.00 +/- 0.50
set.seed(11)
turno <- rep(0:3, each = 30)
x <- 35.0 + c(0.0, 0.10, -0.06, 0.16)[turno + 1] + rnorm(120, 0, 0.09)

LIE <- 34.50; LSE <- 35.50; ALVO <- 35.00

# --- os dois sigmas ---------------------------------------------------------
MR <- abs(diff(x))
sigma_curto <- mean(MR) / 1.128        # d2 = 1.128 para n = 2
sigma_longo <- sd(x)
mu <- mean(x)

indices <- function(mu, s) {
  Cp  <- (LSE - LIE) / (6 * s)
  Cpk <- min(LSE - mu, mu - LIE) / (3 * s)
  Cpm <- (LSE - LIE) / (6 * sqrt(s^2 + (mu - ALVO)^2))
  ppm <- (pnorm(LIE, mu, s) + pnorm(LSE, mu, s, lower.tail = FALSE)) * 1e6
  c(Cp = Cp, Cpk = Cpk, Cpm = Cpm, ppm = ppm)
}

curto <- indices(mu, sigma_curto)
longo <- indices(mu, sigma_longo)

# --- normalidade ------------------------------------------------------------
ad <- ad.test(x)

cat(sprintf("n = %d   media = %.4f mm   alvo = %.2f\n", length(x), mu, ALVO))
cat(sprintf("sigma curto = %.4f   sigma longo = %.4f   racio = %.2f\n\n",
            sigma_curto, sigma_longo, sigma_longo / sigma_curto))
cat(sprintf("  Cp  = %5.2f      Cpk = %5.2f      Cpm = %5.2f   (curto prazo)\n",
            curto["Cp"], curto["Cpk"], curto["Cpm"]))
cat(sprintf("  Pp  = %5.2f      Ppk = %5.2f                        (longo prazo)\n\n",
            longo["Cp"], longo["Cpk"]))
cat(sprintf("  PPM esperado (curto) = %9.1f\n", curto["ppm"]))
cat(sprintf("  PPM esperado (longo) = %9.1f   <- o que o cliente recebe\n", longo["ppm"]))
cat(sprintf("  PPM observado        = %9.1f\n\n", mean(x < LIE | x > LSE) * 1e6))
cat(sprintf("Anderson-Darling A = %.3f, p = %.4f -> %s\n\n", ad$statistic, ad$p.value,
            ifelse(ad$p.value > 0.05, "normal",
                   "NAO normal: use metodo de Clements ou Johnson")))

if (curto["Cp"] - curto["Cpk"] > 0.15)
  cat(sprintf("DIAGNOSTICO: descentrado. Cp - Cpk = %.2f. Ajustar a media em %+.3f mm.\n",
              curto["Cp"] - curto["Cpk"], ALVO - mu))
if (curto["Cpk"] - longo["Cpk"] > 0.15)
  cat(sprintf("DIAGNOSTICO: instavel. Cpk - Ppk = %.2f. Va ao SPC.\n",
              curto["Cpk"] - longo["Cpk"]))

# Alternativa direta: pacote qcc
# library(qcc); process.capability(qcc(x, type = "xbar.one", plot = FALSE),
#                                  spec.limits = c(LIE, LSE), target = ALVO)
--- excel
' Dados em A2:A121, LIE em E1, LSE em E2, ALVO em E3

' Sigma de longo prazo
=DESVPAD.A(A2:A121)

' Sigma de curto prazo pela amplitude movel (coluna B a partir de B3)
B3:  =ABS(A3-A2)          ' arrastar ate B121
=MÉDIA(B3:B121)/1,128

' Indices  (sigma_curto em E5, sigma_longo em E6, media em E4)
Cp  =(E2-E1)/(6*E5)
Cpk =MÍNIMO(E2-E4;E4-E1)/(3*E5)
Cpm =(E2-E1)/(6*RAIZ(E5^2+(E4-E3)^2))
Pp  =(E2-E1)/(6*E6)
Ppk =MÍNIMO(E2-E4;E4-E1)/(3*E6)

' PPM esperado a longo prazo
=(DIST.NORM.N(E1;E4;E6;VERDADEIRO)+(1-DIST.NORM.N(E2;E4;E6;VERDADEIRO)))*1000000

' PPM observado
=(CONT.SE(A2:A121;"<"&E1)+CONT.SE(A2:A121;">"&E2))/CONTAR(A2:A121)*1000000
--- dax
// Medidas de capabilidade em Power BI
// Tabela 'Medicoes' com colunas [Valor], [Data], [Turno]; parametros em 'Spec'

Media = AVERAGE ( Medicoes[Valor] )

SigmaLongo = STDEV.S ( Medicoes[Valor] )

// Sigma de curto prazo pela amplitude movel
SigmaCurto =
VAR ComMR =
    ADDCOLUMNS (
        Medicoes,
        "@MR",
        VAR d = Medicoes[Data]
        VAR ant = CALCULATE ( MAX ( Medicoes[Valor] ), Medicoes[Data] < d )
        RETURN ABS ( Medicoes[Valor] - ant )
    )
RETURN DIVIDE ( AVERAGEX ( ComMR, [@MR] ), 1.128 )

Cp  = DIVIDE ( [LSE] - [LIE], 6 * [SigmaCurto] )

Cpk = DIVIDE ( MIN ( [LSE] - [Media], [Media] - [LIE] ), 3 * [SigmaCurto] )

Ppk = DIVIDE ( MIN ( [LSE] - [Media], [Media] - [LIE] ), 3 * [SigmaLongo] )

// Semaforo para o cartao KPI
StatusCpk =
SWITCH (
    TRUE (),
    [Cpk] >= 1.67, "Excelente",
    [Cpk] >= 1.33, "Conforme",
    [Cpk] >= 1.00, "Marginal",
    "Nao capaz"
)
```

---

## 7 · Quando a distribuição não é normal

É mais frequente do que se admite: batimento, rugosidade, planeza, concentricidade e tudo o que é
**limitado num dos lados por zero** raramente é normal. Aplicar as fórmulas acima nesses casos
produz Cpk otimistas — às vezes por um fator de dois.

| Situação | O que fazer |
|---|---|
| Assimetria moderada, causa conhecida | Transformação de Box-Cox ou Johnson, depois índices normais |
| Característica limitada em zero (batimento, forma) | Método de **Clements** com percentis 0,135% e 99,865% |
| Distribuição identificada (Weibull, lognormal) | Percentis da própria distribuição ajustada |
| Dados por atributos (passa / não passa) | Não use Cpk. Use **PPM** e carta p ou np |

A definição generalizada, que funciona em qualquer distribuição, substitui os $6\sigma$ pelo
intervalo entre percentis:

$$P_{pk} = \min\left(\frac{LSE - x_{0{,}5}}{x_{99{,}865} - x_{0{,}5}},\ \frac{x_{0{,}5} - LIE}{x_{0{,}5} - x_{0{,}135}}\right)$$

Para a normal, esta fórmula reduz-se exatamente à clássica — é a mesma coisa escrita de forma mais
geral. O Capítulo 72 do manual trata este caso em detalhe.

---

## 8 · A lista de verificação antes de assinar um relatório

1. O processo está em **controlo estatístico**? (carta antes de índice, sempre)
2. Os dados são **normais**? Foi testado, e o teste está no relatório?
3. O **subgrupo é racional**? (Capítulo 66 — esta decisão determina o sigma de curto prazo)
4. Há **pelo menos 100 medições**, de preferência 125+, cobrindo turnos e lotes?
5. O sistema de medição foi validado? Um **Gage R&R acima de 30%** invalida qualquer Cpk — a
   variação medida é do instrumento, não do processo.
6. Estão reportados os **quatro índices**, não só o mais favorável?
7. A **especificação está correta** e é a versão em vigor do desenho?
8. O relatório diz **qual sigma foi usado** em cada índice?

O ponto 5 é o que mais frequentemente se ignora: se o Gage R&R consome 30% da tolerância, o
$\sigma$ observado já contém $\sigma_{medição}$, e o Cpk real do processo é **melhor** do que o
calculado. Corrigir isso é aritmética simples:

$$\sigma_{processo} = \sqrt{\sigma_{observado}^2 - \sigma_{medição}^2}$$

---

### Erros comuns

1. **Calcular capabilidade num processo instável.** O erro nº 1, e o mais caro.
2. **Usar `std()` sem `ddof=1`** (ou `n` em vez de `n-1`). Subestima o sigma e inflaciona todos os
   índices. Em R, `sd()` já usa n−1; em Python, `numpy.std()` usa n por omissão.
3. **Confundir $\bar{R}/d_2$ com $s$.** São coisas diferentes e respondem a perguntas diferentes.
4. **Reportar Cpk quando o cliente pediu Ppk.** Ou, pior, alternar entre os dois conforme convém.
5. **Ignorar o alvo.** Um processo dentro da tolerância mas longe do alvo tem Cpk bom e Cpm mau — e
   quem monta a peça a jusante nota a diferença.
6. **Aplicar índices a dados não normais** sem verificar.
7. **Esquecer o sistema de medição.** Ver ponto 5 acima.

### Ligações

- **Capítulo 66** — subgrupo racional: a decisão que determina o sigma de curto prazo.
- **Capítulo 67 e 68** — cartas de controlo: o pré-requisito de estabilidade.
- **Capítulo 61** — Gage R&R: sem ele, o Cpk é ficção.
- **Capítulo 72** — capability não-normal e por atributos.
- **Capítulo 101** — IATF 16949: onde os requisitos de Cpk/Ppk aparecem contratualmente.
