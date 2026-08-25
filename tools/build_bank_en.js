// Gera site/content/bank_en.js a partir de site/content/bank.js (fonte, PT, já
// enriquecido por enrich_bank.js) + i18n/en/bank.json (traducao de q/opts/why).
//
// bank_en.js reaproveita id/bank/domain/ans/bokTopic/chapterRef/cognitiveLevel do
// PT -- so o texto de enunciado, alternativas e explicacao muda. O bokTopic, no
// entanto, e reescrito para o titulo do capitulo em ingles (via content_en.js),
// para nao misturar um titulo PT dentro de um objeto EN.
//
// Correr depois de tools/enrich_bank.js (que por sua vez corre depois de cada
// tools/build.py, porque build.py regenera bank.js do zero a partir do notebook).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function loadReg(file) {
  const reg = {};
  const fn = new Function('ACADEMY', fs.readFileSync(file, 'utf8'));
  fn({ reg(n, d) { reg[n] = d; } });
  return reg;
}

const bank = loadReg(path.join(ROOT, 'site', 'content', 'bank.js')).bank;
const translations = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n', 'en', 'bank.json'), 'utf8'));

// titulos de capitulo em ingles, para reescrever bokTopic
const contentEnSrc = fs.readFileSync(path.join(ROOT, 'site', 'assets', 'content_en.js'), 'utf8');
const contentEnSandbox = {};
new Function('window', contentEnSrc)(contentEnSandbox);
const enChapterTitles = contentEnSandbox.ACADEMY_CONTENT_EN.chapters;

let missing = 0;
const bankEn = bank.map((q) => {
  const t = translations[q.id];
  if (!t) { missing++; console.error('sem traducao EN:', q.id); return null; }
  return {
    id: q.id,
    bank: q.bank,
    domain: q.domain,
    q: t.q,
    opts: t.opts,
    ans: q.ans,
    why: t.why,
    bokTopic: enChapterTitles[q.chapterRef] || q.bokTopic,
    chapterRef: q.chapterRef,
    cognitiveLevel: q.cognitiveLevel,
  };
});

if (missing) {
  console.error(missing + ' questoes sem traducao -- abortando, nada escrito.');
  process.exit(1);
}

const out = 'ACADEMY.reg("bank_en", ' + JSON.stringify(bankEn) + ');\n';
fs.writeFileSync(path.join(ROOT, 'site', 'content', 'bank_en.js'), out, 'utf8');
console.log('bank_en.js gerado com', bankEn.length, 'questoes.');
