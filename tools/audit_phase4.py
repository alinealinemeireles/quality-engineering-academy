#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Phase 4 — deep engineering-content gate.

This is a static content audit. It checks high-risk conceptual guardrails,
chapter inventory, normative freshness markers and assessment maturity.
It intentionally does not replace expert reading or execution in native
statistical/R environments.
"""
from __future__ import annotations
import json,re,sys
from pathlib import Path
from collections import Counter
ROOT=Path(__file__).resolve().parents[1]
FAIL=[]; WARN=[]
def fail(c,m): FAIL.append((c,m))
def warn(c,m): WARN.append((c,m))
def read(p): return p.read_text(encoding='utf-8',errors='replace')

nb=json.loads(read(ROOT/'manual.ipynb'))
chapters={}; cur=None
for cell in nb['cells']:
    s=''.join(cell.get('source',[]))
    m=re.search(r'^#{1,3} Capítulo (\d+):',s,re.M)
    if m:
        cur=int(m.group(1)); chapters[cur]=[]
    if cur: chapters[cur].append(s)

# 1. Inventory
# Chapters 154–165 are standalone extras without chapter headings; 166–182 have headings.
cur=read(ROOT/'tools/curriculum.py')
for num,src in re.findall(r'"num":\s*(15[4-9]|16[0-9]|17[0-9]|18[0-2]).*?"source":\s*"([^"]+)"',cur,re.S):
    chapters[int(num)]=[read(ROOT/src)]
missing=[n for n in range(1,183) if n not in chapters]
if missing: fail('P4-01',f'Missing merged chapters: {missing}')
if len(chapters)!=182: fail('P4-02',f'Expected 182 chapters after notebook+extras merge, found {len(chapters)}')

# 2. High-risk conceptual guardrails. These are fail conditions only when
# the old, unsafe formulation is detected without a nearby qualification.
alltext='\n'.join('\n'.join(v) for v in chapters.values())
checks=[
 ('P4-10', r'(?:duração|aproximadamente)\s+10\.000 horas.*(?:mortalidade infantil|curva da banheira)', 'No fixed 10,000-hour bathtub claim'),
 ('P4-11', r'Gage R&R.*garantir(?:á|ia).*repetibilidade', 'MSA must not be presented as a guarantee'),
 ('P4-12', r'(?:Regra|Rule) de Dez.*é (?:um )?requisito universal', 'Rule of Ten must remain a heuristic'),
 ('P4-14', r'AI Act.*02/12/2027.*02/08/2028', 'AI Act high-risk dates present'),
]
for code,pat,msg in checks:
    if re.search(pat,alltext,re.I|re.S):
        # Most are guardrails; date check is inverted below.
        if code!='P4-14': fail(code,msg)
normtext=read(ROOT/'manual.ipynb')
if not re.search(r'02/12/2027|02/08/2028|December 2, 2027|August 2, 2028',normtext,re.I):
    fail('P4-15','AI Act high-risk timeline not explicit in source')

# 3. Required qualifications in sensitive chapters
required={
 57:['regra de dez','adequação ao uso'],
 61:['finalidade','%GRR'],
 63:['AQL','curva OC'],
 64:['ISO 2859-1:2026','ISO 2859-3:2005'],
 71:['estabilidade','normalidade'],
 72:['não-normais','percentis'],
 73:['randomização','replic'],
 78:['split-plot','dois erros'],
 79:['Taguchi','interações'],
 81:['RPN','AP'],
 98:['MTBF','Weibull'],
 108:['linhagem','reprodutível'],
 111:['causalidade','leakage'],
 112:['monitor','revalida'],
 139:['censura','Weibull'],
 140:['Tipo A','Tipo B'],
 145:['VaR','CVaR'],
 146:['dependência','Markov'],
 149:['ISO/IEC 42001','ISO/IEC 23894'],
 152:['RGPD','AI Act'],
}
for n,terms in required.items():
    t='\n'.join(chapters.get(n,[])).lower()
    for term in terms:
        if term.lower() not in t: warn('P4-20',f'Chapter {n}: expected guardrail/topic missing: {term}')

# 4. Assessment maturity
bank=read(ROOT/'site/content/bank.js') if (ROOT/'site/content/bank.js').exists() else ''
cog=Counter(re.findall(r'"cognitiveLevel":"([^"]+)"',bank))
if sum(cog.values())!=119: fail('P4-30',f'Expected 119 assessment cognitive levels, got {sum(cog.values())}')
if cog.get('Analyze',0)+cog.get('Evaluate',0)<25: warn('P4-31',f'Analyze+Evaluate={cog.get("Analyze",0)+cog.get("Evaluate",0)}; target >=25')

# 5. Provenance/control documents
for p in ['docs/audit/PROVENANCE_MATRIX.md','docs/audit/PHASE4_ENGINEERING_REVIEW.md','docs/audit/PHASE4_EXIT_CRITERIA.md']:
    if not (ROOT/p).exists(): fail('P4-40',f'Missing Phase 4 control document: {p}')

# 6. Source hygiene
if 'example.github.io' in read(ROOT/'README.md'): fail('P4-50','Deployment placeholder remains in README')
if 'manual.ipynb' in read(ROOT/'.gitignore'): fail('P4-51','manual.ipynb is ignored')

print(f'FAIL={len(FAIL)} WARN={len(WARN)}')
for c,m in FAIL: print(f'FAIL {c}: {m}')
for c,m in WARN: print(f'WARN {c}: {m}')
sys.exit(1 if FAIL else 0)
