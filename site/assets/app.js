/* =========================================================================
   Academy — nucleo da aplicacao
   Router por hash, registo de conteudo, progresso, quiz, busca.
   ========================================================================= */
(function () {
  'use strict';

  var A = window.ACADEMY;
  var MAN = A.data.manifest;
  var BANK = A.data.bank || [];

  /* ---------- utilidades ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'style') n.setAttribute('style', attrs[k]);
      else if (k in n && k !== 'list') n[k] = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function deaccent(s) { return s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s; }

  /* ---------- armazenamento resiliente -------------------------------------
     localStorage pode falhar (modo privado, iframe, ficheiro local).
     Cai para memoria sem partir nada; o utilizador pode exportar em JSON.     */
  var Store = (function () {
    var mem = {}, ok = true;
    try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); }
    catch (e) { ok = false; }
    return {
      persistent: ok,
      get: function (k, d) {
        try { var v = ok ? localStorage.getItem(k) : mem[k]; return v == null ? d : JSON.parse(v); }
        catch (e) { return d; }
      },
      set: function (k, v) {
        var s = JSON.stringify(v);
        try { if (ok) localStorage.setItem(k, s); else mem[k] = s; }
        catch (e) { ok = false; mem[k] = s; }
      }
    };
  })();

  /* ---------- estado de progresso ---------- */
  var KEY = 'academy.progress.v1';
  var P = Store.get(KEY, { read: {}, quiz: {}, notes: {}, started: Date.now() });
  if (!P.read) P.read = {};
  if (!P.quiz) P.quiz = {};

  function save() { Store.set(KEY, P); }
  function isRead(id) { return !!P.read[id]; }
  function setRead(id, v) {
    if (v) P.read[id] = Date.now(); else delete P.read[id];
    save();
  }

  /* ---------- indice de capitulos ---------- */
  var CH = {};      // capId -> {mod, track, idx}
  var CHLIST = [];  // ordem global de leitura
  var MODS = {};
  var TRACKS = {};

  MAN.tracks.forEach(function (t) {
    TRACKS[t.id] = t;
    t.modules.forEach(function (m) {
      MODS[m.id] = m;
      m.chapters.forEach(function (c) {
        if (!CH[c.id]) {
          CH[c.id] = { ch: c, mod: m, track: t, i: CHLIST.length };
          CHLIST.push(c.id);
        }
      });
    });
  });

  var TRK_IDX = {};
  MAN.tracks.forEach(function (t, i) { TRK_IDX[t.id] = i + 1; });
  function trackColor(t) {
    // a cor vem do CSS (var --trk-N), para que o tema e a opcao de paleta mandem
    return 'var(--trk-' + (TRK_IDX[t.id] || 1) + ')';
  }
  var CAP_ALIAS = { 900: '40-A', 901: '40-B', 902: '71-A', 903: '14-A',
                    904: '25-A', 905: '18-A', 906: '9-A' };
  function capLabel(n) { return CAP_ALIAS[n] || n; }

  function modProgress(m) {
    var d = m.chapters.filter(function (c) { return isRead(c.id); }).length;
    return { done: d, total: m.chapters.length, pct: pct(d, m.chapters.length) };
  }
  function trackProgress(t) {
    var d = 0, n = 0;
    t.modules.forEach(function (m) { var p = modProgress(m); d += p.done; n += p.total; });
    return { done: d, total: n, pct: pct(d, n) };
  }
  function globalProgress() {
    var d = 0, n = 0;
    MAN.tracks.forEach(function (t) { var p = trackProgress(t); d += p.done; n += p.total; });
    return { done: d, total: n, pct: pct(d, n) };
  }

  /* ---------- carregamento de capitulos sob procura ---------- */
  var loading = {};
  function loadChapter(id, cb) {
    if (A.data[id]) return cb(A.data[id]);
    (A._waiters[id] = A._waiters[id] || []).push(cb);
    if (loading[id]) return;
    loading[id] = true;
    var s = document.createElement('script');
    s.src = 'content/ch/' + id + '.js';
    s.onerror = function () {
      A.reg(id, { id: id, title: 'Capítulo indisponível', part: '', html:
        '<div class="note warn"><b>Não foi possível carregar este capítulo.</b> ' +
        'Verifique se a pasta <code>content/ch/</code> acompanha o ficheiro ' +
        '<code>index.html</code>.</div>', toc: [], stats: {} });
    };
    document.head.appendChild(s);
  }

  /* ---------- bibliotecas locais (KaTeX, Mermaid) --------------------------
     Sao servidas de assets/vendor/ e nao da rede: a aplicacao funciona
     integralmente offline depois de descarregada a pasta.                    */
  var VEND = 'assets/vendor/';
  var libs = {};
  function need(name, urls, test, cb) {
    if (test()) return cb();
    if (libs[name]) { libs[name].push(cb); return; }
    libs[name] = [cb];
    var i = 0;
    (function next() {
      if (i >= urls.length) { libs[name].forEach(function (f) { f(); }); libs[name] = null; return; }
      var u = urls[i++];
      if (/\.css/.test(u)) {
        document.head.appendChild(el('link', { rel: 'stylesheet', href: u }));
        return next();
      }
      var s = document.createElement('script');
      s.src = u; s.onload = next; s.onerror = next;
      document.head.appendChild(s);
    })();
    var tries = 0;
    var iv = setInterval(function () {
      if (test() || ++tries > 120) {
        clearInterval(iv);
        if (libs[name]) { libs[name].forEach(function (f) { f(); }); libs[name] = null; }
      }
    }, 100);
  }

  function renderMath(root) {
    var nodes = $$('.math-block:not(.done), .math-inline:not(.done)', root);
    if (!nodes.length) return;
    need('katex', [
      VEND + 'katex/katex.min.css',
      VEND + 'katex/katex.min.js'
    ], function () { return !!window.katex; }, function () {
      if (!window.katex) return;
      nodes.forEach(function (n) {
        try {
          window.katex.render(n.getAttribute('data-math'), n, {
            displayMode: n.classList.contains('math-block'),
            throwOnError: false, output: 'html'
          });
          n.classList.add('done');
        } catch (e) { /* deixa o texto original visivel */ }
      });
    });
  }

  var mermaidReady = false;
  function renderMermaid(root) {
    var nodes = $$('.mermaid:not([data-done])', root);
    if (!nodes.length) return;
    need('mermaid', [VEND + 'mermaid/mermaid.min.js'],
      function () { return !!window.mermaid; }, function () {
        if (!window.mermaid) return;
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (!mermaidReady) { window.mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' }); mermaidReady = true; }
        window.mermaid.initialize({
          startOnLoad: false, securityLevel: 'loose',
          theme: dark ? 'dark' : 'default',
          themeVariables: { fontFamily: 'Segoe UI, Inter, system-ui, sans-serif', fontSize: '14px' },
          flowchart: { htmlLabels: true, curve: 'basis' }
        });
        nodes.forEach(function (n, i) {
          n.setAttribute('data-done', '1');
          var src = n.getAttribute('data-src') || n.textContent;
          n.setAttribute('data-src', src);
          try {
            window.mermaid.render('mmd' + Date.now() + i, src).then(function (r) {
              n.innerHTML = r.svg;
            }).catch(function () { n.textContent = src; });
          } catch (e) { n.textContent = src; }
        });
      });
  }

  function highlight(root) {
    if (window.ACADEMY_HL) window.ACADEMY_HL(root);
  }

  /* ---------- lupa: ampliar figuras -------------------------------------- */
  function zoomable(root) {
    $$('.prose figure, .prose > p > img, .prose > img, .mermaid-wrap', root)
      .forEach(function (f) {
        if (f.hasAttribute('data-zoom')) return;
        f.setAttribute('data-zoom', '1');
        var b = el('button', { className: 'zoom-btn', type: 'button',
                               title: 'Ampliar figura', 'aria-label': 'Ampliar figura' },
                   '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/>' +
                   '<path d="M15.5 15.5L21 21M8 10.5h5M10.5 8v5"/></svg>');
        var wrap = el('div', { className: 'zoom-host' });
        f.parentNode.insertBefore(wrap, f);
        wrap.appendChild(f); wrap.appendChild(b);
        b.addEventListener('click', function () { openZoom(f); });
      });
  }

  function openZoom(fig) {
    var ov = el('div', { className: 'zoom-ov', role: 'dialog', 'aria-label': 'Figura ampliada' });
    var inner = el('div', { className: 'zoom-in' });
    inner.innerHTML = fig.innerHTML || fig.outerHTML;
    var close = el('button', { className: 'zoom-x', type: 'button', 'aria-label': 'Fechar' }, '✕');
    ov.appendChild(close); ov.appendChild(inner);
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    function kill() {
      ov.remove(); document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') kill(); }
    close.addEventListener('click', kill);
    ov.addEventListener('click', function (e) { if (e.target === ov) kill(); });
    document.addEventListener('keydown', onKey);
    close.focus();
  }

  function enhance(root) {
    renderMath(root); renderMermaid(root); highlight(root); zoomable(root);
    if (window.ACADEMY_VIZ) window.ACADEMY_VIZ.all(root);
    $$('.btn-copy', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var code = $('code', b.closest('.codeblock'));
        var txt = code ? code.textContent : '';
        if (navigator.clipboard) navigator.clipboard.writeText(txt);
        var o = b.textContent; b.textContent = 'Copiado ✓';
        setTimeout(function () { b.textContent = o; }, 1400);
      });
    });
    // tabelas largas ganham rolagem horizontal automatica (ja envolvidas no build)
  }

  /* =======================================================================
     SIDEBAR
     ======================================================================= */
  var ICONS = {
    home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
    map: '<path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4v13"/>',
    beaker: '<path d="M9 3h6M10 3v6.5L4.6 18A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.7-3L14 9.5V3"/><path d="M7.5 15h9"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-2.4L17 21l-1.5-7.5"/>',
    book: '<path d="M4 4.5h6a2.5 2.5 0 0 1 2.5 2.5v13A2 2 0 0 0 10.5 18H4z"/><path d="M20 4.5h-6A2.5 2.5 0 0 0 11.5 7v13a2 2 0 0 1 2-2H20z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/>',
    chev: '<path d="M9 6l6 6-6 6"/>'
  };
  function ico(n, cls) { return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') + '>' + ICONS[n] + '</svg>'; }

  function buildSidebar() {
    var nav = $('#sidebar');
    var h = '';
    h += '<a class="side-link" href="#/" data-r="/">' + ico('home') + 'Painel</a>';
    h += '<a class="side-link" href="#/competencias" data-r="/competencias">' + ico('map') + 'Mapa de competências</a>';
    h += '<a class="side-link" href="#/laboratorio" data-r="/laboratorio">' + ico('beaker') + 'Laboratório Python</a>';
    h += '<a class="side-link" href="#/certificacao" data-r="/certificacao">' + ico('award') + 'Banco de certificação</a>';
    h += '<a class="side-link" href="#/aula/cap-000" data-r="/aula/cap-000">' + ico('book') + 'Abertura do manual</a>';
    h += '<div class="side-h">Percursos</div>';

    MAN.tracks.forEach(function (t) {
      h += '<details class="trk" data-track="' + t.id + '">';
      h += '<summary class="trk-head" style="--c:' + trackColor(t) + '">' +
           '<i class="trk-dot"></i><span>' + esc(t.title) + '</span>' + ico('chev', 'chev') + '</summary>';
      h += '<div class="trk-mods">';
      t.modules.forEach(function (m, i) {
        h += '<a class="mod-link" href="#/modulo/' + m.id + '" data-mod="' + m.id + '">' +
             '<span class="mnum">' + String(i + 1).padStart(2, '0') + '</span>' + esc(m.title) + '</a>';
      });
      h += '</div></details>';
    });
    h += '<div class="side-h">Dados</div>';
    h += '<a class="side-link" href="#/progresso" data-r="/progresso">' + ico('gear') + 'Progresso e backup</a>';
    nav.innerHTML = h;
    syncSidebar();
  }

  function syncSidebar() {
    var hash = location.hash.slice(1) || '/';
    $$('#sidebar .side-link').forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('data-r') === hash);
    });
    $$('#sidebar .mod-link').forEach(function (a) {
      var id = a.getAttribute('data-mod');
      var m = MODS[id];
      a.classList.toggle('on', hash === '/modulo/' + id);
      if (m) a.classList.toggle('done', modProgress(m).pct === 100);
    });
    // abre a trilha da rota atual
    var cur = null;
    var mm = hash.match(/^\/modulo\/(.+)$/);
    var ma = hash.match(/^\/aula\/(.+)$/);
    var mt = hash.match(/^\/trilha\/(.+)$/);
    if (mm && MODS[mm[1]]) cur = MODS[mm[1]].track;
    else if (ma && CH[ma[1]]) cur = CH[ma[1]].track.id;
    else if (mt) cur = mt[1];
    if (cur) {
      var d = $('#sidebar .trk[data-track="' + cur + '"]');
      if (d) d.open = true;
      if (ma && CH[ma[1]]) {
        var l = $('#sidebar .mod-link[data-mod="' + CH[ma[1]].mod.id + '"]');
        if (l) l.classList.add('on');
      }
    }
  }

  /* =======================================================================
     VISTAS
     ======================================================================= */
  var main = $('#main');

  function show(html) {
    main.innerHTML = html;
    main.scrollTop = 0;
    window.scrollTo(0, 0);
    enhance(main);
    syncSidebar();
  }

  function meter(p, color) {
    return '<div class="meter" style="--c:' + color + '"><i style="width:' + p + '%"></i></div>';
  }

  /* ---------- painel ---------- */
  function viewHome() {
    var g = globalProgress();
    var nextId = CHLIST.find(function (id) { return !isRead(id); });
    var next = nextId ? CH[nextId] : null;
    var codeCount = 140, figCount = 192;
    var vizCount = MAN.figCount || 0;

    var h = '<div class="page">';
    h += '<div class="hero">';
    h += '<h1>Formação em Engenharia da Qualidade, Lean Six Sigma e Quality Analytics</h1>';
    h += '<p>' + MAN.chapterCount + ' capítulos organizados em ' + MAN.tracks.length +
         ' percursos, com laboratório Python no navegador, ' + MAN.bankSize +
         ' questões autorais de certificação e mapa de competências.</p>';
    h += '<div class="hero-cta">';
    if (next) h += '<a class="btn ghost" href="#/aula/' + next.ch.id + '">Continuar: ' +
                   esc(next.ch.title.length > 42 ? next.ch.title.slice(0, 42) + '…' : next.ch.title) + ' →</a>';
    h += '<a class="btn ghost" href="#/competencias">Mapa de competências</a>';
    h += '<a class="btn ghost" href="#/laboratorio">Abrir laboratório</a>';
    h += '</div></div>';

    h += '<div class="tiles">';
    h += tile('Progresso global', g.pct + '%', g.done + ' de ' + g.total + ' aulas');
    h += tile('Percursos', String(MAN.tracks.length), 'trilhas de formação');
    h += tile('Exercícios de código', String(codeCount), 'blocos Python executáveis');
    h += tile('Figuras e esquemas', String(figCount), 'diagramas do manual');
    h += tile('Gráficos interativos', String(vizCount), 'com hover e deslizadores');
    h += tile('Banco de questões', String(MAN.bankSize), 'CQE + CSSBB, autorais');
    h += '</div>';

    h += '<h2 style="font-size:20px;margin:6px 0 14px">Meu percurso</h2>';
    h += '<div class="hbars" style="margin-bottom:30px">';
    MAN.tracks.forEach(function (t) {
      var p = trackProgress(t);
      h += '<div class="hbar" style="--c:' + trackColor(t) + '">' +
           '<span class="lab">' + esc(t.title) + '</span>' +
           '<span class="track"><i style="width:' + p.pct + '%"></i></span>' +
           '<span class="val">' + p.pct + '%</span></div>';
    });
    h += '</div>';

    h += '<h2 style="font-size:20px;margin:6px 0 14px">Percursos</h2><div class="cards">';
    MAN.tracks.forEach(function (t) {
      var p = trackProgress(t);
      h += '<a class="card" href="#/trilha/' + t.id + '" style="--c:' + trackColor(t) + '">' +
           '<h3>' + esc(t.title) + '</h3>' +
           '<p>' + esc(t.subtitle) + '</p>' +
           meter(p.pct, trackColor(t)) +
           '<div class="card-meta"><span>' + t.modules.length + ' módulos · ' + p.total + ' aulas</span>' +
           '<span class="badge">' + p.pct + '%</span></div></a>';
    });
    h += '</div>';

    h += '<div class="note info" style="margin-top:30px"><b>Fonte.</b> Todo o conteúdo vem do ' +
         esc(MAN.source) + (Store.persistent ? '' :
         ' <br><b>Atenção:</b> este navegador não está a guardar o progresso (modo privado ou restrição de armazenamento). Use a exportação em JSON na página <a href="#/progresso">Progresso e backup</a>.') +
         '</div>';
    h += '</div>';
    show(h);
  }

  function tile(k, v, s) {
    return '<div class="tile"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) +
           '</div><div class="s">' + esc(s) + '</div></div>';
  }

  /* ---------- trilha ---------- */
  function viewTrack(id) {
    var t = TRACKS[id];
    if (!t) return viewHome();
    var c = trackColor(t), p = trackProgress(t);
    var h = '<div class="page"><div class="page-head">';
    h += '<div class="eyebrow" style="--c:' + c + '"><i class="dot"></i>Percurso ' + esc(t.code) + '</div>';
    h += '<h1>' + esc(t.title) + '</h1><p class="lede">' + esc(t.subtitle) + '</p>';
    h += '<div style="max-width:420px;margin-top:16px">' + meter(p.pct, c) +
         '<div style="font-size:13px;color:var(--ink-3)">' + p.done + ' de ' + p.total +
         ' aulas concluídas · ' + p.pct + '%</div></div>';
    h += '</div><div class="mod-list">';
    t.modules.forEach(function (m, i) {
      var mp = modProgress(m);
      h += '<a class="mod-row' + (mp.pct === 100 ? ' done' : '') + '" href="#/modulo/' + m.id +
           '" style="--c:' + c + '">' +
           '<span class="mod-n">' + (mp.pct === 100 ? '✓' : String(i + 1).padStart(2, '0')) + '</span>' +
           '<span><span class="mod-t">' + esc(m.title) +
           (m.chapters.some(function (x) { return x.new; }) ? ' <span class="badge new">novo</span>' : '') +
           '</span><span class="mod-s">' + m.chapters.length + ' aulas · ' +
           esc(m.competencies.slice(0, 3).join(' · ')) + '</span></span>' +
           '<span class="mod-right">' + mp.done + '/' + mp.total + '<br><span class="badge lvl' + m.level +
           '">nível ' + m.level + '</span></span></a>';
    });
    h += '</div></div>';
    show(h);
  }

  /* ---------- modulo ---------- */
  function viewModule(id) {
    var m = MODS[id];
    if (!m) return viewHome();
    var t = TRACKS[m.track], c = trackColor(t), p = modProgress(m);
    var qz = P.quiz[m.id];

    var h = '<div class="page"><div class="page-head">';
    h += '<div class="crumb"><a href="#/">Painel</a> › <a href="#/trilha/' + t.id + '">' +
         esc(t.title) + '</a></div>';
    h += '<div class="eyebrow" style="--c:' + c + '"><i class="dot"></i>Módulo · nível ' + m.level + '</div>';
    h += '<h1>' + esc(m.title) + '</h1>';
    h += '<div class="chips">' + m.competencies.map(function (x) {
      return '<span class="chip' + (p.pct === 100 ? ' on' : '') + '">' + esc(x) + '</span>';
    }).join('') + '</div>';
    h += '<div style="max-width:420px;margin-top:16px">' + meter(p.pct, c) +
         '<div style="font-size:13px;color:var(--ink-3)">' + p.done + ' de ' + p.total + ' aulas</div></div>';
    h += '</div>';

    h += '<h2 style="font-size:19px;margin:22px 0 12px">Aulas</h2><div class="mod-list">';
    m.chapters.forEach(function (ch, i) {
      var done = isRead(ch.id);
      h += '<a class="mod-row' + (done ? ' done' : '') + '" href="#/aula/' + ch.id +
           '" style="--c:' + c + '"><span class="mod-n">' + (done ? '✓' : (i + 1)) + '</span>' +
           '<span><span class="mod-t">' + esc(ch.title) +
           (ch.new ? ' <span class="badge new">novo</span>' : '') + '</span>' +
           '<span class="mod-s">Capítulo ' + capLabel(ch.num) + ' do manual</span></span>' +
           '<span class="mod-right">' + (done ? 'concluída' : 'por ler') + '</span></a>';
    });
    h += '</div>';

    // avaliacao do modulo a partir do banco
    var qs = quizForModule(m);
    if (qs.length) {
      h += '<h2 style="font-size:19px;margin:30px 0 12px">Avaliação do módulo</h2>';
      h += '<div class="note">' + qs.length + ' questões relacionadas com as competências deste módulo. ' +
           (qz ? '<b>Última tentativa: ' + qz.score + '%</b> em ' +
                 new Date(qz.at).toLocaleDateString('pt-PT') + '.' : 'Ainda não avaliado.') +
           ' Aproveitamento mínimo recomendado: <b>70%</b>.</div>';
      h += '<a class="btn" style="background:' + c + '" href="#/quiz/' + m.id + '">' +
           (qz ? 'Refazer avaliação' : 'Iniciar avaliação') + ' →</a>';
    }
    h += '</div>';
    show(h);
  }

  /* ---------- aula ---------- */
  function viewLesson(id) {
    var info = CH[id];
    var t = info ? info.track : null;
    var c = t ? trackColor(t) : 'var(--accent)';

    show('<div class="empty"><div class="spinner"></div>A carregar o capítulo…</div>');

    loadChapter(id, function (d) {
      var i = info ? info.i : -1;
      var prev = i > 0 ? CH[CHLIST[i - 1]] : null;
      var next = i >= 0 && i < CHLIST.length - 1 ? CH[CHLIST[i + 1]] : null;
      var done = isRead(id);

      var h = '<div class="page"><div class="reader"><div>';
      h += '<div class="crumb">';
      if (info) h += '<a href="#/trilha/' + t.id + '">' + esc(t.title) + '</a> › <a href="#/modulo/' +
                     info.mod.id + '">' + esc(info.mod.title) + '</a>';
      else h += esc(d.part || '');
      h += '</div>';
      h += '<div class="eyebrow" style="--c:' + c + '"><i class="dot"></i>' +
           (d.num ? 'Capítulo ' + capLabel(d.num) : 'Abertura') +
           (d.new ? ' · escrito para a edição web' : '') + '</div>';
      h += '<h1>' + esc(d.title) + '</h1>';

      h += '<div class="lesson-bar">';
      h += '<button class="btn ' + (done ? 'sec' : '') + '" id="markBtn" style="' +
           (done ? '' : 'background:' + c) + '">' + (done ? '✓ Concluída' : 'Marcar como concluída') + '</button>';
      if (d.stats) h += '<span class="spacer"></span><span class="badge">' +
        (d.stats.words || 0).toLocaleString('pt-PT') + ' palavras</span>' +
        (d.stats.code ? '<span class="badge">' + d.stats.code + ' blocos Python</span>' : '') +
        (d.stats.fig ? '<span class="badge">' + d.stats.fig + ' figuras</span>' : '');
      h += '</div>';

      h += '<article class="prose" id="prose">' + d.html + '</article>';

      h += '<div class="pager">';
      if (prev) h += '<a href="#/aula/' + prev.ch.id + '"><span class="dir">← Anterior</span>' +
                     '<span class="ttl">' + esc(prev.ch.title) + '</span></a>'; else h += '<span></span>';
      if (next) h += '<a class="next" href="#/aula/' + next.ch.id + '"><span class="dir">Seguinte →</span>' +
                     '<span class="ttl">' + esc(next.ch.title) + '</span></a>';
      h += '</div>';

      h += '</div>'; // fim coluna
      // indice
      h += '<aside class="toc"><h4>Nesta aula</h4>';
      (d.toc || []).forEach(function (x) {
        h += '<a class="l' + x.l + '" href="#' + location.hash.slice(1) + '" data-jump="' + x.id + '">' +
             esc(x.t) + '</a>';
      });
      h += '</aside></div></div>';

      show(h);

      var btn = $('#markBtn');
      if (btn) btn.addEventListener('click', function () {
        setRead(id, !isRead(id));
        viewLesson(id);
      });
      $$('.toc a').forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var el2 = document.getElementById(a.getAttribute('data-jump'));
          if (el2) el2.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      wireLab(main);
      observeToc();
    });
  }

  function observeToc() {
    var links = $$('.toc a');
    if (!links.length || !window.IntersectionObserver) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('data-jump')] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('on'); });
          var a = map[e.target.id];
          if (a) a.classList.add('on');
        }
      });
    }, { rootMargin: '-70px 0px -75% 0px' });
    Object.keys(map).forEach(function (k) {
      var n = document.getElementById(k);
      if (n) obs.observe(n);
    });
  }

  /* =======================================================================
     QUIZ
     ======================================================================= */
  function norm(s) { return deaccent(String(s)).toLowerCase(); }

  function quizForModule(m) {
    var terms = m.competencies.map(norm).concat([norm(m.title)]);
    var words = [];
    terms.forEach(function (t) {
      t.split(/[^a-z0-9²³]+/).forEach(function (w) { if (w.length > 3) words.push(w); });
    });
    var scored = BANK.map(function (q) {
      var txt = norm(q.q + ' ' + q.opts.join(' ') + ' ' + q.domain);
      var s = 0;
      words.forEach(function (w) { if (txt.indexOf(w) >= 0) s++; });
      return { q: q, s: s };
    }).filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });
    return scored.slice(0, 10).map(function (x) { return x.q; });
  }

  function viewQuiz(modId) {
    var m = MODS[modId];
    if (!m) return viewHome();
    var t = TRACKS[m.track], c = trackColor(t);
    var qs = quizForModule(m);
    renderQuiz({
      title: 'Avaliação · ' + m.title,
      crumb: '<a href="#/trilha/' + t.id + '">' + esc(t.title) + '</a> › <a href="#/modulo/' +
             m.id + '">' + esc(m.title) + '</a>',
      color: c, questions: qs,
      onDone: function (score) {
        P.quiz[m.id] = { score: score, at: Date.now(), n: qs.length };
        save();
      }
    });
  }

  function viewBank() {
    var pick = (location.hash.split('?')[1] || '');
    var bank = /cssbb/i.test(pick) ? 'CSSBB' : (/cqe/i.test(pick) ? 'CQE' : null);
    if (!bank) {
      var counts = { CQE: 0, CSSBB: 0 };
      BANK.forEach(function (q) { counts[q.bank] = (counts[q.bank] || 0) + 1; });
      var h = '<div class="page"><div class="page-head">' +
        '<div class="eyebrow"><i class="dot"></i>Preparação para certificação</div>' +
        '<h1>Banco de questões</h1>' +
        '<p class="lede">Questões autorais escritas para esta edição, com justificação da resposta ' +
        'correta e análise dos distratores. Não reproduzem itens publicados pela ASQ.</p></div>';
      h += '<div class="note warn"><b>Como estudar com este banco.</b> Responda sem consultar e, ' +
           'antes de conferir, justifique por que cada uma das outras três alternativas está errada. ' +
           'Se não conseguir, o conceito ainda não está consolidado.</div>';
      h += '<div class="cards">';
      h += '<a class="card" href="#/certificacao?cqe" style="--c:var(--series-1)"><h3>ASQ CQE</h3>' +
           '<p>Certified Quality Engineer — distribuição proporcional ao peso do Body of Knowledge.</p>' +
           '<div class="card-meta"><span>' + counts.CQE + ' questões</span>' +
           '<span class="badge">iniciar</span></div></a>';
      h += '<a class="card" href="#/certificacao?cssbb" style="--c:var(--series-2)"><h3>ASQ CSSBB</h3>' +
           '<p>Certified Six Sigma Black Belt — DMAIC, estatística, DOE e liderança de projeto.</p>' +
           '<div class="card-meta"><span>' + counts.CSSBB + ' questões</span>' +
           '<span class="badge">iniciar</span></div></a>';
      h += '</div>';
      h += '<div class="note info" style="margin-top:24px"><b>Nota.</b> Esta plataforma é <b>preparatória</b>. ' +
           'Não emite certificação ASQ nem Lean Six Sigma reconhecida — os certificados oficiais são ' +
           'emitidos exclusivamente pelos organismos certificadores.</div>';
      h += '</div>';
      return show(h);
    }
    var qs = BANK.filter(function (q) { return q.bank === bank; });
    renderQuiz({
      title: 'Banco ' + bank, crumb: '<a href="#/certificacao">Banco de certificação</a>',
      color: bank === 'CQE' ? 'var(--series-1)' : 'var(--series-2)',
      questions: qs, showDomain: true,
      onDone: function (score) { P.quiz['bank-' + bank] = { score: score, at: Date.now(), n: qs.length }; save(); }
    });
  }

  function renderQuiz(cfg) {
    var qs = cfg.questions;
    if (!qs.length) {
      return show('<div class="page"><div class="empty">Sem questões associadas a este módulo.<br>' +
                  '<a class="btn sec" style="margin-top:16px" href="#/certificacao">Ir para o banco completo</a></div></div>');
    }
    var answered = 0, correct = 0;
    var h = '<div class="page"><div class="page-head">';
    h += '<div class="crumb">' + cfg.crumb + '</div>';
    h += '<h1>' + esc(cfg.title) + '</h1>';
    h += '<p class="lede">' + qs.length + ' questões. A resposta e a análise dos distratores aparecem ' +
         'imediatamente após cada escolha.</p></div>';
    h += '<div class="score" id="score"><span class="big" id="scoreV">—</span>' +
         '<span style="color:var(--ink-3);font-size:13.5px">Responda para ver o aproveitamento.<br>' +
         'Mínimo recomendado: 70%.</span></div>';
    h += '<div class="quiz">';
    qs.forEach(function (q, i) {
      h += '<div class="qcard" data-q="' + i + '">';
      h += '<div class="qhead"><span class="badge">' + esc(q.id) + '</span>' +
           (cfg.showDomain && q.domain ? '<span>' + esc(q.domain) + '</span>' : '') +
           '<span style="margin-left:auto">' + (i + 1) + ' / ' + qs.length + '</span></div>';
      h += '<div class="qstem">' + q.q + '</div><div class="opts">';
      q.opts.forEach(function (o, j) {
        h += '<button class="opt" type="button" data-i="' + j + '">' +
             '<span class="ltr">' + 'ABCD'[j] + '</span><span>' + o + '</span></button>';
      });
      h += '</div><div class="qwhy" hidden>' + q.why + '</div></div>';
    });
    h += '</div></div>';
    show(h);

    $$('.qcard').forEach(function (card) {
      var i = +card.getAttribute('data-q');
      var q = qs[i];
      $$('.opt', card).forEach(function (b) {
        b.addEventListener('click', function () {
          if (card.getAttribute('data-ans')) return;
          var pickI = +b.getAttribute('data-i');
          card.setAttribute('data-ans', pickI);
          $$('.opt', card).forEach(function (x, j) {
            x.disabled = true;
            if (j === q.ans) x.classList.add('ok');
            else if (j === pickI) x.classList.add('no');
          });
          $('.qwhy', card).hidden = false;
          answered++; if (pickI === q.ans) correct++;
          var s = Math.round(correct / answered * 100);
          $('#scoreV').textContent = s + '%';
          $('#scoreV').style.color = s >= 70 ? 'var(--good)' : 'var(--bad)';
          $('#score').lastElementChild.innerHTML =
            correct + ' certas em ' + answered + ' respondidas (de ' + qs.length + ').<br>' +
            (s >= 70 ? 'Acima do mínimo recomendado.' : 'Abaixo dos 70% recomendados.');
          if (answered === qs.length && cfg.onDone) cfg.onDone(s);
          enhance(card);
        });
      });
    });
  }

  /* =======================================================================
     MAPA DE COMPETENCIAS
     ======================================================================= */
  function viewComp() {
    var h = '<div class="page"><div class="page-head">' +
      '<div class="eyebrow"><i class="dot"></i>Progresso</div><h1>Mapa de competências</h1>' +
      '<p class="lede">Cada competência fica marcada quando todas as aulas do módulo que a ' +
      'desenvolve estão concluídas. É o inverso de um certificado de presença: mostra o que ' +
      'ainda falta.</p></div>';

    h += '<div class="legend">' +
      '<span><i style="--c:var(--good)"></i>Competência adquirida</span>' +
      '<span><i style="--c:var(--surface-3)"></i>Em desenvolvimento</span></div>';

    h += '<div class="hbars" style="margin-bottom:34px">';
    MAN.tracks.forEach(function (t) {
      var p = trackProgress(t);
      h += '<div class="hbar" style="--c:' + trackColor(t) + '">' +
           '<span class="lab">' + esc(t.title) + '</span>' +
           '<span class="track"><i style="width:' + p.pct + '%"></i></span>' +
           '<span class="val">' + p.pct + '%</span></div>';
    });
    h += '</div>';

    MAN.tracks.forEach(function (t) {
      var c = trackColor(t);
      h += '<h2 style="font-size:18px;margin:26px 0 12px;display:flex;align-items:center;gap:9px">' +
           '<i style="width:10px;height:10px;border-radius:3px;background:' + c + ';display:inline-block"></i>' +
           esc(t.title) + '</h2><div class="comp-grid">';
      t.modules.forEach(function (m) {
        var p = modProgress(m);
        h += '<div class="comp-cell"><h4><a href="#/modulo/' + m.id + '" style="text-decoration:none;color:inherit">' +
             esc(m.title) + '</a></h4>' + meter(p.pct, c) +
             '<div class="chips">' + m.competencies.map(function (x) {
               return '<span class="chip' + (p.pct === 100 ? ' on' : '') + '">' +
                      (p.pct === 100 ? '✓ ' : '') + esc(x) + '</span>';
             }).join('') + '</div></div>';
      });
      h += '</div>';
    });
    h += '</div>';
    show(h);
  }

  /* =======================================================================
     BUSCA
     ======================================================================= */
  function viewSearch(q) {
    q = (q || '').trim();
    var h = '<div class="page"><div class="page-head"><div class="eyebrow"><i class="dot"></i>Busca</div>' +
            '<h1>' + (q ? 'Resultados para “' + esc(q) + '”' : 'Buscar no manual') + '</h1></div>';
    if (!q) { h += '<div class="empty">Escreva um termo na caixa de busca.</div></div>'; return show(h); }

    var words = norm(q).split(/\s+/).filter(function (w) { return w.length > 1; });
    var hits = MAN.search.map(function (c) {
      var hay = norm(c.t + ' ' + c.k);
      var s = 0;
      words.forEach(function (w) {
        if (norm(c.t).indexOf(w) >= 0) s += 6;
        if (hay.indexOf(w) >= 0) s += 1;
      });
      return { c: c, s: s };
    }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; });

    if (!hits.length) {
      h += '<div class="empty">Nada encontrado. Tente um termo mais curto ' +
           '(por exemplo <code>cpk</code>, <code>kanban</code>, <code>anova</code>).</div>';
    } else {
      h += '<p class="lede" style="margin-bottom:16px">' + hits.length + ' capítulos.</p>';
      hits.slice(0, 60).forEach(function (x) {
        var m = MODS[x.c.m], t = TRACKS[x.c.tr];
        h += '<a class="hit" href="#/aula/' + x.c.id + '"><div class="h-t">' +
             hl(x.c.t, words) + '</div><div class="h-m">' +
             esc(t ? t.title : '') + ' › ' + esc(m ? m.title : '') +
             ' · Capítulo ' + capLabel(x.c.n) +
             (isRead(x.c.id) ? ' · <span style="color:var(--good)">concluída</span>' : '') +
             '</div></a>';
      });
    }
    h += '</div>';
    show(h);
  }

  function hl(text, words) {
    var out = esc(text);
    words.forEach(function (w) {
      try {
        var re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        // aplica no texto sem acentos mas marca no original por posicao
        var plain = deaccent(out), m2, last = 0, res = '';
        re.lastIndex = 0;
        while ((m2 = re.exec(plain)) !== null) {
          res += out.slice(last, m2.index) + '<mark>' + out.slice(m2.index, m2.index + m2[0].length) + '</mark>';
          last = m2.index + m2[0].length;
          if (re.lastIndex === m2.index) re.lastIndex++;
        }
        out = res + out.slice(last);
      } catch (e) {}
    });
    return out;
  }

  /* =======================================================================
     PROGRESSO / BACKUP
     ======================================================================= */
  function viewProgress() {
    var g = globalProgress();
    var h = '<div class="page"><div class="page-head"><div class="eyebrow"><i class="dot"></i>Dados</div>' +
      '<h1>Progresso e backup</h1><p class="lede">O progresso fica guardado apenas neste navegador. ' +
      'Exporte um ficheiro JSON para o transportar para outro computador ou para não o perder ao ' +
      'limpar os dados do navegador.</p></div>';

    h += '<div class="tiles">' +
      tile('Aulas concluídas', g.done + ' / ' + g.total, g.pct + '% do total') +
      tile('Avaliações feitas', String(Object.keys(P.quiz).length), 'módulos e bancos') +
      tile('Armazenamento', Store.persistent ? 'Ativo' : 'Indisponível',
           Store.persistent ? 'localStorage do navegador' : 'só em memória — exporte!') +
      '</div>';

    h += '<div style="display:flex;flex-wrap:wrap;gap:10px;margin:20px 0">' +
      '<button class="btn" id="expBtn">Exportar progresso (JSON)</button>' +
      '<button class="btn sec" id="impBtn">Importar ficheiro</button>' +
      '<button class="btn sec" id="clrBtn">Apagar todo o progresso</button>' +
      '<input type="file" id="impFile" accept="application/json" hidden></div>';

    var qk = Object.keys(P.quiz);
    if (qk.length) {
      h += '<h2 style="font-size:19px;margin:26px 0 12px">Avaliações</h2><div class="hbars">';
      qk.forEach(function (k) {
        var r = P.quiz[k];
        var name = MODS[k] ? MODS[k].title : k.replace('bank-', 'Banco ');
        var col = r.score >= 70 ? 'var(--good)' : 'var(--bad)';
        h += '<div class="hbar" style="--c:' + col + '"><span class="lab">' + esc(name) +
             '</span><span class="track"><i style="width:' + r.score + '%"></i></span>' +
             '<span class="val">' + r.score + '%</span></div>';
      });
      h += '</div>';
    }
    h += '</div>';
    show(h);

    $('#expBtn').addEventListener('click', function () {
      var blob = new Blob([JSON.stringify(P, null, 2)], { type: 'application/json' });
      var a = el('a', { href: URL.createObjectURL(blob), download: 'academy-progresso.json' });
      document.body.appendChild(a); a.click(); a.remove();
    });
    $('#impBtn').addEventListener('click', function () { $('#impFile').click(); });
    $('#impFile').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var d = JSON.parse(r.result);
          if (d && d.read) { P = d; save(); viewProgress(); }
        } catch (err) { alert('Ficheiro inválido.'); }
      };
      r.readAsText(f);
    });
    $('#clrBtn').addEventListener('click', function () {
      if (confirm('Apagar todo o progresso guardado neste navegador?')) {
        P = { read: {}, quiz: {}, notes: {}, started: Date.now() };
        save(); viewProgress();
      }
    });
  }

  /* =======================================================================
     ROUTER
     ======================================================================= */
  function route() {
    var hash = location.hash.slice(1) || '/';
    var qi = hash.indexOf('?');
    var path = qi >= 0 ? hash.slice(0, qi) : hash;
    var qs = qi >= 0 ? hash.slice(qi + 1) : '';
    var m;
    if (path === '/' || path === '') return viewHome();
    if ((m = path.match(/^\/trilha\/(.+)$/))) return viewTrack(m[1]);
    if ((m = path.match(/^\/modulo\/(.+)$/))) return viewModule(m[1]);
    if ((m = path.match(/^\/aula\/(.+)$/))) return viewLesson(m[1]);
    if ((m = path.match(/^\/quiz\/(.+)$/))) return viewQuiz(m[1]);
    if (path === '/certificacao') return viewBank();
    if (path === '/competencias') return viewComp();
    if (path === '/progresso') return viewProgress();
    if (path === '/laboratorio') return (window.ACADEMY_LAB ? window.ACADEMY_LAB.view(show) : show(
      '<div class="page"><div class="empty">Laboratório indisponível.</div></div>'));
    if (path === '/busca') return viewSearch(decodeURIComponent(qs.replace(/^q=/, '')));
    return viewHome();
  }

  /* =======================================================================
     ARRANQUE
     ======================================================================= */
  buildSidebar();
  window.addEventListener('hashchange', route);

  $('#themeBtn').addEventListener('click', function () {
    var d = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', d ? 'light' : 'dark');
    Store.set('academy.theme', d ? 'light' : 'dark');
    mermaidReady = false;
    if (window.ACADEMY_VIZ) window.ACADEMY_VIZ.retheme();
    $$('.mermaid[data-done]').forEach(function (n) {
      n.removeAttribute('data-done');
      n.textContent = n.getAttribute('data-src') || '';
    });
    route();
  });

  $('#searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('#searchInput').value.trim();
    location.hash = '#/busca?q=' + encodeURIComponent(v);
  });

  var navT = $('#navToggle'), sb = $('#sidebar'), scrim = $('#scrim');
  function closeNav() { sb.classList.remove('open'); scrim.hidden = true; navT.setAttribute('aria-expanded', 'false'); }
  navT.addEventListener('click', function () {
    var open = sb.classList.toggle('open');
    scrim.hidden = !open;
    navT.setAttribute('aria-expanded', String(open));
  });
  scrim.addEventListener('click', closeNav);
  sb.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault(); $('#searchInput').focus();
    }
    if (e.key === 'Escape') { closeNav(); document.activeElement.blur(); }
  });

  // expor para lab.js
  window.ACADEMY_CORE = { show: show, enhance: enhance, esc: esc, $: $, $$: $$, el: el };
  function wireLab(root) { if (window.ACADEMY_LAB) window.ACADEMY_LAB.wire(root); }
  window.ACADEMY_WIRE = wireLab;

  route();
})();
