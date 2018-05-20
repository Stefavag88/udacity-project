import {fetchCuisines as getCuisines, 
        fetchNeighborhoods as getNeighborhoods, 
        fetchRestaurantByCuisineAndNeighborhood as getByCuisineAndNeighbourhood,
        urlForRestaurant as restaurantUrl,
        mapMarkerForRestaurant as restaurentMarker} from "./dbhelper";
import {createResponsiveImage}  from "./imageHelper";

let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  registerSW();
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Register service Worker
 */
const registerSW = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
      .then(function (registration) {
        console.log('Service Worker Registered');
      });
    navigator.serviceWorker.ready.then(function (registration) {
      console.log('Service Worker Ready');
    });
  }
}

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
  getNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
      return;
    }
    self.neighborhoods = neighborhoods;
    fillNeighborhoodsHTML();
  });
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.querySelector('.neighborhoods-select');
  select.addEventListener('change', updateRestaurants);
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
  getCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
      return;
    };
    self.cuisines = cuisines;
    fillCuisinesHTML();
  });
}

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.querySelector('.cuisines-select');
  select.addEventListener('change', updateRestaurants);
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.querySelector('.map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
  const cSelect = document.querySelector('.cuisines-select');
  const nSelect = document.querySelector('.neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  getByCuisineAndNeighbourhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
      return;
	}
	resetRestaurants(restaurants);
	fillRestaurantsHTML();
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.querySelector('.restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if(self.markers){
	  self.markers.forEach(m => m.setMap(null));
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.querySelector('.restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  const responsiveImage = createResponsiveImage(restaurant, image);
  li.append(responsiveImage);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('h4');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('span');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute('aria-label', `Navigate to ${restaurant.name} restaurant review`);
  more.href = restaurantUrl(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = restaurentMarker(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}
