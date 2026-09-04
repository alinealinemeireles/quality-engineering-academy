<a id="capitulo-180"></a>
## Capítulo 180: Métricas de Rendimento Six Sigma: DPU, DPMO, Nível Sigma, FPY/FTY e RTY

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>A linha A tem 2% de peças rejeitadas na inspeção final. A linha B, num processo com cinco estações de inspeção em série, também tem 2% de rejeitados na inspeção final. As duas linhas têm o mesmo desempenho de qualidade?</em></p>
<p>Quase certamente não — e a razão é que "rejeitados na inspeção final" é a métrica errada para comparar processos com números diferentes de oportunidades de defeito e de estações em série. Este capítulo cobre o conjunto de indicadores que o Six Sigma usa precisamente para tornar processos comparáveis, independentemente da sua complexidade: DPU, DPMO, nível sigma, FPY/FTY e RTY.</p>
<h3 id="dpu-defeitos-por-unidade">DPU: defeitos por unidade</h3>
<div class="math-block" data-math="DPU = \frac{\text{Número total de defeitos encontrados}}{\text{Número de unidades inspecionadas}}"></div>
<p>DPU conta <strong>defeitos</strong>, não unidades defeituosas — uma distinção que importa. Uma unidade pode ter mais de um defeito; o DPU captura isso, uma taxa simples de "unidades rejeitadas / unidades produzidas" não. Uma unidade com três defeitos e uma unidade com um defeito contam igualmente para uma taxa de rejeição binária, mas contam de forma diferente (e mais informativa) para o DPU.</p><h3 id="dpmo-e-nivel-sigma">DPMO e nível sigma: normalizando para comparar processos diferentes</h3>
<p>DPU sozinho ainda não permite comparar dois processos com números diferentes de <strong>oportunidades de defeito por unidade</strong> (uma placa eletrónica com 200 soldas tem 200 oportunidades por unidade; uma peça usinada simples pode ter 3). O DPMO resolve isso:</p>
<div class="math-block" data-math="DPMO = \frac{\text{Número total de defeitos}}{\text{Unidades} \times \text{Oportunidades por unidade}} \times 1.000.000"></div>
<p>DPMO é a taxa de defeito normalizada por milhão de oportunidades — comparável entre processos com números de oportunidade completamente diferentes. A partir do DPMO, converte-se para <strong>nível sigma</strong>, usando a área sob a curva normal (com o deslocamento de 1,5σ convencional do Six Sigma, que assume que a média do processo deriva ao longo do tempo em relação à posição medida num curto período):</p>
<div class="math-block" data-math="\text{Nível Sigma} = \Phi^{-1}\left(1 - \frac{DPMO}{1.000.000}\right) + 1{,}5"></div>
<p>onde <span class="math-inline" data-math="\Phi^{-1}"></span> é a inversa da função de distribuição acumulada normal padrão. Um processo "6 sigma" tem DPMO ≈ 3,4 — o padrão de referência da metodologia, correspondendo a menos de 3,4 defeitos por milhão de oportunidades depois de contabilizada a deriva de 1,5σ.</p><h3 id="fpy-fty">FPY / FTY: rendimento de primeira passagem</h3>
<div class="math-block" data-math="FPY = \frac{\text{Unidades boas à primeira, sem retrabalho}}{\text{Unidades que entraram no processo}}"></div>
<p><em>First Pass Yield</em> (também chamado <em>First Time Yield</em>, FTY) mede a fração de unidades que passa por uma estação ou processo <strong>sem qualquer retrabalho ou correção</strong>. É uma métrica mais rigorosa do que a taxa de aprovação final, porque uma unidade que precisou de retrabalho e depois passou na inspeção conta como "aprovada" numa taxa de aprovação simples, mas não conta como "boa à primeira" no FPY — e o custo do retrabalho, mesmo quando invisível na taxa de aprovação final, é real (ver Custo da Qualidade, <a href="#/aula/cap-007">Capítulo 7</a>).</p><h3 id="rty-rendimento-encadeado">RTY: rendimento encadeado e as condições para o calcular</h3>
<p>Quando um processo tem várias estações em série, o <strong>Rolled Throughput Yield</strong> (RTY) é o produto dos FPY de cada estação:</p>
<div class="math-block" data-math="RTY = FPY_1 \times FPY_2 \times \cdots \times FPY_n"></div>
<p>O RTY responde à pergunta que a taxa de rejeição da inspeção final, sozinha, não responde: qual é a probabilidade de uma unidade passar por <strong>todo</strong> o processo sem nenhum retrabalho, em nenhuma estação? É por isso que dois processos com a mesma taxa de rejeição final podem ter desempenhos radicalmente diferentes — um processo com cinco estações em série, cada uma com 98% de FPY, tem RTY = 0,98⁵ ≈ 90,4%, mesmo que o defeito final pareça pequeno.</p>
<p><strong>A ressalva importante:</strong> o produto dos FPYs é a decomposição natural da probabilidade de uma unidade atravessar todas as etapas sem retrabalho, desde que os FPYs estejam definidos de forma consistente sobre o mesmo fluxo. <strong>Não é necessária uma hipótese de independência estatística entre estações para essa identidade.</strong> O problema prático está na qualidade da medição: retrabalho, reinspeção, loops, perdas de rastreabilidade e defeitos detetados numa estação diferente daquela onde foram criados podem fazer com que os FPYs não representem a mesma população e dificultar a atribuição da origem. Quando existe rastreabilidade completa (produto → lote → estação — ver <a href="#/aula/cap-099">Capítulo 99</a>), é possível construir métricas adicionais de rendimento e origem do defeito, mais úteis para decidir onde investir em melhoria.</p><h3 id="exemplo-resolvido-do-dpu-ao-rty">Exemplo resolvido: do DPU ao RTY, na mesma linha de produção</h3><div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct3f2b40a7-t0">Python</button><button type="button" class="ct-tab" role="tab" aria-selected="false" id="ct3f2b40a7-t1">R</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct3f2b40a7-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import numpy as np
from scipy import stats

# ---- DPU e DPMO ----
unidades_inspecionadas = 500
defeitos_encontrados = 63
oportunidades_por_unidade = 12   # ex: 12 pontos de solda / caracteristicas criticas por placa

dpu = defeitos_encontrados / unidades_inspecionadas
dpmo = (defeitos_encontrados / (unidades_inspecionadas * oportunidades_por_unidade)) * 1_000_000
nivel_sigma = stats.norm.ppf(1 - dpmo / 1_000_000) + 1.5

print(f"DPU  = {dpu:.4f} defeitos/unidade")
print(f"DPMO = {dpmo:,.0f} defeitos por milhao de oportunidades")
print(f"Nivel Sigma (com deslocamento de 1,5 sigma) = {nivel_sigma:.2f}")

# ---- FPY por estacao e RTY teorico ----
estacoes = {
    "Corte":          (480, 470),   # (unidades entrada, unidades boas a primeira)
    "Solda":          (470, 452),
    "Montagem":       (452, 441),
    "Teste eletrico": (441, 432),
    "Embalagem":      (432, 428),
}

print("\nFPY por estacao:")
fpys = {}
for estacao, (entrada, boas) in estacoes.items():
    fpy = boas / entrada
    fpys[estacao] = fpy
    print(f"  {estacao:&lt;16}: {boas:&gt;4}/{entrada:&lt;4} = {fpy:.4f}  ({fpy*100:.1f}%)")

rty_teorico = np.prod(list(fpys.values()))
print(f"\nRTY teorico (produto dos FPYs) = {rty_teorico:.4f}  ({rty_teorico*100:.1f}%)")

taxa_rejeicao_final = 1 - (428 / 480)
print(f"Taxa de rejeicao vista so na inspecao final = {taxa_rejeicao_final*100:.1f}%")
print(f"\nRepare: a rejeicao final sozinha ({taxa_rejeicao_final*100:.1f}%) parece pequena,")
print(f"mas o RTY teorico ({rty_teorico*100:.1f}%) revela que cerca de "
      f"{(1-rty_teorico)*100:.1f}% das unidades passaram por RETRABALHO em algum")
print("ponto da linha, mesmo tendo sido aprovadas no final -- custo escondido do")
print("Custo da Qualidade (Capitulo 7) que a taxa de rejeicao final nao mostra.")</code></pre></div></div><div class="ct-pane" hidden role="tabpanel" aria-labelledby="ct3f2b40a7-t1"><div class="codeblock" data-lang="r"><div class="codebar"><span class="lang">R</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-r"># ---- DPU e DPMO ----
unidades_inspecionadas &lt;- 500
defeitos_encontrados &lt;- 63
oportunidades_por_unidade &lt;- 12   # ex: 12 pontos de solda / caracteristicas criticas por placa

dpu &lt;- defeitos_encontrados / unidades_inspecionadas
dpmo &lt;- (defeitos_encontrados / (unidades_inspecionadas * oportunidades_por_unidade)) * 1e6
nivel_sigma &lt;- qnorm(1 - dpmo / 1e6) + 1.5

cat(sprintf("DPU  = %.4f defeitos/unidade\n", dpu))
cat(sprintf("DPMO = %s defeitos por milhao de oportunidades\n", format(round(dpmo), big.mark = ",")))
cat(sprintf("Nivel Sigma (com deslocamento de 1,5 sigma) = %.2f\n", nivel_sigma))

# ---- FPY por estacao e RTY teorico ----
estacoes &lt;- list(
  "Corte"          = c(entrada = 480, boas = 470),
  "Solda"          = c(entrada = 470, boas = 452),
  "Montagem"       = c(entrada = 452, boas = 441),
  "Teste eletrico" = c(entrada = 441, boas = 432),
  "Embalagem"      = c(entrada = 432, boas = 428)
)

cat("\nFPY por estacao:\n")
fpys &lt;- sapply(estacoes, function(e) e[["boas"]] / e[["entrada"]])
for (nome in names(estacoes)) {
  e &lt;- estacoes[[nome]]
  fpy &lt;- fpys[[nome]]
  cat(sprintf("  %-16s: %4d/%-4d = %.4f  (%.1f%%)\n", nome, e[["boas"]], e[["entrada"]], fpy, fpy * 100))
}

rty_teorico &lt;- prod(fpys)
cat(sprintf("\nRTY teorico (produto dos FPYs) = %.4f  (%.1f%%)\n", rty_teorico, rty_teorico * 100))

taxa_rejeicao_final &lt;- 1 - (428 / 480)
cat(sprintf("Taxa de rejeicao vista so na inspecao final = %.1f%%\n", taxa_rejeicao_final * 100))
cat(sprintf("\nRepare: a rejeicao final sozinha (%.1f%%) parece pequena,\n", taxa_rejeicao_final * 100))
cat(sprintf("mas o RTY teorico (%.1f%%) revela que cerca de %.1f%% das unidades passaram por RETRABALHO em algum\n",
            rty_teorico * 100, (1 - rty_teorico) * 100))
cat("ponto da linha, mesmo tendo sido aprovadas no final -- custo escondido do\n")
cat("Custo da Qualidade (Capitulo 7) que a taxa de rejeicao final nao mostra.\n")
</code></pre></div></div></div><h3 id="exercicio-proposto">Exercício proposto</h3>
<p>Usando o exemplo resolvido acima, adicione uma sexta estação com FPY de apenas 85% e recalcule o RTY teórico. Quantos pontos percentuais de RTY uma única estação fraca consegue "comer", mesmo com as outras cinco estações em bom estado? Depois, assumindo que existe rastreabilidade completa (contexto: Notebook 6.6, rastreabilidade produto → lote → máquina do projeto <em>manufacturing-performance-analytics</em>), descreva em texto — não precisa calcular — que dados adicionais seriam necessários para transformar este RTY teórico num RTY rastreável, e por que essa distinção mudaria a prioridade de investimento em melhoria.</p>
<h3 id="erros-comuns">Erros comuns</h3>
<ol>
<li><strong>Usar taxa de rejeição final como proxy de qualidade do processo inteiro.</strong> Como mostra o exemplo, ela esconde retrabalho intermédio em processos com várias estações.</li>
<li><strong>Confundir DPU com taxa de unidades defeituosas.</strong> Uma unidade com múltiplos defeitos infla corretamente o DPU, mas conta como "uma" unidade defeituosa numa taxa binária — as duas métricas respondem a perguntas diferentes.</li>
<li><strong>Esquecer o deslocamento de 1,5σ ao converter DPMO em nível sigma — ou aplicá-lo sem saber por que existe.</strong> É uma convenção da metodologia Six Sigma clássica (Motorola), não uma propriedade matemática universal; alguns contextos reportam nível sigma "de curto prazo" sem o deslocamento — declare sempre qual está a usar.</li>
<li><strong>Multiplicar FPYs de populações incompatíveis.</strong> Antes de calcular RTY, confirme que os denominadores, unidades, período, regras de retrabalho e definição de first-pass são consistentes ao longo das estações.</li>
</ol>
<p><em>Fonte principal: ASQ Certified Six Sigma Yellow/Green Belt (CSSYB/CSSGB) Body of Knowledge, secção de métricas de processo (DPU, DPMO, nível sigma, FPY, RTY). Verificado via pesquisa na web em 01/09/2026.</em></p>

