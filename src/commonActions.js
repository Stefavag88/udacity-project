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
    const element = event.target;
    const restaurantId = parseInt(element.id);
    element.classList.toggle('heart-favourite');

    const message = element.classList.contains('heart-favourite')
                        ? 'added to favourites'
                        : 'removed from favourites';



    showNotification(message, 10000);

    toggleIDBFavoriteFlag(restaurantId)
}

export const showNotification = (message, duration = null) => {
    const notificationBox = document.querySelector('.notification-box');
    const closeBtn = document.querySelector('.notification-close');
    const messageBox = document.querySelector('.notification-message');

    messageBox.innerHTML = message;

    closeBtn.removeEventListener('click', notificationCloseBtnEventHandler);
    closeBtn.addEventListener('click', notificationCloseBtnEventHandler);

    notificationBox.classList.remove('slide-out');
    notificationBox.classList.add('slide-in');

    if(duration)
        setTimeout(() => {
            notificationBox.classList.remove('slide-in');
            notificationBox.classList.add('slide-out');
        }, duration);
}

const notificationCloseBtnEventHandler = (event) => {
    const notificationBox = document.querySelector('.notification-box');
    const closeBtn = document.querySelector('.notification-close');
    
    if(notificationBox.classList.contains('slide-in')){
        notificationBox.classList.remove('slide-in');
        notificationBox.classList.add('slide-out');
    }

    closeBtn.removeEventListener('click', notificationCloseBtnEventHandler);
};