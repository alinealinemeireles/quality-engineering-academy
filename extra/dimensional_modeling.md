<a id="capitulo-177"></a>
## Capítulo 177: Modelagem Dimensional: Fato, Dimensão e Star Schema

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>Um analista pergunta: "qual foi a taxa de rejeitados por máquina, por turno, na última semana, só para o fornecedor X?" A resposta certa existe algures nas suas tabelas — mas se o esquema fosse desenhado só para o sistema transacional que gerou os dados, essa pergunta exigiria oito JOINs e ninguém a conseguiria responder em tempo real.</em></p>
<p>A modelagem dimensional resolve exatamente este problema: organizar os dados para que perguntas analíticas — "quanto, por quem, quando, onde" — sejam respondidas com uma ou duas junções simples, não com uma arqueologia de esquema transacional. Um projeto real de analytics de manufatura que segue este padrão chega a 22 tabelas fato e 15 dimensões — não por acaso, mas porque é a forma como o método de Ralph Kimball estrutura qualquer domínio de negócio suficientemente rico.</p>
<h3 id="o-problema-que-a-modelagem-dimensional-resolve">O problema que a modelagem dimensional resolve</h3>
<p>Um sistema transacional (o ERP, o MES, a base de dados que regista cada evento à medida que acontece) é desenhado para <strong>escrever</strong> rápido e sem duplicação — é normalizado, muitas vezes em dezenas de tabelas interligadas por chaves estrangeiras. Isso é ótimo para integridade operacional e péssimo para análise: responder "qual foi o total de peças rejeitadas por fornecedor no último trimestre" exige atravessar essa teia de tabelas inteira.</p>
<p>A modelagem dimensional, formalizada por Ralph Kimball e Margy Ross em <em>The Data Warehouse Toolkit</em> (Wiley, edição original de 1996), propõe reorganizar os mesmos dados em torno de duas categorias de tabela: <strong>fato</strong> e <strong>dimensão</strong>. O resultado — quando desenhado corretamente — é um <strong>star schema</strong>: uma tabela fato central ligada a várias tabelas dimensão à sua volta, como os raios de uma estrela.</p>
<h3 id="tabelas-fato-o-que-aconteceu-quantificado">Tabelas fato: o que aconteceu, quantificado</h3>
<p>Uma <strong>tabela fato</strong> regista um <em>evento de processo mensurável</em> — uma peça produzida, uma paragem de máquina, uma não conformidade. Cada linha é uma ocorrência desse evento, e as colunas dividem-se em duas famílias:</p>
<ul>
<li><strong>Chaves estrangeiras</strong> para cada dimensão relevante (que máquina, que turno, que dia, que produto) — o "contexto" do evento.</li>
<li><strong>Métricas numéricas aditivas</strong> — quantidade produzida, tempo de paragem em minutos, custo da não conformidade — números que fazem sentido somar ao longo de milhares de linhas.</li>
</ul>
<p>Uma tabela fato de produção, por exemplo, tem uma linha por peça produzida (ou por lote, consoante a granularidade escolhida — a decisão mais importante no desenho de qualquer fato), com chaves para máquina, turno, data e produto, e métricas como quantidade e tempo de ciclo.</p>
<h3 id="tabelas-dimensao-o-contexto-que-da-significado-ao-numero">Tabelas dimensão: o contexto que dá significado ao número</h3>
<p>Uma <strong>tabela dimensão</strong> descreve o "quem, o quê, onde, quando" à volta do evento — é tipicamente larga em colunas (muitos atributos descritivos) e curta em linhas (algumas dezenas ou centenas de máquinas, produtos, fornecedores) comparada com a tabela fato, que cresce uma linha por evento. A dimensão <code>dim_maquina</code> não guarda só o identificador da máquina: guarda o nome, a célula de produção, o fabricante, a data de instalação — tudo o que um analista possa querer usar para agrupar ou filtrar, sem ter de voltar ao sistema de origem.</p>
<p>É esta separação — poucas dimensões largas, muitos factos estreitos e numerosos — que torna a pergunta "taxa de rejeitados por máquina, por turno, por fornecedor" numa junção direta entre um fato e três dimensões, em vez de uma travessia de esquema transacional inteiro.</p>
<h3 id="chaves-substitutas-por-que-nao-usar-a-chave-do-sistema-de-origem">Chaves substitutas: por que não usar a chave do sistema de origem</h3>
<p>Uma prática central de Kimball é que cada dimensão tem uma <strong>chave substituta</strong> (<em>surrogate key</em>) — um identificador inteiro sequencial gerado pelo próprio data warehouse, distinto do identificador de negócio ou do código do sistema de origem (número de série da máquina, código do fornecedor no ERP). Isto desacopla o modelo analítico das mudanças no sistema operacional: se o ERP for substituído amanhã, ou se um fornecedor mudar de código, a chave substituta na dimensão não muda — só é preciso mapear o novo código de origem para a mesma chave substituta já existente.</p>
<h3 id="exemplo-resolvido-um-star-schema-minimo-de-producao">Exemplo resolvido: um star schema mínimo de produção</h3><div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct31906ff4-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct31906ff4-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import sqlite3
import pandas as pd
import numpy as np

rng = np.random.default_rng(2026)
con = sqlite3.connect(":memory:")

# ---------- Duas dimensoes (largas, poucas linhas) ----------
con.executescript("""
CREATE TABLE dim_maquina (
    sk_maquina INTEGER PRIMARY KEY,   -- chave substituta, gerada aqui
    codigo_origem TEXT,               -- identificador no sistema transacional (MES)
    nome TEXT, celula TEXT, fabricante TEXT
);
CREATE TABLE dim_turno (
    sk_turno INTEGER PRIMARY KEY,
    codigo_origem TEXT, nome TEXT, hora_inicio TEXT, hora_fim TEXT
);
""")

maquinas = [(1, "MES-M001", "Injetora 1", "Celula A", "Engel"),
            (2, "MES-M002", "Injetora 2", "Celula A", "Engel"),
            (3, "MES-M003", "Injetora 3", "Celula B", "Arburg")]
con.executemany("INSERT INTO dim_maquina VALUES (?,?,?,?,?)", maquinas)

turnos = [(1, "T1", "Manha", "06:00", "14:00"),
          (2, "T2", "Tarde", "14:00", "22:00"),
          (3, "T3", "Noite", "22:00", "06:00")]
con.executemany("INSERT INTO dim_turno VALUES (?,?,?,?,?)", turnos)

# ---------- Fato: uma linha por lote produzido ----------
con.execute("""
CREATE TABLE fato_producao (
    sk_maquina INTEGER, sk_turno INTEGER, data TEXT,
    qtd_produzida INTEGER, qtd_rejeitada INTEGER, tempo_paragem_min REAL
)
""")

linhas = []
for _ in range(300):
    linhas.append((
        int(rng.integers(1, 4)), int(rng.integers(1, 4)),
        f"2026-08-{rng.integers(1,29):02d}",
        int(rng.integers(400, 600)),
        int(rng.integers(0, 20)),
        float(round(rng.exponential(8), 1)),
    ))
con.executemany("INSERT INTO fato_producao VALUES (?,?,?,?,?,?)", linhas)
con.commit()

# ---------- A pergunta original: taxa de rejeitados por maquina e turno ----------
q = """
SELECT  dm.nome                                     AS maquina,
        dt.nome                                     AS turno,
        SUM(f.qtd_produzida)                        AS produzido,
        SUM(f.qtd_rejeitada)                        AS rejeitado,
        ROUND(100.0 * SUM(f.qtd_rejeitada)
                    / SUM(f.qtd_produzida), 2)       AS pct_rejeitado
FROM        fato_producao f
JOIN        dim_maquina   dm ON dm.sk_maquina = f.sk_maquina
JOIN        dim_turno     dt ON dt.sk_turno   = f.sk_turno
GROUP BY    dm.nome, dt.nome
ORDER BY    pct_rejeitado DESC
"""
resultado = pd.read_sql_query(q, con)
print(resultado.to_string(index=False))
print()
print("Duas junções (fato -&gt; dim_maquina, fato -&gt; dim_turno) bastam para")
print("responder a pergunta completa. Note que 'MES-M001' (o codigo do")
print("sistema de origem) nunca aparece na pergunta -- so a chave")
print("substituta e usada para ligar as tabelas.")
con.close()</code></pre></div></div></div>
<p>Este é exatamente o padrão que um data warehouse de manufatura real replica dezenas de vezes: uma tabela fato por processo de negócio mensurável (produção, paragens, não conformidades, expedições), rodeada pelas dimensões partilhadas — máquina, turno, data, produto.</p>
<h3 id="dimensoes-conformadas-a-mesma-dimensao-reutilizada-em-varias-tabelas-fato">Dimensões conformadas: a mesma dimensão, reutilizada em várias tabelas fato</h3>
<p>Quando <code>dim_maquina</code> e <code>dim_turno</code> são usadas não só por <code>fato_producao</code>, mas também por <code>fato_paragem</code> e <code>fato_nao_conformidade</code>, chamam-se <strong>dimensões conformadas</strong> — a mesma definição de "máquina", com a mesma chave substituta, partilhada por todos os factos que precisam desse contexto. É esta reutilização que permite comparar produção e paragens pela mesma máquina sem ambiguidade, e é uma das razões pelas quais um modelo dimensional bem desenhado tende a ter poucas dimensões (dezenas) e muitas tabelas fato (uma por processo de negócio).</p>
<p>No <a href="#/aula/cap-178">próximo capítulo</a>, este mesmo conjunto de fatos e dimensões volta a aparecer — não como esquema de tabelas, mas como a camada final ("gold") de um pipeline organizado em estágios de qualidade crescente: a arquitetura medalhão.</p>
<h3 id="exercicio-proposto">Exercício proposto</h3>
<p>Estenda o exemplo resolvido acima com uma terceira dimensão, <code>dim_produto</code> (com pelo menos <code>sk_produto</code>, <code>codigo_origem</code>, <code>referencia</code>, <code>familia</code>), adicione a chave <code>sk_produto</code> à <code>fato_producao</code>, e refaça a consulta de taxa de rejeitados agora estratificada também por família de produto. Depois, escreva uma frase explicando por que esta pergunta com três dimensões continua a exigir apenas junções simples — nunca sub-queries aninhadas — mesmo à medida que mais contexto é adicionado.</p>
<h3 id="erros-comuns">Erros comuns</h3><ol>
<li><strong>Usar o identificador do sistema de origem como chave da dimensão.</strong> Perde-se o desacoplamento que a chave substituta oferece — qualquer mudança no sistema transacional propaga-se ao modelo analítico.</li>
<li><strong>Modelar a tabela fato ao nível de granularidade errado.</strong> Decidir a granularidade (uma linha por peça? por lote? por turno?) é a primeira decisão de desenho — mudá-la depois obriga a reconstruir o fato inteiro.</li>
<li><strong>Duplicar a definição de uma dimensão em vez de conformá-la.</strong> Ter duas versões ligeiramente diferentes de "máquina" (uma em cada tabela fato) impede comparações diretas entre processos.</li>
<li><strong>Guardar métricas não aditivas como se fossem aditivas.</strong> Uma percentagem ou uma média não deve ser somada ao longo de linhas de fato — some os componentes (numerador e denominador) e calcule a razão depois, na consulta.</li>
<li><strong>Confundir modelagem dimensional com normalização.</strong> São objetivos opostos: normalização elimina redundância para escrita eficiente; modelagem dimensional aceita alguma redundância controlada (nas dimensões) para leitura analítica simples.</li>
</ol><p><em>Fonte principal: Ralph Kimball &amp; Margy Ross, <em>The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling</em>, 3ª edição (Wiley) — capítulos sobre fato, dimensão e star schema. Cross-check: Kimball Group, “Star Schema OLAP Cube” (kimballgroup.com); dbt Labs, “Building a Kimball dimensional model with dbt”. Verificado via pesquisa na web em 01/09/2026.</em></p>
