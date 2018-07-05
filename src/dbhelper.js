import idb from 'idb';

//const DATABASE_URL = `http://localhost:8000/data/restaurants.json`;
const API_URL = `http://localhost:1337/restaurants`;
const IDB_VERSION = 1;
const REVIEWS_URL = `http://localhost:1337/reviews`;
/**
 * Fetch all restaurants.
 */
export const fetchRestaurants = (callback) => {

  const dbPromise = idb.open('restaurants', IDB_VERSION, upgradeDB => {
    upgradeDB.createObjectStore('stores', { keyPath: 'id', autoIncrement: true })
      .createIndex('by-id', 'id');

    //Create the reviews object store from home Page as well
    upgradeDB
      .createObjectStore('reviews');

    upgradeDB
      .createObjectStore('outbox');

    fetchDataAndSaveToIDB(API_URL, dbPromise, callback);
  });

  dbPromise.then(db => {
    const dbExists = db.objectStoreNames.contains("stores");

    if (!dbExists) return;

    const tx = db.transaction("stores", "readonly");
    tx.objectStore("stores")
      .index('by-id')
      .getAll()
      .then(data => {

        if (!data || data.length === 0 || data.length < 10)
          fetchDataAndSaveToIDB(API_URL, dbPromise, callback);
        else
          callback(null, data);

        return tx.complete;
      })
      .catch(err => {
        callback(err, null);
        return tx.abort;
      })
  })
}

const fetchDataAndSaveToIDB = (fetchURL, dbPromise, callback, ensureFetchDataOnce = null) => {

  if (Array.isArray(fetchURL)) {
    const urlPromises = fetchURL.map(url => fetch(url));
    Promise.all(urlPromises)
      .then((responses) => {
        const clonedResponses = responses.map(r => r.clone());
        const jsonResponses = responses.map(r => r.json());

        Promise.all(jsonResponses)
          .then(data => {
            callback(null, data);
          })
          .then(() => {
            clonedResponses.forEach(response => {
              if (!response.ok)
                callback(response.statusText, null);
              else {
                saveDataToIDB(dbPromise, response);
              }
            });
          })
          .catch(err => {
            console.error("Error!", err)
            callback(err, null);
          })
      });
  }
  else {
    fetch(fetchURL).then(response => {
      if (!response.ok) {
        const error = response.statusText;
        callback(error, null);
        return;
      }

      const responeClone = response.clone();
      saveDataToIDB(dbPromise, responeClone);

      response.json()
        .then(data => {

          if (ensureFetchDataOnce)
            ensureFetchDataOnce = true;

          callback(null, data)
        })
        .catch(err => { callback(err, null) })
    });
  }
}

const saveDataToIDB = (dbPromise, response) => {
  dbPromise.then(db => {
    let reviewsTX;
    if (response.url.includes('reviews')) {
      reviewsTX = db.transaction('reviews', 'readwrite');
    }

    const storesTX = db.transaction('stores', 'readwrite');

    response
      .json()
      .then(data => {

        if (Array.isArray(data)) {
          if (response.url.includes('reviews')) {
            reviewsTX.objectStore('reviews').put(data, parseInt(data[0].restaurant_id));
          } else {
            data.forEach(d => {
              storesTX.objectStore('stores').put(d);
            })
          }
        }
      })
      .catch(err => {
        console.error(`Could not save restaurant/s to idb...`, err);
      })
  })
}

/**
 * Fetch a restaurant by its ID.
 */
export const fetchRestaurantById = (id, callback) => {
  // fetch all restaurants with proper error handling.

  let dataFetched = false;
  const restaurantURL = `${API_URL}/${id}`;
  const reviewsURL = `${REVIEWS_URL}/?restaurant_id=${id}`;
  const combinedURLs = [restaurantURL, reviewsURL];

  const dbPromise = idb.open('restaurants', IDB_VERSION, upgradeDB => {
    const storesDBExists = upgradeDB.objectStoreNames.contains('stores');
    const reviewsDBExists = upgradeDB.objectStoreNames.contains('reviews');
    const outboxDBExists = upgradeDB.objectStoreNames.contains('outbox');

    if (!storesDBExists)
      upgradeDB
        .createObjectStore('stores', { keyPath: 'id', autoIncrement: true })
        .createIndex('by-id', 'id');

    if (!reviewsDBExists)
      upgradeDB
        .createObjectStore('reviews');

    if (!outboxDBExists)
      upgradeDB
        .createObjectStore('outbox');

    fetchDataAndSaveToIDB(combinedURLs, dbPromise, callback, dataFetched);
  });

  dbPromise.then(db => {
    const storesDBExists = db.objectStoreNames.contains('stores');
    const reviewsDBExists = db.objectStoreNames.contains('reviews');

    if (!storesDBExists || !reviewsDBExists) return;

    const storesTX = db.transaction('stores').objectStore('stores').index('by-id').get(parseInt(id));
    const reviewsTX = db.transaction('reviews').objectStore('reviews').get(parseInt(id));

    //Get all restaurant data from IDB..
    Promise.all([storesTX, reviewsTX])
      .then(data => {
        const isAnyNull = data.some(d => d === null || d === undefined);
        if (!data || isAnyNull)
          //Fetch again and store results
          fetchDataAndSaveToIDB(combinedURLs, dbPromise, callback, dataFetched);
        else
          callback(null, data);
      })
      .catch(err => {
        callback(err, null);
      });
  });
}

export const updateReviewsById = (id, callback = null) => {
  const reviewsURL = `${REVIEWS_URL}/?restaurant_id=${id}`;
  fetch(reviewsURL, { cache: 'reload' })
    .then(response => {
      response.json()
        .then(data => {
          idb.open('restaurants', IDB_VERSION)
            .then(dbPromise => {
              dbPromise.transaction('reviews', 'readwrite')
                .objectStore('reviews')
                .put(data, parseInt(data[0].restaurant_id));
            })
          if (callback)
            callback(data);
        })
    })
}

/**
 * Fetch restaurants by a cuisine type with proper error handling.
 */
export const fetchRestaurantByCuisine = (cuisine, callback) => {
  // Fetch all restaurants  with proper error handling
  fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      // Filter restaurants to have only given cuisine type
      const results = restaurants.filter(r => r.cuisine_type === cuisine);
      callback(null, results);
    }
  });
}

/**
 * Fetch restaurants by a neighborhood with proper error handling.
 */
export const fetchRestaurantByNeighborhood = (neighborhood, callback) => {
  // Fetch all restaurants
  fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      // Filter restaurants to have only given neighborhood
      const results = restaurants.filter(r => r.neighborhood === neighborhood);
      callback(null, results);
    }
  });
}

/**
 * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
 */
export const fetchRestaurantByCuisineAndNeighborhood = (cuisine, neighborhood, callback) => {
  // Fetch all restaurants
  fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      let results = restaurants;

      if (cuisine != 'all') { // filter by cuisine
        results = results.filter(r => r.cuisine_type === cuisine);
      }
      if (neighborhood != 'all') { // filter by neighborhood
        results = results.filter(r => r.neighborhood === neighborhood);
      }
      callback(null, results);
    }
  });
}

/**
 * Fetch all neighborhoods with proper error handling.
 */
export const fetchNeighborhoods = (callback) => {
  // Fetch all restaurants
  fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      // Get all neighborhoods from all restaurants
      const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
      // Remove duplicates from neighborhoods
      const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) === i)
      callback(null, uniqueNeighborhoods);
    }
  });
}

/**
 * Fetch all cuisines with proper error handling.
 */
export const fetchCuisines = (callback) => {
  // Fetch all restaurants
  fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      // Get all cuisines from all restaurants
      const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
      // Remove duplicates from cuisines
      const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) === i)
      callback(null, uniqueCuisines);
    }
  });
}

/**
 * Restaurant page URL.
 */
export const urlForRestaurant = (restaurant) => `./restaurant.html?id=${restaurant.id}`;

/**
 * Restaurant image URL.
 */
export const imageUrlForRestaurant = (restaurant) => {

  const { photograph } = restaurant;
  return `/img/${photograph}`;
}

/**
 * Toggle Restaurant favourite flag.
 */
export const toggleFavoriteRestaurant = (restaurantId, swRegistration) => {

  const dbPromise = idb.open('restaurants', IDB_VERSION);

  dbPromise
    .then(db => {
      db.transaction('stores', 'readwrite')
        .objectStore('stores')
        .index('by-id')
        .get(restaurantId)
        .then(r => {
          r.is_favorite = negateValue(r.is_favorite);

          if (window.navigator.onLine) {
            fetch(`${API_URL}/${restaurantId}/?is_favorite=${r.is_favorite}`,
              { method: 'PUT' }
            )
              .then((resp) => {
                db.transaction('stores', 'readwrite')
                  .objectStore('stores')
                  .put(r)
              })
          }
          else {
            db.transaction('outbox', 'readonly')
              .objectStore('outbox')
              .get(`isFav-${restaurantId}`)
              .then(restaurant => {

                const isFavorite = restaurant !== undefined 
                                    ? negateValue(restaurant.is_favorite) 
                                    : r.is_favorite;

                const objectForOutbox = {
                  restaurant_id: restaurantId,
                  is_favorite: isFavorite
                }

                db.transaction('outbox', 'readwrite')
                  .objectStore('outbox')
                  .put(objectForOutbox, `isFav-${restaurantId}`);
                  // .then(addedItem => {
                  //   window.addEventListener('online', () => {
                  //     swRegistration.sync.register('outbox');
                  //   });
                  // });
              })

          }
        })
        .catch(err => {
          console.error("Error in updating flag!!", err);
        })
    })
}

const parseBool = value => {
  if(typeof value === 'boolean') return value;

  switch(value){
      case 'true':
          return true;
      case 'false':
          return false;
      default:
          return null;
  }
}

const negateValue = value => {
  const correctValue = parseBool(value);

  return !correctValue;
}

/**
 * Map marker for a restaurant.
 */
export const mapMarkerForRestaurant = (restaurant, map) => {
  const marker = new google.maps.Marker({
    position: restaurant.latlng,
    title: restaurant.name,
    url: urlForRestaurant(restaurant),
    map: map,
    animation: google.maps.Animation.DROP
  }
  );
  return marker;
}

export default {
  fetchCuisines,
  fetchNeighborhoods,
  fetchRestaurantByCuisine,
  fetchRestaurantByCuisineAndNeighborhood,
  fetchRestaurantById,
  fetchRestaurantByNeighborhood,
  fetchRestaurants,
  mapMarkerForRestaurant,
  imageUrlForRestaurant,
  urlForRestaurant
};
