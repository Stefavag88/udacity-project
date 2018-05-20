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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/restaurant_info.js");
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

/***/ "./src/restaurant_info.js":
/*!********************************!*\
  !*** ./src/restaurant_info.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _dbhelper = __webpack_require__(/*! ./dbhelper.js */ \"./src/dbhelper.js\");\n\nvar _imageHelper = __webpack_require__(/*! ./imageHelper */ \"./src/imageHelper.js\");\n\nvar restaurant = void 0;\nvar map;\n/**\r\n * Initialize Google map, called from HTML.\r\n */\nwindow.initMap = function () {\n  fetchRestaurantFromURL(function (error, restaurant) {\n    if (error) {\n      // Got an error!\n      console.error(error);\n      return;\n    }\n    self.map = new google.maps.Map(document.querySelector('.map'), {\n      zoom: 16,\n      center: restaurant.latlng,\n      scrollwheel: false\n    });\n    fillBreadcrumb();\n    (0, _dbhelper.mapMarkerForRestaurant)(self.restaurant, self.map);\n  });\n};\n\n/**\r\n * Get current restaurant from page URL.\r\n */\nvar fetchRestaurantFromURL = function fetchRestaurantFromURL(callback) {\n  if (self.restaurant) {\n    // restaurant already fetched!\n    callback(null, self.restaurant);\n    return;\n  }\n\n  var id = getParameterByName('id');\n  if (!id) {\n    // no id found in URL\n    error = 'No restaurant id in URL';\n    callback(error, null);\n    return;\n  }\n\n  (0, _dbhelper.fetchRestaurantById)(id, function (error, restaurant) {\n    self.restaurant = restaurant;\n    if (!restaurant) {\n      console.error(error);\n      return;\n    }\n    fillRestaurantHTML();\n    callback(null, restaurant);\n  });\n};\n\n/**\r\n * Create restaurant HTML and add it to the webpage\r\n */\nvar fillRestaurantHTML = function fillRestaurantHTML() {\n  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;\n\n  var name = document.querySelector('.restaurant-name');\n  name.innerHTML = restaurant.name;\n\n  var address = document.querySelector('.restaurant-address');\n  address.innerHTML = restaurant.address;\n\n  var image = (0, _imageHelper.createResponsiveImage)(restaurant, document.querySelector('.restaurant-img'));\n\n  var cuisine = document.querySelector('.restaurant-cuisine');\n  cuisine.innerHTML = restaurant.cuisine_type;\n\n  // fill operating hours\n  if (restaurant.operating_hours) {\n    fillRestaurantHoursHTML();\n  }\n  // fill reviews\n  fillReviewsHTML();\n};\n\n/**\r\n * Create restaurant operating hours HTML table and add it to the webpage.\r\n */\nvar fillRestaurantHoursHTML = function fillRestaurantHoursHTML() {\n  var operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.operating_hours;\n\n  var hours = document.querySelector('.restaurant-hours');\n  for (var key in operatingHours) {\n    var row = document.createElement('tr');\n\n    var day = document.createElement('td');\n    day.innerHTML = key;\n    row.appendChild(day);\n\n    var time = document.createElement('td');\n    time.innerHTML = operatingHours[key];\n    row.appendChild(time);\n\n    hours.appendChild(row);\n  }\n};\n\n/**\r\n * Create all reviews HTML and add them to the webpage.\r\n */\nvar fillReviewsHTML = function fillReviewsHTML() {\n  var reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.reviews;\n\n  var container = document.querySelector('.reviews-container');\n\n  if (!reviews) {\n    var noReviews = document.createElement('p');\n    noReviews.innerHTML = 'No reviews yet!';\n    container.appendChild(noReviews);\n    return;\n  }\n  var ul = document.querySelector('.reviews-list');\n  reviews.forEach(function (review) {\n    ul.appendChild(createReviewHTML(review));\n  });\n  container.appendChild(ul);\n};\n\n/**\r\n * Create review HTML and add it to the webpage.\r\n */\nvar createReviewHTML = function createReviewHTML(review) {\n  var li = document.createElement('li');\n  li.classList.add('review-container');\n\n  var reviewInfo = document.createElement('div');\n  reviewInfo.classList.add('review-info');\n\n  var name = document.createElement('h4');\n  name.classList.add('review-name');\n  name.innerHTML = review.name;\n  reviewInfo.appendChild(name);\n\n  var date = document.createElement('span');\n  date.classList.add('review-date');\n  date.innerHTML = review.date;\n  date.setAttribute('aria-label', \"Published on \" + review.date);\n  reviewInfo.appendChild(date);\n\n  var rating = createRatingStars(review);\n  reviewInfo.appendChild(rating);\n\n  li.appendChild(reviewInfo);\n\n  var comments = document.createElement('blockquote');\n  comments.classList.add('review-comments');\n  comments.innerHTML = review.comments;\n  li.appendChild(comments);\n\n  return li;\n};\n\n/**\r\n * Create rating stars to display to the review\r\n */\nvar createRatingStars = function createRatingStars(_ref) {\n  var rating = _ref.rating;\n\n  var ratingContainer = document.createElement('div');\n  ratingContainer.classList.add('review-rating');\n  ratingContainer.setAttribute('aria-label', \"Rating : \" + rating + \" stars out of 5\");\n  for (var i = 1; i <= rating; i++) {\n    var star = document.createElement('span');\n    star.classList.add('rating-star');\n    star.innerHTML = \"&#x2605;\";\n    star.setAttribute('aria-hidden', 'true');\n    ratingContainer.appendChild(star);\n  }\n\n  return ratingContainer;\n};\n\n/**\r\n * Add restaurant name to the breadcrumb navigation menu\r\n */\nvar fillBreadcrumb = function fillBreadcrumb() {\n  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;\n\n  var breadcrumb = document.querySelector('.breadcrumb');\n  var li = document.createElement('li');\n  li.innerHTML = restaurant.name;\n  breadcrumb.appendChild(li);\n};\n\n/**\r\n * Get a parameter by name from page URL.\r\n */\nvar getParameterByName = function getParameterByName(name, url) {\n  if (!url) url = window.location.href;\n\n  name = name.replace(/[\\[\\]]/g, '\\\\$&');\n  var regex = new RegExp(\"[?&]\" + name + \"(=([^&#]*)|&|#|$)\"),\n      results = regex.exec(url);\n\n  if (!results) return null;\n\n  if (!results[2]) return '';\n\n  return decodeURIComponent(results[2].replace(/\\+/g, ' '));\n};\n\n//# sourceURL=webpack:///./src/restaurant_info.js?");

/***/ })

/******/ });