# Restaurant Reviews App

This the final version of the Udacity Nanonegree Mobile Web Specialist. 
It is a Progressive Web App built with simple HTML, CSS3 and ES6, that uses webpack for asset bundling.

## Features 

- IndexedDB caching using Jake Archibald's IndexedDB Promised library. In offline mode, when a new review is created or a restaurant is toggled as favorite, data is saved into IndexedDB. When online again, data is sent to the server using the Background Sync Api.
- Images are lazy-loaded. On first fetch from server, a low quality, blurred image is downloaded and then using the Intersection Observer Api the high quality image is downloaded.
- App icon shortcut on all devices.

### How to run

- Fork or download the project on your pc .
- You will need to have installed node.js on your machine. *Download Link: [https://nodejs.org/en/download/]* .
- Open a terminal in the project's root direcory (the direcory that package.json is in) and run *npm install* to install the dependencies.
- Run *npm start* . This will open the project with Chrome in localhost:8080 .

IMPORTANT: This project uses an API provided by udacity. You will not be able to see anything unless you download and run it. The repo for the server is : https://github.com/udacity/mws-restaurant-stage-3

### Author
 Vangelis Stefanakis