const { chromium } = require('playwright');
const BASE = 'http://localhost:8899/';

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1.5 });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text().slice(0, 160)); });

  // lupa
  await p.goto(BASE + '#/aula/cap-900', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2500);
  const figs = await p.locator('.zoom-btn').count();
  console.log('botoes de lupa:', figs);
  await p.locator('.prose figure').nth(1).hover();
  await p.waitForTimeout(200);
  await p.locator('.zoom-host').nth(1).locator('.zoom-btn').click();
  await p.waitForTimeout(700);
  await p.screenshot({ path: '/root/academy/shots/14-lupa.png' });
  console.log('overlay aberto:', await p.locator('.zoom-ov').count());
  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);
  console.log('overlay fechado:', await p.locator('.zoom-ov').count());

  // aula com muitas figuras do manual
  await p.goto(BASE + '#/aula/cap-027', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  console.log('cap-027 imgs:', await p.locator('.prose img').count());
  await p.screenshot({ path: '/root/academy/shots/15-vsm.png', fullPage: false });

  // progresso: marcar concluida e ver persistencia
  await p.goto(BASE + '#/aula/cap-040', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1500);
  await p.click('#markBtn');
  await p.waitForTimeout(700);
  await p.goto(BASE, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(900);
  const prog = await p.locator('.hero p').first().innerText();
  console.log('progresso apos marcar 1 aula:', prog);
  await p.screenshot({ path: '/root/academy/shots/16-progresso.png' });

  await p.goto(BASE + '#/progresso', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(700);
  await p.screenshot({ path: '/root/academy/shots/17-backup.png' });

  // dark: modulo
  await p.goto(BASE + '#/modulo/lss-05', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(600);
  await p.click('#themeBtn'); await p.waitForTimeout(600);
  await p.screenshot({ path: '/root/academy/shots/18-modulo-dark.png' });

  console.log('\nerros:', errs.length ? errs.join('\n') : 'nenhum');
  await b.close();
})();
