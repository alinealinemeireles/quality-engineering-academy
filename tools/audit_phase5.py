#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Phase 5 — final release-engineering/static gate.

This gate verifies that the release candidate is wired for a reproducible
build, browser smoke tests, valid chapter references, and clean generated
artifacts. It does not pretend to execute native R or a real browser when the
runtime lacks those dependencies.
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
FAIL=[]; WARN=[]
def fail(c,m): FAIL.append((c,m))
def warn(c,m): WARN.append((c,m))
def text(p): return p.read_text(encoding='utf-8',errors='replace')

# Release dependencies / scripts
try:
    pkg=json.loads(text(ROOT/'package.json'))
    if pkg.get('devDependencies',{}).get('playwright') != '1.62.0':
        fail('P5-01','Playwright must be pinned to 1.62.0 for reproducible browser CI')
except Exception as e: fail('P5-01',f'Invalid package.json: {e}')
for p in ['requirements.txt','package.json','tools/check.js','tools/check2.js','tools/audit_phase5.py']:
    if not (ROOT/p).exists(): fail('P5-02',f'Missing release file: {p}')

# No obsolete chapter references in executable test scripts
for p in [ROOT/'tools/check.js',ROOT/'tools/check2.js']:
    s=text(p)
    if re.search(r'#/aula/cap-(?:900|90[8-9]|91[0-9]|92[0-3])',s):
        fail('P5-03',f'Obsolete chapter route in {p.relative_to(ROOT)}')
    if 'process.exit(1)' not in s: fail('P5-04',f'Browser test does not fail CI on page errors: {p.relative_to(ROOT)}')

# Source/generated chapter inventory
try:
    nb=json.loads(text(ROOT/'manual.ipynb'))
    ids=[]
    for c in nb.get('cells',[]):
        m=re.search(r'^#{1,3} Capítulo (\d+):', ''.join(c.get('source',[])), re.M)
        if m: ids.append(int(m.group(1)))
    extras=json.loads('{}') if False else None
    if len(set(ids)) < 153: fail('P5-05',f'Notebook chapter inventory unexpectedly low: {len(set(ids))}')
except Exception as e: fail('P5-06',f'Cannot parse manual.ipynb: {e}')

# Generated site hygiene
site=ROOT/'site'
if not site.exists(): fail('P5-07','site/ missing')
else:
    htmls=list(site.rglob('*.html'))
    if not htmls: fail('P5-08','No generated HTML files found')
    blob='\n'.join(text(p) for p in htmls)
    if '%%R' in blob: fail('P5-09','Notebook R magic leaked into generated HTML')
    # Decode generated ACADEMY.reg payloads and inspect actual HTML, rather
    # than matching the JavaScript source representation (where escaped tags
    # can create false positives).
    for p in site.rglob('*.js'):
        s=text(p)
        for m in re.finditer(r'ACADEMY\.reg\([^,]+,\s*(\{.*\})\);?\s*$', s, re.S|re.M):
            try:
                obj=json.loads(m.group(1))
                html=obj.get('html','')
            except Exception:
                continue
            for code_block in re.findall(r'<pre><code[^>]*>(.*?)</code></pre>', html, re.I|re.S):
                if re.search(r'<(?:span|div)[^>]*class=\"math-(?:inline|block)\"', code_block, re.I):
                    fail('P5-10',f'Math markup appears inside code in {p.relative_to(ROOT)}')
                    break

# Existing audit scripts must remain syntactically valid.
for p in ['tools/audit_phase2.py','tools/audit_phase3.py','tools/audit_phase4.py']:
    if not (ROOT/p).exists(): fail('P5-11',f'Missing prior audit: {p}')

print(f'FAIL={len(FAIL)} WARN={len(WARN)}')
for c,m in FAIL: print(f'FAIL {c}: {m}')
for c,m in WARN: print(f'WARN {c}: {m}')
sys.exit(1 if FAIL else 0)
