/* =========================================================================
   Academy — Laboratorio de simuladores e calculadoras
   SPC (cartas de controlo X-bar/R), capacidade do processo (Cp/Cpk/Ppk) e OEE.
   Modulo independente: nao depende do estado interno de app.js, so da ponte
   publica window.ACADEMY_APP (show/T/esc/$$) e do carregador de Plotly de
   viz.js (window.ACADEMY_VIZ.ensurePlotly/cssv).
   ========================================================================= */
(function () {
  'use strict';

  var APP = function () { return window.ACADEMY_APP; };
  var T = function (k, v) { return APP().T(k, v); };
  var esc = function (s) { return APP().esc(s); };

  /* ---------- estatistica ---------- */
  function randn() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function erf(x) {
    var sign = x < 0 ? -1 : 1; x = Math.abs(x);
    var a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741,
        a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    var t = 1 / (1 + p * x);
    var y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }
  function normCdf(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }
  function normPdf(x, mean, sigma) {
    var z = (x - mean) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
  }
  function fmt(n, d) { return isFinite(n) ? n.toFixed(d == null ? 2 : d) : '—'; }

  /* constantes de cartas X-bar/R (Montgomery, Introduction to Statistical
     Quality Control) para tamanhos de subgrupo n = 2..10 */
  var SPC_CONST = {
    2:  { A2: 1.880, D3: 0,     D4: 3.267 },
    3:  { A2: 1.023, D3: 0,     D4: 2.574 },
    4:  { A2: 0.729, D3: 0,     D4: 2.282 },
    5:  { A2: 0.577, D3: 0,     D4: 2.114 },
    6:  { A2: 0.483, D3: 0,     D4: 2.004 },
    7:  { A2: 0.419, D3: 0.076, D4: 1.924 },
    8:  { A2: 0.373, D3: 0.136, D4: 1.864 },
    9:  { A2: 0.337, D3: 0.184, D4: 1.816 },
    10: { A2: 0.308, D3: 0.223, D4: 1.777 }
  };

  var activeRedraw = null;
  document.addEventListener('DOMContentLoaded', wireThemeObserver);
  wireThemeObserver();
  function wireThemeObserver() {
    if (wireThemeObserver.done) return;
    wireThemeObserver.done = true;
    new MutationObserver(function () { if (activeRedraw) activeRedraw(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function skinLayout(extra) {
    var VIZ = window.ACADEMY_VIZ;
    var cv = function (n) { return VIZ.cssv(n) || '#888'; };
    var base = {
      paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'Segoe UI, Inter, system-ui, sans-serif', size: 12.5, color: cv('--ink-2') },
      hoverlabel: { bgcolor: cv('--surface-1'), bordercolor: cv('--line'),
                    font: { color: cv('--ink'), size: 12.5 } },
      margin: { l: 56, r: 20, t: 34, b: 44 },
      showlegend: false
    };
    return Object.assign(base, extra);
  }
  function axisSkin() {
    var VIZ = window.ACADEMY_VIZ;
    var cv = function (n) { return VIZ.cssv(n) || '#888'; };
    return {
      gridcolor: cv('--line-soft'), zerolinecolor: cv('--line'),
      linecolor: cv('--line'), tickcolor: cv('--line')
    };
  }

  /* =======================================================================
     INDICE
     ======================================================================= */
  function index() {
    var h = '<div class="page"><div class="page-head">';
    h += '<div class="eyebrow"><i class="dot" style="--c:var(--series-1)"></i>' + T('lab.eyebrow') + '</div>';
    h += '<h1>' + T('lab.title') + '</h1>';
    h += '<p class="lede">' + T('lab.lede') + '</p></div>';
    h += '<div class="cards">';
    h += '<a class="card" href="#/simuladores/spc" style="--c:var(--series-1)"><h3>' + T('lab.card.spc.t') + '</h3>' +
         '<p>' + T('lab.card.spc.s') + '</p><div class="card-meta"><span>' + T('lab.tryit') + '</span></div></a>';
    h += '<a class="card" href="#/simuladores/cpk" style="--c:var(--series-2)"><h3>' + T('lab.card.cpk.t') + '</h3>' +
         '<p>' + T('lab.card.cpk.s') + '</p><div class="card-meta"><span>' + T('lab.tryit') + '</span></div></a>';
    h += '<a class="card" href="#/simuladores/oee" style="--c:var(--series-3)"><h3>' + T('lab.card.oee.t') + '</h3>' +
         '<p>' + T('lab.card.oee.s') + '</p><div class="card-meta"><span>' + T('lab.tryit') + '</span></div></a>';
    h += '</div></div>';
    activeRedraw = null;
    APP().show(h);
  }

  function view(tool) {
    if (tool === 'spc') return viewSpc();
    if (tool === 'cpk') return viewCpk();
    if (tool === 'oee') return viewOee();
    activeRedraw = null;
    APP().show('<div class="page"><div class="empty">' + T('lab.notfound') +
      '<br><a class="btn sec" style="margin-top:16px" href="#/simuladores">' + T('lab.back') + '</a></div></div>');
  }

  function pageHead(titleKey, ledeKey, colorVar) {
    return '<div class="page-head">' +
      '<div class="crumb"><a href="#/simuladores">' + T('lab.back') + '</a></div>' +
      '<div class="eyebrow"><i class="dot" style="--c:' + colorVar + '"></i>' + T('lab.eyebrow') + '</div>' +
      '<h1>' + T(titleKey) + '</h1><p class="lede">' + T(ledeKey) + '</p></div>';
  }

  /* =======================================================================
     SPC — cartas X-bar / R
     ======================================================================= */
  function viewSpc() {
    var h = '<div class="page">' + pageHead('lab.spc.title', 'lab.spc.lede', 'var(--series-1)');
    h += '<div class="lab-grid"><div class="lab-panel">';
    h += '<div class="lab-row"><div class="lab-field"><label for="spc-n">' + T('lab.spc.n') + '</label>' +
         '<select id="spc-n">' + [2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) {
           return '<option value="' + n + '"' + (n === 5 ? ' selected' : '') + '>' + n + '</option>';
         }).join('') + '</select></div>' +
         '<div class="lab-field"><label for="spc-k">' + T('lab.spc.k') + '</label>' +
         '<input id="spc-k" type="number" min="10" max="60" step="1" value="25"></div></div>';
    h += '<div class="lab-row"><div class="lab-field"><label for="spc-mean">' + T('lab.spc.mean') + '</label>' +
         '<input id="spc-mean" type="number" step="any" value="100"></div>' +
         '<div class="lab-field"><label for="spc-sigma">' + T('lab.spc.sigma') + '</label>' +
         '<input id="spc-sigma" type="number" step="any" min="0.0001" value="5"></div></div>';
    h += '<div class="lab-row"><div class="lab-field"><label for="spc-shift">' + T('lab.spc.shift') + '</label>' +
         '<input id="spc-shift" type="number" step="any" value="0"></div>' +
         '<div class="lab-field"><label for="spc-shiftat">' + T('lab.spc.shiftat') + '</label>' +
         '<input id="spc-shiftat" type="number" min="1" step="1" value="16"></div></div>';
    h += '<label class="lab-check"><input type="checkbox" id="spc-rule2"> ' + T('lab.spc.rule2') + '</label>';
    h += '<button class="btn" id="spc-run" style="margin-top:14px;width:100%">' + T('lab.spc.regenerate') + '</button>';
    h += '<div class="lab-verdict" id="spc-summary"></div>';
    h += '<p class="lab-note">' + T('lab.spc.formula') + '</p>';
    h += '</div><div class="lab-chart" id="spc-chart"></div></div></div>';

    APP().show(h);
    var $ = APP().$;

    function draw() {
      var el = document.getElementById('spc-chart');
      if (!el) return;
      var n = parseInt($('#spc-n').value, 10) || 5;
      var k = Math.max(5, Math.min(60, parseInt($('#spc-k').value, 10) || 25));
      var mean = parseFloat($('#spc-mean').value); if (!isFinite(mean)) mean = 100;
      var sigma = parseFloat($('#spc-sigma').value); if (!isFinite(sigma) || sigma <= 0) sigma = 5;
      var shift = parseFloat($('#spc-shift').value); if (!isFinite(shift)) shift = 0;
      var shiftAt = parseInt($('#spc-shiftat').value, 10) || k + 1;
      var checkRule2 = $('#spc-rule2').checked;
      var c = SPC_CONST[n] || SPC_CONST[5];

      var xbars = [], ranges = [];
      for (var i = 1; i <= k; i++) {
        var mu = mean + (i >= shiftAt ? shift * sigma : 0);
        var vals = [];
        for (var j = 0; j < n; j++) vals.push(mu + sigma * randn());
        var s = vals.reduce(function (a, b) { return a + b; }, 0) / n;
        xbars.push(s);
        ranges.push(Math.max.apply(null, vals) - Math.min.apply(null, vals));
      }
      var xbarbar = xbars.reduce(function (a, b) { return a + b; }, 0) / k;
      var rbar = ranges.reduce(function (a, b) { return a + b; }, 0) / k;
      var uclX = xbarbar + c.A2 * rbar, lclX = xbarbar - c.A2 * rbar;
      var uclR = c.D4 * rbar, lclR = c.D3 * rbar;

      var idx = xbars.map(function (_, i) { return i + 1; });
      var oocCount = 0;
      var colorsX = xbars.map(function (v, i) {
        var ooc = v > uclX || v < lclX;
        var run8 = false;
        if (!ooc && checkRule2 && i >= 7) {
          var side = xbars[i] > xbarbar;
          run8 = true;
          for (var q = i - 7; q <= i; q++) { if ((xbars[q] > xbarbar) !== side) { run8 = false; break; } }
        }
        if (ooc) oocCount++;
        return ooc ? APP2cssv('--bad') : (run8 ? APP2cssv('--warn') : APP2cssv('--accent'));
      });
      var colorsR = ranges.map(function (v) { return (v > uclR || v < lclR) ? APP2cssv('--bad') : APP2cssv('--accent-ink'); });

      function limitShapes(y0, y1, yref, color) {
        return { type: 'line', xref: 'x', yref: yref, x0: 0.5, x1: k + 0.5, y0: y0, y1: y1,
                 line: { color: color, width: 1.4, dash: y0 === y1 && y0 === (yref === 'y' ? xbarbar : rbar) ? 'dot' : 'dash' } };
      }
      var ax = axisSkin();
      var shapes = [
        limitShapes(xbarbar, xbarbar, 'y', APP2cssv('--ink-3')),
        limitShapes(uclX, uclX, 'y', APP2cssv('--bad')),
        limitShapes(lclX, lclX, 'y', APP2cssv('--bad')),
        limitShapes(rbar, rbar, 'y2', APP2cssv('--ink-3')),
        limitShapes(uclR, uclR, 'y2', APP2cssv('--bad'))
      ];
      if (lclR > 0) shapes.push(limitShapes(lclR, lclR, 'y2', APP2cssv('--bad')));

      var data = [
        { x: idx, y: xbars, mode: 'lines+markers', type: 'scatter',
          line: { color: APP2cssv('--accent'), width: 1.4 },
          marker: { color: colorsX, size: 7 },
          xaxis: 'x', yaxis: 'y', name: 'X̄',
          hovertemplate: T('lab.spc.hover.xbar') + '<extra></extra>' },
        { x: idx, y: ranges, mode: 'lines+markers', type: 'scatter',
          line: { color: APP2cssv('--accent-ink'), width: 1.4 },
          marker: { color: colorsR, size: 7 },
          xaxis: 'x2', yaxis: 'y2', name: 'R',
          hovertemplate: T('lab.spc.hover.r') + '<extra></extra>' }
      ];
      var layout = skinLayout({
        xaxis: Object.assign({ title: T('lab.spc.axis.subgroup'), domain: [0, 1], anchor: 'y' }, ax),
        yaxis: Object.assign({ title: 'X̄', domain: [0.56, 1] }, ax),
        xaxis2: Object.assign({ title: T('lab.spc.axis.subgroup'), domain: [0, 1], anchor: 'y2', matches: 'x' }, ax),
        yaxis2: Object.assign({ title: 'R', domain: [0, 0.42] }, ax),
        shapes: shapes
      });
      window.ACADEMY_VIZ.ensurePlotly(function () {
        window.Plotly.react(el, data, layout, Object.assign({}, window.ACADEMY_VIZ.config, { displaylogo: false, responsive: true }));
      });

      var summary = document.getElementById('spc-summary');
      var verdictClass = oocCount === 0 ? 'good' : (oocCount <= 2 ? 'warn' : 'bad');
      summary.className = 'lab-verdict ' + verdictClass;
      summary.innerHTML = T('lab.spc.summary', { ooc: oocCount, k: k }) +
        '<br><span style="font-weight:400">UCL̄=' + fmt(uclX) + ' · CL=' + fmt(xbarbar) + ' · LCL=' + fmt(lclX) + '</span>';
    }

    activeRedraw = draw;
    ['#spc-n', '#spc-k', '#spc-mean', '#spc-sigma', '#spc-shift', '#spc-shiftat'].forEach(function (sel) {
      $(sel).addEventListener('input', draw);
    });
    $('#spc-rule2').addEventListener('change', draw);
    $('#spc-run').addEventListener('click', draw);
    draw();
  }

  /* pequeno atalho local para nao repetir window.ACADEMY_VIZ.cssv(...) */
  function APP2cssv(n) { return window.ACADEMY_VIZ.cssv(n) || '#888'; }

  /* =======================================================================
     CAPACIDADE DO PROCESSO — Cp / Cpk
     ======================================================================= */
  function viewCpk() {
    var h = '<div class="page">' + pageHead('lab.cpk.title', 'lab.cpk.lede', 'var(--series-2)');
    h += '<div class="lab-grid"><div class="lab-panel">';
    h += '<div class="lab-row"><div class="lab-field"><label for="cpk-lsl">' + T('lab.cpk.lsl') + '</label>' +
         '<input id="cpk-lsl" type="number" step="any" value="90"></div>' +
         '<div class="lab-field"><label for="cpk-usl">' + T('lab.cpk.usl') + '</label>' +
         '<input id="cpk-usl" type="number" step="any" value="110"></div></div>';
    h += '<div class="lab-row"><div class="lab-field"><label for="cpk-mean">' + T('lab.cpk.mean') + '</label>' +
         '<input id="cpk-mean" type="number" step="any" value="101"></div>' +
         '<div class="lab-field"><label for="cpk-sigma">' + T('lab.cpk.sigma') + '</label>' +
         '<input id="cpk-sigma" type="number" step="any" min="0.0001" value="2.2"></div></div>';
    h += '<div class="lab-field"><label for="cpk-mode">' + T('lab.cpk.mode') + '</label>' +
         '<select id="cpk-mode"><option value="short">' + T('lab.cpk.mode.short') + '</option>' +
         '<option value="long">' + T('lab.cpk.mode.long') + '</option></select></div>';
    h += '<div class="tiles" id="cpk-tiles" style="margin-top:6px"></div>';
    h += '<div class="lab-verdict" id="cpk-summary"></div>';
    h += '<p class="lab-note">' + T('lab.cpk.formula') + '</p>';
    h += '</div><div class="lab-chart" id="cpk-chart"></div></div></div>';

    APP().show(h);
    var $ = APP().$;

    function tile(k, v, s) {
      return '<div class="tile"><div class="k">' + esc(k) + '</div><div class="v">' + v + '</div>' +
             (s ? '<div class="s">' + s + '</div>' : '') + '</div>';
    }

    function draw() {
      var el = document.getElementById('cpk-chart');
      if (!el) return;
      var lsl = parseFloat($('#cpk-lsl').value);
      var usl = parseFloat($('#cpk-usl').value);
      var mean = parseFloat($('#cpk-mean').value);
      var sigma = parseFloat($('#cpk-sigma').value);
      var longTerm = $('#cpk-mode').value === 'long';
      var pLabel = longTerm ? 'Pp' : 'Cp';
      var pkLabel = longTerm ? 'Ppk' : 'Cpk';

      var tiles = document.getElementById('cpk-tiles');
      if (!(isFinite(lsl) && isFinite(usl) && isFinite(mean) && isFinite(sigma) && sigma > 0 && usl > lsl)) {
        tiles.innerHTML = tile(T('lab.cpk.invalid'), '—');
        document.getElementById('cpk-summary').innerHTML = '';
        return;
      }
      var cp = (usl - lsl) / (6 * sigma);
      var zUsl = (usl - mean) / sigma, zLsl = (mean - lsl) / sigma;
      var cpu = zUsl / 3, cpl = zLsl / 3;
      var cpk = Math.min(cpu, cpl);
      var target = (usl + lsl) / 2;
      var kIdx = Math.abs(mean - target) / ((usl - lsl) / 2) * 100;
      var ppmUpper = (1 - normCdf(zUsl)) * 1e6;
      var ppmLower = (1 - normCdf(zLsl)) * 1e6;
      var ppmTotal = ppmUpper + ppmLower;
      var sigmaLevel = 3 * cpk;

      tiles.innerHTML =
        tile(pLabel, fmt(cp), T('lab.cpk.cp.s')) +
        tile(pkLabel, fmt(cpk), T('lab.cpk.cpk.s')) +
        tile(T('lab.cpk.k'), fmt(kIdx, 1) + '%', T('lab.cpk.k.s')) +
        tile(T('lab.cpk.ppm'), fmt(ppmTotal, 0), T('lab.cpk.ppm.s')) +
        tile(T('lab.cpk.sigma.level'), fmt(sigmaLevel, 2) + 'σ', T('lab.cpk.sigma.short')) +
        tile(T('lab.cpk.sigma.shifted'), fmt(sigmaLevel + 1.5, 2) + 'σ', T('lab.cpk.sigma.long'));

      var summary = document.getElementById('cpk-summary');
      var cls = cpk >= 1.33 ? 'good' : (cpk >= 1.0 ? 'warn' : 'bad');
      var verdictKey = cpk >= 1.33 ? 'lab.cpk.verdict.good' : (cpk >= 1.0 ? 'lab.cpk.verdict.warn' : 'lab.cpk.verdict.bad');
      summary.className = 'lab-verdict ' + cls;
      summary.innerHTML = T(verdictKey, { cpk: fmt(cpk) });

      var xmin = Math.min(mean - 4.5 * sigma, lsl - 0.5 * sigma);
      var xmax = Math.max(mean + 4.5 * sigma, usl + 0.5 * sigma);
      var N = 220, xs = [], ys = [];
      for (var i = 0; i <= N; i++) {
        var x = xmin + (xmax - xmin) * i / N;
        xs.push(x); ys.push(normPdf(x, mean, sigma));
      }
      function tail(from, to) {
        var tx = [], ty = [];
        for (var i = 0; i <= 60; i++) {
          var x = from + (to - from) * i / 60;
          tx.push(x); ty.push(normPdf(x, mean, sigma));
        }
        return { x: tx, y: ty };
      }
      var leftTail = tail(xmin, Math.min(lsl, xmax));
      var rightTail = tail(Math.max(usl, xmin), xmax);
      var ax = axisSkin();
      var data = [
        { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color: APP2cssv('--accent'), width: 2 },
          hovertemplate: 'x=%{x:.2f}<extra></extra>' },
        { x: leftTail.x, y: leftTail.y, type: 'scatter', mode: 'lines', fill: 'tozeroy',
          line: { color: 'transparent' }, fillcolor: color_alpha(APP2cssv('--bad'), 0.35), hoverinfo: 'skip' },
        { x: rightTail.x, y: rightTail.y, type: 'scatter', mode: 'lines', fill: 'tozeroy',
          line: { color: 'transparent' }, fillcolor: color_alpha(APP2cssv('--bad'), 0.35), hoverinfo: 'skip' }
      ];
      var shapes = [
        { type: 'line', xref: 'x', yref: 'paper', x0: lsl, x1: lsl, y0: 0, y1: 1, line: { color: APP2cssv('--bad'), width: 1.6, dash: 'dash' } },
        { type: 'line', xref: 'x', yref: 'paper', x0: usl, x1: usl, y0: 0, y1: 1, line: { color: APP2cssv('--bad'), width: 1.6, dash: 'dash' } },
        { type: 'line', xref: 'x', yref: 'paper', x0: mean, x1: mean, y0: 0, y1: 1, line: { color: APP2cssv('--ink-3'), width: 1.4, dash: 'dot' } }
      ];
      var layout = skinLayout({
        xaxis: Object.assign({ title: T('lab.cpk.axis.x') }, ax),
        yaxis: Object.assign({ title: T('lab.cpk.axis.density') }, ax),
        annotations: [
          { x: lsl, y: 1, yref: 'paper', showarrow: false, text: 'LSL', font: { color: APP2cssv('--bad'), size: 11.5 }, yanchor: 'bottom' },
          { x: usl, y: 1, yref: 'paper', showarrow: false, text: 'USL', font: { color: APP2cssv('--bad'), size: 11.5 }, yanchor: 'bottom' }
        ],
        shapes: shapes
      });
      window.ACADEMY_VIZ.ensurePlotly(function () {
        window.Plotly.react(el, data, layout, Object.assign({}, window.ACADEMY_VIZ.config, { displaylogo: false, responsive: true }));
      });
    }

    activeRedraw = draw;
    ['#cpk-lsl', '#cpk-usl', '#cpk-mean', '#cpk-sigma', '#cpk-mode'].forEach(function (sel) {
      $(sel).addEventListener('input', draw);
      $(sel).addEventListener('change', draw);
    });
    draw();
  }

  function color_alpha(cssColor, alpha) {
    var d = document.createElement('div');
    d.style.color = cssColor;
    document.body.appendChild(d);
    var rgb = getComputedStyle(d).color;
    document.body.removeChild(d);
    var m = rgb.match(/[\d.]+/g) || [136, 136, 136];
    return 'rgba(' + m[0] + ',' + m[1] + ',' + m[2] + ',' + alpha + ')';
  }

  /* =======================================================================
     OEE — Overall Equipment Effectiveness
     ======================================================================= */
  function viewOee() {
    var h = '<div class="page">' + pageHead('lab.oee.title', 'lab.oee.lede', 'var(--series-3)');
    h += '<div class="lab-grid"><div class="lab-panel">';
    h += '<div class="lab-field"><label for="oee-planned">' + T('lab.oee.planned') + '</label>' +
         '<input id="oee-planned" type="number" step="any" min="0" value="480"></div>';
    h += '<div class="lab-field"><label for="oee-down">' + T('lab.oee.downtime') + '</label>' +
         '<input id="oee-down" type="number" step="any" min="0" value="45"></div>';
    h += '<div class="lab-field"><label for="oee-cycle">' + T('lab.oee.cycle') + '</label>' +
         '<input id="oee-cycle" type="number" step="any" min="0" value="0.5"></div>';
    h += '<div class="lab-row"><div class="lab-field"><label for="oee-total">' + T('lab.oee.total') + '</label>' +
         '<input id="oee-total" type="number" step="any" min="0" value="700"></div>' +
         '<div class="lab-field"><label for="oee-good">' + T('lab.oee.good') + '</label>' +
         '<input id="oee-good" type="number" step="any" min="0" value="665"></div></div>';
    h += '<div class="tiles" id="oee-tiles" style="margin-top:6px"></div>';
    h += '<div class="lab-verdict" id="oee-summary"></div>';
    h += '<p class="lab-note">' + T('lab.oee.formula') + '</p>';
    h += '</div><div class="lab-chart" id="oee-chart"></div></div></div>';

    APP().show(h);
    var $ = APP().$;

    function tile(k, v, s) {
      return '<div class="tile"><div class="k">' + esc(k) + '</div><div class="v">' + v + '</div>' +
             (s ? '<div class="s">' + s + '</div>' : '') + '</div>';
    }

    function draw() {
      var el = document.getElementById('oee-chart');
      if (!el) return;
      var planned = parseFloat($('#oee-planned').value);
      var down = parseFloat($('#oee-down').value);
      var cycle = parseFloat($('#oee-cycle').value);
      var total = parseFloat($('#oee-total').value);
      var good = parseFloat($('#oee-good').value);
      var tiles = document.getElementById('oee-tiles');
      var summary = document.getElementById('oee-summary');

      if (![planned, down, cycle, total, good].every(isFinite) || planned <= 0 || total <= 0 || good > total || down > planned) {
        tiles.innerHTML = tile(T('lab.cpk.invalid'), '—');
        summary.innerHTML = '';
        return;
      }
      var runTime = Math.max(planned - down, 0.0001);
      var availability = runTime / planned;
      var performance = (cycle * total) / runTime;
      var quality = good / total;
      var oee = availability * performance * quality;
      var clamp = function (v) { return Math.max(0, Math.min(1.5, v)); };

      tiles.innerHTML =
        tile(T('lab.oee.availability'), fmt(availability * 100, 1) + '%', T('lab.oee.availability.s')) +
        tile(T('lab.oee.performance'), fmt(performance * 100, 1) + '%', T('lab.oee.performance.s')) +
        tile(T('lab.oee.quality'), fmt(quality * 100, 1) + '%', T('lab.oee.quality.s')) +
        tile('OEE', fmt(oee * 100, 1) + '%', T('lab.oee.oee.s'));

      var cls = oee >= 0.85 ? 'good' : (oee >= 0.6 ? 'warn' : 'bad');
      var verdictKey = oee >= 0.85 ? 'lab.oee.verdict.good' : (oee >= 0.6 ? 'lab.oee.verdict.warn' : 'lab.oee.verdict.bad');
      summary.className = 'lab-verdict ' + cls;
      summary.innerHTML = T(verdictKey, { oee: fmt(oee * 100, 1) });
      if (performance > 1.0001) {
        summary.innerHTML += '<br><span style="font-weight:400">' + T('lab.oee.perfwarn') + '</span>';
      }

      var cats = [T('lab.oee.availability'), T('lab.oee.performance'), T('lab.oee.quality'), 'OEE'];
      var vals = [clamp(availability) * 100, clamp(performance) * 100, clamp(quality) * 100, clamp(oee) * 100];
      var bench = [90, 95, 99, 85];
      var ax = axisSkin();
      var data = [
        { x: cats, y: vals, type: 'bar',
          marker: { color: [APP2cssv('--series-1'), APP2cssv('--series-3'), APP2cssv('--series-4'), APP2cssv('--accent')] },
          hovertemplate: '%{x}: %{y:.1f}%<extra></extra>' }
      ];
      var shapes = bench.map(function (b, i) {
        return { type: 'line', xref: 'x', yref: 'y', x0: i - 0.4, x1: i + 0.4, y0: b, y1: b,
                 line: { color: APP2cssv('--ink-3'), width: 1.6, dash: 'dash' } };
      });
      var layout = skinLayout({
        xaxis: Object.assign({}, ax),
        yaxis: Object.assign({ title: '%', range: [0, Math.max(105, Math.max.apply(null, vals) + 10)] }, ax),
        shapes: shapes,
        annotations: [{ x: 3, y: bench[3] + 3, showarrow: false, text: T('lab.oee.benchmark'),
                        font: { color: APP2cssv('--ink-3'), size: 10.5 } }]
      });
      window.ACADEMY_VIZ.ensurePlotly(function () {
        window.Plotly.react(el, data, layout, Object.assign({}, window.ACADEMY_VIZ.config, { displaylogo: false, responsive: true }));
      });
    }

    activeRedraw = draw;
    ['#oee-planned', '#oee-down', '#oee-cycle', '#oee-total', '#oee-good'].forEach(function (sel) {
      $(sel).addEventListener('input', draw);
    });
    draw();
  }

  window.ACADEMY_LAB = { index: index, view: view };
})();
