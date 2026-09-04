#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Static Phase-2 audit for Quality Engineering Academy.

Designed to run without browser dependencies. It checks source/build integrity,
chapter cross-references, bilingual code metadata, common content hazards and
basic repository reproducibility signals.
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FAIL = []
WARN = []


def fail(code, msg): FAIL.append((code, msg))
def warn(code, msg): WARN.append((code, msg))

def read(p): return p.read_text(encoding='utf-8', errors='replace')

# 1) Curriculum / files
extra = list((ROOT/'extra').glob('*.md'))
en = list((ROOT/'i18n'/'en').glob('cap-*.md'))
chap_files = list((ROOT/'site'/'content'/'ch').glob('cap-*.js'))
if len(en) != 182: fail('P1-01', f'Expected 182 EN chapter files, found {len(en)}')
if len([p for p in chap_files if re.fullmatch(r'cap-\d{3}\.js', p.name)]) != 183:
    fail('P1-02', 'Expected 183 generated PT files including cap-000')

# 2) Stale renumbering references
stale_pat = re.compile(r'(?:Capítulo\s+|Chapter\s+|cap-)(?:908|909|910|911|915|916|917|919|920|923)\b')
for base in [ROOT/'extra', ROOT/'i18n'/'en', ROOT/'tools']:
    for p in base.rglob('*'):
        if p.is_file() and p.suffix in {'.md','.py','.js'}:
            if stale_pat.search(read(p)): fail('P1-03', f'Stale chapter number in {p.relative_to(ROOT)}')

# 3) EN R blocks accidentally authored as Python
for p in en:
    if re.search(r'---\s+python\s*\n\s*%%R\b', read(p)):
        fail('P0-01', f'EN R example labelled as Python in {p.name}')

# 4) Math markup inside R code (the exact production bug fixed in build.py)
for p in list((ROOT/'extra').glob('*.md')) + en:
    t = read(p)
    # Raw source: inspect each R section until the next fence.
    for m in re.finditer(r'```py-r\s*\n---\s+(?:r|R)\s*\n(.*?)```', t, re.S):
        if 'math-inline' in m.group(1) or 'math-block' in m.group(1):
            fail('P0-02', f'Math HTML embedded in R source block: {p.relative_to(ROOT)}')
# Generated site: inspect actual R panes.
for p in chap_files:
    t=read(p)
    for m in re.finditer(r'<code class="language-r">(.*?)</code>', t, re.S):
        if 'math-inline' in m.group(1) or 'math-block' in m.group(1):
            fail('P0-02', f'Math HTML embedded in generated R code: {p.name}')

# 5) Duplicate headings inside individual source files
for p in list((ROOT/'extra').glob('*.md')) + en:
    hs=re.findall(r'^#{2,6}\s+(.+)$', read(p), re.M)
    seen=set()
    for h in hs:
        if h in seen: warn('P2-01', f'Duplicate heading in {p.relative_to(ROOT)}: {h}')
        seen.add(h)

# 6) Placeholder domain
for p in [ROOT/'README.md', ROOT/'site'/'index.html', ROOT/'site'/'robots.txt', ROOT/'site'/'sitemap.xml']:
    if p.exists() and 'example.github.io' in read(p): warn('P1-04', f'Placeholder domain remains in {p.relative_to(ROOT)}')

# 7) Reproducibility
if not (ROOT/'requirements.txt').exists(): warn('P1-05', 'No requirements.txt; build.py imports markdown and figures.py imports numpy')
workflow_text='\n'.join(read(p) for p in (ROOT/'.github'/'workflows').glob('*.yml'))
if 'python tools/build.py' not in workflow_text: warn('P1-06', 'CI does not run the Python build pipeline')
if 'manual.ipynb' in read(ROOT/'.gitignore'):
    warn('P1-07', 'manual.ipynb is gitignored; public repo cannot reproduce chapters 1-153 from the declared source')

# 8) README code-count consistency (generated PT chapters, excluding opening)
code_total=0; fig_total=0
for p in chap_files:
    if p.name == 'cap-000.js' or not re.fullmatch(r'cap-\d{3}\.js',p.name): continue
    t=read(p)
    code_total += len(re.findall(r'class=\\"codeblock\\"', t))
    fig_total += len(re.findall(r'<img ', t)) + len(re.findall(r'<svg ', t))
readme=read(ROOT/'README.md')
m=re.search(r'Blocos de código \(Python/R/SQL/DAX\) \| (\d+)',readme)
if m and int(m.group(1)) != code_total: fail('P1-08', f'README code count says {m.group(1)}, generated PT count is {code_total}')
m=re.search(r'Figuras e diagramas \| (\d+)',readme)
if m and int(m.group(1)) != fig_total: fail('P1-09', f'README figure count says {m.group(1)}, generated PT count is {fig_total}')

# 9) Assessment distribution
bank_js=read(ROOT/'site'/'content'/'bank.js')
# Safe enough for current generated literal: pull fields by regex rather than eval.
cog=__import__('collections').Counter(re.findall(r'"cognitiveLevel":"([^"]+)"', bank_js))
if cog and cog['Analyze'] < 0.20 * sum(cog.values()): warn('P1-10', f'Only {cog["Analyze"]}/{sum(cog.values())} questions are Analyze-level (<20%)')

def summary():
    print(f'FAIL={len(FAIL)} WARN={len(WARN)}')
    for code,msg in FAIL: print(f'FAIL {code}: {msg}')
    for code,msg in WARN: print(f'WARN {code}: {msg}')

if __name__=='__main__':
    summary()
    sys.exit(1 if FAIL else 0)
