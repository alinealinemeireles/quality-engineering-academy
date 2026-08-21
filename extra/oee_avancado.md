<a id="capitulo-904"></a>
## Capítulo 25-A: OEE Avançado — Decomposição de Perdas, Maturidade Digital e Dados em Tempo Real

> **Nota editorial.** Capítulo interativo escrito de raiz para a edição web, como laboratório
> avançado do Capítulo 25. Onde o capítulo original explica a fórmula, este mostra para onde os
> minutos desaparecem, por que a média semanal mente, e o que separa uma fábrica que só reporta
> OEE de uma que age sobre ele.

### A pergunta de engenharia

*O relatório da semana diz OEE 73%. A diretoria aprova, o quadro fica verde, todos seguem em
frente. Só que a linha 2 parou quatro vezes na terça, o SKU C teve um ramp-up de três horas depois
do changeover, e ninguém no relatório sabe disso — porque a média absorveu tudo.*

O número agregado não é falso. É só a pergunta errada. OEE serve para decidir **onde investir a
próxima hora de melhoria**, e uma média semanal não aponta para lugar nenhum. Este capítulo separa
as duas perguntas: "qual é o número" (o capítulo 25 já responde) e "onde exatamente ele está sendo
perdido" — que é a pergunta que paga a conta.

---

## 1 · A cascata: para onde foram os 120 minutos?

Um turno de 480 minutos. No fim, só 360 minutos produziram peça boa. Passe o rato em cada barra:

```plotly
oee-waterfall
```

*Disponibilidade 87,5% (perde 60 min a paradas não planejadas) × Performance 95,2% (perde 20 min a
microparadas e queda de velocidade) × Qualidade 90,0% (perde 40 min-equivalentes a refugo e
retrabalho) = **OEE 75,0%**.*

A leitura que a fórmula sozinha não dá: os três fatores não custam a mesma coisa para recuperar.
Disponibilidade é a mais barata de atacar primeiro (causas pontuais, muitas vezes já registadas em
apontamento de parada). Performance é a mais escondida — ninguém abre uma ordem de manutenção para
"a máquina está 5% mais lenta que o normal" — get. Qualidade é a mais cara, porque cada minuto
perdido já consumiu material, energia e tempo de máquina antes de ser descartado.

| Camada | O que consome | Pergunta certa |
|---|---|---|
| **Disponibilidade** | Quebras, falta de material, troca de produto | "Por que a máquina não estava rodando?" |
| **Performance** | Microparadas, ciclo mais lento que o padrão | "Por que rodou mais devagar do que devia?" |
| **Qualidade** | Refugo, retrabalho, arranque fora de especificação | "Por que produziu peça ruim enquanto rodava?" |

---

## 2 · As seis etapas de maturidade do OEE

A mesma fórmula, em organizações muito diferentes. Passe o rato em cada degrau:

<figure class="figure2026">
<svg role="img" aria-label="As seis etapas de maturidade do OEE, de ausencia de medicao ate lente estrategica" viewBox="0 0 980 420" style="width:100%;height:auto;display:block;background:var(--surface-1);border:1px solid var(--line);border-radius:10px" xmlns="http://www.w3.org/2000/svg">
<style>
.mt-t { font-family: "Segoe UI", Inter, system-ui, sans-serif; }
.mt-n { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-weight: 700; fill: var(--surface-1); }
.mt-h { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-weight: 700; fill: var(--accent-ink); font-size: 12.5px; }
.mt-s { font-family: "Segoe UI", Inter, system-ui, sans-serif; fill: var(--ink-3); font-size: 10px; }
</style>

<g data-tip="<b>1 · Sem OEE.</b> Acompanhamento manual, quando existe. O número, se alguém pedir, é um chute informado. Não há linha de base para melhorar nada.">
  <rect x="30" y="330" width="130" height="60" rx="8" fill="var(--ink-3)"/>
  <circle cx="95" cy="318" r="16" fill="var(--ink-3)"/><text class="mt-n" x="95" y="323" text-anchor="middle" font-size="14">1</text>
  <text class="mt-h" x="95" y="356" text-anchor="middle" fill="var(--surface-1)">Sem OEE</text>
  <text class="mt-s" x="95" y="372" text-anchor="middle" fill="var(--surface-1)">acompanhamento manual</text>
</g>

<g data-tip="<b>2 · Placar de resultado.</b> Esperado vs. realizado num quadro. Todos veem o número — quase ninguém age sobre ele. É onde a maioria das plantas está presa.">
  <rect x="176" y="300" width="130" height="90" rx="8" fill="var(--bad)"/>
  <circle cx="241" cy="288" r="16" fill="var(--bad)"/><text class="mt-n" x="241" y="293" text-anchor="middle" font-size="14">2</text>
  <text class="mt-h" x="241" y="326" text-anchor="middle" fill="var(--surface-1)">Placar de</text>
  <text class="mt-h" x="241" y="341" text-anchor="middle" fill="var(--surface-1)">resultado</text>
  <text class="mt-s" x="241" y="358" text-anchor="middle" fill="var(--surface-1)">esperado vs. real,</text>
  <text class="mt-s" x="241" y="371" text-anchor="middle" fill="var(--surface-1)">sem ação</text>
</g>

<g data-tip="<b>3 · Categorias de perda.</b> Disponibilidade, performance e qualidade rastreadas em separado — no papel. Já dá para saber ONDE olhar, mas ainda com atraso de horas ou turnos.">
  <rect x="322" y="264" width="130" height="126" rx="8" fill="var(--warn)"/>
  <circle cx="387" cy="252" r="16" fill="var(--warn)"/><text class="mt-n" x="387" y="257" text-anchor="middle" font-size="14">3</text>
  <text class="mt-h" x="387" y="292" text-anchor="middle" fill="var(--surface-1)">Categorias</text>
  <text class="mt-h" x="387" y="307" text-anchor="middle" fill="var(--surface-1)">de perda</text>
  <text class="mt-s" x="387" y="324" text-anchor="middle" fill="var(--surface-1)">disp. · perf. · qual.</text>
  <text class="mt-s" x="387" y="337" text-anchor="middle" fill="var(--surface-1)">no papel, com atraso</text>
</g>

<g data-tip="<b>4 · OEE em tempo real.</b> Perdas capturadas ao vivo. O operador vê a queda de velocidade no momento em que acontece, não no relatório do dia seguinte.">
  <rect x="468" y="228" width="130" height="162" rx="8" fill="var(--series-4)"/>
  <circle cx="533" cy="216" r="16" fill="var(--series-4)"/><text class="mt-n" x="533" y="221" text-anchor="middle" font-size="14">4</text>
  <text class="mt-h" x="533" y="256" text-anchor="middle" fill="var(--surface-1)">Tempo real</text>
  <text class="mt-s" x="533" y="273" text-anchor="middle" fill="var(--surface-1)">perdas capturadas</text>
  <text class="mt-s" x="533" y="286" text-anchor="middle" fill="var(--surface-1)">ao vivo, ação na</text>
  <text class="mt-s" x="533" y="299" text-anchor="middle" fill="var(--surface-1)">troca de turno</text>
</g>

<g data-tip="<b>5 · Motor de decisão.</b> Toda perda tem dono e prazo. O ciclo fecha: perda identificada, ação atribuída, eficácia verificada.">
  <rect x="614" y="192" width="130" height="198" rx="8" fill="var(--series-1)"/>
  <circle cx="679" cy="180" r="16" fill="var(--series-1)"/><text class="mt-n" x="679" y="185" text-anchor="middle" font-size="14">5</text>
  <text class="mt-h" x="679" y="220" text-anchor="middle" fill="var(--surface-1)">Motor de</text>
  <text class="mt-h" x="679" y="235" text-anchor="middle" fill="var(--surface-1)">decisão</text>
  <text class="mt-s" x="679" y="252" text-anchor="middle" fill="var(--surface-1)">toda perda tem</text>
  <text class="mt-s" x="679" y="265" text-anchor="middle" fill="var(--surface-1)">dono e prazo</text>
</g>

<g data-tip="<b>6 · Lente estratégica.</b> OEE informa decisões de CAPEX/OPEX: compra-se mais máquina ou investe-se em eficiência da que já existe? O indicador que ficava no chão de fábrica chega à sala de decisão.">
  <rect x="760" y="156" width="130" height="234" rx="8" fill="var(--good)"/>
  <circle cx="825" cy="144" r="16" fill="var(--good)"/><text class="mt-n" x="825" y="149" text-anchor="middle" font-size="14">6</text>
  <text class="mt-h" x="825" y="184" text-anchor="middle" fill="var(--surface-1)">Lente</text>
  <text class="mt-h" x="825" y="199" text-anchor="middle" fill="var(--surface-1)">estratégica</text>
  <text class="mt-s" x="825" y="216" text-anchor="middle" fill="var(--surface-1)">informa decisão</text>
  <text class="mt-s" x="825" y="229" text-anchor="middle" fill="var(--surface-1)">de CAPEX/OPEX</text>
</g>

<line x1="30" y1="398" x2="920" y2="398" stroke="var(--line)" stroke-width="1.4"/>
<text class="mt-t" x="30" y="414" font-size="11.5" fill="var(--ink-3)">OEE que fica no chão de fábrica é custo de medição.</text>
<text class="mt-t" x="920" y="414" text-anchor="end" font-size="11.5" fill="var(--accent-ink)">OEE que chega à sala de reunião é estratégia.</text>
</svg>
<figcaption>A maioria das fábricas está presa na etapa 2 ou 3 — um quadro com números que ninguém
usa para decidir nada no mesmo turno. O salto que mais compensa é do 3 para o 4: tempo real.</figcaption>
</figure>

---

## 3 · Por que a média semanal mente

Cento e vinte OEE% escondidos atrás de um único número. Quatro SKUs, mesma semana, mesma linha.
Passe o rato em cada barra:

```plotly
oee-sku
```

O agregado de 73% é aritmeticamente correto e operacionalmente inútil. **SKU B** (83%) tem
problema de qualidade concentrado — vale a pena investigar cor e dimensão do lote antes de mexer em
qualquer outra coisa. **SKU C** (60%) tem ramp-up lento — o ganho está no changeover, não na
máquina rodando. **SKU D** (74%) tem downtime fragmentado em muitas microparadas pequenas — o tipo
de perda que relatório nenhum agregado captura, porque cada uma sozinha "não é nada".

> **Regra prática.** Revisão semanal de OEE precisa de duas lentes, sempre: o número (para saber se
> está melhorando) e o que está por trás dele (para saber o que fazer na segunda-feira). Uma sem a
> outra vira teatro de gestão.

---

## 4 · A árvore de causas de downtime

Antes de decompor performance e qualidade, separe bem o que é parada **planejada** do que é
**não planejada** — são orçamentos e responsáveis diferentes.

| Ramo | Categoria | Exemplos |
|---|---|---|
| **Planejada** | Manutenção | Lubrificação, inspeção preventiva, troca de peça programada |
| **Planejada** | Sem produção agendada | Restrição legal, sobre-capacidade, teste de produção |
| **Planejada** | Externa | Falta de energia, água, capacidade de armazém |
| **Não planejada** | Quebra | Falha de componente específico (bico, cabeçote, rolo, braço) |
| **Não planejada** | Troca/changeover | Troca de bobina, recarga de etiqueta, mudança de formato |
| **Não planejada** | Operacional | Start-up, fim de turno, pausas e reuniões |
| **Não planejada** | Perda de velocidade | Desgaste, ajuste manual, ferramenta reparada |

O ponto que costuma passar despercebido: **"quebra" não é uma categoria, é um sintoma**. Uma
"quebra do encapsulador" precisa virar "falha da unidade de bico do encapsulador" antes de gerar
qualquer ação de manutenção — do contrário, o mesmo componente volta a falhar no mês seguinte e o
relatório mostra "quebra" outra vez, como se fosse um evento novo.

---

## 5 · O cálculo completo, em Python, R, Excel e Power BI

```py-r
--- python
import numpy as np

# Turno de 480 min. Downtime, contagem de pecas e refugo do dia.
tempo_planejado = 480          # min
downtime = 60                  # paradas nao planejadas
ciclo_ideal = 1.0              # min/peca
total_pecas = 400
pecas_boas = 360

tempo_operando = tempo_planejado - downtime
disponibilidade = tempo_operando / tempo_planejado
performance = (ciclo_ideal * total_pecas) / tempo_operando
qualidade = pecas_boas / total_pecas
oee = disponibilidade * performance * qualidade

print(f"Disponibilidade = {disponibilidade:6.1%}")
print(f"Performance     = {performance:6.1%}")
print(f"Qualidade       = {qualidade:6.1%}")
print(f"OEE             = {oee:6.1%}")

# Decomposicao em minutos ("cascata")
min_disponibilidade = downtime
min_performance = tempo_operando - ciclo_ideal * total_pecas
min_qualidade = ciclo_ideal * (total_pecas - pecas_boas)
tempo_produtivo = tempo_planejado - min_disponibilidade - min_performance - min_qualidade
print(f"\nMinutos perdidos: disponibilidade {min_disponibilidade:.0f}, "
      f"performance {min_performance:.0f}, qualidade {min_qualidade:.0f}")
print(f"Tempo totalmente produtivo = {tempo_produtivo:.0f} min "
      f"(confere: {tempo_produtivo/tempo_planejado:.1%})")

# MTBF / MTTR do periodo (5 falhas, 480 min de operacao acumulada, 60 min de reparo total)
n_falhas = 5
tempo_operacao_total = 12348.0   # horas, acumulado no mes
tempo_reparo_total = 5.0         # horas, acumulado no mes
mtbf = tempo_operacao_total / n_falhas
mttr = tempo_reparo_total / n_falhas
print(f"\nMTBF = {mtbf:8.1f} h    MTTR = {mttr:5.2f} h")
--- r
# Turno de 480 min. Downtime, contagem de pecas e refugo do dia.
tempo_planejado <- 480
downtime <- 60
ciclo_ideal <- 1.0
total_pecas <- 400
pecas_boas <- 360

tempo_operando <- tempo_planejado - downtime
disponibilidade <- tempo_operando / tempo_planejado
performance <- (ciclo_ideal * total_pecas) / tempo_operando
qualidade <- pecas_boas / total_pecas
oee <- disponibilidade * performance * qualidade

cat(sprintf("Disponibilidade = %.1f%%\n", disponibilidade * 100))
cat(sprintf("Performance     = %.1f%%\n", performance * 100))
cat(sprintf("Qualidade       = %.1f%%\n", qualidade * 100))
cat(sprintf("OEE             = %.1f%%\n", oee * 100))

min_disponibilidade <- downtime
min_performance <- tempo_operando - ciclo_ideal * total_pecas
min_qualidade <- ciclo_ideal * (total_pecas - pecas_boas)
tempo_produtivo <- tempo_planejado - min_disponibilidade - min_performance - min_qualidade
cat(sprintf("\nTempo totalmente produtivo = %.0f min (confere: %.1f%%)\n",
            tempo_produtivo, tempo_produtivo / tempo_planejado * 100))

n_falhas <- 5
tempo_operacao_total <- 12348.0
tempo_reparo_total <- 5.0
mtbf <- tempo_operacao_total / n_falhas
mttr <- tempo_reparo_total / n_falhas
cat(sprintf("\nMTBF = %.1f h    MTTR = %.2f h\n", mtbf, mttr))
--- excel
' Dados: A2=tempo planejado, A3=downtime, A4=ciclo ideal, A5=total pecas, A6=pecas boas

Tempo Operando      =A2-A3
Disponibilidade     =(A2-A3)/A2
Performance         =(A4*A5)/(A2-A3)
Qualidade           =A6/A5
OEE                 =Disponibilidade*Performance*Qualidade

' Cascata em minutos
Perda Disponibilidade =A3
Perda Performance     =(A2-A3)-(A4*A5)
Perda Qualidade       =A4*(A5-A6)
Tempo Produtivo        =A2-[Perda Disponibilidade]-[Perda Performance]-[Perda Qualidade]

' MTBF / MTTR (B2=n falhas, B3=horas de operacao, B4=horas de reparo)
MTBF =B3/B2
MTTR =B4/B2
--- dax
// Medidas de OEE em Power BI. Tabela 'Producao' com [TempoPlanejado],
// [Downtime], [CicloIdeal], [TotalPecas], [PecasBoas] por turno.

TempoOperando = SUM(Producao[TempoPlanejado]) - SUM(Producao[Downtime])

Disponibilidade = DIVIDE([TempoOperando], SUM(Producao[TempoPlanejado]))

Performance =
DIVIDE(
    SUMX(Producao, Producao[CicloIdeal] * Producao[TotalPecas]),
    [TempoOperando]
)

Qualidade = DIVIDE(SUM(Producao[PecasBoas]), SUM(Producao[TotalPecas]))

OEE = [Disponibilidade] * [Performance] * [Qualidade]

// Semaforo para o cartao KPI
StatusOEE =
SWITCH (
    TRUE (),
    [OEE] >= 0.85, "Classe mundial",
    [OEE] >= 0.60, "Média da indústria",
    "Precisa melhorar"
)
```

---

## 6 · Maturidade digital não é o mesmo que maturidade operacional

Uma fábrica pode ter dashboards em tempo real e ainda assim reagir mal — porque o problema nunca
foi a falta de dados.

| | Maturidade operacional baixa | Maturidade operacional alta |
|---|---|---|
| **Maturidade digital alta** | *Caos orientado a relatório.* Dashboards em tempo real, mas reações inconsistentes — reuniões inteiras para interpretar o que o próprio sistema já mostrou. | *Sistema orientado à ação.* Sinal em tempo real → reação predefinida → dono de turno claro. Dados viram ação em minutos. |
| **Maturidade digital baixa** | *Fábrica reativa.* Rastreamento manual, cultura de apagar incêndio, rotina inconsistente turno a turno. | *Disciplinada mas manual.* Rotinas fortes, responsabilidade clara, visibilidade limitada — a disciplina existe, só não escala. |

A diferença não é a ferramenta, é o que o sistema foi desenhado para disparar. Um dashboard
construído para **reportar** cria observadores. Um sistema construído para **agir** cria
desempenho — mesmo com menos telas.

---

### Erros comuns

1. **Reportar só o OEE agregado.** Esconde exatamente o que precisa de ação (seção 3).
2. **Confundir "quebra" com causa raiz.** "Máquina quebrou" não é uma causa — é o sintoma que ainda
   precisa do 5 Porquês (ver capítulo extra de Resolução de Problemas).
3. **Medir performance sem ciclo ideal correto.** Se o ciclo ideal está errado, toda a cascata está
   errada — valide-o contra a especificação do equipamento, não contra a média histórica.
4. **Tratar microparadas como "normais".** Cada uma sozinha é pequena; somadas, costumam ser a
   maior fatia da perda de performance.
5. **Comprar máquina nova antes de calcular a etapa 6.** Se a maturidade ainda está em 2 ou 3, o
   problema não é capacidade — é disciplina de execução.

### Ligações

- **Capítulo 25** — TPM e OEE: a fórmula e os fundamentos que este capítulo aprofunda.
- **Capítulo 66** — Subgrupo racional: mesma lógica de "a média esconde o que importa".
- **Capítulo 70** — SPC de corrida curta: variação entre lotes que uma média mensal apaga.
- **Capítulo 98** — Confiabilidade e Manutenibilidade: MTBF/MTTR em profundidade.
- **Capítulo 105** — Quality 4.0: arquitetura de dados por trás de um OEE em tempo real.
- Capítulo extra **"5S e Gestão Visual"** — o quadro hora a hora que alimenta a etapa 4 da escada.
