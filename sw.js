/* Offline-ready v0.3.0 photo-only release. */
const VERSION = 'dlym-v0.3-photo18-20261022';
const SHELL = ["./", "./index.html", "./style.css", "./script.js", "./art-data.js", "./manifest.webmanifest", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/profiles/hidden_01.webp", "./assets/profiles/hidden_02.webp", "./assets/profiles/hidden_03.webp", "./assets/profiles/hidden_04.webp", "./assets/profiles/hidden_05.webp", "./assets/profiles/hidden_06.webp", "./assets/profiles/hidden_07.webp", "./assets/profiles/hidden_08.webp", "./assets/profiles/hidden_09.webp", "./assets/profiles/hidden_10.webp", "./assets/profiles/mom_06.webp", "./assets/profiles/mom_07.webp", "./assets/profiles/mom_01.webp", "./assets/profiles/mom_02.webp", "./assets/profiles/mom_03.webp", "./assets/profiles/mom_04.webp", "./assets/profiles/mom_05.webp", "./assets/profiles/mom_08.webp"];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('dlym-') && key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
 if (event.request.method !== 'GET') return;
 const url = new URL(event.request.url);
 if (url.origin !== self.location.origin) return;
 const core = /\.(js|css|html)$/.test(url.pathname) || url.pathname.endsWith('/');
 if (core) {
  event.respondWith(fetch(event.request).then(res => {
   if (res.ok) { const copy=res.clone(); event.waitUntil(caches.open(VERSION).then(c=>c.put(event.request,copy))); }
   return res;
  }).catch(()=>caches.match(event.request)));
 } else {
  event.respondWith(caches.match(event.request,{ignoreSearch:true}).then(cached => cached || fetch(event.request).then(res=> {
   if(res.ok && res.type==='basic') { const copy=res.clone();event.waitUntil(caches.open(VERSION).then(c=>c.put(event.request,copy))); }
   return res;
  })));
 }
});
