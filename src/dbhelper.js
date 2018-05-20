/**
 * Database URL.
 * Change this to restaurants.json file location on your server.
 */
const DATABASE_URL = `http://localhost:8000/data/restaurants.json`;

const API_URL = `http://localhost:1337/restaurants`;

/**
 * Fetch all restaurants.
 */
export const fetchRestaurants = (callback) => {
  fetch(API_URL).then(response => {
    if (!response.ok) {
      const error = response.statusText;
      callback(error, null);
      return;
    }

    response.json()
      .then(data => { callback(null, data) })
      .catch(err => { callback(err, null) })
  });
}

/**
 * Fetch a restaurant by its ID.
 */
export const fetchRestaurantById = (id, callback) => {
  // fetch all restaurants with proper error handling.
  fetch(`${API_URL}/${id}`).then(response => {
    if (!response.ok) {
      const error = response.statusText;
      callback(error, null);
      return;
    }

    response.json()
      .then(data => { callback(null, data) })
      .catch(err => { callback(err, null) })
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
      const results = restaurants.filter(r => r.cuisine_type == cuisine);
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
      const results = restaurants.filter(r => r.neighborhood == neighborhood);
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
      let results = restaurants
      if (cuisine != 'all') { // filter by cuisine
        results = results.filter(r => r.cuisine_type == cuisine);
      }
      if (neighborhood != 'all') { // filter by neighborhood
        results = results.filter(r => r.neighborhood == neighborhood);
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
      const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
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
      const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
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
export const imageUrlForRestaurant = (restaurant) => `/img/${restaurant.photograph}`;

/**
 * Map marker for a restaurant.
 */
export const mapMarkerForRestaurant = (restaurant, map) => {
  const marker = new google.maps.Marker({
    position: restaurant.latlng,
    title: restaurant.name,
    url: DBHelper.urlForRestaurant(restaurant),
    map: map,
    animation: google.maps.Animation.DROP
  }
  );
  return marker;
}

export default {fetchCuisines,
                fetchNeighborhoods, 
                fetchRestaurantByCuisine, 
                fetchRestaurantByCuisineAndNeighborhood, 
                fetchRestaurantById, 
                fetchRestaurantByNeighborhood, 
                fetchRestaurants, 
                mapMarkerForRestaurant,
                imageUrlForRestaurant,
                urlForRestaurant};
