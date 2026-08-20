#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera o diagrama BPMN autoral do capitulo 40-A (SVG inline, sem dependencias)."""

W, H = 1240, 640
P = []


def add(s):
    P.append(s)


F = 'Segoe UI, Inter, system-ui, sans-serif'
C_TASK_F, C_TASK_S = '#e8f1f6', '#20627f'
C_GW_F, C_GW_S = '#fff6e0', '#c08a1e'
C_START_F, C_START_S = '#eaf6ea', '#3d8a3d'
C_END_F, C_END_S = '#fdeceb', '#b03a30'
C_POOL_S = '#8ea3ad'
C_LANE_F = '#f7fafb'
C_INK = '#12303c'
C_LINE = '#2b3f4a'


def wrap(text, per=17):
    words, lines, cur = text.split(), [], ''
    for w in words:
        if len(cur) + len(w) + 1 <= per:
            cur = (cur + ' ' + w).strip()
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def label(cx, cy, text, size=11, per=17, weight='400', color=C_INK):
    lines = wrap(text, per)
    y0 = cy - (len(lines) - 1) * (size + 2.4) / 2 + size * 0.36
    for i, ln in enumerate(lines):
        add(f'<text x="{cx}" y="{y0 + i*(size+2.4):.1f}" font-family="{F}" font-size="{size}" '
            f'font-weight="{weight}" fill="{color}" text-anchor="middle">{ln}</text>')


def task(x, y, w, h, text, tag=None):
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="7" fill="{C_TASK_F}" '
        f'stroke="{C_TASK_S}" stroke-width="1.7"/>')
    label(x + w / 2, y + h / 2, text, 11, 18)
    if tag:
        add(f'<text x="{x+7}" y="{y+13}" font-family="{F}" font-size="9.5" font-weight="700" '
            f'fill="{C_TASK_S}" opacity=".75">{tag}</text>')
    return (x, y, w, h)


def gateway(cx, cy, kind='x', s=23):
    add(f'<path d="M{cx-s},{cy} L{cx},{cy-s} L{cx+s},{cy} L{cx},{cy+s} Z" fill="{C_GW_F}" '
        f'stroke="{C_GW_S}" stroke-width="1.7"/>')
    if kind == 'x':
        d = s * 0.42
        add(f'<path d="M{cx-d},{cy-d} L{cx+d},{cy+d} M{cx+d},{cy-d} L{cx-d},{cy+d}" '
            f'stroke="#8a6112" stroke-width="2.4" stroke-linecap="round" fill="none"/>')
    else:
        d = s * 0.5
        add(f'<path d="M{cx-d},{cy} L{cx+d},{cy} M{cx},{cy-d} L{cx},{cy+d}" '
            f'stroke="#8a6112" stroke-width="2.4" stroke-linecap="round" fill="none"/>')


def start_ev(cx, cy, r=18):
    add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{C_START_F}" stroke="{C_START_S}" stroke-width="2"/>')


def end_ev(cx, cy, r=18, kind=None):
    add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{C_END_F}" stroke="{C_END_S}" stroke-width="3.6"/>')
    if kind == 'esc':
        add(f'<path d="M{cx},{cy-8} L{cx+6},{cy+7} L{cx},{cy+1} L{cx-6},{cy+7} Z" fill="#b03a30"/>')


def timer_boundary(cx, cy, r=13):
    add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fff" stroke="{C_GW_S}" stroke-width="1.8"/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="{r-3.4}" fill="none" stroke="{C_GW_S}" stroke-width="1.5"/>')
    add(f'<path d="M{cx},{cy-5.5} L{cx},{cy} L{cx+4},{cy+2.5}" stroke="#8a6112" stroke-width="1.6" '
        f'fill="none" stroke-linecap="round"/>')


def seq(pts, text=None, tx=None, ty=None, dash=False):
    d = 'M' + ' L'.join(f'{x},{y}' for x, y in pts)
    da = 'stroke-dasharray="8 5" ' if dash else ''
    add(f'<path d="{d}" fill="none" stroke="{C_LINE}" stroke-width="1.9" '
        f'{da}marker-end="url(#ar)"/>')
    if text:
        add(f'<rect x="{tx-len(text)*3.2-4}" y="{ty-10}" width="{len(text)*6.4+8}" height="15" '
            f'rx="3" fill="#fff" opacity=".92"/>')
        add(f'<text x="{tx}" y="{ty+1.5}" font-family="{F}" font-size="10" fill="#3b5560" '
            f'text-anchor="middle">{text}</text>')


def msg(pts, text=None, tx=None, ty=None):
    d = 'M' + ' L'.join(f'{x},{y}' for x, y in pts)
    add(f'<circle cx="{pts[0][0]}" cy="{pts[0][1]}" r="4" fill="#fff" stroke="{C_LINE}" stroke-width="1.5"/>')
    add(f'<path d="{d}" fill="none" stroke="{C_LINE}" stroke-width="1.6" stroke-dasharray="7 5" '
        f'marker-end="url(#aro)"/>')
    if text:
        add(f'<text x="{tx}" y="{ty}" font-family="{F}" font-size="9.8" fill="#3b5560" '
            f'text-anchor="middle">{text}</text>')


# ---------------------------------------------------------------- desenho ----
add(f'<rect width="{W}" height="{H}" fill="#fbfcfd"/>')

# pool Fabrica
add(f'<rect x="10" y="10" width="1220" height="490" fill="none" stroke="{C_POOL_S}" stroke-width="2"/>')
add(f'<rect x="10" y="10" width="30" height="490" fill="#e6edf0" stroke="{C_POOL_S}" stroke-width="2"/>')
add(f'<text x="25" y="235" font-family="{F}" font-size="12.5" font-weight="700" fill="{C_INK}" '
    f'text-anchor="middle" transform="rotate(-90 25 235)">Fábrica  (pool)</text>')

# lanes
add(f'<rect x="40" y="10" width="1190" height="140" fill="{C_LANE_F}" stroke="{C_POOL_S}" stroke-width="1.2"/>')
add(f'<rect x="40" y="150" width="1190" height="350" fill="#fff" stroke="{C_POOL_S}" stroke-width="1.2"/>')
add(f'<rect x="40" y="10" width="26" height="140" fill="#eef3f5" stroke="{C_POOL_S}" stroke-width="1.2"/>')
add(f'<rect x="40" y="150" width="26" height="350" fill="#eef3f5" stroke="{C_POOL_S}" stroke-width="1.2"/>')
add(f'<text x="53" y="80" font-family="{F}" font-size="11" font-weight="600" fill="#41606d" '
    f'text-anchor="middle" transform="rotate(-90 53 80)">Produção</text>')
add(f'<text x="53" y="325" font-family="{F}" font-size="11" font-weight="600" fill="#41606d" '
    f'text-anchor="middle" transform="rotate(-90 53 325)">Qualidade</text>')

# --- lane Producao
start_ev(112, 80)
label(112, 118, 'Peça reprovada na inspeção', 9.6, 22, color='#3a5560')
task(170, 52, 132, 56, 'Segregar e identificar a peça', 'A1')
task(800, 52, 132, 56, 'Executar ação corretiva', 'A6')

# --- lane Qualidade, fila principal
task(170, 197, 132, 56, 'Registar e classificar a NC', 'A2')
gateway(362, 225, 'x')
label(362, 181, 'Desvio aceitável?', 9.6, 20, color='#3a5560')
task(424, 197, 132, 56, 'Analisar causa-raiz', 'A3')
gateway(612, 225, '+')
task(662, 160, 130, 50, 'Avaliar lotes em curso', 'A4')
task(662, 240, 130, 50, 'Definir ação corretiva', 'A5')
gateway(858, 225, '+')
task(1000, 197, 120, 56, 'Verificar eficácia', 'A7')
end_ev(1185, 225)
label(1185, 262, 'NC fechada', 9.6, 14, color='#3a5560')

# --- ramo da concessao
task(424, 350, 150, 56, 'Pedir concessão ao cliente', 'A8')
timer_boundary(574, 406)
label(668, 450, '5 dias sem resposta', 9.4, 22, color='#8a6112')
end_ev(790, 466, 17, 'esc')
label(790, 494, 'Escalar', 9.4, 12, color='#3a5560')
end_ev(1010, 378, 17)
label(1010, 412, 'Fechada por concessão', 9.4, 14, color='#3a5560')

# pool cliente (black box)
add(f'<rect x="330" y="540" width="300" height="58" fill="#eceff1" stroke="{C_POOL_S}" stroke-width="2"/>')
add(f'<rect x="330" y="540" width="28" height="58" fill="#dde4e8" stroke="{C_POOL_S}" stroke-width="2"/>')
add(f'<text x="344" y="569" font-family="{F}" font-size="10.5" font-weight="700" fill="{C_INK}" '
    f'text-anchor="middle" transform="rotate(-90 344 569)">Cliente</text>')
add(f'<text x="500" y="565" font-family="{F}" font-size="11.5" font-weight="600" fill="#3b5560" '
    f'text-anchor="middle">pool fechada (black box)</text>')
add(f'<text x="500" y="581" font-family="{F}" font-size="9.6" fill="#63808d" '
    f'text-anchor="middle">o processo dele não nos pertence</text>')

# ---- fluxos de sequencia
seq([(130, 80), (170, 80)])
seq([(236, 108), (236, 197)])
seq([(302, 225), (339, 225)])
seq([(385, 225), (424, 225)], 'não (default)', 404, 254)
seq([(556, 225), (589, 225)])
seq([(612, 202), (612, 185), (662, 185)])
seq([(612, 248), (612, 265), (662, 265)])
seq([(792, 185), (835, 185), (835, 208)])
seq([(792, 265), (835, 265), (835, 242)])
seq([(858, 202), (858, 108)])
seq([(932, 80), (962, 80), (962, 225), (1000, 225)])
seq([(1120, 225), (1167, 225)])
# ramo sim
seq([(362, 248), (362, 378), (424, 378)], 'sim', 336, 316)
seq([(574, 378), (993, 378)])
seq([(574, 419), (574, 466), (773, 466)])

# ---- fluxos de mensagem
msg([(462, 406), (462, 540)], 'pedido', 432, 480)
msg([(524, 540), (524, 406)], 'resposta', 558, 480)

# ---- legenda
add(f'<text x="40" y="628" font-family="{F}" font-size="10" fill="#63808d">'
    f'Seta cheia = fluxo de sequência (só dentro da pool)   ·   '
    f'seta tracejada com círculo = fluxo de mensagem (única ligação permitida entre pools)   ·   '
    f'◇ com × = XOR   ·   ◇ com + = AND   ·   ⏱ na borda = evento de fronteira (temporizador)</text>')

svg = (f'<svg role="img" aria-label="Diagrama BPMN do processo de tratamento de nao conformidade, '
       f'com pool Fabrica dividida nas lanes Producao e Qualidade e uma pool fechada do Cliente" '
       f'viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" '
       f'style="width:100%;height:auto;display:block;min-width:760px">'
       f'<defs>'
       f'<marker id="ar" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto">'
       f'<path d="M0,0 L6.5,3 L0,6 Z" fill="{C_LINE}"/></marker>'
       f'<marker id="aro" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">'
       f'<path d="M0,0 L7,3 L0,6" fill="none" stroke="{C_LINE}" stroke-width="1.3"/></marker>'
       f'</defs>' + ''.join(P) + '</svg>')

print(svg)
