/* Offline-ready v0.4.0 normal + mom profiles. */
const VERSION = 'dlym-v0.4-normal-mom-20261022';
const SHELL = ["./", "./index.html", "./style.css", "./script.js", "./art-data.js", "./manifest.webmanifest", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/profiles/hidden_01.webp", "./assets/profiles/hidden_02.webp", "./assets/profiles/hidden_03.webp", "./assets/profiles/hidden_04.webp", "./assets/profiles/hidden_05.webp", "./assets/profiles/hidden_06.webp", "./assets/profiles/hidden_07.webp", "./assets/profiles/hidden_08.webp", "./assets/profiles/hidden_09.webp", "./assets/profiles/hidden_10.webp", "./assets/profiles/hidden_11.webp", "./assets/profiles/hidden_12.webp", "./assets/profiles/hidden_13.webp", "./assets/profiles/hidden_14.webp", "./assets/profiles/hidden_15.webp", "./assets/profiles/mom_01.webp", "./assets/profiles/mom_02.webp", "./assets/profiles/mom_03.webp", "./assets/profiles/mom_04.webp", "./assets/profiles/mom_05.webp", "./assets/profiles/mom_06.webp", "./assets/profiles/mom_07.webp", "./assets/profiles/normal_01.webp", "./assets/profiles/normal_02.webp", "./assets/profiles/normal_03.webp", "./assets/profiles/normal_04.webp", "./assets/profiles/normal_05.webp", "./assets/profiles/normal_06.webp", "./assets/profiles/normal_07.webp", "./assets/profiles/normal_08.webp", "./assets/profiles/normal_09.webp", "./assets/profiles/normal_10.webp", "./assets/profiles/normal_11.webp", "./assets/profiles/normal_12.webp", "./assets/profiles/normal_13.webp", "./assets/profiles/normal_14.webp", "./assets/profiles/normal_15.webp", "./assets/profiles/normal_16.webp", "./assets/profiles/normal_17.webp", "./assets/profiles/normal_18.webp", "./assets/profiles/normal_19.webp", "./assets/profiles/normal_20.webp", "./assets/profiles/normal_21.webp", "./assets/profiles/normal_22.webp", "./assets/profiles/normal_23.webp"];
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
