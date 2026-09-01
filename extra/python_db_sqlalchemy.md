<a id="capitulo-176"></a>
## Capítulo 176: Conectando Python a Bancos de Dados: SQLAlchemy, pyodbc e Carga em Massa

<h3 id="a-pergunta-de-engenharia">A pergunta de engenharia</h3>
<p><em>O Capítulo 107 ensinou a escrever a query certa. Mas quando o pipeline tem de correr sozinho — todas as noites, sem ninguém a copiar e colar SQL num cliente — quem abre a ligação, autentica, cria a base de dados se ela ainda não existir, e carrega 50 mil linhas sem demorar vinte minutos?</em></p>
<p>É essa a fronteira entre "sei SQL" e "sei construir um pipeline de dados". Este capítulo cobre a camada que liga o Python ao SQL Server: motor de ligação, autenticação, carga em massa e execução de scripts administrativos — exatamente o que uma biblioteca de acesso a dados (o <code>db_lib</code> de um projeto real de analytics de manufatura) precisa de resolver antes de qualquer análise começar.</p>
<h3 id="da-consulta-interativa-ao-pipeline-que-corre-sozinho">Da consulta interativa ao pipeline que corre sozinho</h3>
<p>Um cliente SQL interativo (Azure Data Studio, SSMS, o próprio <code>%%sql</code> de um notebook) pede-lhe as credenciais uma vez, mantém a ligação aberta enquanto trabalha, e deixa-o corrigir um erro de sintaxe na hora. Um pipeline de produção não tem ninguém a olhar para o ecrã: precisa de abrir e fechar a ligação sozinho, de saber o que fazer se a base de dados de destino ainda não existir, e de correr de forma <strong>idempotente</strong> — executável do zero, tantas vezes quantas for preciso, sem depender de estado deixado pela execução anterior.</p>
<p>Em Python, a camada que resolve "como ligar" chama-se tipicamente <strong>SQLAlchemy</strong> (o motor de abstração de ligação e execução), apoiada por um <strong>driver ODBC</strong> — no caso do SQL Server, o <code>pyodbc</code>. SQLAlchemy não substitui o SQL que já sabe escrever: gere a ligação, o pool de conexões e a tradução entre a string de ligação e o protocolo do driver.</p>
<h3 id="sqlalchemy-engine-driver-odbc-e-autenticacao-windows">SQLAlchemy: engine, driver ODBC e autenticação Windows</h3>
<p>O objeto central do SQLAlchemy é o <strong>engine</strong> — criado uma vez, reutilizado por toda a aplicação. Para SQL Server com autenticação Windows integrada (comum em ambientes corporativos, sem palavra-passe em texto no código), a string de ligação usa o driver ODBC e o parâmetro <code>Trusted_Connection</code>:</p>
<div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct6461ade6-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct6461ade6-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">from sqlalchemy import create_engine, event

def get_engine(server, database, driver="ODBC Driver 17 for SQL Server"):
    """Cria um engine SQLAlchemy para SQL Server com autenticacao Windows."""
    conn_str = (
        f"mssql+pyodbc://@{server}/{database}"
        f"?driver={driver.replace(' ', '+')}"
        f"&amp;trusted_connection=yes"
    )
    engine = create_engine(conn_str, fast_executemany=True)
    return engine

# Uso tipico: um engine por processo, reutilizado em todas as operacoes.
# engine = get_engine("localhost\\SQLEXPRESS", "manufatura_dw")
print("Connection string montada -- nao ha password em texto no codigo:")
print("mssql+pyodbc://@localhost/manufatura_dw?driver=ODBC+Driver+17+for+SQL+Server&amp;trusted_connection=yes")</code></pre></div></div></div>
<p>Repare no parâmetro <code>fast_executemany=True</code> passado diretamente ao <code>create_engine</code> — é a forma mais simples de ativar a otimização de carga em massa do pyodbc; a alternativa mais explícita é registar um listener no evento <code>before_cursor_execute</code> que define <code>cursor.fast_executemany = True</code> antes de cada execução em lote. As duas abordagens fazem a mesma coisa; a primeira é suficiente na maioria dos casos com versões recentes do SQLAlchemy.</p>
<h3 id="por-que-pandas-to-sql-nao-escala-para-dezenas-de-milhares-de-linhas">Por que pandas.to_sql() não escala para dezenas de milhares de linhas</h3>
<p><code>DataFrame.to_sql()</code> é conveniente para explorar dados — mas, no modo por omissão, insere linha a linha: cada <code>INSERT</code> é uma ida e volta de rede separada ao servidor. Para 40 linhas isso não se nota; para 40&nbsp;000, a latência de rede multiplicada por 40&nbsp;000 viagens domina totalmente o tempo de execução, ao ponto de uma carga que devia demorar segundos demorar dezenas de minutos.</p>
<p>A técnica <code>fast_executemany</code> do pyodbc resolve isto ao <strong>agrupar muitas linhas num único pacote</strong> enviado ao servidor, em vez de uma viagem de rede por linha. O ganho de desempenho relatado por praticantes em benchmarks públicos é tipicamente de uma ou duas ordens de grandeza face ao <code>executemany</code> ingénuo do pyodbc sem essa opção.</p>
<h3 id="exemplo-executavel-por-que-agrupar-linhas-importa">Exemplo executável: por que agrupar linhas importa</h3><div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct1c68460c-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct1c68460c-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import sqlite3
import time
import numpy as np

rng = np.random.default_rng(2026)
n = 20_000

# Dataset sintetico: 20 mil "medicoes" a carregar, como um lote diario de producao
dados = [(int(i), f"M{rng.integers(1,4)}", float(rng.normal(10.0, 0.03)))
         for i in range(n)]

def carga_linha_a_linha(dados):
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE medicao (id INTEGER, maquina TEXT, valor REAL)")
    t0 = time.perf_counter()
    for linha in dados:
        con.execute("INSERT INTO medicao VALUES (?,?,?)", linha)
    con.commit()
    dt = time.perf_counter() - t0
    con.close()
    return dt

def carga_em_lote(dados, tamanho_lote=2000):
    """Analogo local ao fast_executemany: agrupa varias linhas por
    'ida e volta' em vez de uma insercao por linha."""
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE medicao (id INTEGER, maquina TEXT, valor REAL)")
    t0 = time.perf_counter()
    for i in range(0, len(dados), tamanho_lote):
        lote = dados[i:i + tamanho_lote]
        con.executemany("INSERT INTO medicao VALUES (?,?,?)", lote)
    con.commit()
    dt = time.perf_counter() - t0
    con.close()
    return dt

dt_linha = carga_linha_a_linha(dados)
dt_lote = carga_em_lote(dados)

print(f"Insercao linha a linha : {dt_linha:.3f}s")
print(f"Insercao em lote       : {dt_lote:.3f}s")
print(f"Fator de melhoria      : {dt_linha / dt_lote:.1f}x")
print()
print("Nota: o SQLite em memoria ja e rapido, entao a diferenca aqui vem")
print("apenas do numero de chamadas Python/driver, sem rede. Contra um SQL")
print("Server real numa rede corporativa, a mesma logica de agrupamento")
print("(via cursor.fast_executemany=True no pyodbc) tipicamente multiplica")
print("o ganho, porque elimina uma viagem de rede por linha, nao so uma")
print("chamada de driver por linha.")</code></pre></div></div></div>
<p><strong>Leitura de engenharia.</strong> O padrão <code>load_dataframe</code> de uma biblioteca de carga real normalmente combina três decisões: (1) usar <code>fast_executemany</code> para o ganho de desempenho acima; (2) dimensionar o buffer de parâmetros do cursor via <code>cursor.setinputsizes()</code> quando os tipos de coluna variam muito, para evitar que o pyodbc infira tipos errados a partir das primeiras linhas; e (3) fazer <strong>truncate-and-reload</strong> (apagar e recarregar a tabela de destino inteira) em vez de tentar um <em>upsert</em> linha a linha — mais simples de tornar idempotente, e mais rápido quando a tabela de destino cabe confortavelmente numa recarga completa.</p>
<h3 id="criar-a-base-de-dados-condicionalmente-por-que-fora-de-uma-transacao">Criar a base de dados condicionalmente: por que fora de uma transação</h3>
<p>Um pipeline idempotente que corre do zero precisa de responder à pergunta "a base de dados já existe?" antes de tentar usá-la. O comando <code>CREATE DATABASE</code> do SQL Server tem uma particularidade que surpreende quem vem de outros motores: <strong>não pode ser executado dentro de uma transação explícita</strong> — tem de correr em modo <em>autocommit</em>, fora de um bloco <code>BEGIN TRAN</code>. A prática correta é:</p>
<div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct292b8f9f-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct292b8f9f-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">def create_database_if_missing(engine, database):
    """Cria a base de dados se nao existir. CREATE DATABASE tem de correr
    em autocommit -- fora de uma transacao explicita do SQL Server."""
    # engine.execution_options(isolation_level="AUTOCOMMIT") desliga o
    # envolvimento automatico em transacao do SQLAlchemy para esta ligacao
    with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
        existe = conn.exec_driver_sql(
            "SELECT database_id FROM sys.databases WHERE name = ?", (database,)
        ).fetchone()
        if existe is None:
            conn.exec_driver_sql(f"CREATE DATABASE [{database}]")
            print(f"Base de dados '{database}' criada.")
        else:
            print(f"Base de dados '{database}' ja existe -- nada a fazer.")

print("Padrao: isolation_level=AUTOCOMMIT + verificacao condicional em")
print("sys.databases antes do CREATE DATABASE. Tentar isto dentro de uma")
print("transacao normal do SQLAlchemy falha com um erro do driver.")</code></pre></div></div></div>
<p>Este é um dos pontos onde o conhecimento de SQL genérico não basta: é conhecimento específico do motor (SQL Server), e é exatamente o tipo de detalhe que só aparece quando se tenta automatizar algo que, feito manualmente uma vez num cliente gráfico, nunca dá erro.</p>
<h3 id="scripts-multi-batch-por-que-dividir-por-go">Scripts multi-batch: por que dividir por GO</h3>
<p>Scripts de definição de esquema (<code>CREATE TABLE</code>, <code>CREATE VIEW</code>, alterações de schema) frequentemente vêm num único ficheiro <code>.sql</code> com vários comandos separados pela palavra-chave <code>GO</code>. <code>GO</code> <strong>não é uma instrução SQL</strong> — é uma convenção do cliente T-SQL (SSMS, <code>sqlcmd</code>) que diz "envie tudo o que está acumulado até aqui como um lote (<em>batch</em>) separado". O driver pyodbc não entende <code>GO</code> nativamente: um script com vários blocos separados por <code>GO</code> tem de ser <strong>dividido em Python antes de ser enviado</strong>, um lote de cada vez.</p>
<div class="codetabs"><div class="ct-bar" role="tablist"><button type="button" class="ct-tab on" role="tab" aria-selected="true" id="ct28e0b951-t0">Python</button></div><div class="ct-pane" role="tabpanel" aria-labelledby="ct28e0b951-t0"><div class="codeblock" data-lang="python"><div class="codebar"><span class="lang">Python</span><button class="btn-copy" type="button">Copiar</button></div><pre><code class="language-python">import re

def _split_on_go(script_sql):
    """Divide um script T-SQL em lotes separados pela linha 'GO',
    ignorando maiusculas/minusculas e espacos em branco a volta."""
    lotes = re.split(r"(?im)^\s*GO\s*$", script_sql)
    return [lote.strip() for lote in lotes if lote.strip()]

script = """
CREATE TABLE dim_maquina (id_maquina INT PRIMARY KEY, nome TEXT);
GO
CREATE TABLE fato_producao (id INT PRIMARY KEY, id_maquina INT, qtd INT);
GO
CREATE VIEW vw_producao_por_maquina AS
    SELECT id_maquina, SUM(qtd) AS total FROM fato_producao GROUP BY id_maquina;
GO
"""

lotes = _split_on_go(script)
print(f"Script dividido em {len(lotes)} lotes:")
for i, lote in enumerate(lotes, start=1):
    primeira_linha = lote.splitlines()[0]
    print(f"  Lote {i}: {primeira_linha}")

def run_sql_script(engine, script_sql):
    """Executa cada lote separadamente -- o padrao usado para aplicar
    scripts de schema completos (tabelas + views) num so passo do pipeline."""
    with engine.begin() as conn:
        for lote in _split_on_go(script_sql):
            conn.exec_driver_sql(lote)</code></pre></div></div></div>
<p>Este padrão fecha o ciclo: um script de schema escrito e testado manualmente num cliente SQL (onde <code>GO</code> funciona nativamente) passa a poder ser aplicado por um pipeline Python sem reescrever nada — só é preciso dividir o texto antes de o enviar pelo driver.</p>
<h3 id="exercicio-proposto">Exercício proposto</h3>
<p>Adapte a função <code>carga_em_lote</code> do exemplo resolvido para aceitar diferentes tamanhos de lote (100, 1&nbsp;000, 5&nbsp;000, 20&nbsp;000) e meça o tempo total para cada um. Existe um tamanho de lote a partir do qual o ganho marginal desaparece? Depois, escreva — em prosa, não em código — o que mudaria nessa curva se a ligação fosse a um servidor remoto numa rede corporativa em vez de uma base de dados SQLite em memória (pense em latência de rede vs. overhead de chamada Python).</p>
<h3 id="erros-comuns">Erros comuns</h3><ol>
<li><strong>Guardar a palavra-passe em texto no código.</strong> Com autenticação Windows integrada (<code>Trusted_Connection</code>/<code>trusted_connection=yes</code>), não há palavra-passe a gerir — a identidade do processo que corre o pipeline é a credencial.</li>
<li><strong>Usar <code>pandas.to_sql()</code> sem <code>method="multi"</code> ou sem um engine com <code>fast_executemany</code> para volumes grandes.</strong> Funciona para protótipos; em produção, com dezenas de milhares de linhas, torna-se o gargalo do pipeline inteiro.</li>
<li><strong>Tentar <code>CREATE DATABASE</code> dentro de uma transação explícita do SQLAlchemy.</strong> O SQL Server rejeita — o comando precisa de correr em modo autocommit.</li>
<li><strong>Enviar um script inteiro com vários <code>GO</code> como uma única string ao driver.</strong> <code>GO</code> é uma convenção de cliente, não uma instrução SQL — o driver não sabe o que fazer com ela e o script falha ou é interpretado como um único lote inválido.</li>
<li><strong>Não desenhar o pipeline para ser idempotente.</strong> Um pipeline que só funciona "da primeira vez" não é reexecutável em caso de falha a meio — truncate-and-reload é mais simples de tornar seguro do que upserts parciais.</li>
</ol><p><em>Fonte principal: documentação oficial SQLAlchemy (sqlalchemy.org — Engine Configuration, fast_executemany) e pyodbc (github.com/mkleehammer/pyodbc). Cross-check: GitHub sqlalchemy/sqlalchemy discussion #6840 “Faster way to insert into SQL Server”; pyodbc issue #619 sobre inserção de grandes volumes. Verificado via pesquisa na web em 01/09/2026.</em></p>
