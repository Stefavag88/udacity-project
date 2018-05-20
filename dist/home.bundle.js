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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar DATABASE_URL = 'http://localhost:8000/data/restaurants.json';\nvar API_URL = 'http://localhost:1337/restaurants';\n\n/**\r\n * Fetch all restaurants.\r\n */\nvar fetchRestaurants = exports.fetchRestaurants = function fetchRestaurants(callback) {\n  fetch(API_URL).then(function (response) {\n    if (!response.ok) {\n      var error = response.statusText;\n      callback(error, null);\n      return;\n    }\n\n    response.json().then(function (data) {\n      callback(null, data);\n    }).catch(function (err) {\n      callback(err, null);\n    });\n  });\n};\n\n/**\r\n * Fetch a restaurant by its ID.\r\n */\nvar fetchRestaurantById = exports.fetchRestaurantById = function fetchRestaurantById(id, callback) {\n  // fetch all restaurants with proper error handling.\n  fetch(API_URL + '/' + id).then(function (response) {\n    if (!response.ok) {\n      var error = response.statusText;\n      callback(error, null);\n      return;\n    }\n\n    response.json().then(function (data) {\n      callback(null, data);\n    }).catch(function (err) {\n      callback(err, null);\n    });\n  });\n};\n\n/**\r\n * Fetch restaurants by a cuisine type with proper error handling.\r\n */\nvar fetchRestaurantByCuisine = exports.fetchRestaurantByCuisine = function fetchRestaurantByCuisine(cuisine, callback) {\n  // Fetch all restaurants  with proper error handling\n  fetchRestaurants(function (error, restaurants) {\n    if (error) {\n      callback(error, null);\n    } else {\n      // Filter restaurants to have only given cuisine type\n      var results = restaurants.filter(function (r) {\n        return r.cuisine_type == cuisine;\n      });\n      callback(null, results);\n    }\n  });\n};\n\n/**\r\n * Fetch restaurants by a neighborhood with proper error handling.\r\n */\nvar fetchRestaurantByNeighborhood = exports.fetchRestaurantByNeighborhood = function fetchRestaurantByNeighborhood(neighborhood, callback) {\n  // Fetch all restaurants\n  fetchRestaurants(function (error, restaurants) {\n    if (error) {\n      callback(error, null);\n    } else {\n      // Filter restaurants to have only given neighborhood\n      var results = restaurants.filter(function (r) {\n        return r.neighborhood == neighborhood;\n      });\n      callback(null, results);\n    }\n  });\n};\n\n/**\r\n * Fetch restaurants by a cuisine and a neighborhood with proper error handling.\r\n */\nvar fetchRestaurantByCuisineAndNeighborhood = exports.fetchRestaurantByCuisineAndNeighborhood = function fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {\n  // Fetch all restaurants\n  fetchRestaurants(function (error, restaurants) {\n    if (error) {\n      callback(error, null);\n    } else {\n      var results = restaurants;\n      if (cuisine != 'all') {\n        // filter by cuisine\n        results = results.filter(function (r) {\n          return r.cuisine_type == cuisine;\n        });\n      }\n      if (neighborhood != 'all') {\n        // filter by neighborhood\n        results = results.filter(function (r) {\n          return r.neighborhood == neighborhood;\n        });\n      }\n      callback(null, results);\n    }\n  });\n};\n\n/**\r\n * Fetch all neighborhoods with proper error handling.\r\n */\nvar fetchNeighborhoods = exports.fetchNeighborhoods = function fetchNeighborhoods(callback) {\n  // Fetch all restaurants\n  fetchRestaurants(function (error, restaurants) {\n    if (error) {\n      callback(error, null);\n    } else {\n      // Get all neighborhoods from all restaurants\n      var neighborhoods = restaurants.map(function (v, i) {\n        return restaurants[i].neighborhood;\n      });\n      // Remove duplicates from neighborhoods\n      var uniqueNeighborhoods = neighborhoods.filter(function (v, i) {\n        return neighborhoods.indexOf(v) == i;\n      });\n      callback(null, uniqueNeighborhoods);\n    }\n  });\n};\n\n/**\r\n * Fetch all cuisines with proper error handling.\r\n */\nvar fetchCuisines = exports.fetchCuisines = function fetchCuisines(callback) {\n  // Fetch all restaurants\n  fetchRestaurants(function (error, restaurants) {\n    if (error) {\n      callback(error, null);\n    } else {\n      // Get all cuisines from all restaurants\n      var cuisines = restaurants.map(function (v, i) {\n        return restaurants[i].cuisine_type;\n      });\n      // Remove duplicates from cuisines\n      var uniqueCuisines = cuisines.filter(function (v, i) {\n        return cuisines.indexOf(v) == i;\n      });\n      callback(null, uniqueCuisines);\n    }\n  });\n};\n\n/**\r\n * Restaurant page URL.\r\n */\nvar urlForRestaurant = exports.urlForRestaurant = function urlForRestaurant(restaurant) {\n  return './restaurant.html?id=' + restaurant.id;\n};\n\n/**\r\n * Restaurant image URL.\r\n */\nvar imageUrlForRestaurant = exports.imageUrlForRestaurant = function imageUrlForRestaurant(restaurant) {\n  return '/img/' + restaurant.photograph;\n};\n\n/**\r\n * Map marker for a restaurant.\r\n */\nvar mapMarkerForRestaurant = exports.mapMarkerForRestaurant = function mapMarkerForRestaurant(restaurant, map) {\n  var marker = new google.maps.Marker({\n    position: restaurant.latlng,\n    title: restaurant.name,\n    url: urlForRestaurant(restaurant),\n    map: map,\n    animation: google.maps.Animation.DROP\n  });\n  return marker;\n};\n\nexports.default = { fetchCuisines: fetchCuisines,\n  fetchNeighborhoods: fetchNeighborhoods,\n  fetchRestaurantByCuisine: fetchRestaurantByCuisine,\n  fetchRestaurantByCuisineAndNeighborhood: fetchRestaurantByCuisineAndNeighborhood,\n  fetchRestaurantById: fetchRestaurantById,\n  fetchRestaurantByNeighborhood: fetchRestaurantByNeighborhood,\n  fetchRestaurants: fetchRestaurants,\n  mapMarkerForRestaurant: mapMarkerForRestaurant,\n  imageUrlForRestaurant: imageUrlForRestaurant,\n  urlForRestaurant: urlForRestaurant };\n\n//# sourceURL=webpack:///./src/dbhelper.js?");

/***/ }),

/***/ "./src/imageHelper.js":
/*!****************************!*\
  !*** ./src/imageHelper.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.createResponsiveImage = undefined;\n\nvar _dbhelper = __webpack_require__(/*! ./dbhelper */ \"./src/dbhelper.js\");\n\nvar createResponsiveImage = exports.createResponsiveImage = function createResponsiveImage(restaurant, imgElement) {\n\n    var imgPath = (0, _dbhelper.imageUrlForRestaurant)(restaurant);\n\n    imgElement.className = 'restaurant-img';\n    imgElement.srcset = imgPath + '-360w.jpg 360w,\\n                             ' + imgPath + '-496w.jpg 496w,\\n                             ' + imgPath + '-800w.jpg 800w';\n    imgElement.sizes = \"(max-width: 400px) 360px,(max-width: 600px) 496px,800px\";\n    imgElement.src = imgPath + '-800w.jpg';\n    imgElement.alt = 'Photo of ' + restaurant.name + ' restaurant';\n\n    return imgElement;\n};\n\n//# sourceURL=webpack:///./src/imageHelper.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _dbhelper = __webpack_require__(/*! ./dbhelper */ \"./src/dbhelper.js\");\n\nvar _imageHelper = __webpack_require__(/*! ./imageHelper */ \"./src/imageHelper.js\");\n\nvar restaurants = void 0,\n    neighborhoods = void 0,\n    cuisines = void 0;\nvar map;\nvar markers = [];\n/**\r\n * Fetch neighborhoods and cuisines as soon as the page is loaded.\r\n */\ndocument.addEventListener('DOMContentLoaded', function (event) {\n  registerSW();\n  fetchNeighborhoods();\n  fetchCuisines();\n});\n\n/**\r\n * Register service Worker\r\n */\nvar registerSW = function registerSW() {\n  if ('serviceWorker' in navigator) {\n    navigator.serviceWorker.register('../sw.js').then(function (registration) {\n      console.log('Service Worker Registered');\n    });\n    navigator.serviceWorker.ready.then(function (registration) {\n      console.log('Service Worker Ready');\n    });\n  }\n};\n\n/**\r\n * Fetch all neighborhoods and set their HTML.\r\n */\nvar fetchNeighborhoods = function fetchNeighborhoods() {\n  (0, _dbhelper.fetchNeighborhoods)(function (error, neighborhoods) {\n    if (error) {\n      // Got an error\n      console.error(error);\n      return;\n    }\n    self.neighborhoods = neighborhoods;\n    fillNeighborhoodsHTML();\n  });\n};\n\n/**\r\n * Set neighborhoods HTML.\r\n */\nvar fillNeighborhoodsHTML = function fillNeighborhoodsHTML() {\n  var neighborhoods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.neighborhoods;\n\n  var select = document.querySelector('.neighborhoods-select');\n  select.addEventListener('change', updateRestaurants);\n  neighborhoods.forEach(function (neighborhood) {\n    var option = document.createElement('option');\n    option.innerHTML = neighborhood;\n    option.value = neighborhood;\n    select.append(option);\n  });\n};\n\n/**\r\n * Fetch all cuisines and set their HTML.\r\n */\nvar fetchCuisines = function fetchCuisines() {\n  (0, _dbhelper.fetchCuisines)(function (error, cuisines) {\n    if (error) {\n      // Got an error!\n      console.error(error);\n      return;\n    };\n    self.cuisines = cuisines;\n    fillCuisinesHTML();\n  });\n};\n\n/**\r\n * Set cuisines HTML.\r\n */\nvar fillCuisinesHTML = function fillCuisinesHTML() {\n  var cuisines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.cuisines;\n\n  var select = document.querySelector('.cuisines-select');\n  select.addEventListener('change', updateRestaurants);\n  cuisines.forEach(function (cuisine) {\n    var option = document.createElement('option');\n    option.innerHTML = cuisine;\n    option.value = cuisine;\n    select.append(option);\n  });\n};\n\n/**\r\n * Initialize Google map, called from HTML.\r\n */\nwindow.initMap = function () {\n  var loc = {\n    lat: 40.722216,\n    lng: -73.987501\n  };\n  self.map = new google.maps.Map(document.querySelector('.map'), {\n    zoom: 12,\n    center: loc,\n    scrollwheel: false\n  });\n  updateRestaurants();\n};\n\n/**\r\n * Update page and map for current restaurants.\r\n */\nvar updateRestaurants = function updateRestaurants() {\n  var cSelect = document.querySelector('.cuisines-select');\n  var nSelect = document.querySelector('.neighborhoods-select');\n\n  var cIndex = cSelect.selectedIndex;\n  var nIndex = nSelect.selectedIndex;\n\n  var cuisine = cSelect[cIndex].value;\n  var neighborhood = nSelect[nIndex].value;\n\n  (0, _dbhelper.fetchRestaurantByCuisineAndNeighborhood)(cuisine, neighborhood, function (error, restaurants) {\n    if (error) {\n      // Got an error!\n      console.error(error);\n      return;\n    }\n    resetRestaurants(restaurants);\n    fillRestaurantsHTML();\n  });\n};\n\n/**\r\n * Clear current restaurants, their HTML and remove their map markers.\r\n */\nvar resetRestaurants = function resetRestaurants(restaurants) {\n  // Remove all restaurants\n  self.restaurants = [];\n  var ul = document.querySelector('.restaurants-list');\n  ul.innerHTML = '';\n\n  // Remove all map markers\n  if (self.markers) {\n    self.markers.forEach(function (m) {\n      return m.setMap(null);\n    });\n  }\n  self.markers = [];\n  self.restaurants = restaurants;\n};\n\n/**\r\n * Create all restaurants HTML and add them to the webpage.\r\n */\nvar fillRestaurantsHTML = function fillRestaurantsHTML() {\n  var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;\n\n  var ul = document.querySelector('.restaurants-list');\n  restaurants.forEach(function (restaurant) {\n    ul.append(createRestaurantHTML(restaurant));\n  });\n  addMarkersToMap();\n};\n\n/**\r\n * Create restaurant HTML.\r\n */\nvar createRestaurantHTML = function createRestaurantHTML(restaurant) {\n  var li = document.createElement('li');\n\n  var image = document.createElement('img');\n  var responsiveImage = (0, _imageHelper.createResponsiveImage)(restaurant, image);\n  li.append(responsiveImage);\n\n  var name = document.createElement('h1');\n  name.innerHTML = restaurant.name;\n  li.append(name);\n\n  var neighborhood = document.createElement('h4');\n  neighborhood.innerHTML = restaurant.neighborhood;\n  li.append(neighborhood);\n\n  var address = document.createElement('span');\n  address.innerHTML = restaurant.address;\n  li.append(address);\n\n  var more = document.createElement('a');\n  more.innerHTML = 'View Details';\n  more.setAttribute('aria-label', \"Navigate to \" + restaurant.name + \" restaurant review\");\n  more.href = (0, _dbhelper.urlForRestaurant)(restaurant);\n  li.append(more);\n\n  return li;\n};\n\n/**\r\n * Add markers for current restaurants to the map.\r\n */\nvar addMarkersToMap = function addMarkersToMap() {\n  var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;\n\n  restaurants.forEach(function (restaurant) {\n    // Add marker to the map\n    var marker = (0, _dbhelper.mapMarkerForRestaurant)(restaurant, self.map);\n    google.maps.event.addListener(marker, 'click', function () {\n      window.location.href = marker.url;\n    });\n    self.markers.push(marker);\n  });\n};\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });