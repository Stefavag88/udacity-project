import { fetchRestaurantById, mapMarkerForRestaurant } from "./dbhelper.js"
import { createResponsiveImage, lazyLoadImages } from "./imageHelper";
import "../css/styles_info.css";

let restaurant;
let map;

document.addEventListener('DOMContentLoaded', (event) => {

  document.addEventListener('dataFetch', showMapOnScreen,{once:true});
  
  registerSW();
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
      return;
    }
  });
});

const registerSW = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('../sw.js')
        .then(function (registration) {
          console.log('Service Worker Registered from Info Page!!!');
        });
      navigator.serviceWorker.ready.then(function (registration) {
        console.log('Service Worker Ready');
      });
    });
  }
}

const showMapOnScreen = () => {
  let mapDiv = document.querySelector('.hidden');
  window.initMap();
  mapDiv.classList.remove('hidden');
};


/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {

  if(!google) return;

  self.map = new google.maps.Map(document.querySelector('.map'), {
    zoom: 16,
    center: self.restaurant.latlng,
    scrollwheel: false
  });
  mapMarkerForRestaurant(self.restaurant, self.map);
}

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = (callback) => {
  
  if (self.restaurant) { 
    callback(null, self.restaurant);
    return;
  }

  const id = getParameterByName('id');
  if (!id) { 
    error = 'No restaurant id in URL'
    callback(error, null);
    return;
  }

  fetchRestaurantById(id, (error, restaurant) => {
    if (error)
      callback(error, null);

    if (!restaurant)
      return;
    
    self.restaurant = restaurant;
    fillBreadcrumb();
    fillRestaurantHTML();

    const dataFetchedEvent = new CustomEvent('dataFetch');
    document.dispatchEvent(dataFetchedEvent);

    callback(null, restaurant);
  });
}

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.querySelector('.restaurant-name');
  name.innerHTML = restaurant.name;

  const image = createResponsiveImage(restaurant, document.querySelector('.restaurant-img'), 'info');
  lazyLoadImages([image], true);

  const cuisine = document.querySelector('.restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  const address = document.querySelector('.restaurant-address');
  address.innerHTML = restaurant.address;

  if (restaurant.operating_hours)
    fillRestaurantHoursHTML();

  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.querySelector('.restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.querySelector('.reviews-container');

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.querySelector('.reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.classList.add('review-container');

  const reviewInfo = document.createElement('div');
  reviewInfo.classList.add('review-info');

  const name = document.createElement('h4');
  name.classList.add('review-name');
  name.innerHTML = review.name;
  reviewInfo.appendChild(name);

  const date = document.createElement('span');
  date.classList.add('review-date');
  date.innerHTML = review.date;
  date.setAttribute('aria-label', `Published on ${review.date}`);
  reviewInfo.appendChild(date);

  const rating = createRatingStars(review);
  reviewInfo.appendChild(rating);

  li.appendChild(reviewInfo);

  const comments = document.createElement('blockquote');
  comments.classList.add('review-comments');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Create rating stars to display to the review
 */
const createRatingStars = ({ rating }) => {
  const ratingContainer = document.createElement('div');
  ratingContainer.classList.add('review-rating');
  ratingContainer.setAttribute('aria-label', `Rating : ${rating} stars out of 5`);

  for (let i = 1; i <= rating; i++) {
    const star = document.createElement('span');
    star.classList.add('rating-star');
    star.innerHTML = "&#x2605;";
    star.setAttribute('aria-hidden', 'true');
    ratingContainer.appendChild(star);
  }

  return ratingContainer;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.querySelector('.breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;

  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);

  if (!results)
    return null;

  if (!results[2])
    return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
