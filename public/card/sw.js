const CACHE = 'ian-mcdonald-card-v2';
const ASSETS = ['/card', '/card/index.html', '/card/card.css', '/card/card.js', '/card/config.js', '/card/assets/qrcode.js', '/card/assets/icon-192.png', '/card/assets/icon-512.png', '/card/manifest.webmanifest', "/card/assets/connection-collage.webp", "/card/assets/ian-portrait.webp", "/card/assets/montserrat.woff2", "/card/assets/rosario-italic.woff2", "/card/assets/rosario.woff2", "/card/assets/yellow-paper.webp"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('ian-mcdonald-card-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || (url.pathname !== '/card' && !url.pathname.startsWith('/card/'))) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && response.type === 'basic') {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
    }
    return response;
  }).catch(async () => (await caches.match(event.request)) || (event.request.mode === 'navigate' && await caches.match('/card')) || Response.error()));
});
