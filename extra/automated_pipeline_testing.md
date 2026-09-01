<a id="capitulo-181"></a>
## Capítulo 181: Testes Automatizados de Pipeline: da Lógica pytest ao dbt tests/Great Expectations

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>O pipeline calcula o OEE de uma linha de produção. Uma alteração no código de cálculo das Seis Grandes Perdas, feita seis meses depois por outra pessoa, introduz um bug subtil: uma perda de velocidade passa a ser contada duas vezes, uma como perda de performance e outra como perda de qualidade. O número final de OEE ainda "parece" plausível — está errado, mas não é absurdo o suficiente para ser notado a olho. Como é que esse bug é apanhado antes de chegar a um relatório de gestão?</em></p>
<p>A resposta não é "revisão manual mais cuidadosa" — é <strong>testar o próprio cálculo</strong>, da mesma forma que se testa código de software: com afirmações automáticas e reexecutáveis sobre o que <em>tem de ser sempre verdade</em>, independentemente dos dados de entrada.</p>
<h3 id="testar-dados-e-diferente-de-testar-codigo-mas-usa-as-mesmas-ferramentas">Testar dados é diferente de testar código — mas usa as mesmas ferramentas</h3>
<p>Um teste de software tradicional verifica que uma função devolve o resultado certo para uma entrada conhecida. Um <strong>teste de invariante analítico</strong> verifica algo mais geral: que uma propriedade se mantém verdadeira <em>para qualquer entrada válida</em> — não "o OEE desta linha específica é 0,73", mas "o OEE nunca pode ser superior a 1,0, seja qual for o dataset". É uma afirmação sobre a lógica de cálculo, não sobre um resultado específico, e é precisamente o tipo de erro que passa despercebido numa inspeção visual mas é apanhado imediatamente por uma verificação automática.</p>
<p>Em Python, a ferramenta padrão para escrever este tipo de verificação é o <strong>pytest</strong> — a mesma ferramenta usada para testar qualquer outro código Python, aplicada aqui a funções de cálculo analítico em vez de lógica de aplicação.</p>
<h3 id="exemplo-resolvido-invariantes-de-oee-e-seis-grandes-perdas">Exemplo resolvido: invariantes de OEE e Seis Grandes Perdas</h3><div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct4e7daf2d-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct4e7daf2d-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python"># ficheiro: test_analytics_invariants.py
import numpy as np
import pandas as pd
import pytest

def calcular_oee(disponibilidade, performance, qualidade):
    return disponibilidade * performance * qualidade

def calcular_seis_grandes_perdas(tempo_planejado, tempo_parado,
                                   perda_velocidade, perda_qualidade):
    """Decompoe o tempo planejado nas Seis Grandes Perdas do TPM.
    INVARIANTE: a soma das perdas + tempo produtivo tem de bater
    exatamente com o tempo planejado -- nenhuma perda pode ser
    contada duas vezes."""
    tempo_produtivo = tempo_planejado - tempo_parado - perda_velocidade - perda_qualidade
    return {
        "tempo_parado": tempo_parado,
        "perda_velocidade": perda_velocidade,
        "perda_qualidade": perda_qualidade,
        "tempo_produtivo": tempo_produtivo,
    }

# ---------- Teste 1: OEE nunca pode exceder 1.0 ----------
def test_oee_nunca_excede_um():
    rng = np.random.default_rng(2026)
    for _ in range(1000):
        disp = rng.uniform(0, 1)
        perf = rng.uniform(0, 1)
        qual = rng.uniform(0, 1)
        oee = calcular_oee(disp, perf, qual)
        assert 0 &lt;= oee &lt;= 1, f"OEE fora de [0,1]: {oee}"

# ---------- Teste 2: as Seis Grandes Perdas nao contam nada duas vezes ----------
def test_seis_grandes_perdas_sem_dupla_contagem():
    resultado = calcular_seis_grandes_perdas(
        tempo_planejado=480, tempo_parado=60,
        perda_velocidade=40, perda_qualidade=20,
    )
    soma_componentes = (resultado["tempo_parado"] + resultado["perda_velocidade"]
                         + resultado["perda_qualidade"] + resultado["tempo_produtivo"])
    assert soma_componentes == 480, (
        f"Componentes somam {soma_componentes}, deviam somar o tempo planejado (480). "
        f"Isto indica dupla contagem ou perda de tempo nao contabilizada."
    )

# ---------- Teste 3: caso de regressao -- o bug historico documentado ----------
def test_regressao_perda_velocidade_nao_duplicada_em_qualidade():
    """Este teste existe porque um bug real ja aconteceu: uma perda de
    velocidade estava a ser somada tambem a perda de qualidade, inflando
    o total de perdas alem do tempo planejado. Este caso fixa esse
    cenario especifico para que a regressao nunca volte sem ser notada."""
    resultado = calcular_seis_grandes_perdas(
        tempo_planejado=100, tempo_parado=0,
        perda_velocidade=30, perda_qualidade=10,
    )
    assert resultado["tempo_produtivo"] == 60

if __name__ == "__main__":
    import sys
    sys.exit(pytest.main([__file__, "-v"]))</code></pre></div></div></div>
<p><strong>Leitura de engenharia.</strong> Repare na diferença entre os três testes: o primeiro é uma <strong>propriedade universal</strong> (verificada com 1000 combinações aleatórias, não um único caso); o segundo é uma <strong>invariante de conservação</strong> (a soma das partes tem de bater com o todo); o terceiro é um <strong>teste de regressão</strong> — fixa um caso concreto onde um bug real já aconteceu, para garantir que, se o código for alterado no futuro, esse erro específico não volte sem ser notado. Os três tipos são complementares, não substitutos um do outro.</p>
<h3 id="o-mesmo-vocabulario-noutras-ferramentas-dbt-tests-e-great-expectations">O mesmo vocabulário, noutras ferramentas: dbt tests e Great Expectations</h3>
<p>Este padrão — afirmações automáticas sobre a lógica de um pipeline — tem nomes próprios noutras ferramentas do ecossistema de engenharia de dados, e vale a pena reconhecer o vocabulário mesmo que o exercício deste capítulo use só pytest:</p>
<ul>
<li><strong>dbt tests</strong> — testes definidos em YAML, executados como consultas SQL contra o data warehouse, integrados ao próprio fluxo de transformação do dbt. Respondem à pergunta <em>"a transformação funcionou como esperado?"</em> — os quatro testes genéricos incluídos no dbt (<code>unique</code>, <code>not_null</code>, <code>accepted_values</code>, <code>relationships</code>) cobrem as verificações estruturais mais comuns de uma tabela.</li>
<li><strong>Great Expectations</strong> — uma biblioteca Python dedicada a "expectativas" sobre dados (intervalos de valores válidos, distribuições esperadas, contagem de nulos aceitável). Responde a uma pergunta ligeiramente diferente: <em>"este dado é suficientemente bom para ser usado, independentemente de a transformação ter corrido sem erro técnico?"</em> — um pipeline pode correr sem falhar e ainda assim produzir dados de má qualidade; é essa distinção que Great Expectations cobre e que testes puramente estruturais não cobrem.</li>
</ul>
<p>As três ferramentas — pytest, dbt tests, Great Expectations — não competem entre si: um teste pytest de invariante de negócio (como os do exemplo acima) tipicamente vive ao lado da lógica de cálculo, escrito por quem entende a regra de negócio; testes estruturais de tabela (unicidade, não-nulidade, chaves válidas) tendem a viver mais perto do pipeline de transformação em si, seja em dbt tests, seja em Great Expectations.</p>
<h3 id="exercicio-proposto">Exercício proposto</h3>
<p>Escreva um quarto teste, <code>test_seis_grandes_perdas_rejeita_entrada_invalida</code>, que verifique que a função <code>calcular_seis_grandes_perdas</code> produz um resultado negativo em <code>tempo_produtivo</code> quando a soma das perdas excede o tempo planejado (por exemplo, <code>tempo_planejado=100</code>, <code>tempo_parado=50</code>, <code>perda_velocidade=40</code>, <code>perda_qualidade=30</code>). Depois, decida e justifique por escrito: essa situação devia ser tratada como um <em>bug a corrigir na função</em> (a função devia lançar um erro nesse caso) ou como um <em>sinal de dado de entrada suspeito</em> (a função está correta, mas alguém a montante mediu algo errado)? Não há uma resposta única certa — o exercício é justificar a escolha.</p>
<h3 id="erros-comuns">Erros comuns</h3><ol>
<li><strong>Testar apenas com um caso "feliz" de exemplo.</strong> Um único caso não apanha um bug de dupla contagem que só aparece em combinações específicas de valores — prefira gerar muitos casos aleatórios (como no Teste 1) sempre que a propriedade for universal.</li>
<li><strong>Não fixar casos de regressão para bugs já corrigidos.</strong> Sem o Teste 3, nada impede que o mesmo bug de dupla contagem volte a aparecer numa alteração futura de código, meses depois, sem ninguém se lembrar do incidente original.</li>
<li><strong>Confundir "o pipeline correu sem erro" com "o dado está correto".</strong> Um pipeline pode terminar com sucesso técnico e ainda produzir um OEE de 1,4 — é para isto que servem os testes de invariante, não apenas testes de execução.</li>
<li><strong>Testar só a estrutura (colunas, tipos, nulos) e nunca a lógica de negócio.</strong> Testes estruturais (o forte de dbt tests / Great Expectations) não apanham um erro de fórmula como a dupla contagem de perdas — só um teste que conhece a regra de negócio apanha isso.</li>
<li><strong>Deixar os testes de invariante fora do pipeline de CI.</strong> Um teste que só corre quando alguém se lembra de o correr manualmente não protege contra regressões introduzidas por outra pessoa, mais tarde.</li>
</ol><p><em>Fonte principal: documentação oficial pytest (docs.pytest.org) e dbt (“About dbt tests”, docs.getdbt.com). Cross-check: Great Expectations docs (greatexpectations.io); Datadog Engineering Blog, “Implement dbt data quality checks with dbt-expectations”; comparação dbt tests vs. Great Expectations (metaplane.dev). Verificado via pesquisa na web em 01/09/2026.</em></p>
