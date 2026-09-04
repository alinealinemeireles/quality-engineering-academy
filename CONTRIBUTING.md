# Contributing

Obrigado por contribuir para a Quality Engineering Academy.

## Princípios

As contribuições devem preservar quatro propriedades: rigor técnico, rastreabilidade, reprodutibilidade e clareza pedagógica.

### Conteúdo técnico

- Diferencie claramente definição, heurística, benchmark e requisito normativo.
- Não apresente correlação como causalidade.
- Explicite pressupostos estatísticos relevantes.
- Para normas e legislação, indique a referência e evite afirmar conformidade apenas com base em exemplos didáticos.
- Prefira exemplos industriais reproduzíveis e resultados verificáveis.

### Alterações no currículo

A organização trilha → módulo → capítulo → competência é mantida em `tools/curriculum.py`. Novos capítulos devem passar pelo pipeline de build e ter versão PT/EN correspondente.

### Antes de abrir um PR

Execute localmente:

```bash
python tools/build.py
node tools/enrich_bank.js
node tools/build_bank_en.js
node tools/check_i18n.js
python tools/audit_phase2.py
python tools/audit_phase3.py
python tools/audit_phase4.py
python tools/audit_phase5.py
python tools/audit_phase6.py
python -m pytest -q
```

`node tools/check.js` e `node tools/check2.js` exigem o Chromium do Playwright instalado localmente — rode-os quando alterar `site/index.html` ou o pipeline de build. Não há validação automática em CI neste momento; a checagem local antes do PR é a autoridade final.
