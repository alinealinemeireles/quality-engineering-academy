<a id="capitulo-179"></a>
## Capítulo 179: Engenharia de Pipeline em Pandas: groupby/transform, Matching de Intervalos e Sequenciamento Stateful

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>Três situações reais de um pipeline de manufatura: (1) o número de lote de material está em branco em algumas linhas, mas devia herdar o valor do evento anterior da mesma máquina; (2) uma paragem de máquina precisa de ser associada à ordem de produção que estava a decorrer naquele instante — e, se duas ordens se sobrepõem, à mais recente; (3) o número sequencial de um lote de material só pode ser calculado olhando, uma linha de cada vez, para o que já foi visto antes. Nenhuma destas três operações é uma agregação simples — e nenhuma delas se resolve com uma função vetorizada de uma linha.</em></p>
<p>Este capítulo cobre o pandas que fica entre "sei fazer <code>groupby().sum()</code>" e "sei construir um pipeline de limpeza que aguenta os casos reais e sujos de um chão de fábrica".</p>
<h3 id="a-ponte-que-ja-conhece-groupby-transform-e-partition-by-over">A ponte que já conhece: groupby().transform() é PARTITION BY ... OVER</h3>
<p>No <a href="#/aula/cap-107">Capítulo 107</a> viu <code>SUM(x) OVER (PARTITION BY ...)</code> — uma agregação calculada dentro de cada partição, mas devolvida com a mesma granularidade das linhas originais (ao contrário de <code>GROUP BY</code>, que colapsa as linhas). Em pandas, o equivalente exato é <code>groupby(coluna).transform(funcao)</code>: agrupa, aplica a função a cada grupo, e devolve um resultado com o <strong>mesmo índice e a mesma forma</strong> do DataFrame original — pronto a atribuir de volta a uma coluna nova.</p>
<p>Esta equivalência é a chave para não tratar <code>transform()</code> como magia: é a mesma operação de janela particionada que já viu em SQL, só que expressa na sintaxe do pandas.</p>
<h3 id="exemplo-resolvido-preenchimento-de-lacunas-dentro-de-uma-particao">Exemplo resolvido: preenchimento de lacunas dentro de uma partição</h3><div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct22fdaf30-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct22fdaf30-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import pandas as pd
import numpy as np

# Eventos de producao com o numero de lote de material em falta nalgumas linhas
df = pd.DataFrame({
    "maquina":    ["M1", "M1", "M1", "M1", "M2", "M2", "M2"],
    "sequencia":  [1, 2, 3, 4, 1, 2, 3],
    "lote_material": ["LOT-A", None, None, "LOT-B", "LOT-X", None, None],
})
print("ANTES (lote_material com lacunas):")
print(df.to_string(index=False))

# Preenchimento por grupo: ffill dentro de cada maquina, ordenado por sequencia.
# Equivalente SQL: LAST_VALUE(lote_material IGNORE NULLS)
#                  OVER (PARTITION BY maquina ORDER BY sequencia)
df = df.sort_values(["maquina", "sequencia"])
df["lote_material"] = df.groupby("maquina")["lote_material"].transform(
    lambda s: s.ffill()
)
print("\nDEPOIS (ffill dentro de cada particao 'maquina'):")
print(df.to_string(index=False))
print()
print("Nota: transform() devolveu uma Series com o MESMO indice e a mesma")
print("forma do df original -- por isso pode ser atribuida de volta a uma")
print("coluna diretamente, sem merge. groupby().apply() tambem funcionaria")
print("aqui, mas transform() e mais rapido quando o resultado tem a mesma")
print("forma da entrada, porque evita reconstruir o indice.")</code></pre></div></div></div><h3 id="quando-um-loop-e-necessario-em-vez-de-vetorizacao">Quando um loop é necessário em vez de vetorização</h3>
<p>Nem toda a lógica é vetorizável. Um <strong>sequenciamento stateful</strong> — onde o valor da linha atual depende de uma decisão tomada nas linhas anteriores, e não apenas dos valores da própria linha — é o caso clássico em que um loop explícito, linha a linha, é mais simples e mais correto do que forçar uma solução vetorizada artificial. Um exemplo real: atribuir um novo número de sequência de lote de material sempre que a referência do lote muda dentro da mesma máquina, mas manter o número anterior enquanto a referência se mantém.</p>
<h3 id="exemplo-resolvido-sequenciamento-stateful-loop-vs-alternativa-vetorizada">Exemplo resolvido: sequenciamento stateful — loop vs. alternativa vetorizada</h3><div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct09b31b2c-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct09b31b2c-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import pandas as pd

df = pd.DataFrame({
    "maquina": ["M1"]*6,
    "hora":    [1, 2, 3, 4, 5, 6],
    "lote_material": ["LOT-A", "LOT-A", "LOT-B", "LOT-B", "LOT-B", "LOT-C"],
})

def sequenciar_lote(grupo):
    """Incrementa o numero de sequencia so quando o lote muda -- depende
    do valor da linha ANTERIOR, por isso nao e vetorizavel diretamente."""
    seq = []
    lote_atual = None
    contador = 0
    for lote in grupo["lote_material"]:
        if lote != lote_atual:
            contador += 1
            lote_atual = lote
        seq.append(contador)
    grupo = grupo.copy()
    grupo["seq_lote"] = seq
    return grupo

resultado = df.groupby("maquina", group_keys=False).apply(sequenciar_lote)
print(resultado.to_string(index=False))
print()
print("Alternativa vetorizada equivalente, para quem preferir evitar o loop")
print("Python explicito -- funciona porque 'mudanca de valor' TEM uma forma")
print("vetorizavel via comparacao com shift():")
df["seq_lote_vetorizado"] = (
    df["lote_material"].ne(df["lote_material"].shift()).cumsum()
)
print(df.to_string(index=False))
print()
print("As duas colunas de sequencia sao identicas. O loop explicito e mais")
print("facil de ler quando a regra de transicao e mais complexa do que uma")
print("simples mudanca de valor (ex.: reiniciar a contagem a cada turno,")
print("ou ignorar mudancas com menos de N minutos de intervalo) -- e nesses")
print("casos, tentar forcar vetorizacao produz codigo mais dificil de")
print("verificar do que o loop, mesmo sendo mais lento em teoria.")</code></pre></div></div></div><h3 id="casamento-de-evento-a-uma-janela-temporal-com-regra-de-desempate">Casamento de evento a uma janela temporal com regra de desempate</h3>
<p>Um problema mais difícil ainda: associar um evento pontual (uma paragem de máquina, com um instante único) à ordem de produção que estava ativa <strong>naquela máquina, naquele instante</strong> — sabendo que ordens de produção têm início e fim, podem sobrepor-se por erro de registo, e é preciso uma regra de desempate quando isso acontece. Isto é uma <strong>busca de intervalo</strong> (interval matching), não um <code>merge</code> direto: não há uma chave comum entre as duas tabelas, há uma condição — "o instante da paragem cai dentro do intervalo da ordem, na mesma máquina".</p>
<h3 id="exemplo-resolvido-casamento-de-paragem-a-ordem-de-producao-com-desempate">Exemplo resolvido: casamento de paragem a ordem de produção, com desempate</h3><div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct4696da65-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct4696da65-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import pandas as pd

paragens = pd.DataFrame({
    "maquina": ["M1", "M1"],
    "instante_paragem": pd.to_datetime(["2026-08-01 10:15", "2026-08-01 14:40"]),
})

ordens = pd.DataFrame({
    "maquina": ["M1", "M1", "M1"],
    "ordem_id": ["OP-100", "OP-101", "OP-102"],
    "inicio": pd.to_datetime(["2026-08-01 08:00", "2026-08-01 10:00", "2026-08-01 14:00"]),
    "fim":    pd.to_datetime(["2026-08-01 10:30", "2026-08-01 14:30", "2026-08-01 18:00"]),
})
# Repare: OP-100 e OP-101 sobrepoem-se entre 10:00 e 10:30 -- um registo
# duplicado tipico de um MES real. A paragem das 10:15 cai nas duas.

def encontrar_ordem(paragem, ordens_maquina):
    candidatas = ordens_maquina[
        (ordens_maquina["inicio"] &lt;= paragem) &amp; (paragem &lt;= ordens_maquina["fim"])
    ]
    if candidatas.empty:
        return None
    # Regra de desempate: entre candidatas sobrepostas, fica com a que
    # comecou mais tarde (a mais "recente" em vigor naquele instante).
    return candidatas.sort_values("inicio", ascending=False).iloc[0]["ordem_id"]

resultados = []
for _, p in paragens.iterrows():
    ordens_maq = ordens[ordens["maquina"] == p["maquina"]]
    ordem = encontrar_ordem(p["instante_paragem"], ordens_maq)
    resultados.append(ordem)

paragens["ordem_associada"] = resultados
print(paragens.to_string(index=False))
print()
print("A paragem das 10:15 caiu em OP-100 (08:00-10:30) E OP-101")
print("(10:00-14:30) -- duas ordens validas ao mesmo tempo. A regra de")
print("desempate escolheu OP-101 (a que comecou mais tarde). Sem essa")
print("regra explicita, o resultado dependeria da ordem arbitraria das")
print("linhas na tabela -- um bug silencioso, dificil de detetar em dados")
print("reais onde sobreposicoes sao raras mas nao inexistentes.")</code></pre></div></div></div>
<p><strong>Leitura de engenharia.</strong> Este padrão não tem uma função pronta no pandas — é lógica de negócio explícita, e a regra de desempate ("fica com a mais recente") é uma decisão que precisa de ser documentada, não apenas codificada. Uma regra diferente ("fica com a de menor duração", ou "levanta um alerta de dados em vez de escolher") produziria um resultado igualmente válido para outro contexto de negócio.</p>
<h3 id="data-quality-scorecard-como-pratica-formal">Data Quality Scorecard como prática formal</h3>
<p>Cada uma das transformações acima — preencher, sequenciar, casar — pode falhar silenciosamente: uma partição sem nenhum valor não-nulo para o <code>ffill</code> herdar, uma paragem sem nenhuma ordem candidata, um lote cuja sequência nunca reinicia. Um <strong>Data Quality Scorecard</strong> é a prática de medir, antes e depois de cada etapa do pipeline, indicadores como percentagem de valores em falta, percentagem de eventos sem correspondência, e número de linhas descartadas — e registar essa comparação como parte do próprio pipeline, não como uma verificação manual ad-hoc. No mínimo, um scorecard simples soma, por coluna, a contagem de nulos antes e depois de cada transformação e reporta a diferença — o suficiente para detetar se uma mudança no código de limpeza introduziu uma regressão silenciosa.</p>
<h3 id="exercicio-proposto">Exercício proposto</h3>
<p>No exemplo de casamento de paragem a ordem de produção, mude a regra de desempate para "a ordem com a janela mais curta" (a mais específica) em vez de "a que começou mais tarde", e verifique se o resultado muda para a paragem das 10:15. Depois, adicione uma terceira paragem às 20:00 (fora de qualquer janela de ordem no exemplo) e confirme que a função devolve <code>None</code> em vez de escolher uma ordem incorreta — e escreva uma frase sobre por que devolver <code>None</code> explicitamente é preferível a deixar a função escolher a ordem mais próxima por acidente.</p>
<h3 id="erros-comuns">Erros comuns</h3><ol>
<li><strong>Usar <code>apply()</code> quando <code>transform()</code> resolve.</strong> Quando o resultado tem a mesma forma da entrada, <code>transform()</code> é mais direto e evita reconstruções de índice desnecessárias.</li>
<li><strong>Forçar vetorização em lógica stateful complexa.</strong> Um loop explícito bem comentado é mais fácil de verificar do que uma cadeia de <code>shift()</code>/<code>cumsum()</code> difícil de ler quando a regra de transição tem mais de uma condição.</li>
<li><strong>Fazer casamento de intervalo com um <code>merge</code> simples por chave.</strong> Não existe uma chave comum numa busca de intervalo — é preciso uma condição de sobreposição, e essa condição raramente é 1:1 em dados reais.</li>
<li><strong>Não definir a regra de desempate antes de escrever o código.</strong> Quando duas candidatas são igualmente válidas, deixar o código "escolher a primeira que aparecer" produz um resultado que depende da ordem interna dos dados — não reprodutível de forma confiável.</li>
<li><strong>Medir qualidade de dado só uma vez, no fim do pipeline.</strong> Sem um scorecard por etapa, uma regressão introduzida a meio do pipeline só é descoberta quando o resultado final já está errado — e nessa altura é mais difícil isolar em que etapa o problema começou.</li>
</ol><p><em>Fonte principal: documentação oficial do pandas — “Windowing operations” (pandas.pydata.org/docs/user_guide/window.html) e “Group by: split-apply-combine”. Cross-check: Real Python, “pandas GroupBy: Your Guide to Grouping Data in Python”; engineeringfordatascience.com, “SQL-like Window Functions in Pandas”. Verificado via pesquisa na web em 01/09/2026.</em></p>
