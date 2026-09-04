<a id="capitulo-155"></a>
## Capítulo 40-B: Esparguete, Makigami e Tartaruga — as três que faltavam

### Primeiro: qual delas, e quando

Não são alternativas — são camadas. Passe o rato sobre cada bolha para ver a que serve.

```plotly
map-matriz
```

A leitura útil deste gráfico não é a posição individual, é a **diagonal**: quanto mais profunda a
informação, mais caro o mapa. Um projeto bem conduzido sobe essa diagonal só até onde precisa. Fazer
BPMN de um processo linear de três passos é desperdício; fazer só um fluxograma de um processo que
atravessa cinco departamentos é ingenuidade.

---

## 1 · Diagrama de esparguete

### A pergunta de engenharia — Esparguete

*Toda a gente concorda que a célula está "bem organizada". Porque é que o operador anda 4 km por
turno?*

Porque ninguém mediu. O diagrama de esparguete é a ferramenta mais barata do Lean e uma das mais
persuasivas: desenha-se a planta do posto ou da célula e **traça-se com um lápis o percurso real** de
uma pessoa, de uma peça ou de um documento durante um ciclo. O nome vem do resultado — o traçado de
um processo mal disposto parece um prato de esparguete.

O que o torna poderoso não é a técnica, é o efeito na sala: um supervisor que defende o layout
durante uma hora fica em silêncio quando vê o próprio percurso desenhado.

### Como se faz, em sete passos

1. **Desenhe a planta à escala.** Um esboço a régua chega; o que não pode é ser "mais ou menos".
2. **Escolha o sujeito.** Operador, peça ou informação — **um de cada vez**. Misturar os três num só
   mapa é o erro nº 1.
3. **Escolha o ciclo.** Um turno completo, ou um número inteiro de peças. Nunca "um bocado".
4. **Siga e trace em tempo real.** Não reconstrua de memória, e não pergunte "por onde costuma ir".
5. **Conte.** Número de deslocações, distância total, tempo em deslocação.
6. **Converta em dinheiro e em takt.** Metros ÷ velocidade de marcha (≈ 1,2 m/s em fábrica) = tempo.
   Compare esse tempo com o takt time.
7. **Redesenhe o layout e volte a traçar.** O segundo traçado é a prova.

### Exemplo resolvido

Célula de maquinação, um operador, um ciclo completo de peça. O traçado a vermelho é o estado atual;
o azul é depois de mover a bancada e juntar rebarba a lavagem.

```plotly
map-esparguete
```

<div class="kpi-row">
<div class="kpi bad"><div class="kpi-k">Estado atual</div><div class="kpi-v">184 m</div><div class="kpi-s">por peça, 12 deslocações</div></div>
<div class="kpi ok"><div class="kpi-k">Estado futuro</div><div class="kpi-v">108 m</div><div class="kpi-s">por peça, 7 deslocações — menos 42%</div></div>
<div class="kpi"><div class="kpi-k">Tempo devolvido</div><div class="kpi-v">64 s</div><div class="kpi-s">por peça, a 1,2 m/s de marcha</div></div>
<div class="kpi"><div class="kpi-k">Em 420 peças/dia</div><div class="kpi-v">7,4 h</div><div class="kpi-s">de caminhada eliminada por dia</div></div>
</div>

Repare no que o número faz que a narrativa não faz: "o operador anda muito" é uma opinião;
"7,4 horas de caminhada por dia nesta célula, cerca de 29 000 € por ano" é um caso de negócio.
O bloco de código abaixo reproduz exatamente estes valores.

### Calcular a distância a partir do traçado

Se registar as coordenadas dos postos e a sequência visitada, a distância sai por soma de distâncias
euclidianas — e daí para o tempo e para o custo é aritmética.

```py-r
--- python
import numpy as np

# coordenadas dos postos, em metros
postos = {
    "Armazem": (3.2, 26.9), "Corte": (10.2, 24.3), "Prensa": (20.5, 25.3),
    "Bancada": (12.8, 16.0), "Rebarba": (25.6, 17.9), "Lavagem": (6.4, 9.6),
    "Inspecao": (23.0, 8.3), "Embalagem": (30.1, 27.5), "Expedicao": (30.7, 4.5),
}

atual = ["Armazem","Corte","Bancada","Prensa","Bancada","Rebarba","Lavagem",
         "Bancada","Inspecao","Lavagem","Embalagem","Bancada","Expedicao"]
futuro = ["Armazem","Corte","Prensa","Rebarba","Lavagem","Inspecao",
          "Embalagem","Expedicao"]

def percurso(seq):
    p = np.array([postos[s] for s in seq])
    passos = np.linalg.norm(np.diff(p, axis=0), axis=1)
    return passos.sum(), len(passos), passos

VELOCIDADE = 1.2      # m/s, marcha em fabrica
PECAS_DIA  = 420

for nome, seq in [("Estado atual", atual), ("Estado futuro", futuro)]:
    d, n, passos = percurso(seq)
    print(f"{nome:15s} {d:6.1f} m   {n:2d} deslocacoes   "
          f"maior salto {passos.max():.1f} m   {d/VELOCIDADE:5.1f} s/peca")

d0, _, _ = percurso(atual)
d1, _, _ = percurso(futuro)
poupanca_h = (d0 - d1) * PECAS_DIA / VELOCIDADE / 3600
print()
print(f"Reducao: {(1-d1/d0)*100:.0f}%  ->  {poupanca_h:.1f} h/dia de caminhada eliminada")
print(f"A 18 EUR/h de custo total do posto: {poupanca_h*18*220:,.0f} EUR/ano".replace(",", " "))
--- r
# coordenadas dos postos, em metros
postos <- data.frame(
  posto = c("Armazem","Corte","Prensa","Bancada","Rebarba",
            "Lavagem","Inspecao","Embalagem","Expedicao"),
  x = c(3.2, 10.2, 20.5, 12.8, 25.6, 6.4, 23.0, 30.1, 30.7),
  y = c(26.9, 24.3, 25.3, 16.0, 17.9, 9.6, 8.3, 27.5, 4.5)
)

atual <- c("Armazem","Corte","Bancada","Prensa","Bancada","Rebarba","Lavagem",
           "Bancada","Inspecao","Lavagem","Embalagem","Bancada","Expedicao")
futuro <- c("Armazem","Corte","Prensa","Rebarba","Lavagem","Inspecao",
            "Embalagem","Expedicao")

percurso <- function(seq) {
  p <- postos[match(seq, postos$posto), c("x", "y")]
  passos <- sqrt(diff(p$x)^2 + diff(p$y)^2)
  list(total = sum(passos), n = length(passos), passos = passos)
}

VELOCIDADE <- 1.2
PECAS_DIA  <- 420

for (nm in c("Estado atual", "Estado futuro")) {
  seq <- if (nm == "Estado atual") atual else futuro
  r <- percurso(seq)
  cat(sprintf("%-15s %6.1f m   %2d deslocacoes   maior salto %.1f m   %5.1f s/peca\n",
              nm, r$total, r$n, max(r$passos), r$total / VELOCIDADE))
}

d0 <- percurso(atual)$total
d1 <- percurso(futuro)$total
poupanca_h <- (d0 - d1) * PECAS_DIA / VELOCIDADE / 3600
cat(sprintf("\nReducao: %.0f%%  ->  %.1f h/dia de caminhada eliminada\n",
            (1 - d1/d0) * 100, poupanca_h))
cat(sprintf("A 18 EUR/h de custo total do posto: %s EUR/ano\n",
            format(round(poupanca_h * 18 * 220), big.mark = " ")))
--- excel
' Distancia entre dois postos (coordenadas em A2:B10, sequencia em D2:D14)

' Distancia de um passo:
=RAIZ((ÍNDICE($A$2:$A$10;CORRESP(D3;$C$2:$C$10;0))-ÍNDICE($A$2:$A$10;CORRESP(D2;$C$2:$C$10;0)))^2
     +(ÍNDICE($B$2:$B$10;CORRESP(D3;$C$2:$C$10;0))-ÍNDICE($B$2:$B$10;CORRESP(D2;$C$2:$C$10;0)))^2)

' Distancia total:
=SOMA(E2:E13)

' Tempo por peca (s):
=E15/1,2

' Horas por dia eliminadas:
=(E15_atual-E15_futuro)*420/1,2/3600
```

### Erros comuns — Tartaruga — Esparguete

1. **Traçar de memória.** O percurso lembrado é sempre mais curto e mais limpo que o real.
2. **Misturar sujeitos.** Um mapa para o operador, outro para a peça. Se cruzarem, isso já é um
   achado — mas em mapas separados.
3. **Medir o dia "normal".** Não existe. Trace pelo menos dois ciclos e mostre os dois.
4. **Parar no desenho.** Sem metros e sem segundos, o esparguete é arte decorativa.
5. **Otimizar o layout sem olhar ao fluxo de material.** Encurtar o percurso do operador aumentando o
   transporte de peças é trocar um desperdício por outro maior.

---

## 2 · Makigami

### A pergunta de engenharia — Makigami

*O VSM funciona bem no chão de fábrica. Como se mapeia um processo em que não há peça nenhuma a
mover-se — só informação, aprovações e espera?*

**Makigami** (巻紙, literalmente "rolo de papel") é a resposta japonesa a isso: um mapa de processo
administrativo em camadas horizontais, desenhado num rolo de papel de parede numa sala com todas as
áreas envolvidas. É o VSM dos processos transacionais.

A estrutura é sempre a mesma — colunas são etapas, linhas são camadas:

| Camada | O que se regista | Porque importa |
|---|---|---|
| **Atividade** | O que se faz, verbo no infinitivo | A espinha do mapa |
| **Responsável** | Quem, por nome de função | Revela handoffs, como a swimlane |
| **Documento / sistema** | Que formulário, que ecrã, que e-mail | Onde a informação é recriada |
| **Tempo de processamento** | Minutos de trabalho efetivo | O numerador do rácio VA |
| **Tempo de passagem** | Do início ao fim, incluindo espera | O denominador — quase sempre chocante |
| **Problemas** | Retrabalho, dúvidas, devoluções | Alimenta o Pareto de causas |
| **Ideias** | O que a equipa propõe ali mesmo | Impede que a sessão morra no diagnóstico |

### O que o Makigami expõe e mais nada expõe

Um pedido de cliente que "demora dois dias" na perceção da equipa. Passe o rato em cada barra:

```plotly
map-va-nva
```

*Escala logarítmica e barras lado a lado, de propósito: em escala linear as barras de valor
acrescentado seriam invisíveis ao lado das de espera — que é exatamente o problema.*

<div class="kpi-row">
<div class="kpi ok"><div class="kpi-k">Trabalho útil</div><div class="kpi-v">52 min</div><div class="kpi-s">valor acrescentado</div></div>
<div class="kpi warn"><div class="kpi-k">Necessário sem valor</div><div class="kpi-v">32 min</div><div class="kpi-s">controlos, registos, transcrição</div></div>
<div class="kpi bad"><div class="kpi-k">Espera</div><div class="kpi-v">39,6 h</div><div class="kpi-s">96,8% do tempo total</div></div>
<div class="kpi"><div class="kpi-k">Rácio VA</div><div class="kpi-v">2,1%</div><div class="kpi-s">típico: 1–5% em administrativo</div></div>
</div>

Repare na consequência prática: **acelerar as atividades não resolve nada**. Se a equipa dobrasse a
produtividade em todas as seis etapas, o processo passaria de 40,4 h para 39,7 h — uma melhoria de
1,7%. Todo o ganho está nas esperas, e as esperas vivem nas fronteiras entre áreas, não dentro delas.

Este é o mesmo argumento da regra de ouro pool/lane no capítulo anterior, agora com números.

### Como conduzir uma sessão de Makigami

- **Sala física, papel físico, post-its.** A ferramenta funciona porque toda a gente vê ao mesmo
  tempo. Feito em software por uma pessoa, é só um fluxograma feio.
- **Todas as áreas presentes.** A metade do valor está nas frases "ah, mas eu não sabia que vocês
  faziam isso".
- **Tempo de passagem medido, não estimado.** Extraia do sistema: data/hora de entrada e de saída
  de cada etapa. As estimativas subestimam a espera por um fator de 3 a 10.
- **Duas cores de post-it:** problemas e ideias. Separar as duas evita que a sessão degenere em
  reclamação ou em salto para a solução.

### Makigami e VSM: quando usar qual

| | VSM | Makigami |
|---|---|---|
| Objeto | Peça física | Informação / documento |
| Fluxo de informação | Camada separada, no topo | É o próprio objeto |
| Inventário | Peças entre postos | Pedidos em fila, caixas de entrada |
| Métrica-chave | Lead time, rácio VA | Tempo de passagem, rácio VA |
| Camadas | 2 (material + informação) | 5 a 7 |
| Erro típico | Ignorar o fluxo de informação | Estimar a espera em vez de medir |

---

## 3 · Diagrama de tartaruga

### A pergunta de engenharia — Tartaruga

*O auditor vai chegar e perguntar "mostre-me este processo". O que é que se põe em cima da mesa?*

O **diagrama de tartaruga** existe exatamente para isso. É a representação de um processo na ótica
de sistema de gestão: não a sequência de passos, mas **as seis perguntas que a norma quer ver
respondidas**. O nome vem da forma: um corpo (o processo), uma cabeça (entradas), uma cauda (saídas)
e quatro patas.

É a ferramenta de eleição na preparação para auditorias **IATF 16949** e **ISO 9001**, e é também a
base da auditoria por processo: o auditor entra por uma pata e verifica se as outras cinco são
coerentes.

<figure class="figure2026">
<svg role="img" aria-label="Diagrama de tartaruga: entradas, saidas, com que, com quem, como e indicadores em torno do processo central" viewBox="0 0 940 560" style="width:100%;height:auto;display:block;background:var(--surface-1);border:1px solid var(--line);border-radius:10px" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="tt-ar" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7c8f99"/></marker>
</defs>
<style>
.tt-box { fill: var(--surface-2); stroke: var(--line); stroke-width: 1.6; }
.tt-leg { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 1.6; }
.tt-core { fill: var(--accent); stroke: none; }
.tt-t { font-family: "Segoe UI", Inter, system-ui, sans-serif; fill: var(--ink); }
.tt-h { font-family: "Segoe UI", Inter, system-ui, sans-serif; fill: var(--accent-ink); font-weight: 700; font-size: 13px; }
.tt-s { font-family: "Segoe UI", Inter, system-ui, sans-serif; fill: var(--ink-2); font-size: 11.5px; }
.tt-w { font-family: "Segoe UI", Inter, system-ui, sans-serif; fill: #fff; }
.tt-l { stroke: #7c8f99; stroke-width: 1.6; fill: none; }
</style>

<line class="tt-l" x1="285" y1="150" x2="380" y2="228" marker-end="url(#tt-ar)"/>
<line class="tt-l" x1="655" y1="150" x2="560" y2="228" marker-end="url(#tt-ar)"/>
<line class="tt-l" x1="285" y1="410" x2="380" y2="332" marker-end="url(#tt-ar)"/>
<line class="tt-l" x1="655" y1="410" x2="560" y2="332" marker-end="url(#tt-ar)"/>
<line class="tt-l" x1="250" y1="280" x2="368" y2="280" marker-end="url(#tt-ar)"/>
<line class="tt-l" x1="572" y1="280" x2="690" y2="280" marker-end="url(#tt-ar)"/>

<g data-tip="<b>Com quê?</b> Equipamentos, instrumentos, software e infraestrutura. O auditor pede aqui o plano de calibração e a validação do software. Cláusula 7.1.3 e 7.1.5 da ISO 9001.">
  <rect class="tt-leg" x="120" y="40" width="250" height="112" rx="10"/>
  <text class="tt-h" x="140" y="66">COM QUÊ?</text>
  <text class="tt-s" x="140" y="88">Máquinas, ferramentas, instrumentos</text>
  <text class="tt-s" x="140" y="106">Software e sistemas de informação</text>
  <text class="tt-s" x="140" y="124">Infraestrutura e ambiente</text>
  <text class="tt-s" x="140" y="142" style="fill:var(--accent-ink)">→ calibração, manutenção, validação</text>
</g>

<g data-tip="<b>Com quem?</b> Funções, competências, formação e autoridade. É onde a auditoria cruza a matriz de competências com os registos de formação. Cláusula 7.2 e 7.3.">
  <rect class="tt-leg" x="570" y="40" width="250" height="112" rx="10"/>
  <text class="tt-h" x="590" y="66">COM QUEM?</text>
  <text class="tt-s" x="590" y="88">Funções e responsabilidades</text>
  <text class="tt-s" x="590" y="106">Competência e qualificação</text>
  <text class="tt-s" x="590" y="124">Formação e autorização</text>
  <text class="tt-s" x="590" y="142" style="fill:var(--accent-ink)">→ matriz de competências, registos</text>
</g>

<g data-tip="<b>Entradas.</b> O que dispara o processo e o que ele consome. Cada entrada tem de ser a saída de outro processo — se não for, há uma lacuna no mapa de processos da organização.">
  <path class="tt-box" d="M20,222 h210 l30,58 -30,58 h-210 z"/>
  <text class="tt-h" x="42" y="258">ENTRADAS</text>
  <text class="tt-s" x="42" y="280">Pedido, matéria-prima,</text>
  <text class="tt-s" x="42" y="298">especificação, dados</text>
  <text class="tt-s" x="42" y="320" style="fill:var(--accent-ink)">de que processo vêm?</text>
</g>

<g data-tip="<b>Saídas.</b> O produto do processo e para quem vai. Uma saída sem cliente interno identificado é trabalho que ninguém pediu — candidato imediato a eliminação.">
  <path class="tt-box" d="M710,222 h210 v116 h-210 l30,-58 z"/>
  <text class="tt-h" x="752" y="258">SAÍDAS</text>
  <text class="tt-s" x="752" y="280">Produto conforme,</text>
  <text class="tt-s" x="752" y="298">registo, decisão</text>
  <text class="tt-s" x="752" y="320" style="fill:var(--accent-ink)">para que processo vão?</text>
</g>

<g data-tip="<b>Como?</b> Método, procedimento e critério de aceitação. É a pata que a auditoria compara com o que realmente se faz no posto — a divergência entre as duas é a não conformidade mais comum de todas.">
  <rect class="tt-leg" x="120" y="408" width="250" height="112" rx="10"/>
  <text class="tt-h" x="140" y="434">COMO?</text>
  <text class="tt-s" x="140" y="456">Procedimento, instrução de trabalho</text>
  <text class="tt-s" x="140" y="474">Plano de controlo, critério de aceitação</text>
  <text class="tt-s" x="140" y="492">Métodos de inspeção e ensaio</text>
  <text class="tt-s" x="140" y="510" style="fill:var(--accent-ink)">→ o escrito bate certo com o feito?</text>
</g>

<g data-tip="<b>Quanto?</b> Indicadores de desempenho e de eficácia. A pergunta que desmonta a maioria dos processos: qual é a meta, quem a definiu, e o que se faz quando não é atingida? Cláusula 9.1.">
  <rect class="tt-leg" x="570" y="408" width="250" height="112" rx="10"/>
  <text class="tt-h" x="590" y="434">QUANTO? (INDICADORES)</text>
  <text class="tt-s" x="590" y="456">KPI do processo e meta</text>
  <text class="tt-s" x="590" y="474">Método de medição e frequência</text>
  <text class="tt-s" x="590" y="492">Ação quando fora da meta</text>
  <text class="tt-s" x="590" y="510" style="fill:var(--accent-ink)">→ eficácia, não só atividade</text>
</g>

<g data-tip="<b>O processo.</b> Nome, dono e fronteiras. Se o dono do processo não souber dizer onde ele começa e acaba, nenhuma das quatro patas vai fechar.">
  <rect class="tt-core" x="368" y="228" width="204" height="104" rx="12"/>
  <text class="tt-w" x="470" y="266" font-size="14.5" font-weight="700" text-anchor="middle">PROCESSO</text>
  <text class="tt-w" x="470" y="290" font-size="11.5" text-anchor="middle" opacity=".9">nome · dono · fronteiras</text>
  <text class="tt-w" x="470" y="312" font-size="11" text-anchor="middle" opacity=".75">"Maquinação do eixo 4820"</text>
</g>

<text class="tt-s" x="470" y="544" text-anchor="middle" style="fill:var(--ink-3)">passe o rato (ou toque) em cada elemento</text>
</svg>
<figcaption>Diagrama de tartaruga. As quatro patas e a cabeça/cauda são as seis perguntas que uma
auditoria por processo faz — e a ordem em que as faz.</figcaption>
</figure>

### Como o auditor o usa (e como se prepara para isso)

A auditoria por processo entra por uma pata e verifica a **coerência com as outras cinco**. Os
percursos clássicos:

| O auditor entra por… | E vai verificar… | A falha que procura |
|---|---|---|
| **Indicadores** | Se a meta existe, se é medida e o que se faz quando falha | Indicador que mede atividade em vez de eficácia |
| **Com quê** | Calibração do instrumento que gera aquele indicador | Instrumento fora de prazo a alimentar decisão de conformidade |
| **Com quem** | Se quem executa está qualificado para aquele método | Operador a executar um ensaio para o qual não tem qualificação |
| **Como** | Se o procedimento escrito descreve o que se faz | A divergência procedimento ↔ prática — a NC mais comum de todas |
| **Entradas** | De que processo vem, e se esse processo a declara como saída | Entrada órfã: ninguém a produz formalmente |
| **Saídas** | Para quem vai, e se esse alguém a reconhece como entrada | Saída que ninguém recebe: trabalho desperdiçado |

**A preparação que funciona** não é escrever tartarugas bonitas na véspera. É verificar, em cada
processo, se as seis caixas fecham entre si — e sobretudo se as **entradas e saídas encaixam com as
dos processos vizinhos**. Uma organização cujas tartarugas encaixam todas tem, de facto, um sistema;
uma cujas tartarugas foram escritas isoladamente tem uma coleção de folhas.

### Erros comuns

1. **Confundir a tartaruga com um fluxograma.** Ela não descreve sequência. Se puser passos
   numerados no corpo, perdeu o ponto.
2. **Indicadores de atividade em vez de eficácia.** "Nº de inspeções realizadas" não é um indicador
   do processo de inspeção; "taxa de escape para o cliente" é.
3. **Uma tartaruga por departamento.** É por **processo**. Um processo pode atravessar três
   departamentos — e é precisamente aí que ela é útil.
4. **Escrever para a auditoria.** A tartaruga escrita na véspera nota-se, porque as entradas e as
   saídas não encaixam com as dos processos vizinhos.
5. **Deixar a pata "Como" vazia ou genérica.** É a que o auditor confronta com o posto de trabalho.

---

### Ligações

- **Capítulo 40** — fluxograma e swimlane: a base de simbologia.
- **Capítulo 40-A** — BPMN 2.0 e Bizagi: quando o processo tem exceções e atravessa organizações.
- **Capítulo 27** — VSM: o equivalente do Makigami para o fluxo físico.
- **Capítulo 93** — auditorias da qualidade: onde a tartaruga é usada a sério.
- **Capítulo 101** — IATF 16949: o contexto normativo que a torna praticamente obrigatória.
