const env = process.env.NODE_ENV;
const path = require('path');



const config = {
    entry: {
        home: './src/main.js',
        restaurantInfo: './src/restaurant_info.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: env || 'development',
    devtool: 'inline-source-map',
    devServer: {
        compress: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": ["env"]
                    }
                }
            }
        ]
    }
};

module.exports = config;