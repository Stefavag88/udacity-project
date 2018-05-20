const env = process.env.NODE_ENV;


const config = {
    entry: {
        home: './src/main.js',
        restaurantInfo: './src/restaurant_info.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist'
    },
    mode: env || 'development',
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