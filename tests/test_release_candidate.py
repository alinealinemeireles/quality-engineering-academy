from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]

def files():
    return list((ROOT/'site/content/ch').glob('cap-[0-9][0-9][0-9].js')) + list((ROOT/'site/content/ch').glob('cap-[0-9][0-9][0-9].en.js'))

def test_no_notebook_magic_in_published_r():
    for p in files():
        s=p.read_text(encoding='utf8',errors='replace')
        assert not re.search(r'<code class="language-r">.*?%%R',s,re.S), p

def test_no_math_markup_inside_code():
    for p in files():
        s=p.read_text(encoding='utf8',errors='replace')
        assert not re.search(r'<code class="language-(?:r|python)">.*?(?:math-inline|math-block)',s,re.S), p

def test_expected_chapter_counts():
    assert len(list((ROOT/'site/content/ch').glob('cap-[0-9][0-9][0-9].js'))) == 183
    assert len(list((ROOT/'site/content/ch').glob('cap-[0-9][0-9][0-9].en.js'))) == 183
