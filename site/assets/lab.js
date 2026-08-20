/* =========================================================================
   Academy — Laboratorio Python no navegador (Pyodide / WebAssembly)
   Carrega sob procura: nada e descarregado ate a primeira execucao.
   ========================================================================= */
(function () {
  'use strict';

  var PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  var CORE_PKGS = ['numpy', 'pandas', 'scipy', 'matplotlib'];
  var EXTRA_PKGS = ['statsmodels', 'scikit-learn'];

  var py = null, booting = null, statusEls = [];

  function setStatus(kind, text) {
    statusEls.forEach(function (n) {
      if (!n.isConnected) return;
      n.className = 'lab-status ' + kind;
      n.lastElementChild.textContent = text;
    });
  }

  function statusBar(text) {
    var d = document.createElement('div');
    d.className = 'lab-status';
    d.innerHTML = '<i class="pulse"></i><span>' + text + '</span>';
    statusEls.push(d);
    return d;
  }

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = function () { rej(new Error('rede')); };
      document.head.appendChild(s);
    });
  }

  var PRELUDE = [
    'import sys, io, base64, json',
    'import matplotlib',
    'matplotlib.use("AGG")',
    'import matplotlib.pyplot as plt',
    'plt.rcParams.update({',
    '  "figure.figsize": (7.2, 4.2), "figure.dpi": 120,',
    '  "font.size": 9.5, "axes.grid": True, "grid.alpha": 0.25,',
    '  "axes.spines.top": False, "axes.spines.right": False,',
    '})',
    'import numpy as np, pandas as pd',
    'pd.set_option("display.width", 110)',
    'pd.set_option("display.max_columns", 24)',
    '',
    'def _academy_figs():',
    '    out = []',
    '    for num in plt.get_fignums():',
    '        f = plt.figure(num)',
    '        buf = io.BytesIO()',
    '        f.savefig(buf, format="png", bbox_inches="tight", facecolor="white")',
    '        out.append(base64.b64encode(buf.getvalue()).decode())',
    '    plt.close("all")',
    '    return out',
    ''
  ].join('\n');

  function boot(extra) {
    if (py && !extra) return Promise.resolve(py);
    if (booting) return booting;
    setStatus('loading', 'A descarregar o motor Python (Pyodide)… primeira vez, ~15 MB.');
    booting = loadScript(PYODIDE_URL + 'pyodide.js')
      .then(function () {
        setStatus('loading', 'A iniciar o interpretador…');
        return window.loadPyodide({ indexURL: PYODIDE_URL });
      })
      .then(function (p) {
        py = p;
        setStatus('loading', 'A carregar numpy, pandas, scipy e matplotlib…');
        return py.loadPackage(CORE_PKGS);
      })
      .then(function () {
        return py.runPythonAsync(PRELUDE);
      })
      .then(function () {
        setStatus('ready', 'Python pronto — numpy, pandas, scipy e matplotlib carregados.');
        return py;
      })
      .catch(function (e) {
        booting = null;
        setStatus('err', 'Não foi possível carregar o Python: ' + (e && e.message ? e.message : e) +
          '. É preciso ligação à internet na primeira utilização.');
        throw e;
      });
    return booting;
  }

  function loadExtra() {
    if (!py) return Promise.reject(new Error('sem python'));
    setStatus('loading', 'A carregar statsmodels e scikit-learn…');
    return py.loadPackage(EXTRA_PKGS).then(function () {
      setStatus('ready', 'Bibliotecas avançadas carregadas.');
    }).catch(function () {
      setStatus('err', 'statsmodels/scikit-learn indisponíveis nesta versão.');
    });
  }

  function run(code, outEl) {
    outEl.hidden = false;
    outEl.innerHTML = '<span class="muted">A executar…</span>';
    return boot().then(function (p) {
      var wrapped =
        '_ac_out = io.StringIO()\n' +
        '_ac_old = sys.stdout, sys.stderr\n' +
        'sys.stdout = sys.stderr = _ac_out\n' +
        '_ac_err = None\n' +
        'try:\n' +
        indent(code) + '\n' +
        'except BaseException as _e:\n' +
        '    import traceback\n' +
        '    _ac_err = traceback.format_exc()\n' +
        'finally:\n' +
        '    sys.stdout, sys.stderr = _ac_old\n' +
        '_ac_res = json.dumps({"out": _ac_out.getvalue(), "err": _ac_err, "figs": _academy_figs()})\n' +
        '_ac_res';
      return p.runPythonAsync(wrapped);
    }).then(function (json) {
      var r = JSON.parse(json);
      var h = '';
      if (r.out) h += escape2(r.out);
      if (r.err) h += '<span class="err">' + escape2(r.err) + '</span>';
      (r.figs || []).forEach(function (b64) {
        h += '<img alt="Gráfico gerado pelo código" src="data:image/png;base64,' + b64 + '">';
      });
      outEl.innerHTML = h || '<span class="muted">Executado sem saída.</span>';
    }).catch(function (e) {
      outEl.innerHTML = '<span class="err">' + escape2(String(e && e.message || e)) + '</span>';
    });
  }

  function indent(code) {
    return code.split('\n').map(function (l) { return '    ' + l; }).join('\n');
  }
  function escape2(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  }

  /* ---------- ligar os botoes "Executar" dos capitulos ---------- */
  function wire(root) {
    var blocks = (root || document).querySelectorAll('.codeblock[data-lang="python"]:not([data-wired])');
    if (!blocks.length) return;
    Array.prototype.forEach.call(blocks, function (b) {
      b.setAttribute('data-wired', '1');
      var btn = b.querySelector('.btn-run');
      var pre = b.querySelector('code');
      var out = b.querySelector('.code-out');
      if (!btn || !pre || !out) return;
      pre.setAttribute('contenteditable', 'plaintext-only');
      pre.setAttribute('spellcheck', 'false');
      btn.addEventListener('click', function () {
        if (!statusEls.some(function (n) { return n.isConnected; })) {
          var bar = statusBar('A preparar o Python…');
          b.parentNode.insertBefore(bar, b);
        }
        btn.disabled = true;
        run(pre.textContent, out).then(function () { btn.disabled = false; });
      });
    });
  }

  /* ---------- pagina do laboratorio ---------- */
  var DEMOS = {
    capability: {
      title: 'Capability: Cp, Cpk, Pp, Ppk',
      code: [
        'import numpy as np, pandas as pd, matplotlib.pyplot as plt',
        '',
        '# Diametro de eixo (mm). Especificacao: 35.00 +/- 0.50',
        'rng = np.random.default_rng(42)',
        'x = rng.normal(35.08, 0.147, 125)',
        'LIE, LSE = 34.50, 35.50',
        '',
        '# Sigma de curto prazo pela amplitude movel (d2 = 1.128 para n=2)',
        'MR = np.abs(np.diff(x))',
        'sigma_curto = MR.mean() / 1.128',
        'sigma_longo = x.std(ddof=1)',
        '',
        'def indices(mu, s):',
        '    Cp  = (LSE - LIE) / (6*s)',
        '    Cpk = min(LSE - mu, mu - LIE) / (3*s)',
        '    return Cp, Cpk',
        '',
        'Cp, Cpk = indices(x.mean(), sigma_curto)',
        'Pp, Ppk = indices(x.mean(), sigma_longo)',
        '',
        'print(f"media   = {x.mean():.4f} mm   n = {len(x)}")',
        'print(f"sigma curto = {sigma_curto:.4f} | sigma longo = {sigma_longo:.4f}")',
        'print(f"Cp  = {Cp:.3f}   Cpk = {Cpk:.3f}   (potencial, curto prazo)")',
        'print(f"Pp  = {Pp:.3f}   Ppk = {Ppk:.3f}   (desempenho real)")',
        'print()',
        'print("Cpk >> Ppk indica que o processo esta descentrado ou instavel no longo prazo.")',
        'print("Cliente exige Cpk >= 1.33:", "ATENDE" if Cpk >= 1.33 else "NAO ATENDE")',
        '',
        'fig, ax = plt.subplots()',
        'ax.hist(x, bins=18, color="#2a78d6", edgecolor="white", alpha=.85)',
        'for v, c, lab in [(LIE,"#b03a30","LIE"), (LSE,"#b03a30","LSE"), (x.mean(),"#1f7a52","media")]:',
        '    ax.axvline(v, color=c, lw=2, ls="--")',
        '    ax.text(v, ax.get_ylim()[1]*.95, lab, color=c, ha="center", fontsize=9)',
        'ax.set_xlabel("Diametro (mm)"); ax.set_ylabel("Frequencia")',
        'ax.set_title(f"Capability do processo  ·  Cpk = {Cpk:.2f}   Ppk = {Ppk:.2f}")',
        'plt.show()'
      ].join('\n')
    },
    spc: {
      title: 'Carta de controlo I-MR com regras de Nelson',
      code: [
        'import numpy as np, matplotlib.pyplot as plt',
        '',
        'rng = np.random.default_rng(7)',
        'x = np.r_[rng.normal(100, 2.0, 30), rng.normal(104, 2.0, 10)]  # deriva a partir do ponto 31',
        '',
        'MR = np.abs(np.diff(x))',
        'MRbar, xbar = MR.mean(), x.mean()',
        'sigma = MRbar / 1.128',
        'LSC, LIC = xbar + 3*sigma, xbar - 3*sigma',
        '',
        '# Regra 1 de Nelson: ponto fora dos limites',
        'fora = np.where((x > LSC) | (x < LIC))[0]',
        '# Regra 2: 9 pontos consecutivos do mesmo lado da media',
        'lado = np.sign(x - xbar); run2 = []',
        'for i in range(8, len(x)):',
        '    if abs(lado[i-8:i+1].sum()) == 9: run2.append(i)',
        '',
        'print(f"LC = {xbar:.2f}   LSC = {LSC:.2f}   LIC = {LIC:.2f}   sigma = {sigma:.3f}")',
        'print("Regra 1 (fora dos limites) nos pontos:", (fora+1).tolist())',
        'print("Regra 2 (9 do mesmo lado) nos pontos:", [i+1 for i in run2])',
        '',
        'fig, ax = plt.subplots()',
        'ax.plot(range(1, len(x)+1), x, "-o", color="#2a78d6", ms=4, lw=1.4)',
        'ax.axhline(xbar, color="#1f7a52", lw=1.6)',
        'ax.axhline(LSC, color="#b03a30", ls="--", lw=1.6)',
        'ax.axhline(LIC, color="#b03a30", ls="--", lw=1.6)',
        'if len(fora): ax.plot(fora+1, x[fora], "o", ms=9, mfc="none", mec="#b03a30", mew=2)',
        'ax.set_xlabel("Observacao"); ax.set_ylabel("Valor")',
        'ax.set_title("Carta de individuais (I) com limites 3-sigma")',
        'plt.show()'
      ].join('\n')
    },
    pareto: {
      title: 'Pareto de defeitos com linha acumulada',
      code: [
        'import pandas as pd, matplotlib.pyplot as plt',
        '',
        'd = pd.Series({',
        '    "Rebarba": 412, "Dimensional": 297, "Risco superficial": 168,',
        '    "Porosidade": 96, "Cor fora do padrao": 54, "Rotulo": 31, "Outros": 22',
        '}).sort_values(ascending=False)',
        '',
        'acum = d.cumsum() / d.sum() * 100',
        'corte = (acum <= 80).sum() + 1',
        'print(d.to_frame("qtd").assign(pct=(d/d.sum()*100).round(1), acum=acum.round(1)))',
        'print()',
        'print(f"{corte} de {len(d)} causas explicam {acum.iloc[corte-1]:.1f}% dos defeitos.")',
        '',
        'fig, ax = plt.subplots()',
        'cores = ["#eb6834" if i < corte else "#c9d4da" for i in range(len(d))]',
        'ax.bar(d.index, d.values, color=cores)',
        'ax.set_ylabel("Ocorrencias"); ax.tick_params(axis="x", rotation=32)',
        'ax2 = ax.twinx(); ax2.plot(d.index, acum.values, "-o", color="#0f3a4a", ms=5)',
        'ax2.axhline(80, color="#b03a30", ls=":", lw=1.5); ax2.set_ylim(0, 105)',
        'ax2.set_ylabel("Acumulado (%)"); ax2.grid(False)',
        'ax.set_title("Diagrama de Pareto — defeitos do mes")',
        'plt.tight_layout(); plt.show()'
      ].join('\n')
    },
    hipotese: {
      title: 'Teste t de duas amostras com tamanho de efeito',
      code: [
        'import numpy as np',
        'from scipy import stats',
        '',
        '# Resistencia (MPa) de dois fornecedores',
        'A = np.array([412,398,405,421,409,415,402,418,407,411,396,414])',
        'B = np.array([389,395,401,386,392,399,384,397,390,393,388,402])',
        '',
        '# 1) variancias iguais?',
        'lev = stats.levene(A, B)',
        'print(f"Levene p = {lev.pvalue:.4f} -> variancias {\'iguais\' if lev.pvalue>0.05 else \'diferentes\'}")',
        '',
        '# 2) teste t (Welch e o padrao seguro)',
        't = stats.ttest_ind(A, B, equal_var=False)',
        'print(f"t = {t.statistic:.3f}   p = {t.pvalue:.5f}")',
        '',
        '# 3) tamanho de efeito: p-valor sozinho nao diz se importa',
        'sp = np.sqrt(((len(A)-1)*A.var(ddof=1) + (len(B)-1)*B.var(ddof=1)) / (len(A)+len(B)-2))',
        'd = (A.mean() - B.mean()) / sp',
        'print(f"diferenca = {A.mean()-B.mean():.2f} MPa   d de Cohen = {d:.2f}")',
        '',
        '# 4) intervalo de confianca da diferenca',
        'ic = stats.ttest_ind(A, B, equal_var=False).confidence_interval(0.95)',
        'print(f"IC 95% da diferenca: [{ic.low:.2f}, {ic.high:.2f}] MPa")',
        'print()',
        'print("Conclusao: significativo E relevante" if t.pvalue < 0.05 and abs(d) > 0.8',
        '      else "Rever relevancia pratica")'
      ].join('\n')
    },
    little: {
      title: 'Lei de Little e takt time',
      code: [
        '# Linha de montagem: onde esta o lead time?',
        'import pandas as pd',
        '',
        'proc = pd.DataFrame({',
        '    "etapa":   ["Corte","Dobra","Solda","Pintura","Montagem","Inspecao"],',
        '    "TC_s":    [42, 55, 78, 120, 64, 33],       # tempo de ciclo',
        '    "WIP_pcs": [8, 12, 45, 160, 22, 6],         # inventario em processo',
        '})',
        '',
        'DEMANDA_DIA = 420        # pecas/dia',
        'TEMPO_DISP_S = 8*3600*0.92   # 8 h com 92% de disponibilidade',
        'takt = TEMPO_DISP_S / DEMANDA_DIA',
        '',
        'gargalo = proc.loc[proc.TC_s.idxmax()]',
        'throughput = 1 / (gargalo.TC_s)          # pecas/s',
        'proc["lead_h"] = proc.WIP_pcs / throughput / 3600   # Lei de Little: L = lambda * W',
        '',
        'print(f"Takt time      = {takt:.1f} s/peca")',
        'print(f"Gargalo        = {gargalo.etapa} ({gargalo.TC_s} s)")',
        'print(f"Capacidade     = {TEMPO_DISP_S/gargalo.TC_s:.0f} pecas/dia  (demanda {DEMANDA_DIA})")',
        'print()',
        'print(proc.round(2).to_string(index=False))',
        'print()',
        'print(f"Lead time total = {proc.lead_h.sum():.1f} h")',
        'top = proc.loc[proc.lead_h.idxmax()]',
        'print(f"{top.etapa} sozinha responde por {top.lead_h/proc.lead_h.sum()*100:.0f}% do lead time.")',
        'print("Atacar o WIP de Pintura vale mais do que acelerar qualquer tempo de ciclo.")'
      ].join('\n')
    }
  };

  function view(show) {
    var h = '<div class="page"><div class="page-head">' +
      '<div class="eyebrow"><i class="dot"></i>Laboratório</div>' +
      '<h1>Laboratório Python</h1>' +
      '<p class="lede">Python real a correr dentro do navegador (Pyodide/WebAssembly). ' +
      'Nada é instalado e nada sai do seu computador. A primeira execução descarrega ' +
      'o interpretador — depois fica em cache.</p></div>';

    h += '<div id="labStatus"></div>';

    h += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">';
    Object.keys(DEMOS).forEach(function (k, i) {
      h += '<button class="btn ' + (i ? 'sec' : '') + ' sm" data-demo="' + k + '">' +
           DEMOS[k].title + '</button>';
    });
    h += '<button class="btn sec sm" id="extraBtn">+ statsmodels / scikit-learn</button>';
    h += '</div>';

    h += '<textarea class="editor" id="labCode" spellcheck="false"></textarea>';
    h += '<div style="display:flex;gap:9px;margin:12px 0">' +
      '<button class="btn" id="labRun">▶ Executar</button>' +
      '<button class="btn sec" id="labClear">Limpar saída</button></div>';
    h += '<div class="code-out" id="labOut" hidden></div>';

    h += '<div class="note info" style="margin-top:26px"><b>Disponível.</b> ' +
      'numpy · pandas · scipy · matplotlib carregam por omissão. ' +
      'statsmodels e scikit-learn carregam a pedido no botão acima. ' +
      '<br><b>R:</b> os exemplos em R aparecem nos capítulos como referência com botão de copiar — ' +
      'a execução de R exigiria o webR, que é bastante mais pesado.</div>';
    h += '</div>';

    show(h);

    var ta = document.getElementById('labCode');
    var out = document.getElementById('labOut');
    ta.value = DEMOS.capability.code;
    document.getElementById('labStatus').appendChild(statusBar('Python ainda não carregado — clique em Executar.'));
    if (py) setStatus('ready', 'Python pronto.');

    Array.prototype.forEach.call(document.querySelectorAll('[data-demo]'), function (b) {
      b.addEventListener('click', function () {
        ta.value = DEMOS[b.getAttribute('data-demo')].code;
        Array.prototype.forEach.call(document.querySelectorAll('[data-demo]'), function (x) {
          x.className = 'btn sec sm';
        });
        b.className = 'btn sm';
        out.hidden = true;
      });
    });
    document.getElementById('labRun').addEventListener('click', function () {
      this.disabled = true;
      var self = this;
      run(ta.value, out).then(function () { self.disabled = false; });
    });
    document.getElementById('labClear').addEventListener('click', function () { out.hidden = true; });
    document.getElementById('extraBtn').addEventListener('click', function () {
      var self = this; self.disabled = true;
      boot().then(loadExtra).then(function () { self.disabled = false; })
            .catch(function () { self.disabled = false; });
    });

    // tab insere indentacao em vez de mudar de foco
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = ta.selectionStart;
        ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + 4;
      }
    });
  }

  window.ACADEMY_LAB = { view: view, wire: wire, boot: boot };

  // liga blocos ja renderizados
  if (window.ACADEMY_WIRE) window.ACADEMY_WIRE(document);
  else document.addEventListener('DOMContentLoaded', function () { wire(document); });
})();
