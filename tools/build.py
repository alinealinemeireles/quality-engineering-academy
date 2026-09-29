#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Pipeline: manual.ipynb -> site estatico (content/*.js)."""
import base64
import hashlib
import io
import json
import os
import re
import shutil
import sys

import markdown

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..'))
SITE = os.path.join(ROOT, 'site')
IMGDIR = os.path.join(SITE, 'assets', 'img')
CHDIR = os.path.join(SITE, 'content', 'ch')

sys.path.insert(0, HERE)
from curriculum import TRACKS, EXTRA_CHAPTERS  # noqa: E402
from parse import structure  # noqa: E402
import figures  # noqa: E402

MD = markdown.Markdown(extensions=[
    'tables', 'fenced_code', 'attr_list', 'md_in_html', 'sane_lists',
    'footnotes', 'toc', 'admonition',
], extension_configs={'toc': {'permalink': False}})

EXT = {'png': 'png', 'jpeg': 'jpg', 'jpg': 'jpg', 'gif': 'gif', 'svg+xml': 'svg', 'webp': 'webp'}

_img_cache = {}
_img_count = [0]


def save_image(mime, b64):
    key = hashlib.sha1(b64.encode()).hexdigest()[:16]
    if key in _img_cache:
        return _img_cache[key]
    ext = EXT.get(mime, 'bin')
    name = f'{key}.{ext}'
    path = os.path.join(IMGDIR, name)
    if not os.path.exists(path):
        try:
            data = base64.b64decode(b64)
        except Exception:
            return None
        with open(path, 'wb') as f:
            f.write(data)
    _img_count[0] += 1
    rel = 'assets/img/' + name
    _img_cache[key] = rel
    return rel


IMG_RE = re.compile(r'data:image/([a-zA-Z0-9+.\-]+);base64,\s*([A-Za-z0-9+/=\s]+?)(?=["\')\s])')


def externalise_images(src):
    def rep(m):
        rel = save_image(m.group(1).lower(), re.sub(r'\s+', '', m.group(2)))
        return rel if rel else m.group(0)
    return IMG_RE.sub(rep, src)


# ---- protecao de matematica -------------------------------------------------
MATH_BLOCK = re.compile(r'\$\$(.+?)\$\$', re.S)
MATH_INLINE = re.compile(r'(?<![\\$])\$(?!\s)([^\$\n]+?)(?<!\s)\$(?!\$)')


def protect_math(src, store):
    """Protect math delimiters without ever parsing code as mathematics.

    A literal ``$`` is common in R (``df$col``) and in shell/SQL examples.
    Fenced code and inline-code spans therefore get temporarily replaced before
    the math regexes run, then restored before Markdown conversion.
    """
    protected = []

    def keep_code(m):
        token = f'@@CODE{len(protected)}@@'
        protected.append(m.group(0))
        return token

    # Raw HTML <pre>/<code> widgets (used by the PT/R language-tab blocks)
    # first, fenced Markdown blocks second, inline code outside fences third.
    src = re.sub(r'<pre\b.*?</pre>', keep_code, src, flags=re.S | re.I)
    src = re.sub(r'```.*?```', keep_code, src, flags=re.S)
    src = re.sub(r'(?<!`)`[^`\n]+`(?!`)', keep_code, src)

    def keep(m, disp):
        token = f'@@MATH{len(store)}@@'
        store.append((m.group(1), disp))
        return token

    src = MATH_BLOCK.sub(lambda m: keep(m, True), src)
    src = MATH_INLINE.sub(lambda m: keep(m, False), src)

    for i, code in enumerate(protected):
        src = src.replace(f'@@CODE{i}@@', code)
    return src


def restore_math(html, store):
    for i, (expr, disp) in enumerate(store):
        expr_html = (expr.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))
        tag = (f'<div class="math-block" data-math="{expr_html}"></div>' if disp
               else f'<span class="math-inline" data-math="{expr_html}"></span>')
        html = html.replace(f'@@MATH{i}@@', tag)
    return html


# ---- caixas semanticas: reconhece titulos recorrentes (h2/h3/h4) e envolve a
# secção seguinte (ate ao proximo heading de nivel igual ou maior) numa div
# estilada. O heading original fica intacto e continua dentro da caixa, para
# nao quebrar os anchors do TOC (add_anchors corre depois de md2html).
_HEADING_RE = re.compile(r'<h([234])(?:\s[^>]*)?>(.*?)</h\1>', re.S)
_TAG_RE = re.compile(r'<[^>]+>')
_BOX_RULES = [
    (re.compile(r'^(erros?\s+com(um|uns)|common\s+mistakes?)\b', re.I), 'box-mistake'),
    (re.compile(r'\b(exemplos?|examples?)\b', re.I), 'box-example'),
    (re.compile(r'\b(exerc[íi]cios?|exercises?)\b', re.I), 'box-exercise'),
    (re.compile(r'^(a\s+pergunta\s+de\s+engenharia|the\s+engineering\s+question)\b', re.I), 'box-prompt'),
]


def _classify_heading(heading_html):
    plain = _TAG_RE.sub('', heading_html).strip()
    for rx, action in _BOX_RULES:
        if rx.search(plain):
            return action
    return None


def apply_boxes(html):
    matches = list(_HEADING_RE.finditer(html))
    actions = []
    for i, m in enumerate(matches):
        action = _classify_heading(m.group(2))
        if not action:
            continue
        level = int(m.group(1))
        sec_end = len(html)
        for j in range(i + 1, len(matches)):
            if int(matches[j].group(1)) <= level:
                sec_end = matches[j].start()
                break
        actions.append((m.start(), sec_end, action))
    if not actions:
        return html
    # descarta secções aninhadas dentro de uma secção já marcada
    kept, last_end = [], -1
    for start, end, action in actions:
        if start < last_end:
            continue
        kept.append((start, end, action))
        last_end = end
    out, pos = [], 0
    for start, end, action in kept:
        out.append(html[pos:start])
        out.append('<div class="box ' + action + '">')
        out.append(html[start:end])
        out.append('</div>')
        pos = end
    out.append(html[pos:])
    return ''.join(out)


# ---- citacoes de capitulo -> links reais -----------------------------------
# "Capitulo 71" / "Chapter 71" / "Capitulo 40-A" (alias de capitulo extra) no
# corpo do texto passam a link para a aula real, tal como um leitor faria no
# Microsoft Learn. So aplicado a citacoes singulares (nao "Capitulos 34-38"),
# e nunca dentro de <code>/<pre> (comentarios em blocos de codigo) ou de um
# link ja existente.
_CAP_ALIAS_TO_NUM = {'40-A': 154, '40-B': 155, '71-A': 156, '14-A': 157,
                      '25-A': 158, '18-A': 159, '9-A': 160, '56-A': 161}
_CHAP_CITE_RE = re.compile(r'\b(?:Cap[íi]tulo|Chapter)\s+(\d+)(?:-([A-Z])\b)?')
_TAG_TOKEN_RE = re.compile(r'(<[^>]+>)')
_TAG_NAME_RE = re.compile(r'</?([a-zA-Z0-9]+)')


def link_chapter_citations(html, num_to_cid, current_cid):
    def rep(m):
        num = int(m.group(1))
        if m.group(2):
            num = _CAP_ALIAS_TO_NUM.get(m.group(1) + '-' + m.group(2))
            if num is None:
                return m.group(0)
        cid = num_to_cid.get(num)
        if not cid or cid == current_cid:
            return m.group(0)
        return '<a href="#/aula/' + cid + '">' + m.group(0) + '</a>'

    skip_depth = 0
    out = []
    for tok in _TAG_TOKEN_RE.split(html):
        if tok.startswith('<'):
            tn = _TAG_NAME_RE.match(tok)
            if tn and tn.group(1).lower() in ('code', 'pre', 'a'):
                skip_depth += -1 if tok.startswith('</') else 1
                skip_depth = max(skip_depth, 0)
            out.append(tok)
        elif skip_depth > 0 or not tok:
            out.append(tok)
        else:
            out.append(_CHAP_CITE_RE.sub(rep, tok))
    return ''.join(out)


def md2html(src, lang='pt'):
    src = externalise_images(src)
    store = []
    src = protect_math(src, store)
    MD.reset()
    html = MD.convert(src)
    html = restore_math(html, store)
    html = apply_boxes(html)
    # tabelas responsivas
    html = html.replace('<table>', '<div class="table-wrap"><table>').replace('</table>', '</table></div>')
    # blocos plotly -> div renderizavel
    html = re.sub(
        r'<pre><code class="language-plotly">\s*([\w-]+)\s*</code></pre>',
        lambda m: ('<figure class="viz-figure"><div class="plotly-fig" data-fig="%s">'
                   '</div></figure>' % m.group(1)),
        html, flags=re.S)
    # blocos de codigo nao-python: barra com copiar (tem de correr ANTES do
    # bloco py-r, para nao re-envolver os panes de linguagem r/dax/sql que o
    # codetabs() gera dentro de si mesmo)
    html = re.sub(
        r'<pre><code class="language-(sql|dax|r|bash|json|xml)">(.*?)</code></pre>',
        lambda m: ('<div class="codeblock" data-lang="%s"><div class="codebar">'
                   '<span class="lang">%s</span>'
                   '<button class="btn-copy" type="button">%s</button></div>'
                   '<pre><code class="language-%s">%s</code></pre></div>'
                   % (m.group(1), LANG_LABEL.get(m.group(1), m.group(1).upper()),
                      COPY_LABEL.get(lang, 'Copiar'), m.group(1), m.group(2))),
        html, flags=re.S)
    # blocos py-r -> separadores Python / R
    html = re.sub(
        r'<pre><code class="language-py-r">(.*?)</code></pre>',
        lambda m: codetabs(unesc(m.group(1)), lang), html, flags=re.S)
    # blocos mermaid -> div renderizavel
    html = re.sub(
        r'<pre><code class="language-mermaid">(.*?)</code></pre>',
        lambda m: '<div class="mermaid-wrap"><div class="mermaid">'
                  + unesc(m.group(1)) + '</div></div>',
        html, flags=re.S)
    # links internos "#capitulo-NNN" (ancoras do documento original em pagina
    # unica) -> rota da SPA, onde cada capitulo e uma "pagina" carregada a parte
    html = re.sub(r'href="#capitulo-(\w+)"', r'href="#/aula/cap-\1"', html)
    return html


LANG_LABEL = {'sql': 'SQL', 'dax': 'DAX', 'r': 'R', 'bash': 'Shell', 'json': 'JSON', 'xml': 'XML'}
COPY_LABEL = {'pt': 'Copiar', 'en': 'Copy'}


def unesc(s):
    return (s.replace('&lt;', '<').replace('&gt;', '>')
             .replace('&quot;', '"').replace('&#39;', "'").replace('&amp;', '&'))



TAB_LANG = {'python': 'Python', 'r': 'R', 'sql': 'SQL', 'dax': 'DAX / Power BI',
            'excel': 'Excel', 'vba': 'VBA'}


def codetabs(block, ui_lang='pt'):
    """Converte um bloco `py-r` em separadores de linguagem.

    Formato:
        --- python
        <codigo>
        --- r
        <codigo>
    """
    parts = re.split(r'^---\s+(\w[\w-]*)\s*$', block, flags=re.M)
    langs = []
    for i in range(1, len(parts), 2):
        langs.append((parts[i].strip().lower(), parts[i + 1].strip('\n')))
    if not langs:
        return '<pre><code class="language-python">%s</code></pre>' % esc(block)
    uid = 'ct%s' % hashlib.md5(block.encode('utf-8')).hexdigest()[:8]
    tabs, panes = [], []
    normalized = []
    for lang, code in langs:
        # English translations are authored in Markdown, where an R example may
        # arrive as ``--- python`` + ``%%R``. Normalize it to a real R tab and
        # remove the notebook-only magic before publication.
        if lang == 'python' and code.lstrip().startswith('%%R'):
            code = re.sub(r'^\s*%%R\s*\n?', '', code, count=1)
            lang = 'r'
        elif lang == 'r':
            code = re.sub(r'^\s*%%R\s*\n?', '', code, count=1)
        normalized.append((lang, code))
    langs = normalized
    for i, (lang, code) in enumerate(langs):
        label = TAB_LANG.get(lang, lang.upper())
        on = ' on' if i == 0 else ''
        tabs.append('<button type="button" class="ct-tab%s" role="tab" '
                    'aria-selected="%s" id="%s-t%d">%s</button>'
                    % (on, 'true' if i == 0 else 'false', uid, i, label))
        panes.append(
            '<div class="ct-pane"%s role="tabpanel" aria-labelledby="%s-t%d">'
            '<div class="codeblock" data-lang="%s"><div class="codebar">'
            '<span class="lang">%s</span>'
            '<button class="btn-copy" type="button">%s</button></div>'
            '<pre><code class="language-%s">%s</code></pre></div></div>'
            % ('' if i == 0 else ' hidden', uid, i, lang, label,
               COPY_LABEL.get(ui_lang, 'Copiar'), lang, esc(code)))
    return ('<div class="codetabs"><div class="ct-bar" role="tablist">%s</div>%s</div>'
            % (''.join(tabs), ''.join(panes)))


CODE_TPL = ('<div class="codeblock" data-lang="{lang}">'
            '<div class="codebar"><span class="lang">{label}</span>'
            '<button class="btn-copy" type="button">Copiar</button></div>'
            '<pre><code class="language-{lang}">{code}</code></pre></div>')


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def cell_html(cell):
    src = ''.join(cell['source'])
    if not src.strip():
        return ''
    if cell['cell_type'] == 'code':
        is_r = src.lstrip().startswith('%%R')
        lang, label = ('r', 'R') if is_r else ('python', 'Python')
        if is_r:
            src = re.sub(r'^\s*%%R\s*\n?', '', src, count=1)
        return CODE_TPL.format(lang=lang, label=label, code=esc(src.rstrip()))
    return md2html(src)


HEAD_RE = re.compile(r'<h([2-4])[^>]*>(.*?)</h\1>', re.S)
TAG_RE = re.compile(r'<[^>]+>')

TITLE_H = re.compile(r'^\s*(?:<p>\s*<a id="[^"]*"></a>\s*</p>\s*)?<h[12][^>]*>(.*?)</h[12]>\s*', re.S)


def strip_title(html, title):
    """Remove o titulo repetido no topo do capitulo (a pagina ja o mostra em h1)."""
    m = TITLE_H.match(html)
    if not m:
        return html
    heading = unesc(TAG_RE.sub('', m.group(1)))
    norm_h = re.sub(r'\s+', ' ', heading).strip().lower()
    norm_t = re.sub(r'\s+', ' ', title).strip().lower()
    if norm_t in norm_h or norm_h.endswith(norm_t):
        return html[m.end():]
    return html


def slug(text, seen):
    s = re.sub(r'[^a-z0-9]+', '-', text.lower().strip())
    s = s.strip('-')[:60] or 'sec'
    n = seen.get(s, 0)
    seen[s] = n + 1
    return s if n == 0 else f'{s}-{n}'


def add_anchors(html):
    seen = {}
    toc = []

    def rep(m):
        lvl, inner = int(m.group(1)), m.group(2)
        text = TAG_RE.sub('', inner).strip()
        if not text:
            return m.group(0)
        sid = slug(text, seen)
        toc.append({'l': lvl, 't': text, 'id': sid})
        return f'<h{lvl} id="{sid}">{inner}</h{lvl}>'

    return HEAD_RE.sub(rep, html), toc


def build_toc_html(parts):
    """Indice navegavel: gerado a partir da estrutura real (parts), nunca desatualiza.

    Alguns numeros de capitulo aparecem mais que uma vez dentro da mesma parte (ex.:
    134 "Raciocínio..." seguido de 134 "Exemplo resolvido") -- filtrar e marcar
    como visto tem de acontecer no mesmo passo, senao as duas ocorrencias escapam ao
    filtro por nenhuma delas estar em seen_num ainda quando a outra e avaliada.
    """
    out = ['<p>Clique em qualquer capítulo para abrir a aula.</p>']
    seen_num = set()
    for p in parts:
        items = []
        for ch in p['chapters']:
            if ch['num'] in seen_num:
                continue
            seen_num.add(ch['num'])
            items.append(ch)
        if not items:
            # partes sem capitulos numerados no notebook (o banco de questoes e a
            # bibliografia nao usam o padrao "## Capitulo N:"), mas tem conteudo
            # real -- listadas a mao para nao desaparecer do indice. Os capitulos
            # 132/133 pertencem ao notebook a PARTE XVI mas fisicamente caem sob o
            # cabecalho APENDICE (ver parse.py) -- marcar em seen_num para nao
            # aparecerem duplicados quando o loop chegar ao APENDICE.
            special = TOC_SPECIAL_PARTS.get(p['title'])
            if special:
                out.append(f'<h3>{esc(p["title"])}</h3><ul>')
                out.append(special)
                out.append('</ul>')
                seen_num.update(TOC_SPECIAL_NUMS.get(p['title'], ()))
            continue
        out.append(f'<h3>{esc(p["title"])}</h3><ul>')
        for ch in items:
            out.append(f'<li><a href="#/aula/cap-{ch["num"]:03d}">{ch["num"]}. '
                       f'{esc(ch["title"])}</a></li>')
        out.append('</ul>')
    return '\n'.join(out)


TOC_SPECIAL_PARTS = {
    'PARTE XV — Preparação para Certificação':
        '<li><a href="#/certificacao">Banco de questões (119 perguntas, CQE e CSSBB)</a></li>',
    'PARTE XVI — Metodologia, Fontes e Bibliografia':
        '<li><a href="#/aula/cap-132">132. Sobre Este Manual: Metodologia e Fontes</a></li>'
        '<li><a href="#/aula/cap-133">133. Bibliografia Completa</a></li>',
}

TOC_SPECIAL_NUMS = {
    'PARTE XVI — Metodologia, Fontes e Bibliografia': (132, 133),
}


# ---- indice navegavel em ingles ---------------------------------------------
# O TOC em si e gerado a partir de `parts` (estrutura do manual.ipynb, que e
# sempre em portugues) -- por isso precisa de tradução propria de titulos de
# parte e, por capitulo, usa o titulo EN quando existe traducao (en_titles),
# caindo para o titulo PT quando ainda nao existe (mesma politica de fallback
# usada no resto do site).
PART_TITLE_EN = {
    'PARTE I — Fundamentos da Qualidade e do Six Sigma': 'PART I — Fundamentals of Quality and Six Sigma',
    'PARTE II — Gestão, Liderança e Cultura da Qualidade': 'PART II — Management, Leadership, and Quality Culture',
    'PARTE III — Lean': 'PART III — Lean',
    'PARTE IV — DMAIC e Melhoria de Processos': 'PART IV — DMAIC and Process Improvement',
    'PARTE V — Estatística para Engenharia da Qualidade': 'PART V — Statistics for Quality Engineering',
    'PARTE VI — Engenharia de Medição: Metrologia, MSA e Amostragem':
        'PART VI — Measurement Engineering: Metrology, MSA, and Sampling',
    'PARTE VII — Controlo Estatístico de Processo e Capability':
        'PART VII — Statistical Process Control and Capability',
    'PARTE VIII — Delineamento de Experimentos e Robust Design':
        'PART VIII — Design of Experiments and Robust Design',
    'PARTE IX — Risco, FMEA e Resolução de Problemas': 'PART IX — Risk, FMEA, and Problem Solving',
    'PARTE X — Sistemas da Qualidade, Normas e Auditoria': 'PART X — Quality Systems, Standards, and Auditing',
    'PARTE XI — Design de Produto e Processo, Confiabilidade e DFSS':
        'PART XI — Product and Process Design, Reliability, and DFSS',
    'PARTE XII — Cadeia de Fornecimento e Qualidade Automotiva':
        'PART XII — Supply Chain and Automotive Quality',
    'PARTE XIII — Quality 4.0: Software, Dados, Analytics e IA':
        'PART XIII — Quality 4.0: Software, Data, Analytics, and AI',
    'PARTE XIV — Aplicações Setoriais': 'PART XIV — Sector Applications',
    'PARTE XV — Preparação para Certificação': 'PART XV — Certification Preparation',
    'PARTE XVI — Metodologia, Fontes e Bibliografia': 'PART XVI — Methodology, Sources, and Bibliography',
    'APÊNDICE — VALIDAÇÃO MATEMÁTICA E ESTATÍSTICA 2026':
        'APPENDIX — Mathematical and Statistical Validation 2026',
    'PARTE XVII — LABORATÓRIO AVANÇADO 2026': 'PART XVII — Advanced Laboratory 2026',
    'ENCERRAMENTO — PERCURSO DE CERTIFICAÇÃO E PROJETO FINAL 2026':
        'CLOSING — Certification Path and Final Project 2026',
    'PARTE XVIII — Tópicos Complementares e Aplicações': 'PART XVIII — Complementary Topics and Applications',
}

def part_title_en(title):
    """Return the canonical English part label for generated EN artifacts."""
    return PART_TITLE_EN.get(title, {
        'Tópicos complementares e aplicações': 'Complementary Topics and Applications',
        'Abertura': 'Introduction',
    }.get(title, title))


TOC_SPECIAL_PARTS_EN = {
    'PARTE XV — Preparação para Certificação':
        '<li><a href="#/certificacao">Question bank (119 questions, CQE and CSSBB)</a></li>',
    'PARTE XVI — Metodologia, Fontes e Bibliografia':
        '<li><a href="#/aula/cap-132">132. About This Handbook: Methodology and Sources</a></li>'
        '<li><a href="#/aula/cap-133">133. Complete Bibliography</a></li>',
}


def build_toc_html_en(parts, en_titles):
    out = ['<p>Click any chapter to open the lesson.</p>']
    seen_num = set()
    for p in parts:
        items = []
        for ch in p['chapters']:
            if ch['num'] in seen_num:
                continue
            seen_num.add(ch['num'])
            items.append(ch)
        title_en = PART_TITLE_EN.get(p['title'], p['title'])
        if not items:
            special = TOC_SPECIAL_PARTS_EN.get(p['title'])
            if special:
                out.append(f'<h3>{esc(title_en)}</h3><ul>')
                out.append(special)
                out.append('</ul>')
                seen_num.update(TOC_SPECIAL_NUMS.get(p['title'], ()))
            continue
        out.append(f'<h3>{esc(title_en)}</h3><ul>')
        for ch in items:
            title = en_titles.get(ch['num'], ch['title'])
            out.append(f'<li><a href="#/aula/cap-{ch["num"]:03d}">{ch["num"]}. '
                       f'{esc(title)}</a></li>')
        out.append('</ul>')
    return '\n'.join(out)


STOP = set('de da do das dos e o a os as em um uma para por com que se na no nas nos ao aos '
           'à às como mais ou não sua seu suas seus este esta isso pode ser são foi entre '
           'the of and to in is a for that it this'.split())


def keywords(text, limit=120):
    words = re.findall(r'[a-zà-ÿA-ZÀ-Ý0-9²³σµ]{3,}', text.lower())
    freq = {}
    for w in words:
        if w in STOP:
            continue
        freq[w] = freq.get(w, 0) + 1
    top = sorted(freq.items(), key=lambda kv: -kv[1])[:limit]
    return ' '.join(w for w, _ in top)


# ---- banco de questoes ------------------------------------------------------
Q_RE = re.compile(
    r'^####\s+([A-Z]+)-(\d+)\s+·\s*(.+?)\n+'
    r'\*\*A\.\*\*\s*(.+?)\s*\n'
    r'\*\*B\.\*\*\s*(.+?)\s*\n'
    r'\*\*C\.\*\*\s*(.+?)\s*\n'
    r'\*\*D\.\*\*\s*(.+?)\s*\n+'
    r'<details>.*?\*\*Resposta correta:\s*([A-D])\.?\*\*\s*(.*?)</details>',
    re.S | re.M)

DOM_RE = re.compile(r'^###\s+(CQE|CSSBB)\s+·\s+Dom[íi]nio\s+([IVX]+)\s+—\s+(.+?)\s*$', re.M)


def parse_bank(cells, rng=None):
    """Extrai o banco de questoes. `rng` e opcional: se omitido, localiza
    automaticamente as celulas com perguntas (evita indices fixos, que
    ficam desalinhados sempre que se insere/remove uma celula no notebook)."""
    if rng is None:
        idxs = [i for i, c in enumerate(cells)
                if c['cell_type'] == 'markdown' and Q_RE.search(''.join(c['source']))]
        rng = range(min(idxs), max(idxs) + 1) if idxs else range(0)
    items = []
    for i in rng:
        src = ''.join(cells[i]['source'])
        dm = DOM_RE.search(src)
        domain = f'{dm.group(2)} — {dm.group(3)}' if dm else ''
        for m in Q_RE.finditer(src):
            bank, num, stem, a, b, c, d, ans, expl = m.groups()
            items.append({
                'id': f'{bank}-{num}',
                'bank': bank,
                'domain': domain,
                'q': md2html(stem.strip()),
                'opts': [md2html(x.strip().rstrip('  ')) for x in (a, b, c, d)],
                'ans': 'ABCD'.index(ans),
                'why': md2html(expl.strip()),
            })
    return items


# ---- build ------------------------------------------------------------------
def js_module(name, payload):
    return f'ACADEMY.reg({json.dumps(name)}, {json.dumps(payload, ensure_ascii=False)});\n'


def main():
    for d in (IMGDIR, CHDIR, os.path.join(SITE, 'content')):
        os.makedirs(d, exist_ok=True)

    cells, parts, front = structure()

    # indexar capitulos por numero (juntar duplicados do mesmo numero)
    chapters = {}
    order = []
    for p in parts:
        for ch in p['chapters']:
            n = ch['num']
            if n in chapters:
                chapters[n]['cells'].extend(ch['cells'])
            else:
                chapters[n] = {'num': n, 'title': ch['title'], 'part': p['title'], 'cells': list(ch['cells'])}
                order.append(n)

    # capitulos da PARTE XVIII (154-182): chegam ao dicionario `chapters` pelo
    # loop acima, como qualquer outro capitulo do notebook. So precisamos de
    # aplicar os metadados proprios desta parte (EXTRA_CHAPTERS).
    for key, meta in EXTRA_CHAPTERS.items():
        n = meta['num']
        if n in chapters:
            chapters[n]['new'] = True
            chapters[n]['part'] = 'Tópicos complementares e aplicações'

    num_to_cid = {n: f'cap-{n:03d}' for n in chapters}

    manifest_tracks = []
    search_index = []
    built = set()

    for tr in TRACKS:
        mods = []
        for mod in tr['modules']:
            # 'chapters' normalmente so tem numeros do notebook, mas pode
            # intercalar chaves de EXTRA_CHAPTERS (string) quando um capitulo
            # extra precisa de entrar no meio da lista em vez de so no fim
            # (que e o que 'extra' abaixo sempre faz).
            chlist = [c if isinstance(c, int) else EXTRA_CHAPTERS[c]['num']
                      for c in mod['chapters']]
            for extra in mod.get('extra', []):
                chlist.append(EXTRA_CHAPTERS[extra]['num'])
            chrefs = []
            for n in chlist:
                ch = chapters.get(n)
                if ch is None:
                    print(f'  ! capitulo {n} nao encontrado ({mod["id"]})')
                    continue
                cid = f'cap-{n:03d}'
                if cid not in built:
                    if 'raw_md' in ch:
                        body = md2html(ch['raw_md'])
                    else:
                        body = '\n'.join(x for x in (cell_html(cells[k]) for k in ch['cells']) if x)
                    body = link_chapter_citations(body, num_to_cid, cid)
                    body = strip_title(body, ch['title'])
                    body, toc = add_anchors(body)
                    ncode = len(re.findall(r'class="codeblock"', body))
                    nfig = len(re.findall(r'<img |<svg ', body))
                    plain = TAG_RE.sub(' ', body)
                    payload = {
                        'id': cid, 'num': n, 'title': ch['title'], 'part': ch['part'],
                        'html': body, 'toc': toc, 'stats': {'code': ncode, 'fig': nfig,
                                                            'words': len(plain.split())},
                        'new': ch.get('new', False),
                    }
                    with open(os.path.join(CHDIR, cid + '.js'), 'w', encoding='utf-8') as f:
                        f.write(js_module(cid, payload))
                    search_index.append({'id': cid, 'n': n, 't': ch['title'],
                                         'k': keywords(plain), 'm': mod['id'], 'tr': tr['id']})
                    built.add(cid)
                chrefs.append({'id': cid, 'num': n, 'title': ch['title'],
                               'new': chapters[n].get('new', False)})
            m = dict(mod)
            m['chapters'] = chrefs
            m['track'] = tr['id']
            mods.append(m)
        t = {k: v for k, v in tr.items() if k != 'modules'}
        t['modules'] = mods
        manifest_tracks.append(t)

    # os capitulos 154-182 (EXTRA_CHAPTERS) agora vivem dentro do proprio
    # manual.ipynb, na PARTE XVIII -- ja chegam a `parts` pela estrutura real
    # do notebook, entao o indice navegavel nao precisa de uma parte sintetica.
    toc_parts = parts

    # front matter como capitulo 0 -- texto de abertura escrito a mao, guardado
    # numa celula marcada do proprio manual.ipynb (nao segue o padrao "##
    # Capitulo N:", entao nao aparece em `chapters`/`parts`; precisa de ser
    # localizada pelo marcador). Seguido do indice navegavel, gerado a partir
    # da estrutura real dos capitulos.
    ABERTURA_MARK = '## Abertura do site (Capítulo 0, `cap-000`)'
    abertura_src = None
    for c in cells:
        if c['cell_type'] == 'markdown':
            src = ''.join(c['source'])
            if src.lstrip().startswith(ABERTURA_MARK):
                abertura_src = src.split('\n', 1)[1].lstrip('\n')
                break
    if abertura_src is None:
        raise SystemExit('celula de abertura (cap-000) nao encontrada no manual.ipynb')
    fbody = md2html(abertura_src)
    fbody += build_toc_html(toc_parts)
    fbody, ftoc = add_anchors(fbody)
    with open(os.path.join(CHDIR, 'cap-000.js'), 'w', encoding='utf-8') as f:
        f.write(js_module('cap-000', {'id': 'cap-000', 'num': 0, 'title': 'Abertura do manual',
                                      'part': 'Abertura', 'html': fbody, 'toc': ftoc,
                                      'stats': {'code': 0, 'fig': 0, 'words': len(TAG_RE.sub(' ', fbody).split())}}))

    # traducoes EN (Parte 2 Fase 2 -- piloto): ficheiros markdown autonomos em
    # i18n/en/, um por capitulo traduzido. Registados sob "cap-NNN.en" -- o
    # app.js tenta essa chave quando o idioma e ingles e cai para o PT
    # (cap-NNN) quando a traducao ainda nao existe para aquele capitulo.
    EN_DIR = os.path.join(ROOT, 'i18n', 'en')
    EN_TITLE_RE = re.compile(r'^##\s*Chapter\s+\d+:\s*(.+?)\s*$', re.M)
    id_to_mod_tr = {c['id']: (c['m'], c['tr']) for c in search_index}
    search_index_en = []
    if os.path.isdir(EN_DIR):
        n_en = 0
        en_titles = {}
        for fn in sorted(os.listdir(EN_DIR)):
            m = re.match(r'^cap-(\d+)\.md$', fn)
            if not m:
                continue
            num = int(m.group(1))
            with open(os.path.join(EN_DIR, fn), encoding='utf-8') as f:
                raw = f.read()
            tm = EN_TITLE_RE.search(raw)
            title = tm.group(1) if tm else f'Chapter {num}'
            body = md2html(raw, lang='en')
            body = link_chapter_citations(body, num_to_cid, f'cap-{num:03d}')
            body = strip_title(body, title)
            body, toc = add_anchors(body)
            ncode = len(re.findall(r'class="codeblock"', body))
            nfig = len(re.findall(r'<img |<svg ', body))
            plain = TAG_RE.sub(' ', body)
            src_ch = chapters.get(num, {})
            cid = f'cap-{num:03d}'
            payload = {
                'id': cid, 'num': num, 'title': title,
                'part': part_title_en(src_ch.get('part', '')), 'html': body, 'toc': toc,
                'stats': {'code': ncode, 'fig': nfig, 'words': len(plain.split())},
                'new': src_ch.get('new', False), 'lang': 'en',
            }
            with open(os.path.join(CHDIR, cid + '.en.js'), 'w', encoding='utf-8') as f:
                f.write(js_module(cid + '.en', payload))
            en_titles[num] = title
            mod_id, track_id = id_to_mod_tr.get(cid, ('', ''))
            if mod_id:
                search_index_en.append({'id': cid, 'n': num, 't': title,
                                        'k': keywords(plain), 'm': mod_id, 'tr': track_id})
            n_en += 1
        # abertura em ingles (capitulo 0), com indice navegavel proprio (titulos
        # de parte e de capitulo em ingles, com fallback PT por capitulo ainda
        # nao traduzido -- ver build_toc_html_en)
        en_abertura = os.path.join(EN_DIR, 'abertura.md')
        if os.path.exists(en_abertura):
            with open(en_abertura, encoding='utf-8') as f:
                fbody_en = md2html(f.read(), lang='en')
            fbody_en += build_toc_html_en(toc_parts, en_titles)
            fbody_en, ftoc_en = add_anchors(fbody_en)
            with open(os.path.join(CHDIR, 'cap-000.en.js'), 'w', encoding='utf-8') as f:
                f.write(js_module('cap-000.en', {
                    'id': 'cap-000', 'num': 0, 'title': 'Opening',
                    'part': 'Opening', 'html': fbody_en, 'toc': ftoc_en,
                    'stats': {'code': 0, 'fig': 0, 'words': len(TAG_RE.sub(' ', fbody_en).split())},
                    'lang': 'en'}))
            n_en += 1
        if n_en:
            print(f'traducoes EN      : {n_en}')

    # graficos interativos
    figs = figures.build()
    with open(os.path.join(SITE, 'content', 'figs.js'), 'w', encoding='utf-8') as f:
        f.write(js_module('figs', figs))

    # banco de questoes
    bank = parse_bank(cells)
    with open(os.path.join(SITE, 'content', 'bank.js'), 'w', encoding='utf-8') as f:
        f.write(js_module('bank', bank))

    manifest = {
        'title': 'Academy · Qualidade, Lean Six Sigma e Quality Analytics',
        'source': 'Manual de Engenharia da Qualidade, Lean Six Sigma e Quality Analytics — Edição Original (2026)',
        'tracks': manifest_tracks,
        'search': search_index,
        'searchEn': search_index_en,
        'bankSize': len(bank),
        'figCount': len(figs),
        'chapterCount': len(built),
    }
    with open(os.path.join(SITE, 'content', 'manifest.js'), 'w', encoding='utf-8') as f:
        f.write(js_module('manifest', manifest))

    print(f'capitulos gerados : {len(built)}')
    print(f'imagens extraidas : {len(_img_cache)}')
    print(f'questoes do banco : {len(bank)}')
    total = sum(os.path.getsize(os.path.join(CHDIR, x)) for x in os.listdir(CHDIR))
    print(f'peso do conteudo  : {total/1e6:.1f} MB js + '
          f'{sum(os.path.getsize(os.path.join(IMGDIR,x)) for x in os.listdir(IMGDIR))/1e6:.1f} MB imagens')


if __name__ == '__main__':
    main()
