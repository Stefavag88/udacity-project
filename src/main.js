import {
  fetchCuisines as getCuisines,
  fetchNeighborhoods as getNeighborhoods,
  fetchRestaurantByCuisineAndNeighborhood as getByCuisineAndNeighbourhood,
  urlForRestaurant as restaurantUrl,
  mapMarkerForRestaurant as restaurentMarker
} from "./dbhelper";
import * as common from './commonActions';
import { createResponsiveImage, lazyLoadImages } from "./imageHelper";
import "../css/styles.css";

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  common.registerSW("Home");
  fetchNeighborhoods();
  fetchCuisines();
  updateRestaurants();
});


document.showMapOnScreen = () => {
  const mapDiv = document.querySelector('.map-container');
  const map = document.querySelector('.map');

  mapDiv.classList.toggle('hidden');
  if(mapDiv.classList.contains("hidden")) return;
  initMap(map);
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
const initMap = (map) => {

  if (!google) return;

  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(map, {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  addMarkersToMap();
}

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
  const cuisineSelect = document.querySelector('.cuisines-select');
  const neighborhoodSelect = document.querySelector('.neighborhoods-select');

  const cuisineIndex = cuisineSelect.selectedIndex;
  const neighborhoodIndex = neighborhoodSelect.selectedIndex;

  const cuisine = cuisineSelect[cuisineIndex].value;
  const neighborhood = neighborhoodSelect[neighborhoodIndex].value;

  getByCuisineAndNeighbourhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
      return;
    }

    resetRestaurants(restaurants);
    fillRestaurantsHTML();
    addMarkersToMap();
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
  if (self.markers) {
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

  const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
  lazyLoadImages(lazyImages, false);
}

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const imgContainer = document.createElement('div');
  imgContainer.classList.add('img-container');
  
  const image = document.createElement('img');
  const responsiveImage = createResponsiveImage(restaurant, image, 'home');

  const favouriteHeart = common.createIsFavouriteHeart(restaurant);

  imgContainer.append(responsiveImage);
  imgContainer.append(favouriteHeart)

  li.append(imgContainer);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('h4');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('span');
  address.innerHTML = restaurant.address;
  li.append(address);

  const button = document.createElement('a');
  button.classList.add('details-btn');
  button.innerHTML = 'View Details';
  button.setAttribute('aria-label', `Navigate to ${restaurant.name} restaurant review`);
  button.href = restaurantUrl(restaurant);
  li.append(button)

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
