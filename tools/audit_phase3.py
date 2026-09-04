#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Phase-3 Release Candidate audit.

Focus: engineering correctness signals, reproducibility, generated artefacts,
assessment quality, accessibility and normative freshness markers.
This is a static gate; it deliberately does not claim browser/visual validation.
"""
from __future__ import annotations
import json,re,sys
from pathlib import Path
from collections import Counter
ROOT=Path(__file__).resolve().parents[1]
FAIL=[]; WARN=[]
def fail(c,m): FAIL.append((c,m))
def warn(c,m): WARN.append((c,m))
def txt(p): return p.read_text(encoding='utf-8',errors='replace')

# Inventory
pt=list((ROOT/'site/content/ch').glob('cap-[0-9][0-9][0-9].js'))
en=list((ROOT/'site/content/ch').glob('cap-[0-9][0-9][0-9].en.js'))
if len(pt)!=183: fail('RC-01',f'Expected 183 PT generated chapters incl cap-000; got {len(pt)}')
if len(en)!=183: fail('RC-02',f'Expected 183 EN generated chapters incl cap-000; got {len(en)}')

# Generated code integrity
for p in pt+en:
 s=txt(p)
 if re.search(r'<code class="language-r">.*?%%R',s,re.S): fail('RC-03',f'Notebook magic %%R leaked into generated R: {p.name}')
 if re.search(r'<code class="language-python">.*?%%R',s,re.S): fail('RC-04',f'R magic leaked into Python block: {p.name}')
 if re.search(r'<code class="language-r">.*?(math-inline|math-block)',s,re.S): fail('RC-05',f'Math markup inside R code: {p.name}')
 if re.search(r'<code class="language-python">.*?(math-inline|math-block)',s,re.S): fail('RC-06',f'Math markup inside Python code: {p.name}')
 # basic HTML/code closure sanity
 if s.count('<pre>')!=s.count('</pre>'): fail('RC-07',f'Unbalanced pre tags: {p.name}')

# Source stale chapter aliases
stale=re.compile(r'(?:capitulo-|cap-|Chapter\s+|Capítulo\s+)(?:908|909|910|911|915|916|917|919|920|923)\b')
for base in [ROOT/'extra',ROOT/'i18n/en',ROOT/'tools']:
 for p in base.rglob('*'):
  if p.suffix in {'.md','.py','.js'} and stale.search(txt(p)): fail('RC-09',f'Stale chapter number in {p.relative_to(ROOT)}')

# Reproducibility
if 'manual.ipynb' in txt(ROOT/'.gitignore'): fail('RC-10','manual.ipynb is still ignored; source is not reproducible from a public clone')
for req in ['markdown','numpy']:
 if req.lower() not in txt(ROOT/'requirements.txt').lower(): fail('RC-11',f'Missing build dependency: {req}')

# No placeholder deployment metadata
for p in [ROOT/'README.md',ROOT/'site/index.html',ROOT/'site/robots.txt',ROOT/'site/sitemap.xml']:
 if p.exists() and 'example.github.io' in txt(p): fail('RC-12',f'Placeholder domain remains: {p.relative_to(ROOT)}')

# Accessibility basics in generated images
missing_alt=[]
for p in pt+en:
 for m in re.finditer(r'<img\b([^>]*)>',txt(p),re.I):
  if not re.search(r'\balt\s*=',m.group(1),re.I): missing_alt.append(p.name)
if missing_alt: fail('RC-13',f'Images without alt text: {len(missing_alt)} files; examples={missing_alt[:5]}')

# Assessment distribution and schema
bank=txt(ROOT/'site/content/bank.js')
cog=Counter(re.findall(r'"cognitiveLevel":"([^"]+)"',bank))
if sum(cog.values())!=119: fail('RC-14',f'Expected 119 cognitiveLevel fields; got {sum(cog.values())}')
if cog.get('Analyze',0)<20: warn('RC-15',f'Analyze-level questions remain low: {cog.get("Analyze",0)}/119')
unknown=set(cog)-{'Understand','Apply','Analyze','Evaluate','Create','Remember'}
if unknown: fail('RC-16',f'Unknown cognitive levels: {sorted(unknown)}')
# Every question should have rationale and traceability
for field in ['chapterRef','bokTopic','difficulty','why']:
 if field not in bank: fail('RC-17',f'Assessment bank missing field marker: {field}')

# Normative freshness markers
cap152=(ROOT/'i18n/en/cap-152.md')
if cap152.exists():
 s=txt(cap152)
 if 'December 2, 2027' not in s or 'August 2, 2028' not in s: fail('RC-18','AI Act high-risk dates not explicit in source')
else: fail('RC-18','AI Act source chapter 152 not found')

# Engineering claim tripwires: flag for human review rather than silently trusting prose
tripwires={
 'MTBF_exponential': [r'MTBF.*pressupõe.*taxa de falha',r'MTBF.*assume.*constant failure rate'],
 'RTY_independence': [r'RTY.*independ',r'produto dos FPY.*independ'],
 'OEE_85_absolute': [r'85%.*World Class',r'85%.*classe mundial'],
}
for name,patterns in tripwires.items():
 for base in [ROOT/'extra',ROOT/'i18n/en']:
  for p in base.rglob('*.md'):
   s=txt(p)
   if any(re.search(x,s,re.I|re.S) for x in patterns): warn('RC-19',f'Engineering claim tripwire {name}: {p.relative_to(ROOT)}')

# Source/reference hygiene
if not (ROOT/'docs').exists(): warn('RC-20','No docs/ directory for controlled audit evidence and release records')
if not (ROOT/'tests').exists(): warn('RC-21','No tests/ directory; static audit remains tool-only')

print(f'FAIL={len(FAIL)} WARN={len(WARN)}')
for c,m in FAIL: print(f'FAIL {c}: {m}')
for c,m in WARN: print(f'WARN {c}: {m}')
sys.exit(1 if FAIL else 0)
