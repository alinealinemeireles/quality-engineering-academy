const { chromium } = require('playwright');

const BASE = 'http://localhost:8899/';

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 200)); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message.slice(0, 200)));

  async function shot(hash, name, wait = 1200) {
    await page.goto(BASE + hash, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(wait);
    await page.screenshot({ path: `/root/academy/shots/${name}.png`, fullPage: false });
    return page.title();
  }

  await shot('', '01-painel');
  console.log('painel  h1:', await page.locator('h1').first().innerText());
  console.log('trk-cards:', await page.locator('.trk-card').count());
  console.log('trk aberta:', await page.locator('.trk-card[open]').count());

  await shot('#/trilha/lean', '02-trilha');
  console.log('modulos:', await page.locator('.mod-row').count());

  await shot('#/modulo/lss-05', '03-modulo');
  console.log('aulas  :', await page.locator('.mod-row').count());

  await shot('#/aula/cap-900', '04-aula-bpmn', 4000);
  console.log('mermaid svg:', await page.locator('.mermaid svg').count());
  console.log('tabelas:', await page.locator('.prose table').count());
  console.log('toc    :', await page.locator('.toc a').count());
  await page.screenshot({ path: '/root/academy/shots/04b-aula-bpmn-full.png', fullPage: true });

  await shot('#/aula/cap-071', '05-aula-capability', 2500);
  console.log('capability h1:', await page.locator('h1').first().innerText());
  console.log('codeblocks:', await page.locator('.codeblock').count());
  console.log('katex     :', await page.locator('.katex').count());
  console.log('imgs      :', await page.locator('.prose img').count());

  await shot('#/certificacao', '06-certificacao');
  await shot('#/competencias', '07-competencias');
  console.log('comp cells:', await page.locator('.comp-cell').count());

  await shot('#/quiz/lss-05', '08-quiz');
  console.log('quiz cards:', await page.locator('.qcard').count());
  if (await page.locator('.qcard').count()) {
    await page.locator('.qcard').first().locator('.opt').first().click();
    await page.waitForTimeout(400);
    console.log('score after 1:', await page.locator('#scoreV').innerText());
    await page.screenshot({ path: '/root/academy/shots/08b-quiz-answered.png' });
  }

  await shot('#/busca?q=cpk', '09-busca');
  console.log('hits:', await page.locator('.hit').count());

  // tema escuro
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await page.click('#themeBtn');
  await page.waitForTimeout(700);
  await page.screenshot({ path: '/root/academy/shots/11-dark.png' });
  await page.goto(BASE + '#/aula/cap-900', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: '/root/academy/shots/12-dark-aula.png' });

  // mobile
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await m.goto(BASE, { waitUntil: 'domcontentloaded' });
  await m.waitForTimeout(900);
  await m.screenshot({ path: '/root/academy/shots/13-mobile.png' });

  console.log('\n--- erros ---');
  console.log(errors.length ? errors.join('\n') : 'nenhum');
  await browser.close();
})();
