import { imageUrlForRestaurant } from './dbhelper';

export const createResponsiveImage = (restaurant, imgElement, page) => {

    const imgPath = imageUrlForRestaurant(restaurant);
    const size = page === 'home' ? '360w' : '800w';

    if (page === 'info') {

        imgElement.dataset.srcset = `${imgPath}-360w.jpg 360w,
                                 ${imgPath}-496w.jpg 496w,
                                 ${imgPath}-800w.jpg 800w`;
        imgElement.sizes = "(max-width: 400px) 360px,(max-width: 600px) 496px,800px";

    }

    imgElement.classList.add('restaurant-img');
    imgElement.classList.add('lazy');
    imgElement.src = `${imgPath}-mock.jpg`;
    imgElement.dataset.src = `${imgPath}-${size}.jpg`;
    imgElement.alt = `Photo of ${restaurant.name} restaurant`;

    return imgElement;
}
