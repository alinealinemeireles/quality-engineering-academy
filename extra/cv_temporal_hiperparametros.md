<a id="capitulo-170"></a>
## Capítulo 170: Validação Cruzada Temporal e Busca de Hiperparâmetros (TimeSeriesSplit, GridSearchCV)

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>Seu modelo teve 91% de acurácia na validação cruzada padrão. Um mês depois, em produção, caiu para 64%. O que aconteceu?</em></p>
<p>Quase sempre, a resposta é: a validação cruzada usada não respeitava a ordem do tempo. Já vimos no <a href="#/aula/cap-169">Capítulo 915</a> como escolher a métrica certa para julgar um modelo de qualidade; este capítulo trata de uma pergunta anterior e mais fundamental — como gerar uma estimativa de desempenho em que se possa confiar, quando os dados têm estrutura temporal, como é o caso de qualquer série de produção, lote a lote, dia a dia.</p>
<h3 id="por-que-a-validacao-cruzada-aleatoria-vaza-informacao-temporal">Por que a validação cruzada aleatória vaza informação temporal</h3>
<p>A validação cruzada padrão (<code>KFold</code>) embaralha as linhas e divide em blocos aleatórios, assumindo que as observações são independentes entre si. Em dados de produção essa suposição é falsa por construção: um lote produzido na terça-feira é estatisticamente parecido com o lote de segunda-feira (mesmo turno, mesma ferramenta, mesmo desgaste acumulado), e variáveis derivadas — médias móveis, variáveis defasadas (<em>lag features</em>) — são construídas <strong>a partir</strong> de observações vizinhas no tempo. Quando o embaralhamento aleatório coloca uma observação de terça no treino e a de segunda no teste, o modelo está, na prática, sendo testado com informação que “conhece o futuro” em relação àquele ponto — o mesmo problema de fuga de informação já discutido no <a href="#/aula/cap-111">Capítulo 111</a>, só que introduzido pelo próprio método de validação, não por uma variável específica.</p>
<p>O sintoma é sempre o mesmo: desempenho de validação otimista demais, que não se sustenta em produção.</p>
<h3 id="timeseriessplit-validacao-respeitando-a-ordem-cronologica">TimeSeriesSplit: validação respeitando a ordem cronológica</h3>
<p>O <code>TimeSeriesSplit</code> do scikit-learn resolve isso com uma <strong>janela expansiva</strong>: a primeira dobra treina nos dados mais antigos e testa no bloco seguinte; a segunda dobra inclui esse bloco no treino e testa no próximo; e assim sucessivamente. O treino nunca contém observações posteriores ao teste correspondente — em nenhuma dobra.</p>
<p><div class="math-block" data-math="\text{Dobra } k:\quad \text{treino} = \{1, \dots, t_k\},\quad \text{teste} = \{t_k{+}1, \dots, t_{k+1}\}"></div></p>
<p>Comparado ao <code>KFold</code>, isso tem um custo: cada dobra usa menos dados de treino do que usaria uma divisão aleatória com a mesma proporção, e as primeiras dobras têm pouquíssimos dados. É um preço aceitável — a alternativa é uma estimativa de desempenho que não é válida para o uso real do modelo.</p>
<h3 id="split-hierarquico-treino-validacao-interna-e-teste-externo-intocado">Split hierárquico: treino, validação interna e teste externo intocado</h3>
<p>Existe uma segunda fonte de vazamento, mais sutil, chamada de <em>data snooping</em>: se o mesmo conjunto de teste é usado repetidamente para comparar dezenas de combinações de hiperparâmetros, a melhor combinação encontrada estará parcialmente “encaixada” nesse teste específico — mesmo sem nenhuma variável vazada, só pelo processo repetido de escolha. A solução é uma divisão em três blocos cronológicos, nunca dois:</p>
<ul>
<li><strong>Treino</strong> — onde os parâmetros do modelo são ajustados.</li>
<li><strong>Validação interna</strong> — onde hiperparâmetros e limiar de decisão (ver <a href="#/aula/cap-169">Capítulo 915</a>) são escolhidos, com quantas iterações forem necessárias.</li>
<li><strong>Teste externo</strong> — tocado <strong>uma única vez</strong>, no final, só para reportar o desempenho esperado. Nenhuma decisão de modelagem pode depender do resultado nesse bloco.</li>
</ul>
<p>Na prática, isso significa aplicar o <code>TimeSeriesSplit</code> <strong>dentro</strong> do bloco de treino+validação interna, mantendo o bloco de teste externo completamente fora do processo de seleção — uma divisão aninhada, não uma única divisão cronológica.</p>
<h3 id="exemplo-resolvido-o-custo-de-validar-errado">Exemplo resolvido: o custo de validar errado</h3>
<div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct2c660d40-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct2c660d40-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.model_selection import KFold, TimeSeriesSplit, GridSearchCV
from sklearn.metrics import mean_absolute_error

rng = np.random.default_rng(2026)
n = 900  # ~900 dias de producao, uma linha por dia

# --- Serie com tendencia lenta (desgaste de ferramenta) + ruido ---
t = np.arange(n)
tendencia = 0.015 * t
sazonal = 3.0 * np.sin(2 * np.pi * t / 7)     # padrao semanal
ruido = rng.normal(0, 2.0, n)
producao = 120 + tendencia + sazonal + ruido

df = pd.DataFrame({"dia": t, "producao": producao})
df["lag1"] = df["producao"].shift(1)
df["lag7"] = df["producao"].shift(7)
df["media_movel_7"] = df["producao"].shift(1).rolling(7).mean()
df = df.dropna().reset_index(drop=True)

X = df[["dia", "lag1", "lag7", "media_movel_7"]]
y = df["producao"]

# --- Reserva final: teste externo, nunca usado ate a ultima linha ---
corte_teste = int(0.85 * len(df))
X_dev, X_teste = X.iloc[:corte_teste], X.iloc[corte_teste:]
y_dev, y_teste = y.iloc[:corte_teste], y.iloc[corte_teste:]

modelo = Ridge()
grade = {"alpha": [0.1, 1.0, 5.0, 20.0]}

# --- Comparacao: KFold aleatorio vs. TimeSeriesSplit, ambos so no bloco DEV ---
for nome, cv in [("KFold aleatorio (ERRADO para serie temporal)", KFold(n_splits=5, shuffle=True, random_state=0)),
                  ("TimeSeriesSplit (correto)", TimeSeriesSplit(n_splits=5))]:
    busca = GridSearchCV(modelo, grade, cv=cv, scoring="neg_mean_absolute_error")
    busca.fit(X_dev, y_dev)
    mae_cv = -busca.best_score_
    pred_teste = busca.best_estimator_.predict(X_teste)
    mae_teste_real = mean_absolute_error(y_teste, pred_teste)
    print(f"{nome}")
    print(f"  melhor alpha        = {busca.best_params_['alpha']}")
    print(f"  MAE estimado na CV  = {mae_cv:.3f}")
    print(f"  MAE real no teste externo (nunca visto) = {mae_teste_real:.3f}")
    print(f"  otimismo da CV (MAE_teste - MAE_cv) = {mae_teste_real - mae_cv:+.3f}\n")</code></pre></div></div></div><p><strong>Leitura de engenharia.</strong> O <code>KFold</code> aleatório tende a produzir um MAE de validação mais otimista (menor) do que o MAE real observado no teste externo, porque cada dobra de treino contém vizinhos temporais imediatos do bloco de teste daquela dobra — exatamente o padrão de vazamento descrito acima. O <code>TimeSeriesSplit</code> produz uma estimativa mais próxima do real, às custas de usar menos dados em cada dobra de ajuste.</p>
<h3 id="gridsearchcv-buscando-hiperparametros-sem-vazar-o-teste">GridSearchCV: buscando hiperparâmetros sem vazar o teste</h3>
<p><code>GridSearchCV</code> automatiza a repetição de treino+avaliação para cada combinação de hiperparâmetros de uma grade, usando o esquema de validação cruzada passado em <code>cv</code> — no caso de dados temporais, um <code>TimeSeriesSplit</code>, nunca o padrão aleatório. O parâmetro <code>scoring</code> deve usar a métrica correta para o problema: para classificação desbalanceada, <code>average_precision</code> (PR-AUC, ver <a href="#/aula/cap-169">Capítulo 915</a>) costuma ser preferível a <code>accuracy</code>. Após a busca, <code>best_estimator_</code> é o modelo já re-treinado com a melhor combinação em todo o bloco de desenvolvimento — pronto para ser avaliado, uma única vez, no teste externo.</p>
<p>Com esse framework de validação estabelecido, o próximo capítulo aplica-o para comparar de forma justa três famílias de modelo: regressão linear regularizada, Random Forest e Gradient Boosting.</p>
<h3 id="exercicio-proposto">Exercício proposto</h3>
<p>No exemplo resolvido, aumente o número de dobras do <code>TimeSeriesSplit</code> de 5 para 10 e observe como o MAE estimado em validação muda. Em seguida, calcule quantas observações sobram na primeira dobra de treino com 10 divisões e discuta em que ponto aumentar o número de dobras deixa de ser útil, porque as primeiras dobras passam a treinar com poucos dados demais para o modelo estabilizar.</p>
<h3 id="erros-comuns">Erros comuns</h3>
<ol>
<li><strong>Usar <code>KFold</code> ou <code>train_test_split</code> aleatório em dados com estrutura temporal.</strong> É o erro mais comum e o mais silencioso — o código roda sem erro, só a estimativa de desempenho é otimista demais.</li>
<li><strong>Escolher hiperparâmetros olhando diretamente para o teste externo.</strong> Use sempre uma validação interna dentro do bloco de desenvolvimento; o teste externo é tocado uma única vez.</li>
<li><strong>Construir variáveis defasadas (<em>lag features</em>) antes de separar treino e teste.</strong> Se o <code>rolling()</code>/<code>shift()</code> for calculado no dataframe inteiro antes do split, informação do período de teste pode vazar para as variáveis do período de treino em certas implementações — confira sempre a direção do <code>shift</code>.</li>
<li><strong>Achar que mais dobras é sempre melhor.</strong> Com poucas observações, dobras demais deixam as primeiras janelas de treino pequenas demais para o modelo estabilizar.</li>
<li><strong>Comparar o MAE/AUC de validação cruzada diretamente com o de outro projeto.</strong> Só é comparável se o esquema de validação (aleatório vs. temporal, número de dobras) for o mesmo.</li>
</ol>
<p><em>Fonte principal: scikit-learn User Guide — seção “3.1. Cross-validation: evaluating estimator performance” (TimeSeriesSplit, GridSearchCV). Cross-check: Kuhn &amp; Johnson, “Applied Predictive Modeling”, capítulo 4 (“Over-Fitting and Model Tuning”, tratado como pré-requisito antes dos capítulos de modelos específicos); James, Witten, Hastie &amp; Tibshirani, “An Introduction to Statistical Learning”, capítulo 5 (“Resampling Methods”). Verificado via pesquisa na web em 01/09/2026.</em></p>

