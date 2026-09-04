<a id="capitulo-178"></a>
## Capítulo 178: Arquitetura Medalhão: Bronze, Silver, Gold

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>Os ficheiros brutos chegam sujos — valores em branco disfarçados de texto ("-", "n/a"), categorias com maiúsculas inconsistentes, quantidades negativas por erro de sinal. As tabelas fato e dimensão do <a href="#/aula/cap-177">capítulo anterior</a> pressupõem dados já limpos. Onde é que a limpeza acontece, e como se organiza um pipeline para que cada etapa de refinamento seja auditável em separado?</em></p>
<p>A resposta da engenharia de dados moderna é organizar o pipeline em <strong>camadas de qualidade crescente</strong> — não um único salto de "ficheiro bruto" para "tabela pronta para análise", mas estágios intermédios, cada um com uma responsabilidade clara. É a isto que se chama arquitetura medalhão.</p>
<h3 id="do-esquema-ao-pipeline-por-que-o-star-schema-nao-basta-sozinho">Do esquema ao pipeline: por que o star schema não basta sozinho</h3>
<p>A modelagem dimensional do capítulo anterior responde "como organizar os dados para análise". Não responde "como é que os dados chegam limpos até lá". Entre o ficheiro de origem (uma exportação do MES, um CSV de um fornecedor, uma tabela do ERP) e o star schema final há normalmente várias etapas de transformação — remover duplicados, corrigir tipos, padronizar categorias, juntar fontes — e cada uma dessas etapas pode falhar ou introduzir um erro subtil.</p>
<p>A <strong>arquitetura medalhão</strong> (termo popularizado pela Databricks por volta de 2019–2020, no contexto do data lakehouse) organiza este percurso em três camadas nomeadas por metais preciosos, em ordem crescente de refinamento: <strong>bronze</strong>, <strong>silver</strong> e <strong>gold</strong>.</p>
<h3 id="as-tres-camadas-bronze-silver-e-gold">As três camadas: bronze, silver e gold</h3>
<ul>
<li><strong>Bronze</strong> — o ponto de entrada. Dados brutos, no formato mais próximo possível da origem, sem transformação (ou com o mínimo indispensável, como adicionar uma data de ingestão). O objetivo é preservar a origem: se algo correr mal mais tarde, é sempre possível reprocessar a partir do bronze sem voltar a pedir os dados ao sistema de origem.</li>
<li><strong>Silver</strong> — dados limpos e validados. É aqui que acontece a remoção de valores em branco disfarçados, a padronização de categorias, a correção de quantidades com sinal errado, a deduplicação — as mesmas operações de limpeza cobertas na PARTE de engenharia de dados. O silver ainda está próximo da granularidade original (uma linha por evento), mas já é confiável.</li>
<li><strong>Gold</strong> — dados agregados e organizados para consumo — tipicamente já no formato de star schema do capítulo anterior, prontos para um dashboard, um modelo de machine learning, ou uma consulta analítica direta.</li>
</ul>
<p>A progressão bronze → silver → gold não é apenas uma convenção de nomes de pastas ou schemas — é um contrato: cada camada só pode depender da anterior, nunca ao contrário, o que torna o pipeline mais fácil de depurar (um problema no gold só pode vir do silver ou da lógica de agregação, nunca "voltar" do gold para corromper o silver).</p>
<h3 id="exemplo-resolvido-um-pipeline-bronze-silver-gold-minimo">Exemplo resolvido: um pipeline bronze → silver → gold mínimo</h3><div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct425ff1ad-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct425ff1ad-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import sqlite3
import pandas as pd

con = sqlite3.connect(":memory:")

# ---------- BRONZE: dados brutos, tal como chegam, com sujidade tipica ----------
bronze = pd.DataFrame({
    "id_evento": [1, 2, 3, 4, 5],
    "maquina":   [" M1", "m2", "M1 ", "M3", "m2"],   # espacos e caixa inconsistentes
    "qtd":       [120, -45, 98, "n/a", 60],           # sinal errado + valor disfarcado
    "data":      ["2026-08-01"] * 5,
})
bronze.to_sql("bronze_producao", con, index=False, if_exists="replace")
print("BRONZE (bruto, como chegou):")
print(bronze.to_string(index=False))

# ---------- SILVER: limpo e validado, ainda uma linha por evento ----------
silver = bronze.copy()
silver["maquina"] = silver["maquina"].str.strip().str.upper()
silver["qtd"] = pd.to_numeric(silver["qtd"], errors="coerce")   # "n/a" -&gt; NaN
n_antes = len(silver)
silver = silver.dropna(subset=["qtd"])
print(f"\nSILVER: {n_antes - len(silver)} linha(s) descartada(s) por qtd invalida")
# Nota: sinal negativo aqui seria investigado caso a caso (estorno? erro?) --
# no exemplo, assume-se erro de digitacao e usa-se o valor absoluto.
silver["qtd"] = silver["qtd"].abs()
silver.to_sql("silver_producao", con, index=False, if_exists="replace")
print(silver.to_string(index=False))

# ---------- GOLD: agregado, pronto para consumo direto ----------
gold = pd.read_sql_query("""
    SELECT  maquina, data, SUM(qtd) AS qtd_total, COUNT(*) AS n_eventos
    FROM    silver_producao
    GROUP BY maquina, data
    ORDER BY maquina
""", con)
print("\nGOLD (agregado, pronto para dashboard):")
print(gold.to_string(index=False))
con.close()</code></pre></div></div></div>
<p><strong>Leitura de engenharia.</strong> Repare que cada camada tem uma única responsabilidade: o bronze não decide nada, só preserva; o silver decide o que é um valor válido (mas mantém a granularidade de evento); o gold decide como agregar para uma pergunta de negócio específica. Se amanhã a regra de negócio para "quantidade válida" mudar, só o silver precisa de ser reprocessado — o bronze não muda, e o gold é recalculado a partir do novo silver.</p>
<h3 id="views-passthrough-silver-vs-views-agregadas-gold">Views passthrough (silver) vs. views agregadas (gold)</h3>
<p>Numa implementação em SQL Server (em vez de pandas), a camada silver é frequentemente construída como <strong>views passthrough</strong> — views que selecionam e limpam colunas da bronze 1:1, sem agregação, mantendo a mesma granularidade. A camada gold usa <strong>views agregadas</strong>, com <code>GROUP BY</code> e funções de agregação, construídas sobre as views silver. Esta separação entre "view que limpa" e "view que agrega" espelha exatamente a separação de responsabilidades do exemplo acima, só que expressa em SQL em vez de pandas.</p>
<h3 id="views-geradas-por-metadado-o-caso-da-janela-movel-de-52-semanas">Views geradas por metadado: o caso da janela móvel de 52 semanas</h3>
<p>Um padrão mais avançado, comum em camadas gold que precisam de indicadores sobre janelas de tempo deslizantes (por exemplo, "as últimas 52 semanas" recalculado automaticamente toda a semana), é <strong>gerar as views a partir de metadado</strong> em vez de escrever cada view manualmente. Um script lê uma tabela de configuração (que indicador, que janela, que agregação) e produz o SQL de definição de cada view programaticamente — reduzindo dezenas de views quase idênticas a um único template parametrizado. É uma técnica que só compensa quando o número de views geradas justifica a complexidade extra de as gerar em vez de escrever à mão — mas, a partir de uma dúzia de variações do mesmo padrão, o ganho de manutenção é considerável.</p>
<h3 id="exercicio-proposto">Exercício proposto</h3>
<p>No exemplo resolvido acima, adicione uma quarta camada de decisão ao silver: descartar (em vez de manter) qualquer linha em que a máquina não pertença a uma lista de máquinas válidas conhecidas (por exemplo, <code>{"M1", "M2", "M3"}</code>). Recalcule o gold e verifique se o resultado muda. Depois, escreva uma frase explicando por que esta regra de validação pertence ao silver e não ao bronze nem ao gold — em termos da responsabilidade de cada camada descrita neste capítulo.</p>
<h3 id="erros-comuns">Erros comuns</h3><ol>
<li><strong>Misturar limpeza e agregação na mesma camada.</strong> Torna impossível depurar isoladamente "os dados estão errados" de "a agregação está errada".</li>
<li><strong>Sobrescrever o bronze com dados já transformados.</strong> Perde-se a capacidade de reprocessar do zero se uma regra de limpeza do silver mudar ou se for descoberto um erro na lógica de agregação do gold.</li>
<li><strong>Tratar a arquitetura medalhão como sinónimo de modelagem dimensional.</strong> São complementares, não a mesma coisa — medalhão organiza <em>estágios de refinamento do pipeline</em>; modelagem dimensional (capítulo anterior) organiza o <em>esquema de tabelas</em> da camada gold.</li>
<li><strong>Criar dezenas de views manuais quase idênticas</strong> em vez de considerar geração por metadado quando o padrão se repete — o custo de manutenção cresce linearmente com o número de views copiadas à mão.</li>
<li><strong>Aplicar regras de negócio ambíguas (ex.: quantidade negativa) automaticamente sem documentar a decisão.</strong> Um valor negativo pode ser um erro de sinal ou um estorno legítimo — a escolha do silver deve ficar registada, não escondida dentro de um <code>.abs()</code> silencioso.</li>
</ol><p><em>Fonte principal: Databricks, “What is the medallion lakehouse architecture?” (docs.databricks.com/aws/en/lakehouse/medallion). Cross-check: Microsoft Learn, “What is the medallion lakehouse architecture?” (Azure Databricks); Ralph Kimball &amp; Margy Ross, <em>The Data Warehouse Toolkit</em> (para a distinção entre estágio de pipeline e esquema de tabelas, ver <a href="#/aula/cap-177">Capítulo 177</a>). Verificado via pesquisa na web em 01/09/2026.</em></p>
