<a id="capitulo-182"></a>
## Capítulo 182: Teoria das Restrições (TOC): os 5 Focusing Steps

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>Uma linha de produção tem cinco processos em série. Reduzir o desperdício em quatro deles pela metade, mas deixar o quinto inalterado, muda quanto a saída total da linha? A resposta incómoda é: normalmente nada, ou quase nada — se o quinto processo for o mais lento de todos, é ele, e só ele, que determina o ritmo de saída da linha inteira.</em></p>
<p>Esta observação, aparentemente óbvia depois de dita, é o ponto de partida de um paradigma de melhoria de processos com identidade própria: a <strong>Teoria das Restrições</strong> (Theory of Constraints, TOC), desenvolvida por Eliyahu M. Goldratt nos anos 1980 e popularizada pelo seu livro <em>The Goal</em> (1984).</p>
<h3 id="toc-nao-e-lean-com-outro-nome-sao-filosofias-operacionalmente-distintas">TOC não é Lean com outro nome — são filosofias operacionalmente distintas</h3>
<p>É tentador tratar TOC como "mais uma ferramenta" dentro da caixa de ferramentas Lean já estudada nos módulos anteriores. A literatura é explícita em como isso é um erro de enquadramento: TOC e Lean partem de princípios operacionais diferentes, e por vezes opostos.</p>
<ul>
<li><strong>Foco.</strong> Lean procura eliminar desperdício <em>ao longo de todo o processo</em>, tratando cada etapa como igualmente merecedora de atenção. TOC concentra-se deliberadamente numa única etapa de cada vez — a restrição — e ignora, por agora, otimizações nas etapas que não são a restrição.</li>
<li><strong>Inventário.</strong> Lean procura minimizar inventário em toda a linha, como sinal e causa de desperdício. TOC tolera — e por vezes cria deliberadamente — um <em>buffer</em> de inventário exatamente antes da restrição, para garantir que ela nunca fica parada à espera de material.</li>
<li><strong>Critério de sucesso local vs. global.</strong> Lean, aplicado com disciplina, também pensa no fluxo global — mas TOC torna essa prioridade explícita e formal: melhorar uma etapa que não é a restrição pode não mudar em nada a saída da linha inteira, e TOC trata isso como desperdício de esforço de melhoria, não apenas como uma otimização de menor prioridade.</li>
</ul>
<p>A literatura de melhoria de processos reconhece esta distinção ao tratar TOC, Lean e Six Sigma como <strong>três paradigmas complementares</strong> — não um subordinado ao outro — sob a designação de <strong>TLS Continuum</strong> (Theory of Constraints + Lean + Six Sigma): cada um resolve uma pergunta diferente ("onde focar", "como eliminar desperdício", "como reduzir variação"), e os três juntos cobrem mais do que qualquer um sozinho. Ao contrário do que o nome do track deste módulo sugere, TOC não é uma técnica Lean — é o terceiro paradigma dessa combinação, aqui incluído no mesmo track por serem, na prática, ensinados e aplicados pelas mesmas equipas de melhoria de processo.</p>
<h3 id="os-cinco-passos-de-foco-five-focusing-steps">Os cinco passos de foco (Five Focusing Steps)</h3>
<p>O método prático de TOC para aplicar este princípio a um processo real segue cinco passos, pensados para se repetir continuamente — a restrição de hoje pode não ser a restrição de amanhã, depois de resolvida:</p>
<ol>
<li><strong>Identificar</strong> a restrição — a etapa que limita a saída de todo o sistema.</li>
<li><strong>Explorar</strong> a restrição — extrair o máximo de capacidade dela sem investimento adicional (eliminar micro-paragens, garantir que nunca fica parada por falta de material, priorizar o trabalho que passa por ela).</li>
<li><strong>Subordinar</strong> tudo o resto à decisão anterior — as outras etapas ajustam-se ao ritmo da restrição, mesmo que isso signifique deixá-las com capacidade ociosa deliberada.</li>
<li><strong>Elevar</strong> a restrição — se, depois de a explorar ao máximo, ainda não for suficiente, investir para aumentar a sua capacidade (nova máquina, mais um turno, automatização).</li>
<li><strong>Repetir</strong> o processo — quando a restrição se resolve, outra etapa passa a ser o novo fator limitante, e o ciclo recomeça a partir do passo 1. TOC avisa explicitamente contra deixar a inércia organizacional tornar-se a nova restrição, depois de a original ser resolvida.</li>
</ol>
<h3 id="tambor-pulmao-corda-drum-buffer-rope-e-as-tres-metricas-de-toc">Tambor-pulmão-corda (drum-buffer-rope) e as três métricas de TOC</h3>
<p>Para operacionalizar "subordinar tudo o resto à restrição", TOC usa a metáfora <strong>tambor-pulmão-corda</strong>: a restrição é o <strong>tambor</strong> — o ritmo que toda a linha segue; um <strong>pulmão</strong> (buffer de inventário) protege a restrição de nunca ficar parada por falta de material a montante; e a <strong>corda</strong> é o mecanismo que impede que as etapas antes da restrição produzam mais depressa do que ela consegue processar — evitando acumular inventário desnecessário em qualquer outro ponto da linha.</p>
<p>Para decidir onde investir esforço de melhoria, TOC usa três métricas financeiras simples, deliberadamente mais diretas do que os indicadores de custeio tradicionais:</p>
<ul>
<li><strong>Throughput</strong> — a taxa a que o sistema gera dinheiro através de vendas (não de produção — uma peça produzida e não vendida não é throughput).</li>
<li><strong>Inventory</strong> — todo o dinheiro que o sistema tem investido em coisas que pretende vender (matéria-prima, trabalho em curso, produto acabado).</li>
<li><strong>Operating Expense</strong> — todo o dinheiro que o sistema gasta para transformar inventário em throughput.</li>
</ul>
<p>Qualquer decisão de melhoria em TOC é avaliada pelo seu efeito nestas três métricas — e, especificamente, uma melhoria numa etapa que não é a restrição, mesmo que pareça positiva localmente, tipicamente não move o throughput global em nada.</p>
<h3 id="exemplo-resolvido-onde-investir-esforco-de-melhoria-muda-o-throughput">Exemplo resolvido: onde investir esforço de melhoria muda o throughput?</h3><div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct66b3699f-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct66b3699f-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import numpy as np
import pandas as pd

# Cinco processos em serie, cada um com uma capacidade diferente
# (unidades/hora que cada processo consegue processar).
processos = pd.DataFrame({
    "processo":   ["Corte", "Furacao", "Injecao", "Montagem", "Embalagem"],
    "capacidade_un_h": [140, 125, 60, 130, 150],
})

restricao = processos.loc[processos["capacidade_un_h"].idxmin()]
print("Capacidade de cada processo (un/h):")
print(processos.to_string(index=False))
print(f"\nCANDIDATO A RESTRICAO: {restricao['processo']} "
      f"({restricao['capacidade_un_h']} un/h)")
print("(chamado 'candidato' e nao 'restricao comprovada' ate ser validado")
print(" com dados reais de producao -- ver nota de rigor metodologico abaixo)")

# ---------- Passo 2: EXPLORAR -- quanto a saida da linha melhora se a
# restricao (Injecao) ganhar 10% de capacidade so por eliminar
# microparagens, sem qualquer investimento? ----------
capacidade_atual = processos["capacidade_un_h"].min()
capacidade_explorada = capacidade_atual * 1.10
saida_linha_antes = capacidade_atual          # a linha nunca produz mais que a restricao
saida_linha_depois = min(capacidade_explorada,
                          processos[processos["processo"] != "Injecao"]["capacidade_un_h"].min())

print(f"\nSaida da linha ANTES de explorar a restricao : {saida_linha_antes:.0f} un/h")
print(f"Saida da linha DEPOIS (Injecao +10%, sem investir) : {saida_linha_depois:.0f} un/h")
print(f"Ganho de throughput: {saida_linha_depois - saida_linha_antes:.0f} un/h "
      f"({100*(saida_linha_depois/saida_linha_antes - 1):.1f}%)")

# Comparacao: e se em vez disso melhorassemos 10% um processo QUE NAO
# e a restricao (ex.: Corte, que ja tem folga)?
print("\nComparacao -- melhorar 10% um processo que NAO e a restricao (Corte):")
saida_com_corte_melhor = processos["capacidade_un_h"].min()   # Injecao continua a limitar
print(f"Saida da linha: {saida_com_corte_melhor:.0f} un/h -- SEM MUDANCA.")
print("O throughput da linha inteira nao muda, porque Corte ja tinha folga")
print("acima da restricao -- todo o esforco de melhoria ali foi, do ponto")
print("de vista de TOC, essencialmente desperdicado.")</code></pre></div></div></div>
<p><strong>Leitura de engenharia.</strong> O exemplo é deliberadamente simples, mas a conclusão generaliza: qualquer melhoria de capacidade numa etapa <em>que não é a restrição</em> não move o throughput da linha inteira, por maior que seja a melhoria percentual nessa etapa isoladamente. É exatamente este resultado — contra-intuitivo para quem mede sucesso por indicadores locais de cada processo — que torna TOC uma disciplina de priorização, não apenas mais uma técnica de redução de desperdício.</p>
<h3 id="candidato-a-restricao-vs-restricao-comprovada-rigor-metodologico">Candidato a restrição vs. restrição comprovada: rigor metodológico</h3>
<p>Identificar a etapa com menor capacidade nominal (como no exemplo acima) dá um <strong>candidato</strong> a restrição — uma hipótese, baseada em dados de capacidade teórica ou de projeto. Não é ainda uma <strong>restrição comprovada</strong>: a capacidade real, medida em produção, pode divergir da capacidade nominal por micro-paragens, variabilidade de tempo de ciclo, ou disponibilidade de material. Tratar um candidato como se já fosse confirmado — e redirecionar esforço de melhoria para lá sem verificar com dados reais de produção — é o erro metodológico mais comum na aplicação de TOC fora do livro-texto.</p>
<p>Um sinal adicional de restrição comprovada, além da capacidade medida, é <strong>starvation</strong> (fome) — quando um processo a jusante da restrição fica repetidamente parado à espera de material, é evidência de que a etapa a montante está de facto a limitar o fluxo. A ausência de starvation nos processos a jusante, ao contrário, é um sinal de que a restrição pode estar mal identificada.</p>
<h3 id="exercicio-proposto">Exercício proposto</h3>
<p>Usando a tabela de capacidades do exemplo resolvido, simule o efeito de <strong>elevar</strong> a restrição (Injeção) em vez de apenas a explorar: aumente a capacidade de Injeção de 60 para 135 un/h (um investimento maior, ex. uma segunda máquina de injeção) e recalcule a saída da linha inteira. Qual processo se torna a nova restrição? Depois, escreva um parágrafo curto a aplicar o passo 5 (Repetir) a este novo cenário: que decisão de melhoria faria sentido investigar a seguir, e porquê — sem ainda a implementar, apenas identificando o próximo candidato a restrição.</p>
<h3 id="erros-comuns">Erros comuns</h3><ol>
<li><strong>Tratar TOC como uma técnica dentro do Lean.</strong> São paradigmas com prioridades operacionais diferentes (foco numa etapa vs. eliminação de desperdício em todas) — a literatura TLS trata-os como complementares, não como um subordinado ao outro.</li>
<li><strong>Investir esforço de melhoria numa etapa que não é a restrição.</strong> Como no exemplo resolvido, o throughput da linha inteira não muda — é esforço tecnicamente bem-sucedido e estrategicamente desperdiçado.</li>
<li><strong>Confundir candidato a restrição com restrição comprovada.</strong> A capacidade nominal de projeto raramente coincide exatamente com a capacidade real medida em produção — validar com dados antes de agir evita otimizar a etapa errada.</li>
<li><strong>Eliminar o buffer de inventário antes da restrição, por reflexo Lean de "minimizar inventário em todo o lado".</strong> Esse buffer específico existe deliberadamente para proteger o throughput da linha — removê-lo por princípio, sem distinguir o seu propósito, pode reduzir a saída global.</li>
<li><strong>Esquecer o passo 5 (Repetir).</strong> Depois de elevar uma restrição, outra etapa torna-se automaticamente o novo fator limitante — tratar a melhoria como "terminada" ignora que o processo de foco é, por desenho, contínuo.</li>
</ol><p><em>Fonte principal: Eliyahu M. Goldratt, <em>The Goal</em> (1984) — origem do conceito e dos cinco passos de foco. Cross-check: Theory of Constraints Institute, “Five Focusing Steps” (tocinstitute.org); iSixSigma, “A Beginner's Guide to the Five Focusing Steps in the Theory of Constraints”; literatura do “TLS Continuum” (Theory of Constraints + Lean + Six Sigma) sobre os três paradigmas complementares de melhoria de processo. Verificado via pesquisa na web em 01/09/2026.</em></p>
