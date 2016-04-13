var path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: { 
        path: path.join(__dirname, "build"),
        filename: "index.js",
        publicPath: "/build/"
    },

    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: "babel",
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: "json",
            exclude: /node_modules/
        }]
    }
};