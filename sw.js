importScripts('./src/idb.js');

const version = "0.1.3";
const cacheName = `reviews-${version}`;
const imagesCache = `img-${version}`;
const allCaches = [cacheName, imagesCache];

const updateReviewsById = (id, callback = null) => {
  const reviewsURL = `http://localhost:1337/reviews/?restaurant_id=${id}`;
  fetch(reviewsURL, {cache:'reload'})
    .then(response => {
      response.json()
              .then(data => {
                  idb.open('restaurants', 1)
                   .then(dbPromise => {
                     dbPromise.transaction('reviews', 'readwrite')
                              .objectStore('reviews')
                              .put(data, parseInt(data[0].restaurant_id));
                   })
                if(callback)
                  callback(data);
              })
    })
}

self.addEventListener('install', e => {
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

self.addEventListener('sync', function (event) {
  if (event.tag == 'outbox') {
    event.waitUntil(
      idb.open('restaurants', 1)
        .then(db => {
          db.transaction('outbox', 'readonly')
            .objectStore('outbox')
            .getAll()
            .then(reviews => {
              console.log(reviews);
               return Promise.all(reviews.map(review => {
                 return fetch('http://localhost:1337/reviews', {
                  method: 'POST',
                  body: JSON.stringify(review)
                }).then(function (response) {
                  console.log("SW.JS LINE 61", response);
                  return response.json();
                }).then(function (data) {

                  const restauRantid = parseInt(data.restaurant_id);
                  console.log("FETCH FROM SW!!!", data);
                    db.transaction('outbox', 'readwrite')
                      .objectStore('outbox')
                      .delete(restauRantid)
                      .then(() => {
                        updateReviewsById(restauRantid);
                      })
                  
                })
              }))
            });
        })
    );
  }
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
