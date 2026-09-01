<a id="capitulo-169"></a>
## Capítulo 169: Métricas de Classificação sob Desbalanceamento e Threshold de Decisão Econômico

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>O modelo que classifica lotes como “conforme” ou “risco de rejeição” acerta 96% das vezes. Deve ser aprovado para uso em produção?</em></p>
<p>Depende inteiramente de uma pergunta que a exatidão sozinha não responde: quantos lotes de risco reais existiam na amostra? No <a href="#/aula/cap-111">Capítulo 111</a> já vimos que, com classes desequilibradas, um modelo trivial que responde sempre “conforme” pode ter exatidão altíssima e revocação zero. Este capítulo aprofunda esse ponto: como escolher a métrica certa quando a classe de interesse é rara — no projeto de manufatura de referência, lotes de qualidade comprometida representam entre 5% e 40% dos casos, dependendo do processo — e como transformar a probabilidade prevista em uma decisão (aprovar/reter o lote) usando o custo real de errar em cada direção.</p>
<h3 id="por-que-a-exatidao-engana-sob-desbalanceamento">Por que a exatidão engana sob desbalanceamento</h3>
<p>A matriz de confusão é o ponto de partida de qualquer métrica de classificação. A partir dela, três métricas respondem a perguntas diferentes:</p>
<p><div class="math-block" data-math="\text{Precisão} = \frac{VP}{VP + FP} \qquad \text{Revocação} = \frac{VP}{VP + FN} \qquad F_1 = \frac{2 \times \text{Precisão} \times \text{Revocação}}{\text{Precisão} + \text{Revocação}}"></div></p>
<p><strong>Precisão</strong> responde “dos lotes que o modelo sinalizou como risco, quantos realmente eram?” — importa quando um falso alarme custa caro (inspeção extra, lote retido sem necessidade). <strong>Revocação</strong> responde “dos lotes que realmente eram de risco, quantos o modelo pegou?” — importa quando deixar passar um defeito custa mais caro do que investigar um alarme falso. A <strong>exatidão</strong> (accuracy) mistura as duas classes numa única média ponderada pela frequência — e, com uma classe rara, essa média é dominada pela classe majoritária, escondendo exatamente o desempenho que importa.</p>
<h3 id="pr-auc-vs-roc-auc-qual-escolher">PR-AUC vs. ROC-AUC: qual escolher sob desbalanceamento</h3>
<p>A curva ROC (Revocação vs. Taxa de Falsos Positivos) é a mais comum, mas tem um ponto cego: a Taxa de Falsos Positivos usa como denominador o total de negativos — e quando os negativos são a esmagadora maioria, essa taxa permanece baixa mesmo com muitos falsos positivos em termos absolutos. A curva Precisão-Revocação (PR) não usa verdadeiros negativos em nenhum dos dois eixos, o que a torna mais sensível à classe rara e, por isso, a referência recomendada quando a classe positiva é minoritária e o custo de falso positivo importa. A área sob a curva PR (PR-AUC) é o resumo escalar dessa curva, assim como a AUC resume a ROC.</p>
<p><strong>Regra prática:</strong> com desbalanceamento moderado a severo (classe positiva abaixo de ~20%), reporte PR-AUC como métrica primária de comparação entre modelos, e Precisão/Revocação/F1 em um limiar específico como métricas operacionais.</p>
<h3 id="class-weight-balanced-como-o-scikit-learn-compensa-a-classe-rara"><code>class_weight=“balanced”</code>: como o scikit-learn compensa a classe rara</h3>
<p>Em vez de reamostrar os dados (sobre ou sub-amostragem), muitos modelos do scikit-learn aceitam um peso por classe que altera a função de perda diretamente: erros na classe rara passam a custar mais durante o treino. Com <code>class_weight=“balanced”</code>, o peso de cada classe é calculado como:</p>
<p><div class="math-block" data-math="w_c = \frac{n_{\text{amostras}}}{n_{\text{classes}} \times n_c}"></div></p>
<p>onde <span class="math-inline" data-math="n_c"></span> é o número de exemplos da classe <span class="math-inline" data-math="c"></span> no conjunto de treino. Quanto mais rara a classe, maior o peso — o efeito prático é empurrar o modelo a não ignorar a classe minoritária só porque ela contribui pouco para a perda média. Isso muda o treino do modelo; não substitui a escolha do limiar de decisão, que é uma decisão separada, tomada depois do modelo treinado (ver seção seguinte).</p>
<h3 id="exemplo-resolvido-classificando-lotes-de-risco">Exemplo resolvido: classificando lotes de risco com classe rara</h3>
<div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="cte37c00be-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="cte37c00be-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (precision_recall_curve, average_precision_score,
                              roc_auc_score, f1_score, precision_score, recall_score)

rng = np.random.default_rng(2026)
n = 4000

# --- Simulacao: 3 variaveis de processo + 1 classe rara de "lote de risco" ---
temp = rng.normal(215, 7, n)
pressao = rng.normal(4.2, 0.3, n)
desgaste_ferramenta = rng.uniform(0, 100, n)

risco = -3.6 + 0.05 * (temp - 215) + 1.6 * (pressao - 4.2) + 0.03 * desgaste_ferramenta
p_defeito = 1 / (1 + np.exp(-risco))
y = rng.binomial(1, p_defeito)

X = pd.DataFrame({"temp": temp, "pressao": pressao, "desgaste": desgaste_ferramenta})
print(f"Taxa de lotes de risco na amostra: {y.mean():.1%}  (classe MINORITARIA)\n")

corte = int(0.7 * n)
X_tr, X_te = X.iloc[:corte], X.iloc[corte:]
y_tr, y_te = y[:corte], y[corte:]

# --- Dois modelos: sem e com balanceamento de classe ---
m_simples = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)
m_balanceado = LogisticRegression(max_iter=1000, class_weight="balanced").fit(X_tr, y_tr)

for nome, m in [("Sem class_weight", m_simples), ("Com class_weight=balanced", m_balanceado)]:
    p = m.predict_proba(X_te)[:, 1]
    y_hat_05 = (p &gt;= 0.5).astype(int)
    print(f"{nome}:")
    print(f"  Exatidao a 0,5      = {(y_hat_05 == y_te).mean():.3f}")
    print(f"  Precisao a 0,5      = {precision_score(y_te, y_hat_05, zero_division=0):.3f}")
    print(f"  Revocacao a 0,5     = {recall_score(y_te, y_hat_05, zero_division=0):.3f}")
    print(f"  F1 a 0,5            = {f1_score(y_te, y_hat_05, zero_division=0):.3f}")
    print(f"  ROC-AUC             = {roc_auc_score(y_te, p):.3f}")
    print(f"  PR-AUC              = {average_precision_score(y_te, p):.3f}\n")

# --- Threshold otimo por custo economico assimetrico ---
custo_fn = 480.0   # lote de risco liberado -- custo de reclamacao/retrabalho no cliente
custo_fp = 35.0    # lote bom retido para inspecao extra sem necessidade

p_te = m_balanceado.predict_proba(X_te)[:, 1]
limiares = np.linspace(0.02, 0.90, 45)
resultados = []
for lim in limiares:
    y_hat = (p_te &gt;= lim).astype(int)
    fn = int(((y_hat == 0) &amp; (y_te == 1)).sum())
    fp = int(((y_hat == 1) &amp; (y_te == 0)).sum())
    custo = fn * custo_fn + fp * custo_fp
    resultados.append({"limiar": round(lim, 3), "FN": fn, "FP": fp, "custo_total": custo})

tab = pd.DataFrame(resultados)
otimo = tab.loc[tab["custo_total"].idxmin()]
print("Varredura de limiar (amostra a cada 5 pontos):")
print(tab.iloc[::5].to_string(index=False))
print(f"\nLimiar que minimiza o custo esperado: {otimo['limiar']:.3f}")
print(f"  (muito abaixo de 0,5 -- porque custo_FN/custo_FP = {custo_fn/custo_fp:.1f}x, "
      f"compensa aceitar mais falsos alarmes para evitar escapes)")</code></pre></div></div></div><p><strong>Leitura de engenharia.</strong> Note que <code>class_weight=“balanced”</code> melhora a revocação a 0,5, mas o ganho real vem de combinar isso com a varredura de limiar: o custo econômico definido pelo negócio (não pela conveniência estatística de 0,5) é o critério que decide onde cortar. Esse raciocínio de limiar por custo já foi introduzido como conceito no <a href="#/aula/cap-138">Capítulo 138</a> (validação de modelos e limiar de decisão); aqui ele ganha a formalização completa com custo assimétrico de falso positivo e falso negativo.</p>
<h3 id="o-limiar-otimo-e-uma-decisao-economica-nao-um-numero-fixo">O limiar ótimo é uma decisão econômica, não um número fixo</h3>
<p>O limiar de 0,5 é uma convenção de biblioteca, não uma verdade estatística. A regra geral é:</p>
<p><div class="math-block" data-math="\text{Custo total}(\text{limiar}) = FN(\text{limiar}) \times \text{custo}_{FN} + FP(\text{limiar}) \times \text{custo}_{FP}"></div></p>
<p>e o limiar ótimo é o que minimiza essa função — calculado sempre no conjunto de <strong>validação</strong>, nunca no conjunto de teste, pelo mesmo motivo de rigor metodológico que já se aplica à escolha de hiperparâmetros: se o limiar for ajustado olhando para o teste, o teste deixa de medir generalização. O próximo capítulo formaliza exatamente essa separação entre dados de ajuste e dados de avaliação final, num contexto ainda mais delicado: dados de produção ordenados no tempo.</p>
<h3 id="exercicio-proposto">Exercício proposto</h3>
<p>Usando o exemplo resolvido acima, inverta a relação de custo (<code>custo_fn = 35</code>, <code>custo_fp = 480</code> — simulando um processo em que reter um lote bom é muito mais caro do que deixar passar um defeito, por exemplo por causa de um prazo contíratual apertado) e recalcule o limiar ótimo. Compare com o resultado original e explique, em termos de negócio, por que o limiar se moveu na direção oposta. Em seguida, calcule PR-AUC e ROC-AUC para o modelo <code>m_balanceado</code> e discuta se a diferença entre os dois valores seria maior ou menor se a taxa de lotes de risco na amostra fosse 45% em vez de ~15–20%.</p>
<h3 id="erros-comuns">Erros comuns</h3>
<ol>
<li><strong>Reportar exatidão como métrica única sob desbalanceamento.</strong> Um classificador trivial “sempre conforme” pode ter exatidão de 95% e revocação zero.</li>
<li><strong>Comparar modelos por ROC-AUC quando a classe positiva é muito rara.</strong> PR-AUC é mais sensível à classe minoritária nesse regime.</li>
<li><strong>Usar <code>class_weight=“balanced”</code> como substituto da escolha de limiar.</strong> São duas decisões independentes: uma muda como o modelo é treinado, a outra muda como a probabilidade prevista vira uma decisão.</li>
<li><strong>Escolher o limiar olhando para o conjunto de teste.</strong> Isso contamina a estimativa final de desempenho — o limiar deve ser escolhido em validação.</li>
<li><strong>Assumir que custo de falso positivo e falso negativo são iguais por padrão.</strong> Raramente são, e a diferença costuma ser de uma ordem de grandeza inteira em contextos de qualidade industrial.</li>
</ol>
<p><em>Fonte principal: scikit-learn User Guide — seções “Precision, recall and F-measures” e “class_weight” (compute_class_weight, estratégia “balanced”). Cross-check: “A Gentle Introduction to Threshold-Moving for Imbalanced Classification”, MachineLearningMastery; “An Introduction to Statistical Learning” (James, Witten, Hastie, Tibshirani), capítulo de Classificação. Verificado via pesquisa na web em 01/09/2026.</em></p>

