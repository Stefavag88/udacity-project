import {toggleFavoriteRestaurant as toggleIDBFavoriteFlag} from './dbhelper'; 

export const registerSW = (page) => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../sw.js')
                .then(registration => {
                    console.info(`Service Worker Registered from ${page} Page!!!`);
                });
            navigator.serviceWorker.ready.then(registration => {
                console.info('Service Worker Ready');
            });
        });
    }
}

export const createIsFavouriteHeart = (restaurant) => {

    console.log("In createIsFavouriteHeart!!", restaurant);
    const favouriteHeart = document.createElement('div');

    favouriteHeart.classList.add('fav-heart');
    favouriteHeart.innerHTML = '&#x2764';
    favouriteHeart.setAttribute('role', 'application');
    favouriteHeart.setAttribute('title', 'Mark as favourite!');
    favouriteHeart.setAttribute('id', `${restaurant.id}`);

    if (restaurant.is_favorite) {
        favouriteHeart.setAttribute('title', 'Unmark favourite');
        favouriteHeart.classList.add('heart-favourite');
    }

    favouriteHeart.addEventListener('click', toggleUIAndIDBFavorite)

    return favouriteHeart;
}

const toggleUIAndIDBFavorite = (event) => {

    console.log("Clicked!!!");
    const element = event.target;
    const restaurantId = parseInt(element.id);
    element.classList.toggle('heart-favourite');

    toggleIDBFavoriteFlag(restaurantId)
}

export const showNotification = (message) => {

}