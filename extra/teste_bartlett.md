<a id="capitulo-168"></a>
## Capítulo 168: Teste de Bartlett: Verificando a Pressuposição de Variâncias Iguais

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>Três operadores produzem, em média, exatamente a mesma taxa de peças conformes. A ANOVA do <a href="#/aula/cap-050">Capítulo 50</a> não encontra diferença significativa entre médias. Caso encerrado? Não necessariamente — um dos operadores pode ter uma variabilidade muito maior do que os outros dois, produzindo tanto os melhores quanto os piores lotes do turno. A média esconde exatamente esse tipo de problema.</em></p>
<p>A ANOVA testa se as <strong>médias</strong> são iguais. Ela não testa, nem garante, que as <strong>variâncias</strong> são iguais — e, na verdade, pressupõe isso desde o início. O teste de Bartlett verifica se essa pressuposição se sustenta.</p>
<h3 id="a-pressuposicao-escondida-da-anova">A pressuposição escondida da ANOVA</h3>
<p>A ANOVA de 1 via (<a href="#/aula/cap-050">Capítulo 50</a>) parte de três pressupostos: normalidade dos resíduos, independência das observações, e <strong>homogeneidade de variância</strong> (homocedasticidade) entre os grupos — a ideia de que, embora as médias possam diferir, a dispersão em torno de cada média é a mesma. Quando essa pressuposição falha (heterocedasticidade), o teste F da ANOVA fica distorcido: o erro-padrão combinado deixa de representar bem nenhum dos grupos individualmente, e a taxa real de falso positivo (ou de falso negativo) se afasta do α nominal declarado.</p>
<p>A sequência metodologicamente correta, seguida por qualquer manual de estatística aplicada (por exemplo, o e-Handbook do NIST/SEMATECH), é: <strong>primeiro testar a igualdade de variâncias, só depois confiar no teste de igualdade de médias.</strong></p><h3 id="o-teste-de-bartlett">O teste de Bartlett</h3>
<p>Para k grupos com variâncias amostrais <span class="math-inline" data-math="s_i^2"></span> e tamanhos <span class="math-inline" data-math="n_i"></span>, a estatística de Bartlett é:</p>
<div class="math-block" data-math="\chi^2 = \frac{(N-k)\ln(s_p^2) - \sum_{i=1}^{k}(n_i-1)\ln(s_i^2)}{1 + \frac{1}{3(k-1)}\left(\sum_{i=1}^{k}\frac{1}{n_i-1} - \frac{1}{N-k}\right)}"></div>
<p>onde <span class="math-inline" data-math="N = \sum n_i"></span> e <span class="math-inline" data-math="s_p^2"></span> é a variância combinada (<em>pooled</em>) ponderada pelos graus de liberdade de cada grupo. Sob a hipótese nula de variâncias iguais, esta estatística segue aproximadamente uma distribuição qui-quadrado com k−1 graus de liberdade. Um p-valor pequeno rejeita a hipótese de variâncias iguais.</p>
<p>Na prática, ninguém calcula isto à mão — <code>scipy.stats.bartlett</code> faz o trabalho — mas entender a fórmula ajuda a perceber a limitação mais importante do teste: <strong>Bartlett é muito sensível a desvios de normalidade.</strong> Se os dados não forem razoavelmente normais dentro de cada grupo, o teste pode acusar heterocedasticidade que não existe (ou o inverso), simplesmente porque a distribuição não é a assumida.</p><h3 id="levene-a-alternativa-robusta">Levene: a alternativa robusta</h3>
<p>O <strong>teste de Levene</strong> (e a sua variante mais robusta, com mediana em vez de média, às vezes chamada de teste de Brown-Forsythe) testa a mesma hipótese — igualdade de variâncias — mas transforma os dados antes de aplicar uma ANOVA convencional sobre os desvios absolutos em relação ao centro de cada grupo. Essa transformação torna o teste muito menos sensível a desvios de normalidade do que Bartlett.</p>
<p><strong>Regra prática:</strong> se há boa razão para acreditar que os dados são aproximadamente normais dentro de cada grupo, Bartlett é ligeiramente mais potente (deteta diferenças de variância menores, com a mesma amostra). Em caso de dúvida sobre normalidade — que é a maioria dos casos reais de chão de fábrica —, prefira Levene. Isto não é o mesmo teste que o de aderência à distribuição do <a href="#/aula/cap-047">Capítulo 47</a>: aquele testa se um único conjunto de dados segue uma distribuição específica; Bartlett/Levene testam se <strong>vários</strong> conjuntos de dados têm a <strong>mesma</strong> variância entre si, independentemente de qual seja a forma da distribuição.</p><h3 id="variancia-desigual-e-leitura-de-capability">Variância desigual e leitura de capability</h3>
<p>Heterogeneidade de variância entre grupos não é apenas um detalhe técnico da ANOVA — tem uma consequência prática direta na forma como o <a href="#/aula/cap-071">Capítulo 71</a> calcula Cp/Cpk. Se um estudo de capability agrupar dados de vários operadores, turnos ou máquinas sem verificar antes se a variabilidade é homogénea, o desvio-padrão combinado usado no denominador de Cp/Cpk pode ficar dominado pelo grupo mais disperso — inflando artificialmente a variação "do processo" e subestimando a capacidade real de cada grupo individualmente. Pior ainda: se o subgrupo racional (<a href="#/aula/cap-065">Capítulo 65</a>) misturar deliberada ou acidentalmente fontes de variação com dispersões diferentes, o Cpk calculado deixa de corresponder a nenhum cenário real de produção — não é o Cpk do operador bom, nem o do operador com problema, é uma média sem significado físico direto.</p>
<p>Por isso, antes de reportar um Cp/Cpk agregado sobre múltiplos operadores, turnos ou máquinas, vale a pena rodar Bartlett ou Levene sobre os grupos que compõem o agregado. Se a hipótese de variância igual for rejeitada, a decisão correta não é "consertar" o teste — é reportar Cpk separadamente por grupo, e tratar a diferença de variabilidade como um achado de processo por si só, exatamente como no exemplo do operador C acima.</p><h3 id="exemplo-resolvido-variabilidade-de-operador">Exemplo resolvido: médias iguais, variâncias diferentes</h3><div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct0bda49fd-t0">Python</button><button type="button" class="ct-tab" role="tab" aria-selected="false" id="ct0bda49fd-t1">R</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct0bda49fd-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import numpy as np
from scipy import stats

rng = np.random.default_rng(914)

# Tres operadores, MESMA media-alvo de dimensao (25.00 mm), variabilidade DIFERENTE
op_A = rng.normal(25.00, 0.020, 40)   # consistente
op_B = rng.normal(25.00, 0.022, 40)   # consistente
op_C = rng.normal(25.00, 0.065, 40)   # muito mais disperso

print("Medias por operador (a ANOVA de medias nao veria problema aqui):")
for nome, dados in [("A", op_A), ("B", op_B), ("C", op_C)]:
    print(f"  Operador {nome}: media = {dados.mean():.4f}  desvio-padrao = {dados.std(ddof=1):.4f}")

f_media, p_media = stats.f_oneway(op_A, op_B, op_C)
veredito_media = "medias diferem" if p_media &lt; 0.05 else "medias NAO diferem significativamente"
print(f"\nANOVA de medias (Capitulo 50): F = {f_media:.2f}  p = {p_media:.4f}  -&gt; {veredito_media}")

stat_bartlett, p_bartlett = stats.bartlett(op_A, op_B, op_C)
stat_levene, p_levene = stats.levene(op_A, op_B, op_C, center="median")

print(f"\nTeste de Bartlett : estatistica = {stat_bartlett:.2f}  p = {p_bartlett:.5f}")
print(f"Teste de Levene   : estatistica = {stat_levene:.2f}  p = {p_levene:.5f}")

alfa = 0.05
if p_bartlett &lt; alfa or p_levene &lt; alfa:
    print("\nDIAGNOSTICO: as MEDIAS parecem iguais, mas Bartlett e Levene detetam")
    print("VARIANCIAS significativamente diferentes -- o operador C precisa de")
    print("investigacao (formacao, condicao do instrumento, metodo de trabalho),")
    print("mesmo sem ter produzido pecas fora do alvo em media.")</code></pre></div></div><div class="ct-pane" hidden role="tabpanel" aria-labelledby="ct0bda49fd-t1"><div class="codeblock" data-lang="r"><div class="codebar"><span class="lang">R</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-r">set.seed(914)

# Tres operadores, MESMA media-alvo de dimensao (25.00 mm), variabilidade DIFERENTE
op_A &lt;- rnorm(40, 25.00, 0.020)   # consistente
op_B &lt;- rnorm(40, 25.00, 0.022)   # consistente
op_C &lt;- rnorm(40, 25.00, 0.065)   # muito mais disperso

cat("Medias por operador (a ANOVA de medias nao veria problema aqui):\n")
for (op in list(A = op_A, B = op_B, C = op_C)) {
  nome &lt;- names(which(sapply(list(A = op_A, B = op_B, C = op_C), identical, op)))
}
dados_op &lt;- list(A = op_A, B = op_B, C = op_C)
for (nome in names(dados_op)) {
  d &lt;- dados_op[[nome]]
  cat(sprintf("  Operador %s: media = %.4f  desvio-padrao = %.4f\n", nome, mean(d), sd(d)))
}

valores &lt;- c(op_A, op_B, op_C)
grupo &lt;- factor(rep(c("A", "B", "C"), each = 40))

anova_media &lt;- oneway.test(valores ~ grupo, var.equal = TRUE)
veredito_media &lt;- if (anova_media$p.value &lt; 0.05) "medias diferem" else "medias NAO diferem significativamente"
cat(sprintf("\nANOVA de medias (Capitulo 50): F = %.2f  p = %.4f  -&gt; %s\n",
            anova_media$statistic, anova_media$p.value, veredito_media))

teste_bartlett &lt;- bartlett.test(valores ~ grupo)
teste_levene   &lt;- car::leveneTest(valores ~ grupo, center = median)   # requer install.packages("car")

cat(sprintf("\nTeste de Bartlett : estatistica = %.2f  p = %.5f\n",
            teste_bartlett$statistic, teste_bartlett$p.value))
cat(sprintf("Teste de Levene   : estatistica = %.2f  p = %.5f\n",
            teste_levene$`F value`[1], teste_levene$`Pr(&gt;F)`[1]))

alfa &lt;- 0.05
if (teste_bartlett$p.value &lt; alfa || teste_levene$`Pr(&gt;F)`[1] &lt; alfa) {
  cat("\nDIAGNOSTICO: as MEDIAS parecem iguais, mas Bartlett e Levene detetam\n")
  cat("VARIANCIAS significativamente diferentes -- o operador C precisa de\n")
  cat("investigacao (formacao, condicao do instrumento, metodo de trabalho),\n")
  cat("mesmo sem ter produzido pecas fora do alvo em media.\n")
}
</code></pre></div></div></div><h3 id="exercicio-proposto">Exercício proposto</h3>
<p>Repita o exemplo acima substituindo as três distribuições normais por distribuições log-normais com a mesma média e os mesmos desvios-padrão-alvo (dica: use <code>rng.lognormal</code> ajustando os parâmetros para obter a média/variância desejada). Compare o p-valor de Bartlett com o de Levene nesse cenário não-normal — qual dos dois se mantém mais confiável? Relacione a resposta com a explicação de sensibilidade a não-normalidade dada no capítulo.</p>
<h3 id="erros-comuns">Erros comuns</h3>
<ol>
<li><strong>Rodar ANOVA sem verificar variância nenhuma.</strong> É a prática mais comum e a mais arriscada quando os tamanhos de amostra por grupo são desiguais — a ANOVA é mais sensível à heterocedasticidade quanto mais desiguais forem os n por grupo.</li>
<li><strong>Usar Bartlett cegamente em dados claramente não-normais.</strong> Nesse caso, o teste pode acusar heterogeneidade de variância que é, na verdade, um artefacto da forma da distribuição — prefira Levene.</li>
<li><strong>Confundir este teste com o teste de aderência à distribuição.</strong> Bartlett/Levene comparam variâncias <em>entre</em> grupos; não dizem nada sobre se cada grupo, isoladamente, é normal — ver <a href="#/aula/cap-047">Capítulo 47</a> para isso.</li>
<li><strong>Ignorar um Bartlett/Levene significativo só porque a ANOVA de médias "passou".</strong> Uma variância descontrolada é, por si, um problema de processo — mesmo que a média esteja no alvo, como mostra o exemplo do operador C.</li>
</ol>
<p><em>Fonte principal: NIST/SEMATECH <em>e-Handbook of Statistical Methods</em>, secção sobre o teste de Bartlett (Measures of Scale / EDA). Cross-check: Bartlett, M.S. (1937), "Properties of Sufficiency and Statistical Tests," <em>Proceedings of the Royal Society A</em>. Verificado via pesquisa na web em 01/09/2026.</em></p>

