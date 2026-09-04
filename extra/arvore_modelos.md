<a id="capitulo-171"></a>
## Capítulo 171: Modelos de Árvore: Random Forest e Gradient Boosting (XGBoost)

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>A regressão logística do <a href="#/aula/cap-111">Capítulo 111</a> já explica bem a maior parte dos lotes de risco. Mas erra sistematicamente numa combinação específica: temperatura alta <strong>junto com</strong> ferramenta desgastada. Isoladamente, nenhuma das duas variáveis prevê o defeito — só a combinação. Como capturar isso sem especificar manualmente qual interação procurar?</em></p>
<p>Um modelo linear (ou logístico) só enxerga a interação <em>temperatura × desgaste</em> se alguém criar explicitamente essa variável multiplicada. Com dezenas de variáveis de processo, o número de interações possíveis cresce rápido demais para testar todas à mão. Modelos de árvore resolvem esse problema de outra forma: aprendem interações e não-linearidades diretamente dos dados, sem que ninguém precise nomeá-las.</p>
<h3 id="por-que-arvores-capturam-interacoes-e-nao-linearidades">Por que árvores capturam interações e não-linearidades automaticamente</h3>
<p>Uma árvore de decisão particiona o espaço de variáveis em retangulos sucessivos: primeiro divide por uma variável (por exemplo, “desgaste &gt; 70?”), depois, <strong>dentro de cada ramo</strong>, pode dividir por outra variável com um limiar diferente. O efeito de temperatura no ramo “desgaste alto” pode ser completamente diferente do efeito de temperatura no ramo “desgaste baixo” — isso é, por construção, uma interação, capturada sem que nenhuma variável de interação tenha sido criada à mão (compare com a regressão múltipla do <a href="#/aula/cap-051">Capítulo 51</a>, onde interações precisam ser especificadas explicitamente no modelo).</p>
<p>Uma árvore única, porém, tem alta variância: pequenas mudanças nos dados de treino produzem árvores muito diferentes. As duas famílias de modelo usadas na prática industrial — Random Forest e Gradient Boosting — combinam muitas árvores para reduzir essa variância, cada uma por um caminho diferente.</p>
<h3 id="random-forest-bagging-de-arvores-independentes">Random Forest: bagging de árvores independentes</h3>
<p>Cada árvore da floresta é treinada num reamostragem <em>bootstrap</em> dos dados (amostragem com reposição) e, em cada divisão, só considera um subconjunto aleatório das variáveis — as duas fontes de aleatoriedade que decorrelacionam as árvores entre si. A previsão final é a média (regressão) ou o voto majoritário (classificação) de todas as árvores. Hiperparâmetros que mais importam na prática:</p>
<ul>
<li><strong><code>n_estimators</code></strong> — número de árvores; mais árvores raramente pioram o modelo, só custam mais tempo de treino (ao contrário do Gradient Boosting, ver abaixo).</li>
<li><strong><code>max_depth</code></strong> e <strong><code>min_samples_leaf</code></strong> — controlam o quanto cada árvore individual pode crescer; árvores mais rasas reduzem overfitting à custa de interações mais complexas não serem capturadas.</li>
<li><strong><code>max_features</code></strong> — quantas variáveis são consideradas em cada divisão; valores menores aumentam a decorrelação entre árvores.</li>
</ul>
<h3 id="gradient-boosting-xgboost-arvores-sequenciais-corrigindo-o-erro">Gradient Boosting / XGBoost: árvores sequenciais corrigindo o erro</h3>
<p>Em vez de árvores independentes, o <em>gradient boosting</em> treina árvores <strong>em série</strong>: cada nova árvore é ajustada para corrigir o erro residual deixado pelas anteriores. XGBoost é uma implementação otimizada e regularizada dessa ideia, muito usada em produção pela combinação de velocidade e desempenho preditivo. Hiperparâmetros-chave:</p>
<ul>
<li><strong><code>learning_rate</code></strong> — o quanto cada árvore nova corrige o erro anterior; valores menores exigem mais árvores mas generalizam melhor.</li>
<li><strong><code>n_estimators</code></strong> — aqui, ao contrário do Random Forest, <strong>mais árvores podem piorar</strong> o desempenho fora da amostra: o modelo continua corrigindo resíduos do treino até memorizá-lo.</li>
<li><strong><code>max_depth</code></strong> — tipicamente bem menor do que no Random Forest (3–6 é comum), porque cada árvore só precisa corrigir um pedaço do erro, não explicar o problema inteiro sozinha.</li>
</ul>
<p>Por essa razão, <code>n_estimators</code> e <code>max_depth</code> em conjunto devem sempre ser escolhidos com o framework de validação do <a href="#/aula/cap-170">Capítulo 170</a> (<code>TimeSeriesSplit</code> + <code>GridSearchCV</code>), nunca por tentativa manual: é exatamente o tipo de hiperparâmetro em que overfitting silencioso é fácil de introduzir sem perceber.</p>
<h3 id="exemplo-resolvido-comparando-tres-familias-de-modelo">Exemplo resolvido: comparando três famílias de modelo</h3>
<div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="cte5f550bd-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="cte5f550bd-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.metrics import mean_absolute_error
from xgboost import XGBRegressor

rng = np.random.default_rng(2026)
n = 1200

temp = rng.normal(215, 7, n)
desgaste = rng.uniform(0, 100, n)
dia = np.arange(n)

# --- Efeito NAO-LINEAR e com INTERACAO: so degrada muito quando os dois sao altos ---
efeito = 0.02 * (temp - 215) + 0.01 * desgaste + 0.0025 * np.maximum(temp - 218, 0) * desgaste
producao_perdida = np.clip(2.0 + efeito + rng.normal(0, 1.0, n), 0, None)

df = pd.DataFrame({"dia": dia, "temp": temp, "desgaste": desgaste})
y = producao_perdida

corte = int(0.8 * n)
X_dev, X_teste = df.iloc[:corte], df.iloc[corte:]
y_dev, y_teste = y[:corte], y[corte:]

cv = TimeSeriesSplit(n_splits=5)

modelos = {
    "Ridge (linear, sem termo de interacao)": (Ridge(), {"alpha": [0.1, 1.0, 10.0]}),
    "Random Forest": (RandomForestRegressor(random_state=0),
                       {"n_estimators": [200], "max_depth": [4, 8, None]}),
    "XGBoost": (XGBRegressor(random_state=0, objective="reg:squarederror"),
                {"n_estimators": [100, 300], "max_depth": [2, 4], "learning_rate": [0.05, 0.1]}),
}

resultados = []
melhor_rf = None
for nome, (modelo, grade) in modelos.items():
    busca = GridSearchCV(modelo, grade, cv=cv, scoring="neg_mean_absolute_error")
    busca.fit(X_dev, y_dev)
    pred = busca.best_estimator_.predict(X_teste)
    mae = mean_absolute_error(y_teste, pred)
    resultados.append({"modelo": nome, "melhores_parametros": busca.best_params_,
                        "MAE_teste_externo": round(mae, 3)})
    if nome == "Random Forest":
        melhor_rf = busca.best_estimator_

tab = pd.DataFrame(resultados)
print("Comparacao no MESMO teste externo (nunca usado na busca de hiperparametros):")
print(tab.to_string(index=False))

print("\nFeature importance nativa do Random Forest:")
for var, imp in sorted(zip(X_dev.columns, melhor_rf.feature_importances_),
                        key=lambda x: -x[1]):
    print(f"  {var:10s}  {imp:.3f}")
print("\nRepare que o Ridge (linear) fica sistematicamente pior -- ele nao tem como")
print("representar o termo de interacao temp x desgaste sem que alguem o construa")
print("manualmente. As arvores capturam isso sem qualquer engenharia de variavel extra.")</code></pre></div></div></div><p><strong>Leitura de engenharia.</strong> As três famílias são comparadas usando exatamente o mesmo esquema de validação cruzada temporal e o mesmo teste externo intocado, do <a href="#/aula/cap-170">Capítulo 170</a> — sem esse cuidado, a comparação entre modelos não é justa, porque cada família tem uma tendência diferente a se ajustar excessivamente ao ruído do conjunto usado na comparação.</p>
<h3 id="feature-importance-nativa-o-que-ela-mede-e-o-que-nao-mede">Feature importance nativa: o que ela mede (e o que não mede)</h3>
<p>A <code>feature_importances_</code> de um Random Forest ou XGBoost mede, em média, o quão útil uma variável foi para reduzir o erro nas divisões das árvores — é uma medida de <strong>utilidade preditiva agregada</strong>, calculada sobre o conjunto de treino inteiro. Duas limitações importantes:</p>
<ul>
<li><strong>Não é causalidade.</strong> Uma variável pode ter importância alta por ser um <em>proxy</em> de outra causa real não medida — o mesmo alerta já feito no <a href="#/aula/cap-111">Capítulo 111</a> sobre importância de variável. Para saber o que mudar no processo, ainda é preciso um DOE (<a href="#/aula/cap-073">Capítulo 73</a>).</li>
<li><strong>É uma média global, não explica um caso individual.</strong> Não diz por que <em>este</em> lote específico foi sinalizado como risco — só diz que, em média, aquela variável importa. Essa lacuna é exatamente o que o próximo capítulo resolve, com SHAP.</li>
</ul>
<h3 id="exercicio-proposto">Exercício proposto</h3>
<p>No exemplo resolvido, treine um Random Forest deliberadamente profundo demais (<code>max_depth=None</code>, <code>min_samples_leaf=1</code>) e compare o MAE no bloco de desenvolvimento (dentro da validação cruzada) com o MAE no teste externo. Depois repita com <code>max_depth=3</code>. Discuta em qual dos dois casos a diferença entre os dois MAE é maior, e por que essa diferença é o sintoma prático de overfitting.</p>
<h3 id="erros-comuns">Erros comuns</h3>
<ol>
<li><strong>Aumentar <code>n_estimators</code> do XGBoost sem limite, achando que mais árvores sempre ajuda.</strong> No boosting, ao contrário do Random Forest, isso pode piorar o desempenho fora da amostra.</li>
<li><strong>Não comparar contra um baseline linear.</strong> Se o Ridge/regressão logística já explica quase tudo, a complexidade extra de um modelo de árvore pode não se justificar (ver a mesma lógica de “comece pelo modelo simples” do <a href="#/aula/cap-111">Capítulo 111</a>).</li>
<li><strong>Interpretar <code>feature_importances_</code> como causalidade.</strong> É utilidade preditiva média, não efeito causal.</li>
<li><strong>Escolher hiperparâmetros de árvore fora do framework de validação cruzada temporal.</strong> Ver <a href="#/aula/cap-170">Capítulo 170</a> — esses hiperparâmetros controlam diretamente o risco de overfitting.</li>
<li><strong>Ignorar o tempo de inferência em produção.</strong> Uma floresta com milhares de árvores profundas pode ser inviável para decisão em tempo real na linha de produção, mesmo com desempenho preditivo superior.</li>
</ol>
<p><em>Fonte principal: scikit-learn User Guide — seção “1.11. Ensemble methods” (Random Forest, Gradient Boosting). Cross-check: Kuhn &amp; Johnson, “Applied Predictive Modeling”, capítulo “Regression Trees and Rule-Based Models”; James, Witten, Hastie &amp; Tibshirani, “An Introduction to Statistical Learning”, capítulo “Tree-Based Methods”; documentação oficial XGBoost (xgboost.readthedocs.io), seção de parâmetros. Verificado via pesquisa na web em 01/09/2026.</em></p>

