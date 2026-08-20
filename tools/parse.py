#!/usr/bin/env python3
"""Parser do notebook -> estrutura de capitulos."""
import json, re, sys, os

NB = os.path.join(os.path.dirname(__file__), '..', 'manual.ipynb')

PART_RE = re.compile(r'^#\s+(PARTE\s+[IVXL]+.*|AP[ÊE]NDICE.*|ENCERRAMENTO.*)$', re.M)
CHAP_RE = re.compile(r'^#{1,2}\s+Cap[íi]tulo\s+(\d+)\s*[:—-]\s*(.+?)\s*$', re.M)


def load():
    with open(NB, encoding='utf-8') as f:
        return json.load(f)


def structure():
    nb = load()
    cells = nb['cells']
    parts = []
    cur_part = None
    cur_chap = None
    front = {'id': 'front', 'num': 0, 'title': 'Abertura do manual', 'cells': []}

    for i, c in enumerate(cells):
        src = ''.join(c['source'])
        mp = PART_RE.search(src)
        mc = CHAP_RE.search(src)
        if mp and not mc:
            cur_part = {'title': mp.group(1).strip(), 'chapters': [], 'first_cell': i}
            parts.append(cur_part)
            # the part heading cell may contain other content -> keep it
        if mc:
            cur_chap = {
                'num': int(mc.group(1)),
                'title': mc.group(2).strip().rstrip('✦').strip(),
                'cells': [i],
                'first_cell': i,
            }
            if cur_part is None:
                cur_part = {'title': 'PARTE 0 — Abertura', 'chapters': [], 'first_cell': 0}
                parts.append(cur_part)
            cur_part['chapters'].append(cur_chap)
            continue
        if cur_chap is not None:
            cur_chap['cells'].append(i)
        else:
            front['cells'].append(i)
    return cells, parts, front


if __name__ == '__main__':
    cells, parts, front = structure()
    total = 0
    for p in parts:
        nch = len(p['chapters'])
        ncells = sum(len(ch['cells']) for ch in p['chapters'])
        total += nch
        print(f"\n=== {p['title']}  ({nch} caps, {ncells} cells)")
        for ch in p['chapters']:
            chars = sum(len(''.join(cells[k]['source'])) for k in ch['cells'])
            code = sum(1 for k in ch['cells'] if cells[k]['cell_type'] == 'code')
            print(f"   {ch['num']:3d}. {ch['title'][:72]:<74s} cells={len(ch['cells']):3d} code={code:2d} kchars={chars//1000:4d}")
    print(f"\nTOTAL capitulos: {total}; front cells: {len(front['cells'])}")
