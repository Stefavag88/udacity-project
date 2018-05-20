import { imageUrlForRestaurant } from './dbhelper';

export const createResponsiveImage = (restaurant, imgElement) => {

    const imgPath = imageUrlForRestaurant(restaurant);

    imgElement.className = 'restaurant-img';
    imgElement.srcset = `${imgPath}-360w.jpg 360w,
                             ${imgPath}-496w.jpg 496w,
                             ${imgPath}-800w.jpg 800w`;
    imgElement.sizes = "(max-width: 400px) 360px,(max-width: 600px) 496px,800px";
    imgElement.src = `${imgPath}-800w.jpg`
    imgElement.alt = `Photo of ${restaurant.name} restaurant`;

    return imgElement;
}
