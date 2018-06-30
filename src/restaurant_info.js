import { fetchRestaurantById,
         mapMarkerForRestaurant } from "./dbhelper"
import { createResponsiveImage, lazyLoadImages } from "./imageHelper";
import "../css/styles_info.css";
import * as common from './commonActions';
import UIRestaurantData from "./uiRestaurantData.js";

document.addEventListener('DOMContentLoaded', (event) => {

  common.registerSW('Info');
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
      return;
    }
  });
});

document.showMapOnScreen = () => {
  let mapDiv = document.querySelector('.map');
  let mapbtn = document.querySelector('#map-toggle-btn');
  mapbtn.classList.add("hidden");
  mapDiv.classList.toggle('hidden');
  if(mapDiv.classList.contains("hidden")) return;
  window.initMap();
}
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {

  if (!google) return;

  self.map = new google.maps.Map(document.querySelector('.map'), {
    zoom: 16,
    center: self.restaurant.info.latlng,
    scrollwheel: false
  });
  mapMarkerForRestaurant(self.restaurant.info, self.map);
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
    const error = 'No restaurant id in URL'
    callback(error, null);
    return;
  }

  fetchRestaurantById(id, (error, restaurant) => {
    if (error)
      callback(error, null);

    if (!restaurant){
      callback(error, null);
      console.error("No restaurant retrieved from DB...");
    }

    self.restaurant = new UIRestaurantData(restaurant[0], restaurant[1]);
    const {info, reviews} = self.restaurant;

    fillBreadcrumb(info);
    fillRestaurantHTML(info);
    fillReviewsHTML(reviews);
  });
}

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurantInfo) => {
  const name = document.querySelector('.restaurant-name');
  name.innerHTML = restaurantInfo.name;

  const image = createResponsiveImage(restaurantInfo, document.querySelector('.restaurant-img'), 'info');
  lazyLoadImages([image], true);

  const imgContainer = document.querySelector('.img-container');
  imgContainer.append(common.createIsFavouriteHeart(restaurantInfo));

  const cuisine = document.querySelector('.restaurant-cuisine');
  cuisine.innerHTML = restaurantInfo.cuisine_type;

  const address = document.querySelector('.restaurant-address');
  address.innerHTML = restaurantInfo.address;

  if (restaurantInfo.operating_hours)
    fillRestaurantHoursHTML(restaurantInfo.operating_hours);
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours) => {
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
const fillReviewsHTML = (reviews) => {
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
  const uiDate = parseUnixDate(review.createdAt);
  date.innerHTML = uiDate;
  date.setAttribute('aria-label', `Published on ${uiDate}`);
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
const fillBreadcrumb = (restaurantInfo) => {
  const breadcrumb = document.querySelector('.breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurantInfo.name;
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

const parseUnixDate = (unixDate) => {

  const date = new Date(unixDate);

  return `${date.getFullYear()}/ ${date.getMonth()}/ ${date.getDay()}`;
}
