// Service Worker для КІПФК СумДУ
// Стратегия: сеть в приоритете, кэш — запасной вариант (офлайн-режим)

const CACHE_NAME = 'kipt-v6';

const CORE_ASSETS = [
  './index.html',
  './specialnosti.html',
  './dovidnyk.html',
  './vstup.html',
  './kontakty.html',
  './rozklad.html',
  './style.css',
  './data.js',
  './main.js',
  './favicon.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;
  // Telegram API и внешние запросы не трогаем
  const url = new URL(req.url);
  if(url.origin !== location.origin) return;

  event.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
  );
});
