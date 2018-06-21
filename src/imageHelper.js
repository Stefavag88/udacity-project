import { imageUrlForRestaurant } from './dbhelper';


/**
 * Creates responsive image
 * @param{ Object } restaurant: The restaurant Object
 * @param{ HTMLImageElement } imgElement: The initial html img Element
 * @param{ string } page: The page that this is loaded by
 */
export const createResponsiveImage = (restaurant, imgElement, page) => {

    const imgPath = imageUrlForRestaurant(restaurant);
    const size = '800w';

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

/**
 * Lazy Load Images on Scroll, Resize and OrientationChange Events
 * @param{ [ HTMLImageElement ] } lazyImages: The Images to lazy load
 * @param{ boolean } setSrcSet: Whether a 'srcset' attbibute should be set on each image
 */
const lazyLoadImagesWithEvents = (images, setSrcSet) => {
    let active = false;

    const lazyLoad = function () {
        if (active === false) {
            active = true;

            setTimeout(function () {
                images.forEach(function (lazyImage) {
                    if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                        lazyImage.src = lazyImage.dataset.src;
                        window.fetch(`${lazyImage.src}`).then(response => {
                            console.log('Called fetch from IntersectionHelper', response);
                            caches.open("img-0.1.3")
                                  .then(cache => {
                                    console.log("Caching from intersection Observer...", response.url);
                                    cache.put(response.url, response.clone())
                                  });
                        })
                        if (setSrcSet)
                            lazyImage.srcset = lazyImage.dataset.srcset;
                        lazyImage.classList.remove("lazy");

                        images = images.filter(function (image) {
                            return image !== lazyImage;
                        });

                        if (images.length === 0) {
                            document.removeEventListener("scroll", lazyLoad);
                            window.removeEventListener("resize", lazyLoad);
                            window.removeEventListener("orientationchange", lazyLoad);
                        }
                    }
                });

                active = false;
            }, 200);
        }
    };

    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);
}
/**
 * Lazy Load Images with Interection Observer
 * @param{ [ HTMLImageElement ] } lazyImages: The Images to lazy load
 * @param{ boolean } setSrcSet: Whether a 'srcset' attbibute should be set on each image
 */
const lazyLoadImagesWithIntersection = (images, setSrcSet) => {

        let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    window.fetch(`${lazyImage.src}`).then(response => {
                        caches.open("img-0.1.3")
                              .then(cache => {
                                cache.put(response.url, response.clone())
                              });
                    })
                    if (setSrcSet)
                        lazyImage.srcset = lazyImage.dataset.srcset;

                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        images.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
}


/**
 * Let the browser decide which lazy loading strategy to follow (Intersection Observer or Event Based).
 * @param{ [ HTMLImageElement ] } lazyImages: The Images to lazy load
 * @param{ boolean } setSrcSet: Whether a 'srcset' attbibute should be set on each image
 */
export const lazyLoadImages = (lazyImages, setSrcSet) => {

    if("IntersectionObserver" in window){
        lazyLoadImagesWithIntersection(lazyImages, setSrcSet);
    }else{
        lazyLoadImagesWithEvents(lazyImages, setSrcSet)
    }
}
