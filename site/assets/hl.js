/* =========================================================================
   Academy — realce de sintaxe minimo e offline (Python, R, SQL, DAX, XML)
   Substitui o highlight.js: ~4 KB, sem dependencias, sem rede.
   ========================================================================= */
(function () {
  'use strict';

  var KW = {
    python: 'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield',
    r: 'if else repeat while function for in next break TRUE FALSE NULL Inf NaN NA NA_integer_ NA_real_ NA_character_ library require return',
    sql: 'select from where group by order having join inner left right full outer on as and or not in is null distinct union all insert update delete create table view with over partition case when then else end limit offset count sum avg min max cast',
    dax: 'var return if switch calculate filter all allexcept values sumx averagex divide related relatedtable earlier date year month day blank not and or in',
    xml: ''
  };
  var BUILTIN = {
    python: 'abs all any bool dict enumerate float format int len list map max min print range round set sorted str sum tuple type zip self np pd plt scipy stats sm sklearn',
    r: 'c mean sd median var quantile length nrow ncol data.frame matrix apply sapply lapply plot hist summary lm aov t.test qcc',
    sql: '', dax: '', xml: ''
  };

  function build(lang) {
    var kw = (KW[lang] || '').trim().split(/\s+/).filter(Boolean);
    var bi = (BUILTIN[lang] || '').trim().split(/\s+/).filter(Boolean);
    return {
      kw: kw.length ? new RegExp('\\b(' + kw.map(esc).join('|') + ')\\b', lang === 'sql' || lang === 'dax' ? 'gi' : 'g') : null,
      bi: bi.length ? new RegExp('\\b(' + bi.map(esc).join('|') + ')\\b', 'g') : null
    };
  }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function h(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  var cache = {};

  function highlight(code, lang) {
    var cfg = cache[lang] || (cache[lang] = build(lang));
    var out = '', i = 0, n = code.length;
    var cmt = lang === 'sql' || lang === 'dax' ? '--' : '#';

    function flushPlain(txt) {
      var t = h(txt);
      if (cfg.kw) t = t.replace(cfg.kw, '<span class="t-k">$1</span>');
      if (cfg.bi) t = t.replace(cfg.bi, '<span class="t-b">$1</span>');
      t = t.replace(/\b(\d+\.?\d*(?:[eE][-+]?\d+)?)\b/g, '<span class="t-n">$1</span>');
      out += t;
    }

    var plain = '';
    while (i < n) {
      var c = code[i];
      if (code.startsWith(cmt, i) || (lang === 'r' && c === '#')) {
        var e = code.indexOf('\n', i); if (e < 0) e = n;
        flushPlain(plain); plain = '';
        out += '<span class="t-c">' + h(code.slice(i, e)) + '</span>';
        i = e; continue;
      }
      if (lang === 'python' && (code.startsWith('"""', i) || code.startsWith("'''", i))) {
        var q3 = code.slice(i, i + 3);
        var e3 = code.indexOf(q3, i + 3); e3 = e3 < 0 ? n : e3 + 3;
        flushPlain(plain); plain = '';
        out += '<span class="t-s">' + h(code.slice(i, e3)) + '</span>';
        i = e3; continue;
      }
      if (c === '"' || c === "'") {
        var j = i + 1;
        while (j < n && code[j] !== c) { if (code[j] === '\\') j++; j++; }
        j = Math.min(j + 1, n);
        flushPlain(plain); plain = '';
        out += '<span class="t-s">' + h(code.slice(i, j)) + '</span>';
        i = j; continue;
      }
      plain += c; i++;
    }
    flushPlain(plain);
    return out;
  }

  window.ACADEMY_HL = function (root) {
    var nodes = (root || document).querySelectorAll('code[class*="language-"]:not([data-hl])');
    Array.prototype.forEach.call(nodes, function (n) {
      n.setAttribute('data-hl', '1');
      var m = /language-(\w+)/.exec(n.className);
      var lang = m ? m[1] : 'python';
      if (lang === 'mermaid') return;
      if (!(lang in KW)) lang = 'python';
      try { n.innerHTML = highlight(n.textContent, lang); } catch (e) {}
    });
  };
})();
