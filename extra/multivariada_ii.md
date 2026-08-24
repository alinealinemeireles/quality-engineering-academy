<a id="capitulo-910"></a>
## Capítulo 56-A: Análise Multivariada II — Fatorial, Discriminante e MANOVA

### A pergunta de engenharia

*Você tem vinte variáveis de processo correlacionadas entre si. Quer saber quais delas realmente formam grupos com significado físico — não apenas números que se movem juntos por coincidência estatística — e, uma vez identificados os grupos, quer usar essa estrutura para classificar novas peças ou para comparar o efeito de um tratamento sobre várias características de qualidade ao mesmo tempo.*

Três perguntas diferentes, três ferramentas diferentes. A análise fatorial reduz muitas variáveis correlacionadas a um pequeno número de fatores latentes. A análise discriminante usa muitas variáveis de entrada para prever uma única saída categórica. O MANOVA estende o ANOVA para avaliar o efeito de um fator sobre várias variáveis de saída simultaneamente, em vez de uma de cada vez.

### Análise fatorial: variância comum, não variância total

O Capítulo 56 já cobriu a PCA (análise de componentes principais), que decompõe a **variância total** dos dados em componentes ortogonais, sem distinguir entre variância "significativa" e ruído de medição. A análise fatorial parte de uma suposição diferente: cada variável observada é explicada por um pequeno número de **fatores latentes** não observados diretamente, mais um termo de erro específico daquela variável:

$$x_i = \lambda_{i1} F_1 + \lambda_{i2} F_2 + \cdots + \lambda_{ik} F_k + \varepsilon_i$$

onde $F_1, \ldots, F_k$ são os fatores comuns, $\lambda_{ij}$ são as **cargas fatoriais** (a força da relação entre a variável $i$ e o fator $j$), e $\varepsilon_i$ é a variância específica daquela variável — incluindo o erro de medição. É essa separação entre variância comum (explicada pelos fatores) e variância específica que distingue a análise fatorial da PCA: a PCA usa toda a variância; a análise fatorial usa apenas a parte que as variáveis compartilham entre si. Na prática industrial, isso torna a análise fatorial mais adequada quando o objetivo é identificar **causas latentes** por trás de um conjunto de sintomas correlacionados — por exemplo, descobrir que dez medições de qualidade superficial diferentes são, na realidade, manifestações de apenas dois fatores físicos subjacentes (temperatura de processo e desgaste de ferramenta).

### Análise discriminante: muitas entradas, uma saída categórica

A análise discriminante linear (LDA) responde a uma pergunta de classificação: dado um conjunto de variáveis de entrada contínuas, a que categoria (grupo, classe, lote aprovado/reprovado) uma nova observação pertence com maior probabilidade? A LDA constrói combinações lineares das variáveis de entrada que **maximizam a separação entre grupos** relativamente à dispersão dentro de cada grupo — conceitualmente, o inverso do que o ANOVA testa: em vez de perguntar "estes grupos têm médias diferentes numa variável?", a LDA pergunta "que combinação de variáveis melhor separa estes grupos?" e depois usa essa combinação para classificar novos casos. Na engenharia da qualidade, um uso típico é combinar várias medições de processo (temperatura, pressão, viscosidade, tempo de cura) numa única regra de classificação que prevê se um lote vai ou não passar no teste final — antes mesmo de o teste ser feito.

### MANOVA: um fator, várias saídas simultâneas

O ANOVA convencional (Capítulo 50) testa se um ou mais fatores afetam **uma** variável de resposta. Quando o objetivo é avaliar se um fator afeta **várias** respostas correlacionadas ao mesmo tempo — por exemplo, se um novo fornecedor de matéria-prima afeta simultaneamente dureza, rugosidade e resistência à tração de uma peça —, rodar três ANOVAs separados infla a taxa de erro tipo I (Capítulo 48) e ignora a correlação entre as respostas. O MANOVA resolve isso testando o efeito do fator sobre o **vetor** de respostas de uma só vez.

A estatística de teste mais reportada é o **lambda de Wilks** ($\Lambda$), que mede a proporção da variância total nas variáveis de resposta que **não** é explicada pelo fator testado:

$$\Lambda = \frac{|\mathbf{E}|}{|\mathbf{E} + \mathbf{H}|}$$

onde $\mathbf{E}$ é a matriz de soma de quadrados e produtos cruzados dos resíduos (erro), e $\mathbf{H}$ é a matriz correspondente ao efeito do fator (hipótese). $\Lambda$ próximo de 0 indica que o fator explica quase toda a variância (efeito forte); $\Lambda$ próximo de 1 indica que o fator não explica quase nada (sem efeito) — o oposto da intuição do $R^2$ do ANOVA convencional, o que costuma confundir quem vê o lambda de Wilks pela primeira vez.

### Exemplo resolvido: os três métodos num único conjunto de dados de processo

```py-r
--- python
import numpy as np
import pandas as pd
from sklearn.decomposition import FactorAnalysis
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.model_selection import train_test_split
from statsmodels.multivariate.manova import MANOVA

rng = np.random.default_rng(2026)
n = 240

# Dois fatores latentes fisicos: temperatura de processo e desgaste de ferramenta
temp_proc = rng.normal(0, 1, n)
desgaste  = rng.normal(0, 1, n)

# Oito medicoes de qualidade superficial: as 4 primeiras dominadas por temperatura,
# as 4 ultimas dominadas por desgaste -- duas causas latentes fisicamente distintas
cols = {}
for i in range(8):
    if i < 4:
        w_t, w_d = rng.uniform(0.75, 0.95), rng.uniform(0.05, 0.25)
    else:
        w_t, w_d = rng.uniform(0.05, 0.25), rng.uniform(0.75, 0.95)
    cols[f"medida_{i+1}"] = w_t*temp_proc + w_d*desgaste + rng.normal(0, 0.35, n)
X = pd.DataFrame(cols)

# --- 1) Analise fatorial (com rotacao varimax, para estrutura simples e interpretavel) ---
fa = FactorAnalysis(n_components=2, random_state=0, rotation="varimax").fit(X)
cargas = pd.DataFrame(fa.components_.T, index=X.columns,
                       columns=["Fator 1", "Fator 2"]).round(2)
print("PASSO 1 -- Analise fatorial (cargas):")
print(cargas)
print("Leitura: as medidas com carga alta no mesmo fator partilham a mesma causa latente.\n")

# --- 2) Analise discriminante: prever aprovado/reprovado a partir das medidas ---
score = 3*temp_proc - 2*desgaste + rng.normal(0, 1.5, n)
aprovado = (score > np.median(score)).astype(int)
Xtr, Xte, ytr, yte = train_test_split(X, aprovado, test_size=0.3, random_state=0)
lda = LinearDiscriminantAnalysis().fit(Xtr, ytr)
acc = lda.score(Xte, yte)
print(f"PASSO 2 -- Analise discriminante: acuracia na classificacao aprovado/reprovado = {acc:.1%}\n")

# --- 3) MANOVA: um fator categorico (turno) afeta 3 respostas ao mesmo tempo? ---
turno = rng.choice(["A", "B", "C"], size=n)
efeito_turno = pd.Series(turno).map({"A": 0.0, "B": 0.35, "C": -0.20}).values
dureza      = 60 + 2*temp_proc + efeito_turno*3 + rng.normal(0, 1.5, n)
rugosidade  = 1.2 + 0.3*desgaste + efeito_turno*0.4 + rng.normal(0, 0.2, n)
resistencia = 400 + 5*temp_proc - 3*desgaste + efeito_turno*6 + rng.normal(0, 8, n)

df = pd.DataFrame({"turno": turno, "dureza": dureza,
                    "rugosidade": rugosidade, "resistencia": resistencia})
maov = MANOVA.from_formula("dureza + rugosidade + resistencia ~ turno", data=df)
res = maov.mv_test()
print("PASSO 3 -- MANOVA: efeito do turno sobre (dureza, rugosidade, resistencia):")
print(res)
```

**Leitura de engenharia.** No Passo 1, as cargas fatoriais devem separar claramente as oito medidas em dois grupos, revelando que — apesar de haver oito números na folha de inspeção — só existem duas causas físicas independentes por trás deles; investir em reduzir a variabilidade de "temperatura de processo" e "desgaste de ferramenta" resolve as oito medidas de uma vez, em vez de perseguir cada uma isoladamente. No Passo 3, um valor de $p$ pequeno associado ao lambda de Wilks confirma que o turno afeta o conjunto das três respostas conjuntamente — mesmo que, testada isoladamente, alguma das três respostas não mostrasse um efeito estatisticamente significativo de turno.

### Ferramentas: Excel, Power BI e Minitab

**Excel 365.** O Analysis ToolPak não inclui análise fatorial, análise discriminante nem MANOVA — são métodos matriciais além do que uma folha de cálculo comum suporta bem. O Excel serve, quando muito, para organizar e limpar os dados de entrada antes de os levar a Python, R ou Minitab.

**Power BI (DAX).** Da mesma forma, não é uma ferramenta de cálculo para estas três técnicas; o papel do Power BI aqui é a jusante — visualizar os resultados já calculados (por exemplo, um scatter plot dos dois primeiros fatores, colorido pela classe prevista pela análise discriminante) para consumo por quem não roda o modelo diretamente.

**Minitab** (versão atual — conferir em minitab.com): é a ferramenta comercial mais completa para as três técnicas neste capítulo. **Stat → Multivariate → Factor Analysis** ajusta o modelo fatorial e mostra as cargas rotacionadas; **Stat → Multivariate → Discriminant Analysis** constrói a regra de classificação e reporta a taxa de erro de classificação cruzada; **Stat → ANOVA → General MANOVA** roda o teste multivariado e reporta o lambda de Wilks junto com os outros três critérios clássicos (traço de Pillai, traço de Hotelling-Lawley e maior raiz de Roy), úteis quando os resultados dos diferentes critérios divergem em amostras pequenas ou desbalanceadas.

### Exercício proposto

Usando o conjunto de dados do exemplo resolvido, adicione um terceiro fator latente independente (por exemplo, "variação de matéria-prima") que afete apenas quatro das oito medidas de qualidade superficial, e rode novamente a análise fatorial pedindo três fatores em vez de dois. Verifique se as cargas conseguem separar corretamente as medidas em três grupos, e discuta o que aconteceria à qualidade da separação se as oito medidas fossem reduzidas a apenas cinco.

### Erros comuns

1. **Usar PCA quando o objetivo real é análise fatorial.** Se a pergunta é "que causas latentes explicam estes sintomas correlacionados?", PCA responde a uma pergunta ligeiramente diferente (redução de variância total, sem separar sinal de ruído específico).
2. **Rodar vários ANOVAs em vez de um MANOVA quando as respostas são correlacionadas.** Além de inflacionar o erro tipo I, ignora informação real sobre como as respostas se movem juntas.
3. **Interpretar o lambda de Wilks como um R².** É o oposto: valores baixos indicam efeito forte, valores próximos de 1 indicam efeito fraco.
4. **Aplicar LDA sem verificar a separabilidade linear dos grupos.** Quando os grupos não são linearmente separáveis nas variáveis originais, a LDA tem desempenho fraco; nesses casos, métodos não lineares de classificação são mais apropriados.
5. **Ignorar a validação fora da amostra na análise discriminante.** Uma regra de classificação ajustada e avaliada nos mesmos dados tende a parecer melhor do que realmente é — sempre separe dados de treino e de teste, como no exemplo acima.

*Fonte principal: ASQ Certified Six Sigma Black Belt Body of Knowledge (2022), seção VI.A.3 "Multivariate tools". Cross-check: SixSigma.us e MSI Certified, material introdutório sobre análise fatorial, análise discriminante e MANOVA em contexto Six Sigma; Statistics How To, "Wilks' Lambda". Verificado via pesquisa na web em 22/08/2026.*

### Revisão técnica 2026 — Capítulo 910

**Status:** Capítulo novo, escrito para cobrir a lacuna do tópico VI.A.3 do BOK do CSSBB (análise fatorial, discriminante e MANOVA), identificada em auditoria de conteúdo de agosto de 2026.
