/* This service worker caches the app shell and card illustrations on demand. */
const VERSION = 'dlym-v0.1.0';
const SHELL = ['./', './index.html', './style.css', './script.js', './art-data.js', './manifest.webmanifest', './assets/mom.svg', './assets/icon-192.png', './assets/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (response.ok && response.type === 'basic') {
        const clone = response.clone();
        caches.open(VERSION).then(cache => cache.put(event.request, clone));
      }
      return response;
    });
  }));
});
