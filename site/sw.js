/* Quality Engineering Academy — service worker: cache do essencial (app shell)
   + cache dinamica (stale-while-revalidate) de assets/ e content/ para leitura
   offline dos capitulos, figuras e bibliotecas ja visitados. */
const CACHE = 'qea-v3';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/app.css',
  './assets/app.js',
  './assets/i18n.js',
  './assets/hl.js',
  './assets/viz.js',
  './assets/lab.js',
  './assets/content_en.js',
  './content/manifest.js',
  './content/bank.js',
  './content/bank_en.js',
  './assets/exam.js',
  './content/figs.js',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(CORE.map((u) => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const cacheable = url.pathname.includes('/assets/') || url.pathname.includes('/content/');

  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.ok && cacheable) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() => cached || caches.match('./index.html'));
      return cached || network;
    })
  );
});
