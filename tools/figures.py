#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera os graficos interativos (Plotly) usados nos capitulos enriquecidos.

As cores sao emitidas como tokens "@series-1", "@ink-3", ... e resolvidas no
navegador a partir das variaveis CSS — assim o grafico segue o tema claro/escuro
sem duplicar figuras.
"""
import json
import math

import numpy as np

FIGS = {}


def reg(name, data, layout, config=None):
    FIGS[name] = {'data': data, 'layout': layout}
    if config:
        FIGS[name]['config'] = config


def norm_pdf(x, mu, s):
    return np.exp(-0.5 * ((x - mu) / s) ** 2) / (s * math.sqrt(2 * math.pi))


def norm_cdf(z):
    return 0.5 * (1 + np.vectorize(math.erf)(z / math.sqrt(2)))


BASE_AXIS = dict(showgrid=True, zeroline=False, automargin=True)


def ax(title=None, **kw):
    a = dict(BASE_AXIS)
    if title is not None:
        a['title'] = {'text': title}
    a.update(kw)
    return a


# =============================================================================
# CAPABILITY
# =============================================================================
def fig_capability_studio():
    """Histograma + normal ajustada + limites, com deslizador de centragem."""
    LIE, LSE = 34.50, 35.50
    alvo = 35.00
    sigma = 0.118
    x = np.linspace(34.2, 35.8, 170)

    frames, steps = [], []
    medias = np.round(np.arange(34.80, 35.21, 0.02), 2)
    for mu in medias:
        Cp = (LSE - LIE) / (6 * sigma)
        Cpk = min(LSE - mu, mu - LIE) / (3 * sigma)
        # PPM total fora de especificacao
        ppm = (norm_cdf(np.array([(LIE - mu) / sigma]))[0] +
               (1 - norm_cdf(np.array([(LSE - mu) / sigma]))[0])) * 1e6
        y = norm_pdf(x, mu, sigma)
        dentro = (x >= LIE) & (x <= LSE)
        frames.append({
            'name': f'{mu:.2f}',
            'data': [
                {'x': np.round(x[dentro], 3).tolist(), 'y': np.round(y[dentro], 3).tolist()},
                {'x': np.round(x[~dentro], 3).tolist(), 'y': np.round(y[~dentro], 3).tolist()},
                {'x': [mu, mu], 'y': [0, float(norm_pdf(np.array([mu]), mu, sigma)[0])]},
            ],
            'layout': {'annotations': [
                _ann(f'<b>Cp {Cp:.2f}</b>   ·   <b>Cpk {Cpk:.2f}</b>   ·   '
                     f'{ppm:,.0f} PPM fora'.replace(',', ' '),
                     'ok' if Cpk >= 1.33 else ('warn' if Cpk >= 1.0 else 'bad'))]}
        })
        steps.append({'label': f'{mu:.2f}', 'method': 'animate',
                      'args': [[f'{mu:.2f}'],
                               {'mode': 'immediate',
                                'frame': {'duration': 0, 'redraw': True},
                                'transition': {'duration': 0}}]})

    mu0 = 35.00
    y0 = norm_pdf(x, mu0, sigma)
    dentro0 = (x >= LIE) & (x <= LSE)
    i0 = int(np.where(medias == 35.00)[0][0])

    data = [
        {'type': 'scatter', 'mode': 'lines', 'fill': 'tozeroy', 'name': 'dentro da especificação',
         'x': np.round(x[dentro0], 3).tolist(), 'y': np.round(y0[dentro0], 3).tolist(),
         'line': {'color': '@series-1', 'width': 2},
         'fillcolor': 'rgba(10,125,157,.22)',
         'hovertemplate': 'diâmetro %{x:.3f} mm<br>densidade %{y:.2f}<extra>conforme</extra>'},
        {'type': 'scatter', 'mode': 'lines', 'fill': 'tozeroy', 'name': 'fora da especificação',
         'x': np.round(x[~dentro0], 3).tolist(), 'y': np.round(y0[~dentro0], 3).tolist(),
         'line': {'color': '@bad', 'width': 2},
         'fillcolor': 'rgba(166,58,46,.3)',
         'hovertemplate': 'diâmetro %{x:.3f} mm<extra>não conforme</extra>'},
        {'type': 'scatter', 'mode': 'lines', 'name': 'média',
         'x': [mu0, mu0], 'y': [0, float(norm_pdf(np.array([mu0]), mu0, sigma)[0])],
         'line': {'color': '@good', 'width': 2.5, 'dash': 'dot'},
         'hovertemplate': 'média do processo<extra></extra>'},
    ]

    layout = {
        'title': {'text': 'Estúdio de capabilidade — arraste a média e veja o Cpk responder'},
        'xaxis': ax('Diâmetro do eixo (mm)', range=[34.2, 35.8]),
        'yaxis': ax('Densidade', rangemode='tozero', showticklabels=False),
        'showlegend': False,
        'hovermode': 'x unified',
        'margin': {'l': 46, 'r': 26, 't': 56, 'b': 132},
        'shapes': [
            _vline(LIE, '@bad'), _vline(LSE, '@bad'),
            _vline(alvo, '@ink-3', dash='dash', width=1.4),
        ],
        'annotations': [
            _ann('<b>Cp 1.41</b>   ·   <b>Cpk 1.41</b>   ·   66 PPM fora', 'ok'),
            {'x': LIE, 'y': 1.035, 'yref': 'paper', 'text': 'LIE 34,50', 'showarrow': False,
             'font': {'size': 11, 'color': '@bad'}},
            {'x': LSE, 'y': 1.035, 'yref': 'paper', 'text': 'LSE 35,50', 'showarrow': False,
             'font': {'size': 11, 'color': '@bad'}},
            {'x': alvo, 'y': 1.035, 'yref': 'paper', 'text': 'alvo 35,00', 'showarrow': False,
             'font': {'size': 10.5, 'color': '@ink-3'}},
        ],
        'sliders': [{
            'active': i0, 'y': -0.30, 'x': 0.04, 'len': 0.92,
            'currentvalue': {'prefix': 'Média do processo:  ', 'suffix': ' mm',
                             'font': {'size': 13}},
            'pad': {'t': 26, 'b': 10},
            'steps': steps,
        }],
    }
    reg('cap-studio', data, layout)
    FIGS['cap-studio']['layout']['_frames'] = None
    FIGS['cap-studio']['frames'] = frames


def _vline(x, color, dash='solid', width=2):
    return {'type': 'line', 'x0': x, 'x1': x, 'y0': 0, 'y1': 1, 'yref': 'paper',
            'line': {'color': color, 'width': width, 'dash': dash}}


def _ann(text, kind):
    col = {'ok': '@good', 'warn': '@warn', 'bad': '@bad'}[kind]
    return {'x': 0.015, 'y': 0.98, 'xref': 'paper', 'yref': 'paper', 'text': text,
            'showarrow': False, 'font': {'size': 14.5, 'color': col},
            'xanchor': 'left', 'yanchor': 'top', 'align': 'left',
            'bgcolor': 'rgba(255,255,255,.72)', 'borderpad': 5}


def fig_cp_vs_cpk():
    """Quatro processos com o mesmo Cp e Cpk muito diferentes."""
    LIE, LSE = 9.0, 11.0
    casos = [
        ('A — centrado e capaz', 10.00, 0.20, '@series-1'),
        ('B — descentrado', 10.42, 0.20, '@series-2'),
        ('C — disperso', 10.00, 0.33, '@series-3'),
        ('D — descentrado e disperso', 10.38, 0.33, '@series-4'),
    ]
    x = np.linspace(8.6, 11.6, 200)
    data = []
    for i, (nome, mu, s, cor) in enumerate(casos):
        Cp = (LSE - LIE) / (6 * s)
        Cpk = min(LSE - mu, mu - LIE) / (3 * s)
        ppm = (norm_cdf(np.array([(LIE - mu) / s]))[0] +
               1 - norm_cdf(np.array([(LSE - mu) / s]))[0]) * 1e6
        data.append({
            'type': 'scatter', 'mode': 'lines', 'name': nome,
            'x': np.round(x, 3).tolist(), 'y': np.round(norm_pdf(x, mu, s), 4).tolist(),
            'line': {'color': cor, 'width': 2.2},
            'hovertemplate': (f'<b>{nome}</b><br>µ = {mu:.2f} · σ = {s:.2f}<br>'
                              f'Cp {Cp:.2f} · <b>Cpk {Cpk:.2f}</b><br>'
                              f'{ppm:,.0f} PPM fora de especificação'.replace(',', ' ') +
                              '<extra></extra>'),
        })
    layout = {
        'title': {'text': 'Mesmo Cp não significa mesmo Cpk — passe o rato em cada curva'},
        'xaxis': ax('Característica medida', range=[8.6, 11.6]),
        'yaxis': ax('Densidade', showticklabels=False, rangemode='tozero'),
        'legend': {'orientation': 'h', 'y': -0.22, 'x': 0},
        'margin': {'l': 46, 'r': 26, 't': 52, 'b': 96},
        'shapes': [_vline(LIE, '@bad'), _vline(LSE, '@bad')],
        'annotations': [
            {'x': LIE, 'y': 1.04, 'yref': 'paper', 'text': 'LIE', 'showarrow': False,
             'font': {'size': 11, 'color': '@bad'}},
            {'x': LSE, 'y': 1.04, 'yref': 'paper', 'text': 'LSE', 'showarrow': False,
             'font': {'size': 11, 'color': '@bad'}},
        ],
    }
    reg('cap-cp-vs-cpk', data, layout)


def fig_cpk_ppm():
    """Cpk -> PPM (escala log). A curva que justifica o 1,33 e o 1,67."""
    cpk = np.linspace(0.3, 2.2, 260)
    ppm_uni = (1 - norm_cdf(3 * cpk)) * 1e6
    marcos = [(1.00, 'Cpk 1,00\nmínimo histórico'), (1.33, 'Cpk 1,33\nrequisito típico do cliente'),
              (1.67, 'Cpk 1,67\nautomóvel / crítico'), (2.00, 'Cpk 2,00\n"seis sigma"')]
    data = [{
        'type': 'scatter', 'mode': 'lines', 'name': 'PPM (cauda única)',
        'x': cpk.tolist(), 'y': ppm_uni.tolist(),
        'line': {'color': '@series-1', 'width': 2.6},
        'hovertemplate': 'Cpk %{x:.2f}<br><b>%{y:,.1f} PPM</b> fora do lado crítico<extra></extra>',
    }]
    xs = [m[0] for m in marcos]
    ys = [(1 - norm_cdf(np.array([3 * m[0]]))[0]) * 1e6 for m in marcos]
    data.append({
        'type': 'scatter', 'mode': 'markers+text', 'name': 'referências',
        'x': xs, 'y': ys, 'text': ['1,00', '1,33', '1,67', '2,00'],
        'textposition': 'top right', 'textfont': {'size': 11, 'color': '@ink-3'},
        'marker': {'size': 11, 'color': '@series-2',
                   'line': {'color': '@surface-1', 'width': 2}},
        'customdata': [[m[1].replace('\n', ' — ')] for m in marcos],
        'hovertemplate': '<b>%{customdata[0]}</b><br>%{y:,.1f} PPM<extra></extra>',
    })
    layout = {
        'title': {'text': 'Porque é que 1,33 não é um número arbitrário'},
        'xaxis': ax('Cpk', range=[0.3, 2.2], dtick=0.25),
        'yaxis': ax('Peças fora de especificação (PPM)', type='log',
                      range=[-3.4, 5.6]),
        'showlegend': False,
        'margin': {'l': 74, 'r': 26, 't': 52, 'b': 54},
    }
    reg('cap-cpk-ppm', data, layout)


def fig_cpk_heat():
    """Mapa de Cpk em funcao de centragem e dispersao."""
    desloc = np.linspace(-0.5, 0.5, 41)      # (mu - alvo) / (metade da tolerancia)
    disp = np.linspace(0.10, 0.60, 41)       # sigma / (metade da tolerancia)
    Z = np.zeros((len(disp), len(desloc)))
    for i, s in enumerate(disp):
        for j, d in enumerate(desloc):
            Z[i, j] = round((1 - abs(d)) / (3 * s), 3)
    data = [{
        'type': 'contour', 'x': desloc.tolist(), 'y': disp.tolist(), 'z': Z.tolist(),
        'colorscale': [[0, '#8b2f26'], [0.18, '#c07a2c'], [0.33, '#c9a227'],
                       [0.5, '#4f9a78'], [0.75, '#1c7d78'], [1, '#0c4d5e']],
        'contours': {'start': 0.4, 'end': 2.4, 'size': 0.2,
                     'showlabels': True,
                     'labelfont': {'size': 10, 'color': '#ffffff'}},
        'colorbar': {'title': {'text': 'Cpk', 'side': 'right'}, 'thickness': 14, 'len': 0.9},
        'hovertemplate': ('desvio do alvo: %{x:.2f} × meia-tolerância<br>'
                          'dispersão: σ = %{y:.2f} × meia-tolerância<br>'
                          '<b>Cpk = %{z:.2f}</b><extra></extra>'),
    }]
    layout = {
        'title': {'text': 'Onde ganhar Cpk: centrar ou reduzir variação?'},
        'xaxis': ax('Descentragem  (µ − alvo) ÷ meia-tolerância'),
        'yaxis': ax('Dispersão  σ ÷ meia-tolerância'),
        'margin': {'l': 78, 'r': 20, 't': 52, 'b': 60},
        'annotations': [
            {'x': 0, 'y': 0.25, 'text': 'Cpk 1,33', 'showarrow': True, 'arrowhead': 0,
             'ax': 40, 'ay': -30, 'font': {'size': 11, 'color': '#ffffff'},
             'arrowcolor': '#ffffff', 'bgcolor': 'rgba(0,0,0,.35)', 'borderpad': 3},
        ],
    }
    reg('cap-cpk-heat', data, layout)


def fig_pp_vs_cp_run():
    """Serie temporal que separa variacao de curto e de longo prazo."""
    rng = np.random.default_rng(11)
    n = 120
    turno = np.repeat(np.arange(4), 30)
    offset = np.array([0.0, 0.10, -0.06, 0.16])[turno]
    x = 35.0 + offset + rng.normal(0, 0.09, n)
    MR = np.abs(np.diff(x))
    s_curto = MR.mean() / 1.128
    s_longo = x.std(ddof=1)
    LIE, LSE = 34.5, 35.5
    Cpk = min(LSE - x.mean(), x.mean() - LIE) / (3 * s_curto)
    Ppk = min(LSE - x.mean(), x.mean() - LIE) / (3 * s_longo)
    cores = ['@series-1', '@series-2', '@series-3', '@series-4']
    data = []
    for t in range(4):
        m = turno == t
        data.append({
            'type': 'scatter', 'mode': 'markers+lines', 'name': f'Turno {t+1}',
            'x': (np.arange(n)[m] + 1).tolist(), 'y': x[m].round(4).tolist(),
            'line': {'color': cores[t], 'width': 1.2},
            'marker': {'size': 6, 'color': cores[t]},
            'hovertemplate': f'Turno {t+1}<br>obs %{{x}}<br><b>%{{y:.3f}} mm</b><extra></extra>',
        })
    layout = {
        'title': {'text': f'Cpk {Cpk:.2f} vs Ppk {Ppk:.2f} — a diferença tem nome: turno'},
        'xaxis': ax('Observação'),
        'yaxis': ax('Diâmetro (mm)'),
        'legend': {'orientation': 'h', 'y': -0.22, 'x': 0},
        'margin': {'l': 60, 'r': 26, 't': 52, 'b': 90},
        'shapes': [
            {'type': 'line', 'x0': 0, 'x1': 1, 'xref': 'paper', 'y0': float(x.mean()),
             'y1': float(x.mean()), 'line': {'color': '@ink-3', 'width': 1.4, 'dash': 'dash'}},
        ],
    }
    reg('cap-curto-longo', data, layout)


# =============================================================================
# MAPEAMENTO DE PROCESSOS
# =============================================================================
def fig_spaghetti():
    """Diagrama de esparguete: percurso do operador antes e depois."""
    postos = {
        'Armazém': (3.2, 26.9), 'Corte': (10.2, 24.3), 'Prensa': (20.5, 25.3),
        'Bancada': (12.8, 16.0), 'Rebarba': (25.6, 17.9), 'Lavagem': (6.4, 9.6),
        'Inspeção': (23.0, 8.3), 'Embalagem': (30.1, 27.5), 'Expedição': (30.7, 4.5),
    }
    antes = ['Armazém', 'Corte', 'Bancada', 'Prensa', 'Bancada', 'Rebarba', 'Lavagem',
             'Bancada', 'Inspeção', 'Lavagem', 'Embalagem', 'Bancada', 'Expedição']
    depois = ['Armazém', 'Corte', 'Prensa', 'Rebarba', 'Lavagem', 'Inspeção',
              'Embalagem', 'Expedição']

    def dist(seq):
        d = 0
        for a, b in zip(seq, seq[1:]):
            (x1, y1), (x2, y2) = postos[a], postos[b]
            d += math.hypot(x2 - x1, y2 - y1)
        return d  # coordenadas ja em metros

    da, dd = dist(antes), dist(depois)
    data = []
    for seq, nome, cor, largura, dash in (
            (antes, f'Estado atual — {da:.0f} m/peça', '@bad', 2.0, 'solid'),
            (depois, f'Estado futuro — {dd:.0f} m/peça', '@series-1', 2.6, 'solid')):
        xs = [postos[p][0] for p in seq]
        ys = [postos[p][1] for p in seq]
        data.append({
            'type': 'scatter', 'mode': 'lines', 'name': nome,
            'x': xs, 'y': ys, 'line': {'color': cor, 'width': largura, 'dash': dash,
                                       'shape': 'spline', 'smoothing': 0.7},
            'opacity': 0.85,
            'text': [f'{i+1}. {p}' for i, p in enumerate(seq)],
            'hovertemplate': '%{text}<extra>' + nome + '</extra>',
        })
    data.append({
        'type': 'scatter', 'mode': 'markers', 'name': 'postos',
        'x': [p[0] for p in postos.values()], 'y': [p[1] for p in postos.values()],
        'text': list(postos),
        'marker': {'size': 21, 'color': '@surface-2', 'symbol': 'square',
                   'line': {'color': '@ink-3', 'width': 1.8}},
        'hovertemplate': '<b>%{text}</b><extra>posto de trabalho</extra>',
    })
    data.append({
        'type': 'scatter', 'mode': 'text', 'name': 'rótulos', 'showlegend': False,
        'x': [p[0] for p in postos.values()],
        'y': [p[1] - 2.6 for p in postos.values()],
        'text': list(postos), 'textposition': 'bottom center',
        'textfont': {'size': 11.5, 'color': '@ink-2'},
        'hoverinfo': 'skip',
    })
    layout = {
        'title': {'text': f'Diagrama de esparguete — {(1-dd/da)*100:.0f}% menos deslocação'},
        'xaxis': ax(None, visible=False, range=[0, 34],
                      scaleanchor='y', scaleratio=1),
        'yaxis': ax(None, visible=False, range=[1.0, 31]),
        'legend': {'orientation': 'h', 'y': -0.06, 'x': 0},
        'margin': {'l': 16, 'r': 16, 't': 52, 'b': 56},
        'plot_bgcolor': 'rgba(0,0,0,0)',
    }
    reg('map-esparguete', data, layout)


def fig_va_nva():
    """Barra empilhada: onde esta o tempo num fluxo administrativo (Makigami)."""
    etapas = ['Receção do<br>pedido', 'Análise de<br>crédito', 'Aprovação<br>comercial',
              'Planeamento', 'Emissão da<br>ordem', 'Confirmação<br>ao cliente']
    va = [4, 12, 6, 18, 9, 3]                      # minutos de valor acrescentado
    nva = [2, 8, 5, 11, 4, 2]                      # trabalho sem valor mas necessario
    espera = [35, 480, 1440, 240, 60, 120]         # minutos de espera
    data = [
        {'type': 'bar', 'name': 'Valor acrescentado', 'x': etapas, 'y': va,
         'marker': {'color': '@series-1', 'line': {'color': '@surface-1', 'width': 2}},
         'hovertemplate': '<b>%{x}</b><br>Valor acrescentado: %{y} min<extra></extra>'},
        {'type': 'bar', 'name': 'Necessário sem valor', 'x': etapas, 'y': nva,
         'marker': {'color': '@series-4', 'line': {'color': '@surface-1', 'width': 2}},
         'hovertemplate': '<b>%{x}</b><br>Necessário sem valor: %{y} min<extra></extra>'},
        {'type': 'bar', 'name': 'Espera', 'x': etapas, 'y': espera,
         'marker': {'color': '@ink-3', 'line': {'color': '@surface-1', 'width': 2}},
         'hovertemplate': '<b>%{x}</b><br>Espera: %{y} min (%{customdata} h)<extra></extra>',
         'customdata': [round(e / 60, 1) for e in espera]},
    ]
    tot_va, tot = sum(va), sum(va) + sum(nva) + sum(espera)
    layout = {
        'title': {'text': f'Makigami — rácio de valor acrescentado: '
                          f'{tot_va/tot*100:.1f}%  ({tot_va} min úteis em {tot/60:.0f} h)'},
        'barmode': 'group', 'bargap': 0.3, 'bargroupgap': 0.08,
        'xaxis': ax(''),
        'yaxis': ax('Minutos por pedido — escala logarítmica', type='log', dtick=1),
        'legend': {'orientation': 'h', 'y': -0.18, 'x': 0},
        'margin': {'l': 66, 'r': 24, 't': 56, 'b': 96},
    }
    reg('map-va-nva', data, layout)


def fig_handoffs():
    """Handoffs e pontos de decisao antes/depois — a metrica que ninguem extrai."""
    proc = ['Tratamento<br>de NC', 'Pedido de<br>compra', 'Alteração de<br>engenharia',
            'Reclamação<br>de cliente', 'Libertação<br>de lote']
    ha, hd = [14, 11, 19, 16, 9], [6, 4, 9, 7, 4]
    data = [
        {'type': 'bar', 'name': 'Estado atual', 'x': proc, 'y': ha, 'orientation': 'v',
         'marker': {'color': '@ink-3', 'line': {'color': '@surface-1', 'width': 2}},
         'hovertemplate': '<b>%{x}</b><br>Estado atual: %{y} handoffs<extra></extra>'},
        {'type': 'bar', 'name': 'Estado futuro', 'x': proc, 'y': hd,
         'marker': {'color': '@series-1', 'line': {'color': '@surface-1', 'width': 2}},
         'customdata': [[round((1 - d / a) * 100) for a, d in zip(ha, hd)]],
         'hovertemplate': '<b>%{x}</b><br>Estado futuro: %{y} handoffs<extra></extra>'},
    ]
    layout = {
        'title': {'text': 'Handoffs por processo — conte-os no mapa, é a métrica mais barata'},
        'barmode': 'group', 'bargap': 0.32, 'bargroupgap': 0.12,
        'xaxis': ax(''),
        'yaxis': ax('Transferências entre lanes'),
        'legend': {'orientation': 'h', 'y': -0.16, 'x': 0},
        'margin': {'l': 62, 'r': 24, 't': 52, 'b': 92},
    }
    reg('map-handoffs', data, layout)


def fig_ferramenta_matriz():
    """Matriz de escolha da ferramenta de mapeamento: esforco x profundidade."""
    ferr = [
        ('SIPOC', 1.0, 1.2, 'Fronteiras do processo em 1 página. 30 minutos com a equipa.'),
        ('Fluxograma', 2.0, 2.4, 'Sequência de passos. Rápido, mas sem gramática formal.'),
        ('Diagrama de esparguete', 2.4, 3.0, 'Deslocação física de pessoa ou peça no layout.'),
        ('Diagrama de tartaruga', 2.6, 3.4, 'Vista de sistema: entradas, saídas, com quê, com quem, como, indicadores.'),
        ('Swimlane', 3.4, 4.2, 'Quem faz o quê. Expõe os handoffs.'),
        ('Makigami', 4.2, 5.4, 'Processos administrativos: tempo, papel e espera camada a camada.'),
        ('BPMN 2.0', 5.6, 7.4, 'Semântica de execução sem ambiguidade. Base para automação.'),
        ('VSM', 6.2, 6.8, 'Material + informação + tempo. A ferramenta-mãe do Lean.'),
    ]
    data = [{
        'type': 'scatter', 'mode': 'markers+text',
        'x': [f[1] for f in ferr], 'y': [f[2] for f in ferr],
        'text': [f[0] for f in ferr], 'textposition': 'top center',
        'textfont': {'size': 11.5, 'color': '@ink-2'},
        'marker': {'size': [22, 22, 22, 22, 26, 26, 30, 30],
                   'color': ['@series-3', '@series-3', '@series-4', '@series-4',
                             '@series-1', '@series-2', '@series-1', '@series-2'],
                   'opacity': 0.85, 'line': {'color': '@surface-1', 'width': 2}},
        'customdata': [[f[3]] for f in ferr],
        'hovertemplate': '<b>%{text}</b><br>%{customdata[0]}<extra></extra>',
    }]
    layout = {
        'title': {'text': 'Qual ferramenta de mapeamento usar — passe o rato em cada bolha'},
        'xaxis': ax('Esforço para construir  →', range=[0, 7.4],
                      showticklabels=False),
        'yaxis': ax('Profundidade da informação  →', range=[0, 8.6],
                      showticklabels=False),
        'showlegend': False,
        'margin': {'l': 56, 'r': 26, 't': 52, 'b': 56},
    }
    reg('map-matriz', data, layout)


# =============================================================================
# VOZ DO CLIENTE
# =============================================================================
def fig_voc_pareto():
    """Pareto de reclamacoes: 100 reclamacoes de uma fabrica de embalagens."""
    causas = ['Embalagem\ndanificada', 'Atraso', 'Quantidade\nincorreta',
              'Documentação', 'Outros']
    n = [42, 27, 15, 9, 7]
    total = sum(n)
    cum = np.cumsum(n) / total * 100
    cores = ['@bad', '@warn', '@series-4', '@series-3', '@ink-3']
    data = [
        {'type': 'bar', 'name': 'Reclamações', 'x': causas, 'y': n,
         'marker': {'color': cores}, 'yaxis': 'y',
         'text': [str(v) for v in n], 'textposition': 'outside',
         'hovertemplate': '<b>%{x}</b><br>%{y} reclamações<extra></extra>'},
        {'type': 'scatter', 'mode': 'lines+markers', 'name': '% acumulado',
         'x': causas, 'y': np.round(cum, 1).tolist(), 'yaxis': 'y2',
         'line': {'color': '@series-1', 'width': 2.4},
         'marker': {'size': 7, 'color': '@series-1'},
         'hovertemplate': '<b>%{x}</b><br>%{y:.0f}% acumulado<extra></extra>'},
    ]
    layout = {
        'title': {'text': 'Pareto de 100 reclamações — 69% vêm de duas causas'},
        'xaxis': ax(''),
        'yaxis': ax('Nº de reclamações', range=[0, 46]),
        'yaxis2': ax('% acumulado', overlaying='y', side='right',
                     range=[0, 105], showgrid=False, ticksuffix='%'),
        'showlegend': False,
        'margin': {'l': 54, 'r': 54, 't': 52, 'b': 54},
        'shapes': [{'type': 'line', 'x0': 0, 'x1': 1, 'xref': 'paper',
                    'y0': 80, 'y1': 80, 'yref': 'y2',
                    'line': {'color': '@ink-3', 'width': 1.2, 'dash': 'dot'}}],
        'annotations': [{'x': 0.01, 'y': 83.5, 'xref': 'paper', 'yref': 'y2',
                         'text': 'linha dos 80%', 'showarrow': False, 'xanchor': 'left',
                         'font': {'size': 10, 'color': '@ink-3'}}],
    }
    reg('voc-pareto', data, layout)


def fig_voc_dimensoes():
    """Satisfacao decomposta por dimensao da experiencia."""
    dims = ['Documentação', 'Prazo', 'Pós-venda', 'Flexibilidade',
            'Atendimento', 'Qualidade']
    notas = [6.9, 7.1, 7.4, 8.1, 8.8, 9.2]

    def cor(v):
        return '@bad' if v < 7.5 else ('@warn' if v < 8.5 else '@good')
    cores = [cor(v) for v in notas]
    data = [{
        'type': 'bar', 'orientation': 'h', 'x': notas, 'y': dims,
        'marker': {'color': cores},
        'text': [f'{v:.1f}' for v in notas], 'textposition': 'outside',
        'hovertemplate': '<b>%{y}</b><br>nota %{x:.1f} / 10<extra></extra>',
    }]
    layout = {
        'title': {'text': 'Satisfação geral 7,9 — mas decomposta conta outra história'},
        'xaxis': ax('Nota média (0–10)', range=[0, 10.6]),
        'yaxis': ax(''),
        'showlegend': False,
        'margin': {'l': 118, 'r': 34, 't': 52, 'b': 46},
        'shapes': [{'type': 'line', 'x0': 7.9, 'x1': 7.9, 'y0': 0, 'y1': 1,
                    'yref': 'paper', 'line': {'color': '@ink-3', 'width': 1.4,
                                              'dash': 'dash'}}],
        'annotations': [{'x': 7.9, 'y': 1.05, 'yref': 'paper', 'showarrow': False,
                         'text': 'média geral 7,9', 'font': {'size': 10.5, 'color': '@ink-3'}}],
    }
    reg('voc-dimensoes', data, layout)


def fig_voc_antes_depois():
    """PPM, OTIF e satisfacao antes/depois do projeto DMAIC + Lean."""
    metricas = ['PPM<br>(menor é melhor)', 'OTIF %', 'Satisfação /10']
    antes = [850, 91, 7.3]
    depois = [180, 98.7, 9.0]
    # normalizado para 0-100 para caber no mesmo eixo, com texto real no hover
    antes_n = [100, 91, 73]
    depois_n = [180/850*100, 98.7, 90]
    antes_txt = ['850 ppm', '91,0%', '7,3']
    depois_txt = ['180 ppm', '98,7%', '9,0']
    data = [
        {'type': 'bar', 'name': 'Antes', 'x': metricas, 'y': antes_n,
         'marker': {'color': '@ink-3'}, 'customdata': antes,
         'text': antes_txt, 'textposition': 'outside',
         'textfont': {'size': 12, 'color': '@ink-2'},
         'hovertemplate': '<b>%{x}</b><br>Antes: %{customdata}<extra></extra>'},
        {'type': 'bar', 'name': 'Depois', 'x': metricas, 'y': depois_n,
         'marker': {'color': '@good'}, 'customdata': depois,
         'text': depois_txt, 'textposition': 'outside',
         'textfont': {'size': 12, 'color': '@good'},
         'hovertemplate': '<b>%{x}</b><br>Depois: %{customdata}<extra></extra>'},
    ]
    layout = {
        'title': {'text': 'Antes / depois do ciclo VoC → DMAIC → Lean → nova VoC'},
        'barmode': 'group', 'bargap': 0.35, 'bargroupgap': 0.12,
        'xaxis': ax(''),
        'yaxis': ax('', showticklabels=False, range=[0, 205]),
        'legend': {'orientation': 'h', 'y': -0.16, 'x': 0},
        'margin': {'l': 30, 'r': 20, 't': 52, 'b': 74},
    }
    reg('voc-antes-depois', data, layout)


# =============================================================================
# OEE AVANCADO
# =============================================================================
def fig_oee_waterfall():
    """Cascata de perdas do OEE num turno de 480 minutos.

    Implementada com barras + `base` (em vez do trace 'waterfall') porque o bundle
    cartesian do Plotly usado no site nao inclui o modulo waterfall/scatterpolar.
    """
    x = ['Tempo<br>planejado', 'Perda de<br>disponibilidade', 'Perda de<br>performance',
         'Perda de<br>qualidade', 'Tempo totalmente<br>produtivo']
    cum0 = 480
    cum1 = cum0 - 60
    cum2 = cum1 - 20
    cum3 = cum2 - 40  # == 360, confere com o total final
    y = [480, 60, 20, 40, 360]
    base = [0, cum1, cum2, cum3, 0]
    cores = ['@series-1', '@bad', '@bad', '@bad', '@good']
    hover = [
        'Tempo planejado do turno<br><b>480 min</b>',
        'Paradas não planejadas (quebras, falta de material)<br><b>-60 min</b> · Disponibilidade 87,5%',
        'Microparadas e redução de velocidade<br><b>-20 min</b> · Performance 95,2%',
        'Refugo e retrabalho (40 de 400 peças)<br><b>-40 min</b> · Qualidade 90,0%',
        'Tempo totalmente produtivo<br><b>360 min · OEE 75,0%</b>',
    ]
    data = [{
        'type': 'bar', 'x': x, 'y': y, 'base': base,
        'marker': {'color': cores, 'line': {'color': '@surface-1', 'width': 1.5}},
        'text': ['480', '-60', '-20', '-40', '360'],
        'textposition': 'outside',
        'hovertext': hover, 'hoverinfo': 'text',
    }]
    layout = {
        'title': {'text': 'Para onde foram os 120 minutos? — a cascata do OEE (turno de 480 min, OEE 75%)'},
        'xaxis': ax(''),
        'yaxis': ax('Minutos do turno', range=[0, 520]),
        'showlegend': False,
        'margin': {'l': 60, 'r': 24, 't': 52, 'b': 60},
    }
    reg('oee-waterfall', data, layout)


def fig_oee_sku():
    """OEE agregado semanal vs decomposicao por SKU — a media esconde a instabilidade."""
    x = ['Agregado<br>semanal', 'SKU A', 'SKU B', 'SKU C', 'SKU D']
    y = [73, 65, 83, 60, 74]
    cores = ['@ink-3', '@bad', '@warn', '@bad', '@warn']
    causas = [
        'Disponibilidade 89% × Performance 84% × Qualidade 97% — o número que vai ao relatório',
        'Gap de velocidade: 234 de 300 un/min esperadas · 1 quebra · 9 microparadas',
        'Scrap concentrado: 675 kg de refugo, desvio de cor e dimensão',
        'Ramp-up longo após changeover: 63%→79% ao longo de 3 horas · 9 microparadas',
        '3 quebras · 22 microparadas (box jam, troca de bobina, rasgo de plástico)',
    ]
    data = [{
        'type': 'bar', 'x': x, 'y': y,
        'marker': {'color': cores},
        'text': [f'{v}%' for v in y], 'textposition': 'outside',
        'customdata': causas,
        'hovertemplate': '<b>%{x}</b><br>OEE %{y}%<br>%{customdata}<extra></extra>',
    }]
    layout = {
        'title': {'text': 'OEE semanal 73% esconde quatro histórias diferentes'},
        'xaxis': ax(''),
        'yaxis': ax('OEE (%)', range=[0, 100]),
        'showlegend': False,
        'margin': {'l': 54, 'r': 24, 't': 52, 'b': 56},
        'shapes': [{'type': 'line', 'x0': 0, 'x1': 1, 'xref': 'paper', 'y0': 73, 'y1': 73,
                    'line': {'color': '@ink-3', 'width': 1.2, 'dash': 'dot'}}],
        'annotations': [{'x': 0.99, 'y': 76, 'xref': 'paper', 'text': 'média semanal 73%',
                         'showarrow': False, 'xanchor': 'right',
                         'font': {'size': 10.5, 'color': '@ink-3'}}],
    }
    reg('oee-sku', data, layout)


# =============================================================================
# 5S E GESTAO VISUAL
# =============================================================================
def fig_5s_radar():
    """Auditoria 5S por pilar: onde a disciplina cai primeiro.

    Barra horizontal (em vez de radar/scatterpolar) porque o bundle cartesian do
    Plotly usado no site nao inclui o modulo de graficos polares.
    """
    pilares = ['Sustain\n(Sustentar)', 'Shine\n(Limpar)', 'Sort\n(Separar)',
               'Standardize\n(Padronizar)', 'Set in Order\n(Ordenar)']
    atual = [58, 75, 78, 80, 82]

    def cor(v):
        return '@bad' if v < 70 else ('@warn' if v < 85 else '@good')
    cores = [cor(v) for v in atual]
    data = [{
        'type': 'bar', 'orientation': 'h', 'x': atual, 'y': pilares,
        'marker': {'color': cores},
        'text': [f'{v}/100' for v in atual], 'textposition': 'outside',
        'hovertemplate': '<b>%{y}</b><br>%{x}/100<extra></extra>',
    }]
    layout = {
        'title': {'text': 'Auditoria 5S por pilar — Sustain é sempre o elo mais fraco'},
        'xaxis': ax('Pontuação da auditoria (0–100)', range=[0, 112]),
        'yaxis': ax(''),
        'showlegend': False,
        'margin': {'l': 116, 'r': 30, 't': 52, 'b': 46},
        'shapes': [{'type': 'line', 'x0': 90, 'x1': 90, 'y0': 0, 'y1': 1, 'yref': 'paper',
                    'line': {'color': '@ink-3', 'width': 1.4, 'dash': 'dash'}}],
        'annotations': [{'x': 90, 'y': 1.05, 'yref': 'paper', 'showarrow': False,
                         'text': 'meta 90', 'font': {'size': 10.5, 'color': '@ink-3'}}],
    }
    reg('5s-radar', data, layout)


def fig_5s_pareto():
    """Pareto de achados numa auditoria 5S."""
    causas = ['Itens fora\ndo lugar', 'Sujeira\nacumulada', 'Falta de\nidentificação',
              'Excesso de\nmaterial', 'Sem padrão\nvisual', 'Outros']
    n = [34, 22, 16, 11, 9, 6]
    total = sum(n)
    cum = np.cumsum(n) / total * 100
    cores = ['@bad', '@warn', '@series-4', '@series-3', '@series-2', '@ink-3']
    data = [
        {'type': 'bar', 'name': 'Achados', 'x': causas, 'y': n,
         'marker': {'color': cores}, 'yaxis': 'y',
         'text': [str(v) for v in n], 'textposition': 'outside',
         'hovertemplate': '<b>%{x}</b><br>%{y} achados<extra></extra>'},
        {'type': 'scatter', 'mode': 'lines+markers', 'name': '% acumulado',
         'x': causas, 'y': np.round(cum, 1).tolist(), 'yaxis': 'y2',
         'line': {'color': '@series-1', 'width': 2.4},
         'marker': {'size': 7, 'color': '@series-1'},
         'hovertemplate': '<b>%{x}</b><br>%{y:.0f}% acumulado<extra></extra>'},
    ]
    layout = {
        'title': {'text': 'Pareto de 98 achados numa auditoria 5S — onde focar primeiro'},
        'xaxis': ax(''),
        'yaxis': ax('Nº de achados', range=[0, 38]),
        'yaxis2': ax('% acumulado', overlaying='y', side='right',
                     range=[0, 105], showgrid=False, ticksuffix='%'),
        'showlegend': False,
        'margin': {'l': 54, 'r': 54, 't': 52, 'b': 60},
        'shapes': [{'type': 'line', 'x0': 0, 'x1': 1, 'xref': 'paper',
                    'y0': 80, 'y1': 80, 'yref': 'y2',
                    'line': {'color': '@ink-3', 'width': 1.2, 'dash': 'dot'}}],
        'annotations': [{'x': 0.01, 'y': 83.5, 'xref': 'paper', 'yref': 'y2',
                         'text': 'linha dos 80%', 'showarrow': False, 'xanchor': 'left',
                         'font': {'size': 10, 'color': '@ink-3'}}],
    }
    reg('5s-pareto', data, layout)


# =============================================================================
# RESOLUCAO ESTRUTURADA DE PROBLEMAS
# =============================================================================
def fig_capa_pareto():
    """Pareto de nao-conformidades antes de abrir um 8D."""
    causas = ['Material fora\nde especificação', 'Erro de\nsetup', 'Falha de\ntreino',
              'Desvio de\nprocedimento', 'Instrumento não\ncalibrado', 'Outros']
    n = [31, 24, 18, 13, 9, 5]
    total = sum(n)
    cum = np.cumsum(n) / total * 100
    cores = ['@bad', '@warn', '@series-4', '@series-3', '@series-2', '@ink-3']
    data = [
        {'type': 'bar', 'name': 'Não conformidades', 'x': causas, 'y': n,
         'marker': {'color': cores}, 'yaxis': 'y',
         'text': [str(v) for v in n], 'textposition': 'outside',
         'hovertemplate': '<b>%{x}</b><br>%{y} ocorrências<extra></extra>'},
        {'type': 'scatter', 'mode': 'lines+markers', 'name': '% acumulado',
         'x': causas, 'y': np.round(cum, 1).tolist(), 'yaxis': 'y2',
         'line': {'color': '@series-1', 'width': 2.4},
         'marker': {'size': 7, 'color': '@series-1'},
         'hovertemplate': '<b>%{x}</b><br>%{y:.0f}% acumulado<extra></extra>'},
    ]
    layout = {
        'title': {'text': 'Pareto de 100 não conformidades — onde investigar antes de abrir o 8D'},
        'xaxis': ax(''),
        'yaxis': ax('Nº de ocorrências', range=[0, 34]),
        'yaxis2': ax('% acumulado', overlaying='y', side='right',
                     range=[0, 105], showgrid=False, ticksuffix='%'),
        'showlegend': False,
        'margin': {'l': 54, 'r': 54, 't': 52, 'b': 60},
        'shapes': [{'type': 'line', 'x0': 0, 'x1': 1, 'xref': 'paper',
                    'y0': 80, 'y1': 80, 'yref': 'y2',
                    'line': {'color': '@ink-3', 'width': 1.2, 'dash': 'dot'}}],
        'annotations': [{'x': 0.01, 'y': 83.5, 'xref': 'paper', 'yref': 'y2',
                         'text': 'linha dos 80%', 'showarrow': False, 'xanchor': 'left',
                         'font': {'size': 10, 'color': '@ink-3'}}],
    }
    reg('capa-pareto', data, layout)


def fig_capa_recorrencia():
    """Correcao rapida vs causa raiz: recorrencia do mesmo problema em 6 meses."""
    meses = ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6']
    correcao = [8, 7, 9, 8, 7, 9]
    causa_raiz = [8, 5, 3, 1, 1, 0]
    data = [
        {'type': 'scatter', 'mode': 'lines+markers', 'name': 'Só correção (troca a peça)',
         'x': meses, 'y': correcao, 'line': {'color': '@bad', 'width': 2.4},
         'marker': {'size': 8, 'color': '@bad'},
         'hovertemplate': '<b>%{x}</b><br>%{y} recorrências<extra>correção</extra>'},
        {'type': 'scatter', 'mode': 'lines+markers', 'name': 'Ação corretiva (causa raiz)',
         'x': meses, 'y': causa_raiz, 'line': {'color': '@good', 'width': 2.4},
         'marker': {'size': 8, 'color': '@good'},
         'hovertemplate': '<b>%{x}</b><br>%{y} recorrências<extra>causa raiz</extra>'},
    ]
    layout = {
        'title': {'text': 'O mesmo problema, dois tratamentos — recorrência ao longo de 6 meses'},
        'xaxis': ax(''),
        'yaxis': ax('Recorrências no mês', range=[0, 10.5]),
        'legend': {'orientation': 'h', 'y': -0.18, 'x': 0},
        'margin': {'l': 50, 'r': 24, 't': 52, 'b': 70},
    }
    reg('capa-recorrencia', data, layout)


def build():
    fig_voc_pareto()
    fig_voc_dimensoes()
    fig_voc_antes_depois()
    fig_capability_studio()
    fig_cp_vs_cpk()
    fig_cpk_ppm()
    fig_cpk_heat()
    fig_pp_vs_cp_run()
    fig_spaghetti()
    fig_va_nva()
    fig_handoffs()
    fig_ferramenta_matriz()
    fig_oee_waterfall()
    fig_oee_sku()
    fig_5s_radar()
    fig_5s_pareto()
    fig_capa_pareto()
    fig_capa_recorrencia()
    return FIGS


if __name__ == '__main__':
    f = build()
    for k, v in f.items():
        print(f'{k:22s} {len(json.dumps(v))/1000:7.1f} kB   traces={len(v["data"])}')
    print('total', sum(len(json.dumps(v)) for v in f.values()) / 1000, 'kB')
