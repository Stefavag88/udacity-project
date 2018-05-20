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

/***/ "./src/restaurant_info.js":
/*!********************************!*\
  !*** ./src/restaurant_info.js ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _dbhelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dbhelper */ \"./src/dbhelper.js\");\n/* harmony import */ var _imageHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./imageHelper */ \"./src/imageHelper.js\");\n\r\n\r\n\r\nlet restaurant;\r\nvar map;\r\n/**\r\n * Initialize Google map, called from HTML.\r\n */\r\nwindow.initMap = () => {\r\n  fetchRestaurantFromURL((error, restaurant) => {\r\n    if (error) { // Got an error!\r\n      console.error(error);\r\n      return;\r\n    } \r\n    self.map = new google.maps.Map(document.querySelector('.map'), {\r\n      zoom: 16,\r\n      center: restaurant.latlng,\r\n      scrollwheel: false\r\n    });\r\n    fillBreadcrumb();\r\n    _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].mapMarkerForRestaurant(self.restaurant, self.map);\r\n  });\r\n}\r\n\r\n/**\r\n * Get current restaurant from page URL.\r\n */\r\nfetchRestaurantFromURL = (callback) => {\r\n  if (self.restaurant) { // restaurant already fetched!\r\n    callback(null, self.restaurant)\r\n    return;\r\n  }\r\n\r\n  const id = getParameterByName('id');\r\n  if (!id) { // no id found in URL\r\n    error = 'No restaurant id in URL'\r\n    callback(error, null);\r\n    return;\r\n  }\r\n\r\n  _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].fetchRestaurantById(id, (error, restaurant) => {\r\n    self.restaurant = restaurant;\r\n    if (!restaurant) {\r\n      console.error(error);\r\n      return;\r\n    }\r\n    fillRestaurantHTML();\r\n    callback(null, restaurant)\r\n  });\r\n}\r\n\r\n/**\r\n * Create restaurant HTML and add it to the webpage\r\n */\r\nfillRestaurantHTML = (restaurant = self.restaurant) => {\r\n  const name = document.querySelector('.restaurant-name');\r\n  name.innerHTML = restaurant.name;\r\n\r\n  const address = document.querySelector('.restaurant-address');\r\n  address.innerHTML = restaurant.address;\r\n\r\n  const image = _imageHelper__WEBPACK_IMPORTED_MODULE_1__[\"ImageHelper\"].createResponsiveImage(restaurant, document.querySelector('.restaurant-img'));\r\n\r\n  const cuisine = document.querySelector('.restaurant-cuisine');\r\n  cuisine.innerHTML = restaurant.cuisine_type;\r\n\r\n  // fill operating hours\r\n  if (restaurant.operating_hours) {\r\n    fillRestaurantHoursHTML();\r\n  }\r\n  // fill reviews\r\n  fillReviewsHTML();\r\n}\r\n\r\n/**\r\n * Create restaurant operating hours HTML table and add it to the webpage.\r\n */\r\nfillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {\r\n  const hours = document.querySelector('.restaurant-hours');\r\n  for (let key in operatingHours) {\r\n    const row = document.createElement('tr');\r\n\r\n    const day = document.createElement('td');\r\n    day.innerHTML = key;\r\n    row.appendChild(day);\r\n\r\n    const time = document.createElement('td');\r\n    time.innerHTML = operatingHours[key];\r\n    row.appendChild(time);\r\n\r\n    hours.appendChild(row);\r\n  }\r\n}\r\n\r\n/**\r\n * Create all reviews HTML and add them to the webpage.\r\n */\r\nfillReviewsHTML = (reviews = self.restaurant.reviews) => {\r\n  const container = document.querySelector('.reviews-container');\r\n\r\n  if (!reviews) {\r\n    const noReviews = document.createElement('p');\r\n    noReviews.innerHTML = 'No reviews yet!';\r\n    container.appendChild(noReviews);\r\n    return;\r\n  }\r\n  const ul = document.querySelector('.reviews-list');\r\n  reviews.forEach(review => {\r\n    ul.appendChild(createReviewHTML(review));\r\n  });\r\n  container.appendChild(ul);\r\n}\r\n\r\n/**\r\n * Create review HTML and add it to the webpage.\r\n */\r\ncreateReviewHTML = (review) => {\r\n  const li = document.createElement('li');\r\n  li.classList.add('review-container');\r\n  \r\n  const reviewInfo = document.createElement('div');\r\n  reviewInfo.classList.add('review-info');\r\n\r\n  const name = document.createElement('h4');\r\n  name.classList.add('review-name');\r\n  name.innerHTML = review.name;\r\n  reviewInfo.appendChild(name);\r\n\r\n  const date = document.createElement('span');\r\n  date.classList.add('review-date');\r\n  date.innerHTML = review.date;\r\n  date.setAttribute('aria-label', `Published on ${review.date}`);\r\n  reviewInfo.appendChild(date);\r\n\r\n  const rating = createRatingStars(review);\r\n  reviewInfo.appendChild(rating);\r\n\r\n  li.appendChild(reviewInfo);\r\n\r\n  const comments = document.createElement('blockquote');\r\n  comments.classList.add('review-comments');\r\n  comments.innerHTML = review.comments;\r\n  li.appendChild(comments);\r\n\r\n  return li;\r\n}\r\n\r\n/**\r\n * Create rating stars to display to the review\r\n */\r\ncreateRatingStars = ({rating}) => {\r\n  const ratingContainer = document.createElement('div');\r\n  ratingContainer.classList.add('review-rating');\r\n  ratingContainer.setAttribute('aria-label', `Rating : ${rating} stars out of 5`);\r\n  for(let i = 1; i <= rating; i++){\r\n    const star = document.createElement('span');\r\n    star.classList.add('rating-star');\r\n    star.innerHTML = \"&#x2605;\";\r\n    star.setAttribute('aria-hidden', 'true');\r\n    ratingContainer.appendChild(star);\r\n  }\r\n\r\n  return ratingContainer;\r\n}\r\n\r\n/**\r\n * Add restaurant name to the breadcrumb navigation menu\r\n */\r\nfillBreadcrumb = (restaurant=self.restaurant) => {\r\n  const breadcrumb = document.querySelector('.breadcrumb');\r\n  const li = document.createElement('li');\r\n  li.innerHTML = restaurant.name;\r\n  breadcrumb.appendChild(li);\r\n}\r\n\r\n/**\r\n * Get a parameter by name from page URL.\r\n */\r\ngetParameterByName = (name, url) => {\r\n  if (!url)\r\n    url = window.location.href;\r\n\r\n  name = name.replace(/[\\[\\]]/g, '\\\\$&');\r\n  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),\r\n        results = regex.exec(url);\r\n\r\n  if (!results)\r\n    return null;\r\n\r\n  if (!results[2])\r\n    return '';\r\n    \r\n  return decodeURIComponent(results[2].replace(/\\+/g, ' '));\r\n}\r\n\n\n//# sourceURL=webpack:///./src/restaurant_info.js?");

/***/ })

/******/ });