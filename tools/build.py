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
    def keep(m, disp):
        token = f'@@MATH{len(store)}@@'
        store.append((m.group(1), disp))
        return token
    src = MATH_BLOCK.sub(lambda m: keep(m, True), src)
    src = MATH_INLINE.sub(lambda m: keep(m, False), src)
    return src


def restore_math(html, store):
    for i, (expr, disp) in enumerate(store):
        expr_html = (expr.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))
        tag = (f'<div class="math-block" data-math="{expr_html}"></div>' if disp
               else f'<span class="math-inline" data-math="{expr_html}"></span>')
        html = html.replace(f'@@MATH{i}@@', tag)
    return html


def md2html(src):
    src = externalise_images(src)
    store = []
    src = protect_math(src, store)
    MD.reset()
    html = MD.convert(src)
    html = restore_math(html, store)
    # tabelas responsivas
    html = html.replace('<table>', '<div class="table-wrap"><table>').replace('</table>', '</table></div>')
    # blocos plotly -> div renderizavel
    html = re.sub(
        r'<pre><code class="language-plotly">\s*([\w-]+)\s*</code></pre>',
        lambda m: ('<figure class="viz-figure"><div class="plotly-fig" data-fig="%s">'
                   '</div></figure>' % m.group(1)),
        html, flags=re.S)
    # blocos py-r -> separadores Python / R
    html = re.sub(
        r'<pre><code class="language-py-r">(.*?)</code></pre>',
        lambda m: codetabs(unesc(m.group(1))), html, flags=re.S)
    # blocos mermaid -> div renderizavel
    html = re.sub(
        r'<pre><code class="language-mermaid">(.*?)</code></pre>',
        lambda m: '<div class="mermaid-wrap"><div class="mermaid">'
                  + unesc(m.group(1)) + '</div></div>',
        html, flags=re.S)
    # blocos de codigo nao-python: barra com copiar
    html = re.sub(
        r'<pre><code class="language-(sql|dax|r|bash|json|xml)">(.*?)</code></pre>',
        lambda m: ('<div class="codeblock" data-lang="%s"><div class="codebar">'
                   '<span class="lang">%s</span>'
                   '<button class="btn-copy" type="button">Copiar</button></div>'
                   '<pre><code class="language-%s">%s</code></pre></div>'
                   % (m.group(1), LANG_LABEL.get(m.group(1), m.group(1).upper()),
                      m.group(1), m.group(2))),
        html, flags=re.S)
    return html


LANG_LABEL = {'sql': 'SQL', 'dax': 'DAX', 'r': 'R', 'bash': 'Shell', 'json': 'JSON', 'xml': 'XML'}


def unesc(s):
    return (s.replace('&lt;', '<').replace('&gt;', '>')
             .replace('&quot;', '"').replace('&#39;', "'").replace('&amp;', '&'))



TAB_LANG = {'python': 'Python', 'r': 'R', 'sql': 'SQL', 'dax': 'DAX / Power BI',
            'excel': 'Excel', 'vba': 'VBA'}


def codetabs(block):
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
    uid = 'ct%d' % (abs(hash(block)) % 10 ** 8)
    tabs, panes = [], []
    for i, (lang, code) in enumerate(langs):
        label = TAB_LANG.get(lang, lang.upper())
        on = ' on' if i == 0 else ''
        tabs.append('<button type="button" class="ct-tab%s" role="tab" '
                    'aria-selected="%s" id="%s-t%d">%s</button>'
                    % (on, 'true' if i == 0 else 'false', uid, i, label))
        run = ('<button class="btn-run" type="button">Executar</button>'
               if lang == 'python' else '')
        panes.append(
            '<div class="ct-pane"%s role="tabpanel" aria-labelledby="%s-t%d">'
            '<div class="codeblock" data-lang="%s"><div class="codebar">'
            '<span class="lang">%s</span>%s'
            '<button class="btn-copy" type="button">Copiar</button></div>'
            '<pre><code class="language-%s">%s</code></pre>'
            '<div class="code-out" hidden></div></div></div>'
            % ('' if i == 0 else ' hidden', uid, i, lang, label, run, lang, esc(code)))
    return ('<div class="codetabs"><div class="ct-bar" role="tablist">%s</div>%s</div>'
            % (''.join(tabs), ''.join(panes)))


CODE_TPL = ('<div class="codeblock" data-lang="python">'
            '<div class="codebar"><span class="lang">Python</span>'
            '<button class="btn-run" type="button">Executar</button>'
            '<button class="btn-copy" type="button">Copiar</button></div>'
            '<pre><code class="language-python">{code}</code></pre>'
            '<div class="code-out" hidden></div></div>')


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def cell_html(cell):
    src = ''.join(cell['source'])
    if not src.strip():
        return ''
    if cell['cell_type'] == 'code':
        return CODE_TPL.format(code=esc(src.rstrip()))
    return md2html(src)


HEAD_RE = re.compile(r'<h([2-4])[^>]*>(.*?)</h\1>', re.S)
TAG_RE = re.compile(r'<[^>]+>')

TITLE_H = re.compile(r'^\s*(?:<p>\s*<a id="[^"]*"></a>\s*</p>\s*)?<h[12][^>]*>(.*?)</h[12]>\s*', re.S)


def strip_title(html, title):
    """Remove o titulo repetido no topo do capitulo (a pagina ja o mostra em h1)."""
    m = TITLE_H.match(html)
    if not m:
        return html
    heading = TAG_RE.sub('', m.group(1))
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


def parse_bank(cells, rng):
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

    # capitulos extra escritos de raiz
    for key, meta in EXTRA_CHAPTERS.items():
        path = os.path.join(ROOT, meta['source'])
        if os.path.exists(path):
            with open(path, encoding='utf-8') as f:
                chapters[meta['num']] = {'num': meta['num'], 'title': meta['title'],
                                         'part': 'Conteúdo novo (4ª edição web)',
                                         'raw_md': f.read(), 'new': True}

    manifest_tracks = []
    search_index = []
    built = set()

    for tr in TRACKS:
        mods = []
        for mod in tr['modules']:
            chlist = list(mod['chapters'])
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

    # front matter como capitulo 0
    fbody = '\n'.join(x for x in (cell_html(cells[k]) for k in front['cells']) if x)
    fbody, ftoc = add_anchors(fbody)
    with open(os.path.join(CHDIR, 'cap-000.js'), 'w', encoding='utf-8') as f:
        f.write(js_module('cap-000', {'id': 'cap-000', 'num': 0, 'title': 'Abertura do manual',
                                      'part': 'Abertura', 'html': fbody, 'toc': ftoc,
                                      'stats': {'code': 0, 'fig': 0, 'words': len(TAG_RE.sub(' ', fbody).split())}}))

    # graficos interativos
    figs = figures.build()
    with open(os.path.join(SITE, 'content', 'figs.js'), 'w', encoding='utf-8') as f:
        f.write(js_module('figs', figs))

    # banco de questoes
    bank = parse_bank(cells, range(1262, 1290))
    with open(os.path.join(SITE, 'content', 'bank.js'), 'w', encoding='utf-8') as f:
        f.write(js_module('bank', bank))

    manifest = {
        'title': 'Academy · Qualidade, Lean Six Sigma e Quality Analytics',
        'source': 'Manual de Engenharia da Qualidade, Lean Six Sigma e Quality Analytics — 4ª edição (2026)',
        'tracks': manifest_tracks,
        'search': search_index,
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
