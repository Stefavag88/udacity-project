let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
      return;
    } 
    self.map = new google.maps.Map(document.querySelector('.map'), {
      zoom: 16,
      center: restaurant.latlng,
      scrollwheel: false
    });
    fillBreadcrumb();
    DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }

  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
    return;
  }

  DBHelper.fetchRestaurantById(id, (error, restaurant) => {
    self.restaurant = restaurant;
    if (!restaurant) {
      console.error(error);
      return;
    }
    fillRestaurantHTML();
    callback(null, restaurant)
  });
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.querySelector('.restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.querySelector('.restaurant-address');
  address.innerHTML = restaurant.address;

  const image = ImageHelper.createResponsiveImage(restaurant, document.querySelector('.restaurant-img'));

  const cuisine = document.querySelector('.restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
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
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
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
createReviewHTML = (review) => {
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
createRatingStars = ({rating}) => {
  const ratingContainer = document.createElement('div');
  ratingContainer.classList.add('review-rating');
  ratingContainer.setAttribute('aria-label', `Rating : ${rating} stars out of 5`);
  for(let i = 1; i <= rating; i++){
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
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.querySelector('.breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
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
