import idb from 'idb';
import UIRestaurantData from './uiRestaurantData';

//const DATABASE_URL = `http://localhost:8000/data/restaurants.json`;
const API_URL = `http://localhost:1337/restaurants`;
const IDB_VERSION = 1;
const REVIEWS_URL = `http://localhost:1337/reviews`;
/**
 * Fetch all restaurants.
 */
export function fetchRestaurants(callback) {

  const dbPromise = idb.open('restaurants', IDB_VERSION, upgradeDB => {
    upgradeDB.createObjectStore('stores', { keyPath: 'id', autoIncrement: true })
      .createIndex('by-id', 'id');

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

function fetchDataAndSaveToIDB(fetchURL, dbPromise, callback, ensureFetchDataOnce = null) {

  if (Array.isArray(fetchURL)) {

    let uiCombinedData = new UIRestaurantData();

    Promise.all(fetchURL.map(url => {
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log("Raw data!!", data);
          if(Array.isArray(data)){
            uiCombinedData.reviews = data;
          }else{
            uiCombinedData.info = data;
          }
        })
        .catch(err => {
          console.log("Promise All ERROR!", err);
        })
    })).then(() => {
      console.log("Combined Data!!", uiCombinedData);
    })
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

function saveDataToIDB(dbPromise, response, objectStoreName) {
  dbPromise.then(db => {
    const storesTX = db.transaction('stores', 'readwrite');
    const reviewsTX = db.transaction('reviews', 'readwrite');

    response
      .json()
      .then(data => {

        if (Array.isArray(data)) {
          if(objectStoreName === 'reviews'){
            data.forEach(d => {
              reviews.objectStore('reviews').put(d, d[0].restaurant_id);
            })
          }else{
            data.forEach(d => {
              storesTX.objectStore('stores').put(d);
            })
          }
        } else {
          storesTX.objectStore('stores').put(data);
          reviewsTX.objectStore('reviews').put(data.reviews, data.info.id);
        }
      })
      .catch(err => {
        console.log(`Could not save restaurant/s to idb...`, err);
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

  const dbPromise = idb.open('restaurants', IDB_VERSION, upgradeDB => {

    const storesDBExists = upgradeDB.objectStoreNames.contains('stores');
    const reviewsDBExists = upgradeDB.objectStoreNames.contains('reviews');

    if (!storesDBExists) {
      upgradeDB
        .createObjectStore('stores', { keyPath: 'id', autoIncrement: true })
        .createIndex('by-id', 'id');
    }

    if (!reviewsDBExists) {
      upgradeDB
        .createObjectStore('reviews');
    }

    fetchDataAndSaveToIDB([restaurantURL, reviewsURL], dbPromise, callback, dataFetched);
  });

  dbPromise.then(db => {
    const dbExists = db.objectStoreNames.contains("stores");
    if (!dbExists) return;
    const tx = db.transaction("stores");
    const index = tx.objectStore("stores")
      .index('by-id');

    index.get(parseInt(id))
      .then(data => {

        if (!data || data.length === 0)
          fetchDataAndSaveToIDB(restaurantURL, dbPromise, callback, dataFetched);
        else
          callback(null, data);
      })
      .catch(err => {
        callback(err, null);
      });
  });
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
export function fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
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
export function fetchNeighborhoods(callback) {
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
