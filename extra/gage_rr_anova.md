<a id="capitulo-175"></a>
## Capítulo 175: Gage R&R por ANOVA: o Método Recomendado pela AIAG MSA

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>O método Range do <a href="#/aula/cap-061">Capítulo 61</a> diz que o sistema de medição está aprovado. Mas dois inspetores discordam sistematicamente mais nas peças grandes do que nas pequenas — um padrão que o método Range, por construção, não consegue enxergar. O sistema está mesmo aprovado?</em></p>
<p>Talvez não. A interação inspetor×peça — quando a diferença entre inspetores não é constante, mas varia conforme a peça medida — é invisível ao método Average-and-Range, e é exatamente o que o método ANOVA foi desenhado para capturar. Não é coincidência que o manual MSA da AIAG, na edição atual, recomende ANOVA como o método preferido — e é exatamente o método que o projeto <em>manufacturing-performance-analytics</em> implementa (Notebook, Parte 9.2).</p>
<h3 id="por-que-a-aiag-recomenda-anova">Por que a AIAG recomenda ANOVA em vez do método Range</h3>
<p>O método Average-and-Range, tratado no <a href="#/aula/cap-061">Capítulo 61</a>, nasceu numa época em que ANOVA à mão era impraticável — é um método desenhado para ser calculado com régua e papel. Isso tem um custo estatístico: o método Range <strong>não modela a interação inspetor×peça</strong>, porque calcula repetitividade e reprodutibilidade como componentes separados, sem um termo cruzado.</p>
<p>O AIAG <em>Measurement Systems Analysis</em> (MSA), na sua 4ª edição, é explícito: o método ANOVA é preferível porque (1) considera a interação inspetor×peça, informação que o método Range simplesmente descarta, e (2) é mais preciso na estimativa das componentes de variância, especialmente com amostras pequenas de peças ou inspetores. Com qualquer ferramenta de cálculo moderna — Python, Excel, Minitab —, não há razão prática para continuar a usar o método Range como método principal; ele permanece útil como verificação rápida ou em contextos sem acesso a software estatístico.</p><h3 id="o-modelo-anova-de-dois-fatores">O modelo ANOVA de dois fatores para R&amp;R</h3>
<p>O estudo de Gage R&amp;R por ANOVA trata cada medição como resultado de um modelo com dois fatores cruzados — Peça e Inspetor — mais a sua interação:</p>
<div class="math-block" data-math="y_{ijk} = \mu + P_i + I_j + (PI)_{ij} + \varepsilon_{ijk}"></div>
<p>onde <span class="math-inline" data-math="P_i"></span> é o efeito da peça, <span class="math-inline" data-math="I_j"></span> o efeito do inspetor, <span class="math-inline" data-math="(PI)_{ij}"></span> a interação, e <span class="math-inline" data-math="\varepsilon_{ijk}"></span> o erro de repetição (repetitividade). A tabela ANOVA de duas vias com interação decompõe a soma de quadrados total nessas quatro fontes, e delas derivam-se as componentes de variância. No código do projeto <em>manufacturing-performance-analytics</em> (Notebook, Parte 9.2), estas componentes aparecem com os nomes <code>var_repeatability</code>, <code>var_reproducibility</code>, <code>var_part</code> e <code>var_grr</code>:</p>
<ul>
<li><strong>Repetitividade (<code>var_repeatability</code>)</strong> — da variação residual (<span class="math-inline" data-math="\varepsilon"></span>): o instrumento, medindo a mesma peça pelo mesmo inspetor, repete-se quanto?</li>
<li><strong>Reprodutibilidade (<code>var_reproducibility</code>)</strong> — do efeito de inspetor e da interação inspetor×peça combinados: inspetores diferentes, medindo a mesma peça, discordam quanto?</li>
<li><strong>Variação peça-a-peça (<code>var_part</code>)</strong> — do efeito de peça: quanto as peças realmente diferem entre si (a variação "boa", que o sistema de medição deve conseguir detetar).</li>
<li><strong>GRR total (<code>var_grr</code>)</strong> — a soma de repetitividade e reprodutibilidade: <code>var_grr = var_repeatability + var_reproducibility</code>.</li>
</ul>
<p>O indicador final, %GRR, compara o desvio-padrão de medição com a variação total do estudo:</p>
<div class="math-block" data-math="\%GRR = 100 \times \frac{\sqrt{\text{var\_grr}}}{\sqrt{\text{var\_grr} + \text{var\_part}}}"></div>
<p><strong>Critério de aceitação (AIAG):</strong> %GRR &lt; 10% — sistema aceitável; 10–30% — aceitável condicionalmente, dependendo da aplicação e do custo de melhorar; &gt; 30% — inaceitável.</p><h3 id="exemplo-resolvido-anova-de-dois-fatores">Exemplo resolvido: ANOVA de dois fatores com interação, no mesmo formato do projeto prático</h3><div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct2a4b949e-t0">Python</button><button type="button" class="ct-tab" role="tab" aria-selected="false" id="ct2a4b949e-t1">R</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct2a4b949e-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import numpy as np
import pandas as pd
import statsmodels.api as sm
import statsmodels.formula.api as smf

rng = np.random.default_rng(921)

# Estudo classico AIAG: 10 pecas, 3 inspetores, 2 repeticoes.
# Mesma estrutura de modelo usada no projeto manufacturing-performance-analytics
# (Notebook, Parte 9.2): ANOVA cruzada com interacao PartId x Inspector.
pecas = [f"P{p:02d}" for p in range(1, 11)]
inspetores = ["Insp1", "Insp2", "Insp3"]
valor_real_peca = rng.normal(50.0, 1.2, len(pecas))   # variacao real peca-a-peca

registos = []
for i, peca in enumerate(pecas):
    for insp in inspetores:
        # interacao: Insp3 tem vies que CRESCE com o tamanho da peca (nao constante!)
        vies_interacao = 0.03 * (valor_real_peca[i] - 50.0) if insp == "Insp3" else 0.0
        for rep in range(2):
            medido = valor_real_peca[i] + vies_interacao + rng.normal(0, 0.15)
            registos.append({"PartId": peca, "Inspector": insp, "Rep": rep, "MeasuredValue": medido})

df = pd.DataFrame(registos)

modelo = smf.ols("MeasuredValue ~ C(PartId) + C(Inspector) + C(PartId):C(Inspector)", data=df).fit()
anova_tab = sm.stats.anova_lm(modelo, typ=2)
print("Tabela ANOVA de 2 vias com interacao:")
print(anova_tab.round(4), "\n")

n_inspetores = df["Inspector"].nunique()
n_pecas = df["PartId"].nunique()
n_reps = df.groupby(["PartId", "Inspector"]).size().iloc[0]

ms_erro = anova_tab.loc["Residual", "sum_sq"] / anova_tab.loc["Residual", "df"]
ms_interacao = anova_tab.loc["C(PartId):C(Inspector)", "sum_sq"] / anova_tab.loc["C(PartId):C(Inspector)", "df"]
ms_inspector = anova_tab.loc["C(Inspector)", "sum_sq"] / anova_tab.loc["C(Inspector)", "df"]
ms_part = anova_tab.loc["C(PartId)", "sum_sq"] / anova_tab.loc["C(PartId)", "df"]

var_repeatability = ms_erro
var_interaction = max(0.0, (ms_interacao - ms_erro) / n_reps)
var_inspector = max(0.0, (ms_inspector - ms_interacao) / (n_pecas * n_reps))
var_reproducibility = var_inspector + var_interaction
var_part = max(0.0, (ms_part - ms_interacao) / (n_inspetores * n_reps))

var_grr = var_repeatability + var_reproducibility
var_total = var_grr + var_part

print(f"Repetitividade (var_repeatability)     : {var_repeatability:.5f}")
print(f"Reprodutibilidade (var_reproducibility): {var_reproducibility:.5f}  "
      f"(inclui interacao PartId x Inspector = {var_interaction:.5f})")
print(f"Peca-a-peca (var_part)                 : {var_part:.5f}")
print(f"GRR total (var_grr)                    : {var_grr:.5f}")

pct_grr = 100 * np.sqrt(var_grr) / np.sqrt(var_total)
print(f"\n%GRR = 100 x sqrt(var_grr) / sqrt(var_total) = {pct_grr:.1f}%")

p_interacao = anova_tab.loc["C(PartId):C(Inspector)", "PR(&gt;F)"]
print(f"\np-valor da interacao PartId x Inspector: {p_interacao:.4f}")
if p_interacao &lt; 0.05:
    print("SIGNIFICATIVA -- este e exatamente o padrao que o metodo Range nao deteta:")
    print("um inspetor que so diverge dos outros em pecas de um certo tamanho.")</code></pre></div></div><div class="ct-pane" hidden role="tabpanel" aria-labelledby="ct2a4b949e-t1"><div class="codeblock" data-lang="r"><div class="codebar"><span class="lang">R</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-r">set.seed(921)

# Estudo classico AIAG: 10 pecas, 3 inspetores, 2 repeticoes.
# Mesma estrutura de modelo usada no projeto manufacturing-performance-analytics
# (Notebook, Parte 9.2): ANOVA cruzada com interacao PartId x Inspector.
pecas &lt;- sprintf("P%02d", 1:10)
inspetores &lt;- c("Insp1", "Insp2", "Insp3")
valor_real_peca &lt;- rnorm(length(pecas), 50.0, 1.2)   # variacao real peca-a-peca
names(valor_real_peca) &lt;- pecas

registos &lt;- do.call(rbind, lapply(seq_along(pecas), function(i) {
  peca &lt;- pecas[i]
  do.call(rbind, lapply(inspetores, function(insp) {
    # interacao: Insp3 tem vies que CRESCE com o tamanho da peca (nao constante!)
    vies_interacao &lt;- if (insp == "Insp3") 0.03 * (valor_real_peca[i] - 50.0) else 0.0
    do.call(rbind, lapply(0:1, function(rep) {
      medido &lt;- valor_real_peca[i] + vies_interacao + rnorm(1, 0, 0.15)
      data.frame(PartId = peca, Inspector = insp, Rep = rep, MeasuredValue = medido)
    }))
  }))
}))

modelo &lt;- aov(MeasuredValue ~ PartId * Inspector, data = registos)
anova_tab &lt;- summary(modelo)[[1]]
cat("Tabela ANOVA de 2 vias com interacao:\n")
print(round(anova_tab, 4))

n_inspetores &lt;- length(unique(registos$Inspector))
n_pecas &lt;- length(unique(registos$PartId))
n_reps &lt;- 2

ms_erro       &lt;- anova_tab["Residuals", "Mean Sq"]
ms_interacao  &lt;- anova_tab["PartId:Inspector", "Mean Sq"]
ms_inspector  &lt;- anova_tab["Inspector", "Mean Sq"]
ms_part       &lt;- anova_tab["PartId", "Mean Sq"]

var_repeatability   &lt;- ms_erro
var_interaction     &lt;- max(0, (ms_interacao - ms_erro) / n_reps)
var_inspector       &lt;- max(0, (ms_inspector - ms_interacao) / (n_pecas * n_reps))
var_reproducibility &lt;- var_inspector + var_interaction
var_part            &lt;- max(0, (ms_part - ms_interacao) / (n_inspetores * n_reps))

var_grr   &lt;- var_repeatability + var_reproducibility
var_total &lt;- var_grr + var_part

cat(sprintf("Repetitividade (var_repeatability)     : %.5f\n", var_repeatability))
cat(sprintf("Reprodutibilidade (var_reproducibility): %.5f  (inclui interacao PartId x Inspector = %.5f)\n",
            var_reproducibility, var_interaction))
cat(sprintf("Peca-a-peca (var_part)                 : %.5f\n", var_part))
cat(sprintf("GRR total (var_grr)                    : %.5f\n", var_grr))

pct_grr &lt;- 100 * sqrt(var_grr) / sqrt(var_total)
cat(sprintf("\n%%GRR = 100 x sqrt(var_grr) / sqrt(var_total) = %.1f%%\n", pct_grr))

p_interacao &lt;- anova_tab["PartId:Inspector", "Pr(&gt;F)"]
cat(sprintf("\np-valor da interacao PartId x Inspector: %.4f\n", p_interacao))
if (p_interacao &lt; 0.05) {
  cat("SIGNIFICATIVA -- este e exatamente o padrao que o metodo Range nao deteta:\n")
  cat("um inspetor que so diverge dos outros em pecas de um certo tamanho.\n")
}
</code></pre></div></div></div><h3 id="de-grr-para-cpk">De %GRR para a leitura de Cpk</h3>
<p>Um sistema de medição com %GRR alto não produz apenas medições ruidosas — ele <strong>contamina diretamente</strong> a leitura de capacidade de processo do <a href="#/aula/cap-071">Capítulo 71</a>. A variância total observada num estudo de capability é, por construção, a soma da variância real do processo com a variância do sistema de medição:</p>
<div class="math-block" data-math="\sigma_{Observada}^2 = \sigma_{Processo}^2 + \sigma_{Medicao}^2"></div>
<p>Se <span class="math-inline" data-math="\sigma_{Medicao}"></span> for uma fração relevante de <span class="math-inline" data-math="\sigma_{Observada}"></span>, o Cpk calculado a partir dos dados <strong>subestima</strong> o Cpk real do processo — porque o denominador da fórmula de Cpk usa o desvio-padrão observado, inflado pelo ruído de medição. Na prática, isto significa que um processo genuinamente capaz pode parecer incapaz só porque o sistema de medição é ruim — e a ação corretiva errada (mexer no processo, que já estava bem) não resolve nada, porque o problema estava na régua, não na peça.</p>
<p>É por isso que a sequência metodológica correta é sempre: <strong>validar o sistema de medição primeiro (este capítulo), calcular capability depois (Capítulo 71).</strong> Fazer o inverso é construir uma conclusão de capacidade sobre uma base que pode estar contaminada.</p><h3 id="exercicio-proposto">Exercício proposto</h3>
<p>Usando o exemplo resolvido acima, remova o termo <code>vies_interacao</code> (ou seja, faça os três inspetores terem viés constante, sem depender do tamanho da peça) e rode novamente a ANOVA. Compare o p-valor da interação PartId×Inspector antes e depois — e compare também o %GRR resultante. Em seguida, calcule o %GRR para o mesmo dataset usando o método Range do <a href="#/aula/cap-061">Capítulo 61</a> (com apenas 2 inspetores e 5 réplicas, para simplificar) e verifique: o método Range consegue, nalguma forma indireta, sinalizar que existe uma interação, ou essa informação simplesmente não aparece?</p>
<h3 id="erros-comuns">Erros comuns</h3>
<ol>
<li><strong>Continuar a usar apenas o método Range "porque é mais simples".</strong> Com uma biblioteca estatística disponível, a simplicidade de cálculo deixou de ser uma vantagem prática relevante — e o custo de perder a interação inspetor×peça é real.</li>
<li><strong>Ignorar um p-valor de interação significativo.</strong> Se a interação for significativa, isso é, em si, um achado de engenharia: significa que pelo menos um inspetor tem um problema específico de método ou de treino em certas condições, não um viés geral.</li>
<li><strong>Calcular capability antes de validar o sistema de medição.</strong> Como explicado acima, um Cpk calculado sobre um sistema de medição não validado pode estar sistematicamente subestimado.</li>
<li><strong>Confundir variância negativa estimada com erro de cálculo.</strong> É comum, com poucos dados, que a subtração de quadrados médios produza uma estimativa de variância de interação ligeiramente negativa — a convenção é truncar em zero (como faz o código acima), não é um bug.</li>
</ol>
<p><em>Fonte principal: AIAG, <em>Measurement Systems Analysis (MSA)</em>, 4ª edição — recomendação do método ANOVA sobre o método Average-and-Range. Cross-check: SPC for Excel, "ANOVA Gage R&amp;R"; CalibrationOS, "Gage R&amp;R Study Procedure". Verificado via pesquisa na web em 01/09/2026.</em></p>

