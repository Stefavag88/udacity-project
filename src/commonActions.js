import { toggleFavoriteRestaurant as toggleIDBFavoriteFlag } from './dbhelper';

export const registerSW = (page) => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../sw.js')
                .then(registration => {
                    console.info(`Service Worker Registered from ${page} Page!!!`);
                    if ('sync' in registration) {
                        window.addEventListener('online', () => {
                            console.log("online AGAIN!!");
                            registration.sync.register('outbox');
                        });

                        document.addEventListener('click', toggleUIAndIDBFavorite(registration));
                    }
                })
                .catch(err => { console.error(err); })
            navigator.serviceWorker.ready.then(registration => {
                console.info('Service Worker Ready');
            });
        });
    }
}

export const createIsFavouriteHeart = (restaurant) => {
    const favouriteHeart = document.createElement('div');

    favouriteHeart.classList.add('fav-heart');
    favouriteHeart.innerHTML = '&#x2764';
    favouriteHeart.setAttribute('role', 'application');
    favouriteHeart.setAttribute('title', 'Mark as favourite!');
    favouriteHeart.setAttribute('id', `${restaurant.id}`);

    if (parseBool(restaurant.is_favorite)) {
        favouriteHeart.setAttribute('title', 'Unmark favourite');
        favouriteHeart.classList.add('heart-favourite');
    }

    return favouriteHeart;
}

const parseBool = (value) => {
    if(typeof value === 'boolean') return value;

    switch(value){
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return null;
    }
}

export const toggleUIAndIDBFavorite = (swRegistration) => {
    return function (event) {
        console.log("CLICKED BEFORE!!!", event.target.classList);
        if(!event.target.classList.contains('fav-heart')) return;
        console.log("clicked!!", event);
        const element = event.target;
        const restaurantId = parseInt(element.id);
        element.classList.toggle('heart-favourite');

        const message = element.classList.contains('heart-favourite')
            ? 'added to favourites'
            : 'removed from favourites';


        showNotification(message, element, 2500);

        toggleIDBFavoriteFlag(restaurantId, swRegistration)
    }
}

export const showNotification = (message, elementActivatedBy, duration = null) => {
    const notificationBox = document.querySelector('.notification-box');
    const closeBtn = document.querySelector('.notification-close');
    const messageBox = document.querySelector('.notification-message');

    messageBox.innerHTML = message;

    closeBtn.removeEventListener('click', notificationCloseBtnEventHandler);
    closeBtn.addEventListener('click', notificationCloseBtnEventHandler);

    console.log("PASSES FORM??", elementActivatedBy);
    let elementActivatedPosition;
    if (elementActivatedBy) {
        // elementActivatedPosition = elementActivatedBy.getBoundingClientRect().top;
        notificationBox.setAttribute("style", `top:50%;`);
    } else {
        notificationBox.setAttribute("style", `top:50%;`);
    }

    notificationBox.classList.remove('slide-out');
    notificationBox.classList.add('slide-in');
    notificationBox.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    if (duration)
        setTimeout(() => {
            notificationBox.classList.remove('slide-in');
            notificationBox.classList.add('slide-out');
        }, duration);
}

const notificationCloseBtnEventHandler = (event) => {
    const notificationBox = document.querySelector('.notification-box');
    const closeBtn = document.querySelector('.notification-close');

    if (notificationBox.classList.contains('slide-in')) {
        notificationBox.classList.remove('slide-in');
        notificationBox.classList.add('slide-out');
    }

    closeBtn.removeEventListener('click', notificationCloseBtnEventHandler);
};