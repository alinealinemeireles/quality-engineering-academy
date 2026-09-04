#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Phase 6 — final release-readiness gate.

Checks repository hygiene, release metadata and CI wiring. It intentionally
separates local static evidence from remote/runner-dependent execution.
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
FAIL=[]
def fail(code,msg): FAIL.append((code,msg))
def read(p): return p.read_text(encoding='utf-8',errors='replace')

required = [
    'tools/audit_translation.py',
    'README.md','LICENSE','CHANGELOG.md','CONTRIBUTING.md','SECURITY.md','CITATION.cff',
    '.editorconfig','requirements.txt','package.json','manual.ipynb',
    'tools/audit_phase2.py','tools/audit_phase3.py','tools/audit_phase4.py',
    'tools/audit_phase5.py','tools/audit_phase6.py',
    'docs/audit/FASE6_RESULTADO.md'
]
for rel in required:
    if not (ROOT/rel).exists(): fail('P6-01',f'Missing release file: {rel}')

# Version metadata
try:
    pkg=json.loads(read(ROOT/'package.json'))
    if pkg.get('version') != '1.0.0': fail('P6-02',f'package.json version is {pkg.get("version")!r}, expected 1.0.0')
    if pkg.get('engines',{}).get('node') != '>=22 <23': fail('P6-03','Node engine must remain >=22 <23')
    if pkg.get('devDependencies',{}).get('playwright') != '1.62.0': fail('P6-04','Playwright pin changed unexpectedly')
except Exception as e: fail('P6-05',f'Invalid package.json: {e}')

cff=read(ROOT/'CITATION.cff') if (ROOT/'CITATION.cff').exists() else ''
if 'version: "1.0.0"' not in cff: fail('P6-06','CITATION.cff does not declare release 1.0.0')

# CI must contain the complete release gate and browser tests.
for rel in ['.github/workflows/check.yml','.github/workflows/pages.yml']:
    p=ROOT/rel
    if not p.exists(): fail('P6-07',f'Missing workflow: {rel}'); continue
    s=read(p)
    for token in ['python tools/build.py','node tools/check_i18n.js','python tools/audit_phase4.py','python tools/audit_phase5.py','npx playwright install --with-deps chromium','node tools/check.js','node tools/check2.js']:
        if token not in s: fail('P6-08',f'{rel} missing CI step: {token}')

# Repository hygiene: no Python caches, npm modules or local logs in release source.
for bad in ['.pytest_cache','node_modules','.DS_Store']:
    if (ROOT/bad).exists(): fail('P6-09',f'Temporary/local artefact present: {bad}')
for p in ROOT.rglob('*'):
    if p.is_file() and p.suffix in {'.log','.pyc'}: fail('P6-10',f'Temporary file present: {p.relative_to(ROOT)}')

# Generated inventory must remain coherent with the documented release.
chap_pt=list((ROOT/'site/content/ch').glob('cap-[0-9][0-9][0-9].js'))
chap_en=list((ROOT/'site/content/ch').glob('cap-[0-9][0-9][0-9].en.js'))
if len(chap_pt) != 183: fail('P6-11',f'Expected 183 PT chapter files, found {len(chap_pt)}')
if len(chap_en) != 183: fail('P6-12',f'Expected 183 EN chapter files, found {len(chap_en)}')

# No obvious placeholder domain in public site metadata.
public='\n'.join(read(p) for p in [ROOT/'site/index.html',ROOT/'site/robots.txt',ROOT/'site/sitemap.xml'] if p.exists())
if 'example.github.io' in public: fail('P6-13','Placeholder example.github.io remains in public metadata')

# Final report must preserve the distinction between local and remote validation.
report=read(ROOT/'docs/audit/FASE6_RESULTADO.md') if (ROOT/'docs/audit/FASE6_RESULTADO.md').exists() else ''
if 'Pendente de execução remota' not in report: fail('P6-14','Final report must disclose runner-dependent validation')

print(f'FAIL={len(FAIL)}')
for c,m in FAIL: print(f'FAIL {c}: {m}')
sys.exit(1 if FAIL else 0)
