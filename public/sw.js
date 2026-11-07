// Service worker tối giản: giúp app cài được như ứng dụng (PWA).
// Chat là thời gian thực nên luôn ưu tiên mạng; SW chỉ giữ bản dự phòng của vỏ app.
const CACHE = 'yahoo-chat-xua-v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/socket.io/')) return; // không đụng vào kết nối chat
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
