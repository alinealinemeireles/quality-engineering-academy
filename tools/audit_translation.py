from pathlib import Path
import re, json
ROOT=Path(__file__).resolve().parents[1]; EN=ROOT/'i18n/en'; SITE=ROOT/'site/content/ch'
fail=[]; warn=[]
def payload(p):
    m=re.search(r'ACADEMY\.reg\([^,]+, (.*)\);\s*$',p.read_text(encoding='utf-8'),re.S)
    return json.loads(m.group(1))
chapters={p.stem.split('.')[0] for p in SITE.glob('cap-*.js') if not p.name.endswith('.en.js')}
for ep in sorted(SITE.glob('cap-*.en.js')):
    n=ep.stem.split('.')[0]; pp=SITE/f'{n}.js'
    if not pp.exists(): fail.append(f'{n}: missing PT artifact'); continue
    e=payload(ep); p=payload(pp)
    if e['num']!=p['num']: fail.append(f'{n}: chapter number mismatch')

    part=e.get('part','')
    if re.search(r'\b(PARTE|APÊNDICE|Conteúdo novo|Abertura)\b', part, re.I):
        fail.append(f'{n}: Portuguese part metadata remains in EN artifact: {part}')
    # R is the critical parity check because translated source uses py-r blocks.
    a=e['html'].count('language-r'); b=p['html'].count('language-r')
    if a!=b: fail.append(f'{n}: R block count PT={b} EN={a}')
    targets=set(re.findall(r'#/aula/(cap-\d+)',e['html']))
    missing=sorted(x for x in targets if x not in chapters)
    if missing: fail.append(f'{n}: EN links to missing chapters {missing}')
    if '%%R' in ep.read_text(encoding='utf-8'): fail.append(f'{n}: %%R leaked into EN generated artifact')
    hs=re.findall(r'<h[1-6]\b[^>]*>(.*?)</h[1-6]>',e['html'])
    for a,b in zip(hs,hs[1:]):
        aa=re.sub('<[^>]+>','',a).strip().lower(); bb=re.sub('<[^>]+>','',b).strip().lower()
        if aa and aa==bb: fail.append(f'{n}: duplicate consecutive heading: {aa[:80]}'); break
for p in SITE.glob('cap-*.en.js'):
    if '>Copiar<' in p.read_text(encoding='utf-8'): fail.append(f'{p.name}: Portuguese copy label remains in EN')
# high-confidence untranslated UI/caption phrases outside fenced code
terms=['as tres janelas','botao Chart Options','Em Options','hipotese alternativa','nível de confiança','nivel de confianca','geracao de dados aleatorios','já resumidos','ja resumidos','diferenca hipotetizada','Média =','Variância =','Poisson exige','turno N pior','matéria-prima']
for p in EN.glob('cap-*.md'):
    prose=re.sub(r'```.*?```','',p.read_text(encoding='utf-8'),flags=re.S)
    for term in terms:
        if term.lower() in prose.lower(): fail.append(f'{p.name}: untranslated Portuguese phrase: {term}')
# obsolete pre-renumbering references
for p in list(EN.glob('cap-*.md'))+list(SITE.glob('cap-*.en.js')):
    s=p.read_text(encoding='utf-8')
    if re.search(r'Chapter 900\b|Chapter 901\b|Chapter 902\b|capitulo-900\b|capitulo-901\b|capitulo-902\b',s,re.I): fail.append(f'{p.relative_to(ROOT)}: stale chapter 900-902 reference')
print(f'FAIL={len(fail)} WARN={len(warn)}')
for x in fail: print('FAIL:',x)
raise SystemExit(1 if fail else 0)
