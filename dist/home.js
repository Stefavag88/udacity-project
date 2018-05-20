/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/dbhelper.js":
/*!*************************!*\
  !*** ./src/dbhelper.js ***!
  \*************************/
/*! exports provided: DBHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DBHelper\", function() { return _DBHelper; });\n/**\r\n * Common database helper functions.\r\n */\r\nclass DBHelper {\r\n\r\n  /**\r\n   * Database URL.\r\n   * Change this to restaurants.json file location on your server.\r\n   */\r\n  static get DATABASE_URL() {\r\n    const port = 8000 // Change this to your server port\r\n    return `http://localhost:${port}/data/restaurants.json`;\r\n  }\r\n\r\n  static get API_URL(){\r\n    const port = 1337\r\n    return `http://localhost:${port}/restaurants`;\r\n  }\r\n\r\n  /**\r\n   * Fetch all restaurants.\r\n   */\r\n  static fetchRestaurants(callback) {\r\n    fetch(DBHelper.API_URL).then(response => {\r\n      if(!response.ok){\r\n        const error = response.statusText;\r\n        callback(error, null);\r\n        return;\r\n      }\r\n\r\n      response.json()\r\n        .then(data => {callback(null, data)})\r\n        .catch(err => {callback(err, null)})\r\n    });\r\n  }\r\n\r\n  /**\r\n   * Fetch a restaurant by its ID.\r\n   */\r\n  static fetchRestaurantById(id, callback) {\r\n    // fetch all restaurants with proper error handling.\r\n    fetch(`${DBHelper.API_URL}/${id}`).then(response => {\r\n    if(!response.ok){\r\n        const error = response.statusText;\r\n        callback(error, null);\r\n        return;\r\n      }\r\n\r\n      response.json()\r\n        .then(data => {callback(null, data)})\r\n        .catch(err => {callback(err, null)})\r\n    });\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a cuisine type with proper error handling.\r\n   */\r\n  static fetchRestaurantByCuisine(cuisine, callback) {\r\n    // Fetch all restaurants  with proper error handling\r\n    DBHelper.fetchRestaurants((error, restaurants) => {\r\n      if (error) {\r\n        callback(error, null);\r\n      } else {\r\n        // Filter restaurants to have only given cuisine type\r\n        const results = restaurants.filter(r => r.cuisine_type == cuisine);\r\n        callback(null, results);\r\n      }\r\n    });\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a neighborhood with proper error handling.\r\n   */\r\n  static fetchRestaurantByNeighborhood(neighborhood, callback) {\r\n    // Fetch all restaurants\r\n    DBHelper.fetchRestaurants((error, restaurants) => {\r\n      if (error) {\r\n        callback(error, null);\r\n      } else {\r\n        // Filter restaurants to have only given neighborhood\r\n        const results = restaurants.filter(r => r.neighborhood == neighborhood);\r\n        callback(null, results);\r\n      }\r\n    });\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.\r\n   */\r\n  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {\r\n    // Fetch all restaurants\r\n    DBHelper.fetchRestaurants((error, restaurants) => {\r\n      if (error) {\r\n        callback(error, null);\r\n      } else {\r\n        let results = restaurants\r\n        if (cuisine != 'all') { // filter by cuisine\r\n          results = results.filter(r => r.cuisine_type == cuisine);\r\n        }\r\n        if (neighborhood != 'all') { // filter by neighborhood\r\n          results = results.filter(r => r.neighborhood == neighborhood);\r\n        }\r\n        callback(null, results);\r\n      }\r\n    });\r\n  }\r\n\r\n  /**\r\n   * Fetch all neighborhoods with proper error handling.\r\n   */\r\n  static fetchNeighborhoods(callback) {\r\n    // Fetch all restaurants\r\n    DBHelper.fetchRestaurants((error, restaurants) => {\r\n      if (error) {\r\n        callback(error, null);\r\n      } else {\r\n        // Get all neighborhoods from all restaurants\r\n        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)\r\n        // Remove duplicates from neighborhoods\r\n        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)\r\n        callback(null, uniqueNeighborhoods);\r\n      }\r\n    });\r\n  }\r\n\r\n  /**\r\n   * Fetch all cuisines with proper error handling.\r\n   */\r\n  static fetchCuisines(callback) {\r\n    // Fetch all restaurants\r\n    DBHelper.fetchRestaurants((error, restaurants) => {\r\n      if (error) {\r\n        callback(error, null);\r\n      } else {\r\n        // Get all cuisines from all restaurants\r\n        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)\r\n        // Remove duplicates from cuisines\r\n        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)\r\n        callback(null, uniqueCuisines);\r\n      }\r\n    });\r\n  }\r\n\r\n  /**\r\n   * Restaurant page URL.\r\n   */\r\n  static urlForRestaurant(restaurant) {\r\n    return (`./restaurant.html?id=${restaurant.id}`);\r\n  }\r\n\r\n  /**\r\n   * Restaurant image URL.\r\n   */\r\n  static imageUrlForRestaurant(restaurant) {\r\n    return `/img/${restaurant.photograph}`;\r\n  }\r\n\r\n  /**\r\n   * Map marker for a restaurant.\r\n   */\r\n  static mapMarkerForRestaurant(restaurant, map) {\r\n    const marker = new google.maps.Marker({\r\n      position: restaurant.latlng,\r\n      title: restaurant.name,\r\n      url: DBHelper.urlForRestaurant(restaurant),\r\n      map: map,\r\n      animation: google.maps.Animation.DROP}\r\n    );\r\n    return marker;\r\n  }\r\n\r\n}\r\n\r\nconst _DBHelper = DBHelper;\r\n\r\n\n\n//# sourceURL=webpack:///./src/dbhelper.js?");

/***/ }),

/***/ "./src/imageHelper.js":
/*!****************************!*\
  !*** ./src/imageHelper.js ***!
  \****************************/
/*! exports provided: ImageHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ImageHelper\", function() { return _ImageHelper; });\nclass ImageHelper{\r\n\r\n    static createResponsiveImage(restaurant, imgElement){\r\n\r\n        const imgPath = DBHelper.imageUrlForRestaurant(restaurant);\r\n\r\n        imgElement.className = 'restaurant-img';\r\n        imgElement.srcset = `${imgPath}-360w.jpg 360w,\r\n                             ${imgPath}-496w.jpg 496w,\r\n                             ${imgPath}-800w.jpg 800w`;\r\n        imgElement.sizes = \"(max-width: 400px) 360px,(max-width: 600px) 496px,800px\";\r\n        imgElement.src = `${imgPath}-800w.jpg`\r\n        imgElement.alt = `Photo of ${restaurant.name} restaurant`;\r\n\r\n        return imgElement;\r\n    }\r\n}\r\n\r\nconst _ImageHelper = ImageHelper;\r\n\n\n//# sourceURL=webpack:///./src/imageHelper.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _dbhelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dbhelper */ \"./src/dbhelper.js\");\n/* harmony import */ var _imageHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./imageHelper */ \"./src/imageHelper.js\");\n\r\n\r\n\r\nlet restaurants,\r\n  neighborhoods,\r\n  cuisines\r\nvar map\r\nvar markers = []\r\n/**\r\n * Fetch neighborhoods and cuisines as soon as the page is loaded.\r\n */\r\ndocument.addEventListener('DOMContentLoaded', (event) => {\r\n  fetchNeighborhoods();\r\n  fetchCuisines();\r\n});\r\n\r\n/**\r\n * Fetch all neighborhoods and set their HTML.\r\n */\r\nfetchNeighborhoods = () => {\r\n  _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].fetchNeighborhoods((error, neighborhoods) => {\r\n    if (error) { // Got an error\r\n      console.error(error);\r\n      return;\r\n    }\r\n    self.neighborhoods = neighborhoods;\r\n    fillNeighborhoodsHTML();\r\n  });\r\n}\r\n\r\n/**\r\n * Set neighborhoods HTML.\r\n */\r\nfillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {\r\n  const select = document.querySelector('.neighborhoods-select');\r\n  neighborhoods.forEach(neighborhood => {\r\n    const option = document.createElement('option');\r\n    option.innerHTML = neighborhood;\r\n    option.value = neighborhood;\r\n    select.append(option);\r\n  });\r\n}\r\n\r\n/**\r\n * Fetch all cuisines and set their HTML.\r\n */\r\nfetchCuisines = () => {\r\n  _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].fetchCuisines((error, cuisines) => {\r\n    if (error) { // Got an error!\r\n      console.error(error);\r\n      return;\r\n    };\r\n    self.cuisines = cuisines;\r\n    fillCuisinesHTML();\r\n  });\r\n}\r\n\r\n/**\r\n * Set cuisines HTML.\r\n */\r\nfillCuisinesHTML = (cuisines = self.cuisines) => {\r\n  const select = document.querySelector('.cuisines-select');\r\n\r\n  cuisines.forEach(cuisine => {\r\n    const option = document.createElement('option');\r\n    option.innerHTML = cuisine;\r\n    option.value = cuisine;\r\n    select.append(option);\r\n  });\r\n}\r\n\r\n/**\r\n * Initialize Google map, called from HTML.\r\n */\r\nwindow.initMap = () => {\r\n  let loc = {\r\n    lat: 40.722216,\r\n    lng: -73.987501\r\n  };\r\n  self.map = new google.maps.Map(document.querySelector('.map'), {\r\n    zoom: 12,\r\n    center: loc,\r\n    scrollwheel: false\r\n  });\r\n  updateRestaurants();\r\n}\r\n\r\n/**\r\n * Update page and map for current restaurants.\r\n */\r\nupdateRestaurants = () => {\r\n  const cSelect = document.querySelector('.cuisines-select');\r\n  const nSelect = document.querySelector('.neighborhoods-select');\r\n\r\n  const cIndex = cSelect.selectedIndex;\r\n  const nIndex = nSelect.selectedIndex;\r\n\r\n  const cuisine = cSelect[cIndex].value;\r\n  const neighborhood = nSelect[nIndex].value;\r\n\r\n  _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {\r\n    if (error) { // Got an error!\r\n      console.error(error);\r\n      return;\r\n\t}\r\n\tresetRestaurants(restaurants);\r\n\tfillRestaurantsHTML();\r\n  })\r\n}\r\n\r\n/**\r\n * Clear current restaurants, their HTML and remove their map markers.\r\n */\r\nresetRestaurants = (restaurants) => {\r\n  // Remove all restaurants\r\n  self.restaurants = [];\r\n  const ul = document.querySelector('.restaurants-list');\r\n  ul.innerHTML = '';\r\n\r\n  // Remove all map markers\r\n  if(self.markers){\r\n\tself.markers.forEach(m => m.setMap(null));\r\n  }\r\n  self.markers = [];\r\n  self.restaurants = restaurants;\r\n}\r\n\r\n/**\r\n * Create all restaurants HTML and add them to the webpage.\r\n */\r\nfillRestaurantsHTML = (restaurants = self.restaurants) => {\r\n  const ul = document.querySelector('.restaurants-list');\r\n  restaurants.forEach(restaurant => {\r\n    ul.append(createRestaurantHTML(restaurant));\r\n  });\r\n  addMarkersToMap();\r\n}\r\n\r\n/**\r\n * Create restaurant HTML.\r\n */\r\ncreateRestaurantHTML = (restaurant) => {\r\n  const li = document.createElement('li');\r\n\r\n  const image = document.createElement('img');\r\n  const responsiveImage = _imageHelper__WEBPACK_IMPORTED_MODULE_1__[\"ImageHelper\"].createResponsiveImage(restaurant, image);\r\n  li.append(responsiveImage);\r\n\r\n  const name = document.createElement('h1');\r\n  name.innerHTML = restaurant.name;\r\n  li.append(name);\r\n\r\n  const neighborhood = document.createElement('h4');\r\n  neighborhood.innerHTML = restaurant.neighborhood;\r\n  li.append(neighborhood);\r\n\r\n  const address = document.createElement('span');\r\n  address.innerHTML = restaurant.address;\r\n  li.append(address);\r\n\r\n  const more = document.createElement('a');\r\n  more.innerHTML = 'View Details';\r\n  more.setAttribute('aria-label', `Navigate to ${restaurant.name} restaurant review`);\r\n  more.href = _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].urlForRestaurant(restaurant);\r\n  li.append(more)\r\n\r\n  return li\r\n}\r\n\r\n/**\r\n * Add markers for current restaurants to the map.\r\n */\r\naddMarkersToMap = (restaurants = self.restaurants) => {\r\n  restaurants.forEach(restaurant => {\r\n    // Add marker to the map\r\n    const marker = _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].mapMarkerForRestaurant(restaurant, self.map);\r\n    google.maps.event.addListener(marker, 'click', () => {\r\n      window.location.href = marker.url\r\n    });\r\n    self.markers.push(marker);\r\n  });\r\n}\r\n\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });