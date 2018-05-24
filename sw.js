  const version = "0.1.2";
  const cacheName = `reviews-${version}`;
  self.addEventListener('install', e => {
    const timeStamp = Date.now();
    e.waitUntil(
      caches.open(cacheName).then(cache => {
        return cache.addAll([
          `/`,
          `/index.html`,
          `/restaurant.html`,
          `/dist/restaurantInfo.js`,
          `/dist/home.css`,
          `/dist/restaurantInfo.css`,
          `/dist/home.js`
        ])
          .then(() => self.skipWaiting());
      })
    );
  });

  self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
  });

  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.open(cacheName)
        .then(cache => cache.match(event.request, { ignoreSearch: true }))
        .then(response => {
          return response || fetch(event.request);
        })
    );
  });
