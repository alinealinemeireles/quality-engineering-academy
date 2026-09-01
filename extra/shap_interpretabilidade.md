<a id="capitulo-172"></a>
## Capítulo 172: Interpretabilidade com SHAP

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>O Random Forest do <a href="#/aula/cap-171">Capítulo 917</a> acertou 94% dos lotes de risco. O gestor de qualidade pergunta: “por que <strong>este</strong> lote específico foi sinalizado?” — não em média, este lote.</em></p>
<p><code>feature_importances_</code> responde no agregado: em média, sobre todo o conjunto de treino, o desgaste da ferramenta importa mais do que a temperatura. Isso não ajuda a explicar uma decisão individual — e numa auditoria de qualidade, numa reclamação de cliente ou numa exigência regulatória, é exatamente a explicação individual que é pedida. É essa lacuna que os valores de Shapley (SHAP) preenchem.</p>
<h3 id="valores-de-shapley-intuicao-sem-a-teoria-dos-jogos-completa">Valores de Shapley: intuição sem a teoria dos jogos completa</h3>
<p>A ideia, emprestada da teoria dos jogos cooperativos, é distribuir de forma justa a diferença entre a previsão do modelo para uma observação específica e a previsão média do modelo (a “linha de base”) entre as variáveis que contribuíram para essa diferença:</p>
<p><div class="math-block" data-math="f(x) = f_{\text{base}} + \sum_{j=1}^{p} \phi_j"></div></p>
<p>onde <span class="math-inline" data-math="\phi_j"></span> é o valor de Shapley da variável <span class="math-inline" data-math="j"></span> para aquela observação específica — a contribuição marginal média dessa variável, considerando todas as ordens possíveis em que as variáveis poderiam ser “reveladas” ao modelo. Um <span class="math-inline" data-math="\phi_j"></span> positivo empurrou a previsão para cima em relação à linha de base; negativo, empurrou para baixo. A soma de todos os <span class="math-inline" data-math="\phi_j"></span> mais a linha de base reconstrói exatamente a previsão do modelo para aquele ponto — essa é a propriedade que torna o SHAP consistente e diferente de outras medidas de importância que não têm essa garantia matemática.</p>
<h3 id="treeexplainer-shap-eficiente-para-modelos-de-arvore">TreeExplainer: SHAP eficiente para modelos de árvore</h3>
<p>Calcular valores de Shapley exatos, considerando todas as ordens possíveis de variáveis, é computacionalmente inviável para modelos genéricos com muitas variáveis. O <code>TreeExplainer</code> explora a estrutura interna de árvores de decisão para calcular valores exatos em tempo polinomial, em vez de exponencial — por isso é a escolha padrão para Random Forest e XGBoost, e exige um modelo de árvore <strong>já treinado</strong> como entrada (o modelo do <a href="#/aula/cap-171">Capítulo 917</a>, não uma regressão linear — para modelos lineares ou genéricos existe o <code>LinearExplainer</code>/<code>KernelExplainer</code>, mais lentos e fora do escopo aqui).</p>
<h3 id="grafico-summary-importancia-global-e-efeito-por-observacao">Gráfico summary: importância global e efeito por observação</h3>
<p>O gráfico <em>summary</em> (também chamado <em>beeswarm</em>) empilha, para cada variável, um ponto por observação do conjunto de dados: a posição horizontal é o valor de Shapley daquela observação (o quanto aquela variável empurrou a previsão), e a cor indica se o valor <strong>da variável</strong> era alto ou baixo naquela observação. As variáveis são ordenadas de cima para baixo pela importância média absoluta — recuperando, de forma mais rica, a mesma informação agregada da <code>feature_importances_</code>, mas agora também mostrando a direção do efeito (desgaste alto empurra a previsão para cima ou para baixo?) e a dispersão entre observações (o efeito é consistente ou depende de outras variáveis?).</p>
<h3 id="exemplo-resolvido-explicando-um-lote-especifico">Exemplo resolvido: explicando um lote específico</h3>
<div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct4c6135a0-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct4c6135a0-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import shap

rng = np.random.default_rng(2026)
n = 1500

temp = rng.normal(215, 7, n)
pressao = rng.normal(4.2, 0.3, n)
desgaste = rng.uniform(0, 100, n)

risco = (-4.0 + 0.05 * (temp - 215) + 1.4 * (pressao - 4.2)
         + 0.045 * desgaste + 0.002 * np.maximum(temp - 218, 0) * desgaste)
y = rng.binomial(1, 1 / (1 + np.exp(-risco)))

X = pd.DataFrame({"temp": temp, "pressao": pressao, "desgaste": desgaste})

modelo = RandomForestClassifier(n_estimators=300, max_depth=5, random_state=0).fit(X, y)

explainer = shap.TreeExplainer(modelo)
shap_values = explainer.shap_values(X)          # contribuicoes por observacao e variavel
# Para classificacao binaria, selecionar a classe positiva (indice 1).
# Versoes recentes do SHAP retornam um ndarray (amostras, variaveis, classes);
# versoes antigas retornam uma lista com um array por classe -- cobrir os dois casos.
if isinstance(shap_values, list):
    sv_classe1 = shap_values[1]
elif shap_values.ndim == 3:
    sv_classe1 = shap_values[:, :, 1]
else:
    sv_classe1 = shap_values

print("Importancia media |SHAP| por variavel (equivalente ao summary plot em numeros):")
importancia = pd.Series(np.abs(sv_classe1).mean(axis=0), index=X.columns).sort_values(ascending=False)
print(importancia.round(4).to_string())

# --- Explicando UM lote especifico, como o gestor de qualidade pediu ---
idx_lote_critico = int(np.argmax(modelo.predict_proba(X)[:, 1]))
linha = X.iloc[idx_lote_critico]
contrib = pd.Series(sv_classe1[idx_lote_critico], index=X.columns).sort_values(key=abs, ascending=False)

print(f"\nLote #{idx_lote_critico} -- probabilidade de risco prevista = "
      f"{modelo.predict_proba(X)[[idx_lote_critico]][0, 1]:.3f}")
print("Valores de entrada:")
print(linha.to_string())
print("\nContribuicao de cada variavel para AFASTAR este lote da media (SHAP):")
print(contrib.round(4).to_string())
base = explainer.expected_value
base_classe1 = base[1] if hasattr(base, "__len__") else base
print(f"\nBase (previsao media do modelo): {base_classe1:.3f}")
print(f"Base + soma das contribuicoes = "
      f"{base_classe1 + contrib.sum():.3f}  "
      f"(deve bater com a probabilidade prevista acima, na escala do modelo)")

# shap.summary_plot(sv_classe1, X)  # gera o grafico beeswarm em notebook/ambiente grafico</code></pre></div></div></div><p><strong>Leitura de engenharia.</strong> Note a propriedade de consistência: a linha de base do modelo somada às contribuições SHAP daquele lote reconstrói exatamente a probabilidade prevista pelo modelo para aquele lote. É essa reconstrução exata — impossível de garantir com <code>feature_importances_</code> sozinha — que permite responder “por que <strong>este</strong> lote” em vez de só “o que importa em média”.</p>
<h3 id="shap-nao-e-causalidade">SHAP não é causalidade</h3>
<p>O mesmo alerta do <a href="#/aula/cap-111">Capítulo 111</a> e do <a href="#/aula/cap-171">Capítulo 917</a> se aplica aqui, com mais força ainda — porque um gráfico SHAP <em>parece</em> mais rigoroso e convence com mais facilidade do que costuma merecer. SHAP explica <strong>o que o modelo aprendeu</strong>, não <strong>o que causa o defeito no processo real</strong>. Se duas variáveis são fortemente correlacionadas no processo (por exemplo, desgaste da ferramenta e número de ciclos produzidos), o SHAP pode atribuir contribuição alta a qualquer uma delas, ou dividir entre as duas, sem que isso diga qual das duas é a causa raiz. Para essa pergunta, a ferramenta correta continua sendo o DOE (<a href="#/aula/cap-073">Capítulo 73</a>) ou uma análise causal formal (<a href="#/aula/cap-137">Capítulo 137</a>) — SHAP é uma ferramenta de auditoria e comunicação do modelo, não de descoberta de causa.</p>
<h3 id="exercicio-proposto">Exercício proposto</h3>
<p>No exemplo resolvido, escolha o lote com a <strong>menor</strong> probabilidade de risco prevista (em vez do maior) e recalcule a decomposição SHAP para ele. Compare quais variáveis dominam a contribuição negativa nesse caso “tranquilo” com as que dominaram o caso crítico. Depois, calcule a correlação entre <code>temp</code> e <code>desgaste</code> nos dados simulados e discuta se ela é alta o suficiente para que a divisão de contribuição SHAP entre as duas variáveis deva ser interpretada com cautela.</p>
<h3 id="erros-comuns">Erros comuns</h3>
<ol>
<li><strong>Interpretar valor de Shapley como efeito causal do processo.</strong> É a contribuição do modelo para aquela previsão, não o efeito real de mudar a variável na fábrica.</li>
<li><strong>Usar <code>KernelExplainer</code> genérico quando o modelo é uma árvore.</strong> É muito mais lento do que <code>TreeExplainer</code> sem ganho de precisão para esse tipo de modelo.</li>
<li><strong>Rodar SHAP antes de validar corretamente o modelo.</strong> Explicar um modelo mal validado (ver Capítulos <a href="#/aula/cap-170">916</a> e <a href="#/aula/cap-171">917</a>) só produz uma explicação convincente de um modelo que não generaliza.</li>
<li><strong>Ignorar variáveis correlacionadas na leitura do gráfico summary.</strong> A contribuição pode se dividir entre variáveis redundantes de forma que sub-representa a importância conjunta delas.</li>
<li><strong>Apresentar SHAP como prova de conformidade regulatória sem contexto.</strong> SHAP explica a decisão do modelo; não substitui a validação estatística do sistema de medição (MSA) nem a avaliação de risco do modelo em si (<a href="#/aula/cap-138">Capítulo 138</a>).</li>
</ol>
<p><em>Fonte principal: documentação oficial SHAP (shap.readthedocs.io) — seções sobre <code>TreeExplainer</code> e propriedades dos valores de Shapley. Cross-check: “A Gentle Introduction to SHAP for Tree-Based Models”, MachineLearningMastery. Verificado via pesquisa na web em 01/09/2026.</em></p>

