const path = require("path");
const env = process.env.NODE_ENV;


const config = {
    entry: {
        home: './src/main.js',
        restaurantInfo: './src/restaurant_info.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    }, 
    mode: env || 'development'
};

module.exports = config;