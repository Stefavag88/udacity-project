const version = "0.1.3";
const cacheName = `reviews-${version}`;
const imagesCache = `img-${version}`;
const allCaches = [cacheName, imagesCache];


self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/restaurant.html`,
        `/restaurantInfo.js`,
        `/home.js`,
        `/dist/restaurantInfo.js`,
        `/dist/home.css`,
        `/dist/restaurantInfo.css`,
        `/dist/home.js`
      ])
        .then(() => self.skipWaiting())
        .catch((err) => console.error("Caching Error!!", err));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName.startsWith('reviews-') &&
                !allCaches.includes(cacheName);
            })
            .map(cacheName => caches.delete(cacheName))
        );
      })
  );
});

self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);
  if (requestURL.origin === location.origin) {
    if (requestURL.pathname.startsWith('/img/')) {
      event.respondWith(servePhoto(event.request));
      return;
    }
  }

  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        let customResponse = null;
        if (response) {
          customResponse = response.clone();
          //not for production environments!!
          customResponse.headers.set("Access-Control-Allow-Origin", "*");
        }
        console.log(event.request);
        return customResponse || fetch(event.request);
      })
      .catch(err => console.log("SW Error!!", err))
  );
});

const servePhoto = (request) => {
  
  if (request.url.includes('mock')) {
    
    const storageURL = request.url.replace('mock', '800w');
    return caches
            .open(imagesCache)
            .then(cache => cache.match(storageURL)
              .then(response => {
                if (response) return response;

                fetch(request)
                  .then(response => response);
                return;
        }));
  }

  const storageURL = request.url.replace(/-\d+w\.jpg$/, '-800w.jpg');
  
  return caches.open(imagesCache)
    .then(cache => cache.match(storageURL)
      .then(response => {
        
        if (response) return response;

        fetch(request)
          .then(response => {
            cache.put(storageURL, response.clone());
            return response;
          });
      })
    );
}
