/* =========================================================================
   Academy — graficos interativos (Plotly) e tooltips de infografico
   Os graficos sao pre-calculados em Python no build; aqui so se renderizam.
   ========================================================================= */
(function () {
  'use strict';

  var A = window.ACADEMY;
  var VEND = 'assets/vendor/';
  var loading = false, queue = [];

  function theme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function cssv(n) {
    return getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  }

  function layoutSkin() {
    var dark = theme() === 'dark';
    return {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'Segoe UI, Inter, system-ui, sans-serif', size: 12.5,
              color: cssv('--ink-2') || (dark ? '#a2b3bb' : '#44545c') },
      title: { font: { size: 14.5, color: cssv('--ink') } },
      xaxis: { gridcolor: cssv('--line-soft'), zerolinecolor: cssv('--line'),
               linecolor: cssv('--line'), tickcolor: cssv('--line') },
      yaxis: { gridcolor: cssv('--line-soft'), zerolinecolor: cssv('--line'),
               linecolor: cssv('--line'), tickcolor: cssv('--line') },
      hoverlabel: { bgcolor: cssv('--surface-1'), bordercolor: cssv('--line'),
                    font: { color: cssv('--ink'), size: 12.5,
                            family: 'Segoe UI, Inter, system-ui, sans-serif' } },
      legend: { bgcolor: 'rgba(0,0,0,0)', font: { color: cssv('--ink-2') } },
      margin: { l: 58, r: 24, t: 44, b: 48 }
    };
  }

  function deepSkin(layout) {
    var sk = layoutSkin();
    var out = JSON.parse(JSON.stringify(layout || {}));
    function merge(dst, src) {
      for (var k in src) {
        if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
          dst[k] = merge(dst[k] || {}, src[k]);
        } else if (dst[k] === undefined) {
          dst[k] = src[k];
        }
      }
      return dst;
    }
    // aplica o skin a todos os eixos existentes (xaxis, xaxis2, ...)
    Object.keys(out).forEach(function (k) {
      if (/^[xy]axis\d*$/.test(k)) merge(out[k], k[0] === 'x' ? sk.xaxis : sk.yaxis);
    });
    if (!out.xaxis) out.xaxis = sk.xaxis;
    if (!out.yaxis) out.yaxis = sk.yaxis;
    ['paper_bgcolor', 'plot_bgcolor'].forEach(function (k) { out[k] = sk[k]; });
    out.font = merge(out.font || {}, sk.font);
    out.hoverlabel = merge(out.hoverlabel || {}, sk.hoverlabel);
    out.legend = merge(out.legend || {}, sk.legend);
    out.margin = merge(out.margin || {}, sk.margin);
    if (out.title) out.title = merge(out.title, sk.title);
    // cores declaradas como token CSS -> valor real
    var s = JSON.stringify(out).replace(/"@([a-z0-9-]+)"/g, function (m, n) {
      return JSON.stringify(cssv('--' + n) || '#888');
    });
    return JSON.parse(s);
  }

  function resolveTokens(o) {
    return JSON.parse(JSON.stringify(o).replace(/"@([a-z0-9-]+)"/g, function (m, n) {
      return JSON.stringify(cssv('--' + n) || '#888');
    }));
  }

  var CONFIG = {
    displaylogo: false, responsive: true, displayModeBar: 'hover',
    locale: 'pt-br',
    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d', 'toggleSpikelines'],
    toImageButtonOptions: { format: 'png', scale: 2 }
  };

  function ensurePlotly(cb) {
    if (window.Plotly) return cb();
    queue.push(cb);
    if (loading) return;
    loading = true;
    var s = document.createElement('script');
    s.src = VEND + 'plotly/plotly.min.js';
    s.onload = function () { queue.splice(0).forEach(function (f) { f(); }); };
    s.onerror = function () {
      queue.splice(0);
      document.querySelectorAll('.plotly-fig').forEach(function (n) {
        n.innerHTML = '<div class="viz-fallback">Gráfico indisponível: ' +
                      'o ficheiro <code>assets/vendor/plotly/plotly.min.js</code> não carregou.</div>';
      });
    };
    document.head.appendChild(s);
  }

  function render(root) {
    var nodes = Array.prototype.slice.call(
      (root || document).querySelectorAll('.plotly-fig:not([data-done])'));
    if (!nodes.length) return;
    var figs = A.data.figs || {};
    ensurePlotly(function () {
      nodes.forEach(function (n) {
        n.setAttribute('data-done', '1');
        var name = n.getAttribute('data-fig');
        var f = figs[name];
        if (!f) {
          n.innerHTML = '<div class="viz-fallback">Figura <code>' + name + '</code> não encontrada.</div>';
          return;
        }
        var host = document.createElement('div');
        host.className = 'plotly-host';
        n.appendChild(host);
        try {
          window.Plotly.newPlot(host, {
            data: resolveTokens(f.data),
            layout: deepSkin(f.layout),
            frames: f.frames ? resolveTokens(f.frames) : undefined,
            config: Object.assign({}, CONFIG, f.config || {})
          });
        } catch (e) {
          n.innerHTML = '<div class="viz-fallback">Não foi possível desenhar este gráfico.</div>';
        }
      });
    });
  }

  function retheme() {
    if (!window.Plotly) return;
    document.querySelectorAll('.plotly-fig[data-done]').forEach(function (n) {
      var name = n.getAttribute('data-fig');
      var f = (A.data.figs || {})[name];
      var host = n.querySelector('.plotly-host');
      if (!f || !host) return;
      try {
        window.Plotly.react(host, {
          data: resolveTokens(f.data),
          layout: deepSkin(f.layout),
          frames: f.frames ? resolveTokens(f.frames) : undefined,
          config: Object.assign({}, CONFIG, f.config || {})
        });
      } catch (e) {}
    });
  }

  /* ---------- tooltips em infograficos (atributo data-tip) ---------------- */
  var tipEl = null;
  function tip() {
    if (!tipEl) {
      tipEl = document.createElement('div');
      tipEl.className = 'infotip';
      tipEl.setAttribute('role', 'tooltip');
      document.body.appendChild(tipEl);
    }
    return tipEl;
  }
  function showTip(target) {
    var t = tip();
    t.innerHTML = target.getAttribute('data-tip');
    t.classList.add('on');
    var r = target.getBoundingClientRect();
    var tr = t.getBoundingClientRect();
    var left = r.left + r.width / 2 - tr.width / 2;
    left = Math.max(10, Math.min(left, innerWidth - tr.width - 10));
    var top = r.top - tr.height - 11;
    if (top < 8) top = r.bottom + 11;
    t.style.left = left + 'px';
    t.style.top = top + 'px';
  }
  function hideTip() { if (tipEl) tipEl.classList.remove('on'); }

  function wireTips(root) {
    var nodes = (root || document).querySelectorAll('[data-tip]:not([data-tipped])');
    Array.prototype.forEach.call(nodes, function (n) {
      n.setAttribute('data-tipped', '1');
      if (!n.hasAttribute('tabindex')) n.setAttribute('tabindex', '0');
      n.addEventListener('mouseenter', function () { showTip(n); });
      n.addEventListener('focus', function () { showTip(n); });
      n.addEventListener('mouseleave', hideTip);
      n.addEventListener('blur', hideTip);
      n.addEventListener('click', function (e) { e.stopPropagation(); showTip(n); });
    });
  }
  document.addEventListener('scroll', hideTip, true);

  /* ---------- separadores Python / R -------------------------------------- */
  function wireTabs(root) {
    var nodes = (root || document).querySelectorAll('.codetabs:not([data-wired])');
    Array.prototype.forEach.call(nodes, function (box) {
      box.setAttribute('data-wired', '1');
      var tabs = box.querySelectorAll('.ct-tab');
      var panes = box.querySelectorAll('.ct-pane');
      Array.prototype.forEach.call(tabs, function (t, i) {
        t.addEventListener('click', function () {
          Array.prototype.forEach.call(tabs, function (x, j) {
            x.classList.toggle('on', i === j);
            x.setAttribute('aria-selected', String(i === j));
          });
          Array.prototype.forEach.call(panes, function (p, j) { p.hidden = i !== j; });
          if (window.ACADEMY_HL) window.ACADEMY_HL(box);
          if (window.ACADEMY_LAB) window.ACADEMY_LAB.wire(box);
        });
      });
    });
  }

  window.ACADEMY_VIZ = {
    render: render, retheme: retheme, wireTips: wireTips, wireTabs: wireTabs,
    all: function (root) { render(root); wireTips(root); wireTabs(root); }
  };
})();
