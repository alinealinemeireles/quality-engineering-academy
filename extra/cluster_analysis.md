<a id="capitulo-907"></a>
## Capítulo 56-A: Análise de Clusters — Hierárquica e K-Means na Qualidade

> **Nota editorial.** Capítulo escrito de raiz para a edição web, como extensão natural do
> Capítulo 56 (PCA e T² de Hotelling). O PCA responde "quantas dimensões independentes existem
> nos meus dados?"; a análise de clusters responde uma pergunta diferente e complementar:
> "que grupos naturais de observações parecidas existem, sem eu ter dito ao algoritmo quais são?"
> É a principal técnica **não supervisionada** ainda ausente do manual, e uma das mais usadas na
> prática para segmentar fornecedores, produtos, modos de falha e assinaturas de processo.

### A pergunta de engenharia

*Tenho 40 fornecedores, cada um com uma dúzia de indicadores de qualidade. Há grupos naturais aí
dentro — ou estou só a olhar para uma nuvem de pontos e a inventar padrões que não existem?*

A análise de clusters é a família de técnicas estatísticas que responde a essa pergunta de forma
sistemática: agrupa observações de modo que as de dentro de cada grupo sejam parecidas entre si e
as de grupos diferentes sejam distintas, usando apenas as variáveis medidas — sem nenhuma variável
de resposta ou rótulo pré-definido a orientar o agrupamento. Por isso se chama **aprendizagem não
supervisionada**: ao contrário da regressão (capítulos 51-55) ou da classificação, não há um "y"
certo contra o qual validar o resultado. O grupo existe, ou não existe, e cabe a quem analisa
decidir se faz sentido de engenharia — a estatística sozinha nunca prova que um cluster é "real".

---

## 1 · Duas famílias, duas perguntas diferentes

<figure class="figure2026">
<svg role="img" aria-label="Duas familias de clustering: hierarquico e k-means, com as perguntas que cada uma responde" viewBox="0 0 720 320" style="width:100%;height:auto;display:block;background:var(--surface-1);border:1px solid var(--line);border-radius:10px" xmlns="http://www.w3.org/2000/svg">
<style>
.cl-t { font-family: "Segoe UI", Inter, system-ui, sans-serif; }
.cl-h { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-weight: 700; fill: var(--surface-1); font-size: 15px; }
.cl-s { font-family: "Segoe UI", Inter, system-ui, sans-serif; fill: var(--surface-1); font-size: 11.5px; opacity: .92; }
</style>
<g data-tip="<b>Clustering hierárquico.</b> Constrói uma árvore de fusões sucessivas (dendrograma). Não é preciso decidir k antes — corta-se a árvore à altura que fizer sentido, depois de ver a estrutura. Bom para explorar dados novos e para conjuntos pequenos/médios (até algumas centenas de observações).">
  <rect x="30" y="30" width="300" height="110" rx="12" fill="var(--series-1)"/>
  <text class="cl-h" x="180" y="65" text-anchor="middle">Hierárquico (aglomerativo)</text>
  <text class="cl-s" x="180" y="88" text-anchor="middle">"Como é que os pontos se juntam,</text>
  <text class="cl-s" x="180" y="105" text-anchor="middle">do mais parecido ao menos parecido?"</text>
  <text class="cl-s" x="180" y="125" text-anchor="middle">Não exige decidir k antecipadamente</text>
</g>
<g data-tip="<b>K-Means.</b> Decide-se k (número de grupos) antecipadamente e o algoritmo particiona os dados em k grupos, minimizando a distância de cada ponto ao centro do seu grupo. Escala para milhares/milhões de observações — a escolha certa quando o dendrograma seria grande demais para interpretar.">
  <rect x="390" y="30" width="300" height="110" rx="12" fill="var(--series-2)"/>
  <text class="cl-h" x="540" y="65" text-anchor="middle">K-Means (particionamento)</text>
  <text class="cl-s" x="540" y="88" text-anchor="middle">"Dado que quero k grupos,</text>
  <text class="cl-s" x="540" y="105" text-anchor="middle">qual é a melhor partição possível?"</text>
  <text class="cl-s" x="540" y="125" text-anchor="middle">Exige decidir k antecipadamente</text>
</g>
<line x1="180" y1="140" x2="180" y2="175" stroke="#7c8f99" stroke-width="1.6"/>
<line x1="540" y1="140" x2="540" y2="175" stroke="#7c8f99" stroke-width="1.6"/>
<g data-tip="<b>Quando usar hierárquico.</b> Poucas dezenas a poucas centenas de observações, quero ver a estrutura antes de decidir quantos grupos, ou quero comparar várias soluções de k a partir da mesma árvore sem recalcular tudo.">
  <rect x="30" y="180" width="300" height="115" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
  <text class="cl-t" x="180" y="205" text-anchor="middle" font-size="12.5" font-weight="700" fill="var(--ink-1)">Use quando</text>
  <text class="cl-t" x="180" y="228" text-anchor="middle" font-size="11" fill="var(--ink-2)">≤ algumas centenas de casos</text>
  <text class="cl-t" x="180" y="248" text-anchor="middle" font-size="11" fill="var(--ink-2)">quer explorar antes de decidir k</text>
  <text class="cl-t" x="180" y="268" text-anchor="middle" font-size="11" fill="var(--ink-2)">precisa de um dendrograma para relatório</text>
</g>
<g data-tip="<b>Quando usar k-means.</b> Muitas observações (milhares ou mais), já há uma ideia razoável de quantos grupos fazem sentido operacionalmente (ex.: 3 turnos, 4 famílias de produto), e a prioridade é escalar e repetir o agrupamento periodicamente sobre dados novos.">
  <rect x="390" y="180" width="300" height="115" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
  <text class="cl-t" x="540" y="205" text-anchor="middle" font-size="12.5" font-weight="700" fill="var(--ink-1)">Use quando</text>
  <text class="cl-t" x="540" y="228" text-anchor="middle" font-size="11" fill="var(--ink-2)">muitas observações (milhares+)</text>
  <text class="cl-t" x="540" y="248" text-anchor="middle" font-size="11" fill="var(--ink-2)">já há ideia aproximada de k</text>
  <text class="cl-t" x="540" y="268" text-anchor="middle" font-size="11" fill="var(--ink-2)">precisa repetir o agrupamento sobre dados novos</text>
</g>
</svg>
</figure>

---

## 2 · A base de tudo: distância e padronização

Qualquer método de clustering começa por definir "parecido" numericamente. A escolha mais comum é
a **distância euclidiana** entre dois pontos $\mathbf{x}_i$ e $\mathbf{x}_j$ com $p$ variáveis:

$$d(\mathbf{x}_i, \mathbf{x}_j) = \sqrt{\sum_{k=1}^{p} (x_{ik} - x_{jk})^2}$$

**O passo que mais gente esquece — e que mais distorce o resultado — é a padronização.** Se uma
variável é "PPM de defeitos" (0 a 50.000) e outra é "Cpk" (0,5 a 2,0), a distância euclidiana bruta
é dominada quase inteiramente pela primeira, e o algoritmo "vê" apenas essa variável, ignorando as
restantes na prática. A correção padrão é normalizar cada variável antes de calcular distâncias:

$$z_{ik} = \frac{x_{ik} - \bar{x}_k}{s_k}$$

exatamente a mesma padronização usada para as componentes principais no capítulo 56 — e não é
coincidência: PCA e clustering partilham a mesma sensibilidade a escala, e por isso é comum
encadeá-los (ver seção 6).

---

## 3 · Clustering hierárquico e o dendrograma

O algoritmo aglomerativo começa com cada observação como o seu próprio cluster e funde,
repetidamente, os dois clusters mais próximos, até restar um só. O resultado é uma árvore de
fusões — o **dendrograma** — onde a altura de cada fusão representa a distância entre os clusters
fundidos. Cortar a árvore a uma determinada altura produz uma partição em $k$ grupos; alturas
diferentes de corte dão números diferentes de grupos, todos calculados de uma vez só.

A decisão que mais afeta o resultado é o **método de ligação** (linkage) — como medir a distância
entre dois *clusters* (não entre dois pontos):

| Método de ligação | Como mede a distância entre clusters | Tendência |
|---|---|---|
| **Single (mínimo)** | Menor distância entre qualquer par de pontos dos dois clusters | Produz clusters alongados/em cadeia; sensível a outliers que "encadeiam" grupos distintos |
| **Complete (máximo)** | Maior distância entre qualquer par de pontos dos dois clusters | Produz clusters compactos e de tamanho parecido |
| **Average** | Média de todas as distâncias entre pares dos dois clusters | Compromisso entre single e complete |
| **Ward** | Minimiza o aumento da soma de quadrados dentro dos clusters ao fundir | O mais usado por omissão em qualidade — produz clusters compactos e de variância comparável, e liga-se diretamente à mesma lógica de "soma de quadrados dentro do grupo" do capítulo 54 |

**Regra prática:** comece por Ward com distância euclidiana sobre variáveis padronizadas. Mude
para single/complete apenas se tiver um motivo específico (ex.: suspeita de clusters alongados,
não esféricos).

---

## 4 · K-means: quando já se quer decidir k

O algoritmo de k-means parte de $k$ centros iniciais (aleatórios ou escolhidos) e itera dois passos
até convergir:

1. **Atribuição.** Cada ponto é atribuído ao centro (centróide) mais próximo.
2. **Atualização.** Cada centróide passa a ser a média dos pontos atualmente atribuídos a ele.

O critério que o algoritmo minimiza é a **soma de quadrados dentro dos clusters** (WCSS,
within-cluster sum of squares):

$$WCSS = \sum_{c=1}^{k} \sum_{\mathbf{x}_i \in C_c} \lVert \mathbf{x}_i - \boldsymbol{\mu}_c \rVert^2$$

**Como escolher $k$.** Duas técnicas complementares, nenhuma sozinha é suficiente:

- **Método do cotovelo (elbow).** Corre-se k-means para vários valores de $k$ e traça-se o WCSS
  contra $k$. O WCSS cai sempre que $k$ aumenta (no limite, $k = n$ dá WCSS = 0), mas a queda tem
  um "cotovelo" — o ponto a partir do qual aumentar $k$ traz cada vez menos benefício. É subjetivo
  por natureza; sirva-se dele como primeira estimativa, não como resposta final.
- **Coeficiente de silhueta.** Para cada ponto, compara a distância média aos pontos do seu próprio
  cluster ($a$) com a distância média aos pontos do cluster vizinho mais próximo ($b$):

$$s = \frac{b - a}{\max(a, b)}, \qquad s \in [-1, 1]$$

  Valores de silhueta próximos de 1 indicam ponto bem encaixado no seu cluster; próximos de 0,
  ponto na fronteira entre dois clusters; negativos, ponto provavelmente mal classificado. A
  silhueta **média** de toda a solução, comparada entre diferentes valores de $k$, é um critério
  mais objetivo que o cotovelo para escolher $k$.

<div class="kpi-row">
<div class="kpi ok"><div class="kpi-k">Silhueta média &gt; 0,50</div><div class="kpi-v">Estrutura forte</div><div class="kpi-s">clusters bem separados; a partição é defensável</div></div>
<div class="kpi warn"><div class="kpi-k">Silhueta média 0,25 – 0,50</div><div class="kpi-v">Estrutura fraca</div><div class="kpi-s">clusters existem mas sobrepõem-se; trate como indicativa</div></div>
<div class="kpi bad"><div class="kpi-k">Silhueta média &lt; 0,25</div><div class="kpi-v">Sem estrutura clara</div><div class="kpi-s">os dados podem não ter grupos naturais — não force uma partição</div></div>
</div>

---

## 5 · Exemplo resolvido: segmentar fornecedores por perfil de qualidade

```py-r
--- python
import numpy as np
import pandas as pd
from scipy.cluster.hierarchy import linkage, fcluster, dendrogram
from scipy.spatial.distance import pdist
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

rng = np.random.default_rng(56)

# 40 fornecedores, 3 indicadores: PPM de defeitos, Cpk médio, % entregas no prazo
n = 40
grupo_real = rng.choice(["A", "B", "C"], n, p=[0.35, 0.40, 0.25])
ppm = np.where(grupo_real == "A", rng.normal(800, 250, n),
      np.where(grupo_real == "B", rng.normal(4500, 900, n), rng.normal(12000, 2200, n)))
cpk = np.where(grupo_real == "A", rng.normal(1.55, 0.18, n),
      np.where(grupo_real == "B", rng.normal(1.15, 0.15, n), rng.normal(0.75, 0.14, n)))
otd = np.where(grupo_real == "A", rng.normal(97.5, 1.8, n),
      np.where(grupo_real == "B", rng.normal(92.0, 3.0, n), rng.normal(81.0, 5.5, n)))
ppm = np.clip(ppm, 50, None)

d = pd.DataFrame({"fornecedor": [f"F{i+1:02d}" for i in range(n)],
                   "ppm": ppm, "cpk": cpk, "otd_pct": otd})

X = StandardScaler().fit_transform(d[["ppm", "cpk", "otd_pct"]])

# --- Hierarquico (Ward) ---
Z = linkage(X, method="ward")
d["cluster_hier"] = fcluster(Z, t=3, criterion="maxclust")

# --- K-means, escolhendo k pelo cotovelo + silhueta ---
wcss, sil = [], []
for k in range(2, 7):
    km = KMeans(n_clusters=k, n_init=10, random_state=56).fit(X)
    wcss.append(km.inertia_)
    sil.append(silhouette_score(X, km.labels_))

print("k   WCSS      silhueta")
for k, w, s in zip(range(2, 7), wcss, sil):
    print(f"{k}   {w:8.1f}  {s:.3f}")

k_final = 3  # confirmado pelo cotovelo + pela silhueta maxima
km_final = KMeans(n_clusters=k_final, n_init=10, random_state=56).fit(X)
d["cluster_kmeans"] = km_final.labels_

print("\nPerfil medio por cluster (k-means):")
print(d.groupby("cluster_kmeans")[["ppm", "cpk", "otd_pct"]].mean().round(1))

print(f"\nSilhueta media da solucao final (k={k_final}): {silhouette_score(X, km_final.labels_):.3f}")
print(f"Concordancia hierarquico x k-means (tabela cruzada):")
print(pd.crosstab(d["cluster_hier"], d["cluster_kmeans"]))
--- r
library(cluster)   # silhouette()

set.seed(56)
n <- 40
grupo_real <- sample(c("A","B","C"), n, replace = TRUE, prob = c(0.35, 0.40, 0.25))
ppm <- ifelse(grupo_real == "A", rnorm(n, 800, 250),
       ifelse(grupo_real == "B", rnorm(n, 4500, 900), rnorm(n, 12000, 2200)))
cpk <- ifelse(grupo_real == "A", rnorm(n, 1.55, 0.18),
       ifelse(grupo_real == "B", rnorm(n, 1.15, 0.15), rnorm(n, 0.75, 0.14)))
otd <- ifelse(grupo_real == "A", rnorm(n, 97.5, 1.8),
       ifelse(grupo_real == "B", rnorm(n, 92.0, 3.0), rnorm(n, 81.0, 5.5)))
ppm <- pmax(ppm, 50)

d <- data.frame(fornecedor = sprintf("F%02d", 1:n), ppm, cpk, otd_pct = otd)
X <- scale(d[, c("ppm", "cpk", "otd_pct")])

# --- Hierarquico (Ward) ---
hc <- hclust(dist(X), method = "ward.D2")
d$cluster_hier <- cutree(hc, k = 3)

# --- K-means, k de 2 a 6: WCSS e silhueta ---
resultados <- data.frame(k = 2:6, wcss = NA, silhueta = NA)
for (k in 2:6) {
  km <- kmeans(X, centers = k, nstart = 10)
  resultados$wcss[resultados$k == k] <- km$tot.withinss
  resultados$silhueta[resultados$k == k] <- mean(silhouette(km$cluster, dist(X))[, 3])
}
print(resultados)

k_final <- 3
km_final <- kmeans(X, centers = k_final, nstart = 10)
d$cluster_kmeans <- km_final$cluster

cat("\nPerfil medio por cluster (k-means):\n")
print(aggregate(cbind(ppm, cpk, otd_pct) ~ cluster_kmeans, data = d, FUN = mean))

cat(sprintf("\nSilhueta media da solucao final (k=%d): %.3f\n",
            k_final, mean(silhouette(km_final$cluster, dist(X))[, 3])))
cat("Concordancia hierarquico x k-means:\n")
print(table(d$cluster_hier, d$cluster_kmeans))
```

```plotly
cluster-kmeans-scatter
```

```plotly
cluster-elbow
```

**Leitura de engenharia.** O gráfico do cotovelo mostra a queda do WCSS a estabilizar por volta de
$k=3$, e a silhueta média confirma: é o maior valor entre $k=2$ e $k=6$. O gráfico de dispersão
separa visualmente os três perfis de fornecedor — o grupo com PPM alto e Cpk baixo é imediato de
identificar sem nenhuma regra manual de corte. Note a tabela de concordância entre o método
hierárquico e o k-means: quando os dois métodos, com lógicas de agrupamento diferentes, convergem
para a mesma partição, isso é evidência de que os grupos são uma característica real dos dados —
não um artefacto do algoritmo escolhido.

---

## 6 · A ligação com PCA (capítulo 56) e com Six Sigma

Duas ligações práticas valem a pena tornar explícitas:

**PCA antes de clustering, quando há muitas variáveis correlacionadas.** Com dezenas de variáveis
de processo fortemente correlacionadas (o mesmo cenário do capítulo 56), calcular distâncias
diretamente sobre todas elas dá peso redundante às dimensões que se repetem. A prática comum é
reduzir primeiro por PCA (reter as componentes que explicam, por exemplo, 90% da variância) e só
depois aplicar clustering sobre os *scores* das componentes — reduz ruído e acelera o cálculo sem
perder a estrutura real dos dados.

**Clustering como diagnóstico anterior à segmentação de um projeto Six Sigma.** Antes de assumir
que "o processo" tem uma única distribuição (premissa por trás de todo o SPC clássico dos
capítulos 65-70), vale a pena verificar se os dados escondem sub-populações distintas — por
exemplo, duas máquinas com assinaturas de processo diferentes a alimentar a mesma carta de
controlo. Um cluster bem separado nos dados históricos de um "processo único" é, com frequência, o
sinal de que a carta deveria estar estratificada por máquina, turno ou fornecedor — o mesmo
problema de estratificação insuficiente tratado no capítulo 8, agora descoberto de forma
não supervisionada em vez de hipotetizado a priori.

### Erros comuns

1. **Não padronizar as variáveis antes de calcular distâncias.** O erro mais comum e mais grave —
   ver seção 2. Uma variável em escala maior domina silenciosamente o resultado inteiro.
2. **Escolher k só pelo cotovelo, sem verificar a silhueta.** O cotovelo é subjetivo e, em dados
   ruidosos, muitas vezes não tem um ponto de inflexão claro.
3. **Interpretar clusters de k-means como "a verdade" sem verificar estabilidade.** Corra o k-means
   várias vezes com sementes diferentes (`n_init`/`nstart` altos, como no exemplo) — se a partição
   mudar muito entre execuções, a estrutura é fraca.
4. **Usar k-means com clusters de forma muito não esférica ou de tamanhos muito desiguais.** O
   k-means assume implicitamente clusters aproximadamente esféricos e de variância parecida;
   nesses casos, hierárquico com linkage `single` ou métodos baseados em densidade (fora do âmbito
   deste capítulo) funcionam melhor.
5. **Tratar todo cluster encontrado como acionável.** Um cluster estatisticamente distinto pode não
   ter nenhum significado de engenharia. A validação final é sempre substantiva, não estatística:
   o grupo encontrado corresponde a algo que faz sentido conhecer sobre o processo?

### Ligações

- **Capítulo 56** — Análise Multivariada: PCA e T² de Hotelling — a técnica de redução de
  dimensão que frequentemente precede o clustering (ver seção 6).
- **Capítulo 54** — Modelos Mistos: a mesma lógica de decompor variação "dentro" vs "entre" grupos,
  aqui aplicada sem grupos pré-definidos.
- **Capítulo 8** — Processo e Estratificação: o cenário de "processo único" que o clustering pode
  revelar como, na verdade, várias sub-populações misturadas.
- **Capítulo 65** — Métodos de Controlo de Produto e Processo: subgrupos racionais mal definidos
  são, com frequência, clusters não detectados nos dados históricos.