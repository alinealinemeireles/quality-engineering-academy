// Enriquece site/content/bank.js com bokTopic, cognitiveLevel e chapterRef,
// extraídos do texto de rastreabilidade já presente em cada questão (campo `why`).
// Não inventa classificação nova: usa o "tipo" já escrito por questão.
const fs = require('fs');

global.ACADEMY = { _reg: {}, reg(n, d) { this._reg[n] = d; } };
eval(fs.readFileSync('site/content/bank.js', 'utf8'));
eval(fs.readFileSync('site/content/manifest.js', 'utf8'));

const bank = ACADEMY._reg.bank;
const manifest = ACADEMY._reg.manifest;

const chapterByNum = {};
for (const t of manifest.tracks) {
  for (const mod of t.modules) {
    for (const c of mod.chapters) chapterByNum[c.num] = c;
  }
}

// Mapeamento tipo (já escrito nas questões) -> nível cognitivo (taxonomia de Bloom,
// como usada pela ASQ no BoK): conceito = recordar/entender; aplicação = aplicar;
// cálculo = aplicar (execução de procedimento); interpretação = analisar.
const COGNITIVE = {
  'conceito': 'Understand',
  'aplicação': 'Apply',
  'cálculo': 'Apply',
  'interpretação': 'Analyze',
};

let missing = 0;
for (const q of bank) {
  const m = q.why.match(/Rastreabilidade:\s*<\/em>?\s*BoK dom[ií]nio\s+([IVX]+)\s*[·.]\s*tipo:\s*([^·<\n]+?)\s*[·.]\s*aprofundar no\s*(?:<strong>)?Cap[ií]tulo\s*(\d+)/i);
  if (!m) { missing++; console.error('sem rastreabilidade:', q.id); continue; }
  const [, , tipoRaw, capNumStr] = m;
  const tipo = tipoRaw.trim();
  const capNum = parseInt(capNumStr, 10);
  const chapter = chapterByNum[capNum];
  q.cognitiveLevel = COGNITIVE[tipo] || null;
  q.chapterRef = chapter ? chapter.id : ('cap-' + String(capNum).padStart(3, '0'));
  q.bokTopic = chapter ? chapter.title : null;
}

if (missing) {
  console.error(missing + ' questões sem rastreabilidade — abortando, nada escrito.');
  process.exit(1);
}

const out = 'ACADEMY.reg("bank", ' + JSON.stringify(bank) + ');\n';
fs.writeFileSync('site/content/bank.js', out, 'utf8');
console.log('bank.js atualizado com bokTopic / cognitiveLevel / chapterRef em', bank.length, 'questões.');
