// Verifica a paridade PT/EN dos capitulos e a rastreabilidade do banco de questoes.
// Puramente Node (sem browser): corre em qualquer ambiente, incluindo CI.
//
//   node tools/check_i18n.js
//
// Sai com codigo 1 se encontrar qualquer capitulo sem traducao EN carregavel, ou
// qualquer questao do banco sem os campos de rastreabilidade (bokTopic, cognitiveLevel,
// chapterRef). E o teste que teria apanhado os cap-154..161 sem versao EN.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHDIR = path.join(ROOT, 'site', 'content', 'ch');

function loadReg(file) {
  const reg = {};
  const sandbox = { ACADEMY: { reg(n, d) { reg[n] = d; } } };
  const fn = new Function('ACADEMY', fs.readFileSync(file, 'utf8'));
  fn(sandbox.ACADEMY);
  return reg;
}

let failures = 0;

function fail(msg) {
  failures++;
  console.error('FAIL  ' + msg);
}

// --- 1. paridade de capitulos: todo cap-NNN.js precisa de cap-NNN.en.js real -----------
const manifestReg = loadReg(path.join(ROOT, 'site', 'content', 'manifest.js'));
const manifest = manifestReg.manifest;

const chapterIds = [];
for (const t of manifest.tracks) {
  for (const mod of t.modules) {
    for (const c of mod.chapters) chapterIds.push(c.id);
  }
}
console.log(`capitulos no manifest: ${chapterIds.length}`);

for (const id of chapterIds) {
  const ptFile = path.join(CHDIR, id + '.js');
  const enFile = path.join(CHDIR, id + '.en.js');
  if (!fs.existsSync(ptFile)) { fail(`${id}: ficheiro PT em falta (${ptFile})`); continue; }
  if (!fs.existsSync(enFile)) { fail(`${id}: SEM traducao EN (${enFile} nao existe)`); continue; }

  const ptReg = loadReg(ptFile);
  const enReg = loadReg(enFile);
  const pt = ptReg[id];
  const en = enReg[id + '.en'];
  if (!en) { fail(`${id}: cap-${id}.en.js nao regista a chave "${id}.en"`); continue; }
  if (!en.title || !en.html) { fail(`${id}: traducao EN sem title/html`); continue; }
  if (en.title === pt.title) {
    fail(`${id}: titulo EN identico ao PT ("${en.title}") -- provavelmente nao traduzido`);
  }
  if (en.html.length < 200) {
    fail(`${id}: traducao EN suspeitosamente curta (${en.html.length} chars)`);
  }
  if (en.lang !== 'en') {
    fail(`${id}: cap-${id}.en.js sem "lang": "en" -- o app.js mostra o aviso de ` +
         `"so disponivel em portugues" mesmo em capitulos traduzidos quando este campo falta`);
  }
}

// --- 2. rastreabilidade do banco de questoes --------------------------------------------
const bankReg = loadReg(path.join(ROOT, 'site', 'content', 'bank.js'));
const bank = bankReg.bank;
console.log(`questoes no banco: ${bank.length}`);

const seenIds = new Set();
for (const q of bank) {
  if (seenIds.has(q.id)) fail(`banco: id duplicado "${q.id}"`);
  seenIds.add(q.id);
  if (!q.bokTopic) fail(`${q.id}: sem bokTopic`);
  if (!q.chapterRef) fail(`${q.id}: sem chapterRef`);
  if (!q.cognitiveLevel) fail(`${q.id}: sem cognitiveLevel`);
  if (![0, 1, 2, 3].includes(q.ans)) fail(`${q.id}: "ans" fora de 0-3`);
  if (!Array.isArray(q.opts) || q.opts.length !== 4) fail(`${q.id}: nao tem exatamente 4 alternativas`);
}

// --- 3. paridade EN do banco de questoes -------------------------------------------------
const bankEnFile = path.join(ROOT, 'site', 'content', 'bank_en.js');
if (!fs.existsSync(bankEnFile)) {
  fail('site/content/bank_en.js nao existe -- correr node tools/build_bank_en.js');
} else {
  const bankEnReg = loadReg(bankEnFile);
  const bankEn = bankEnReg.bank_en;
  console.log(`questoes traduzidas (bank_en): ${bankEn ? bankEn.length : 0}`);
  const enById = {};
  (bankEn || []).forEach((q) => { enById[q.id] = q; });
  for (const q of bank) {
    const en = enById[q.id];
    if (!en) { fail(`${q.id}: sem entrada em bank_en.js`); continue; }
    if (!en.q || !Array.isArray(en.opts) || en.opts.length !== 4 || !en.why) {
      fail(`${q.id}: entrada em bank_en.js incompleta (q/opts/why)`);
    }
    if (en.ans !== q.ans) fail(`${q.id}: "ans" diverge entre bank.js e bank_en.js`);
  }
}

// --- resultado ----------------------------------------------------------------------------
if (failures) {
  console.error(`\n${failures} problema(s) encontrado(s).`);
  process.exit(1);
} else {
  console.log('\nOK -- paridade PT/EN completa e banco de questoes com rastreabilidade integra.');
}
