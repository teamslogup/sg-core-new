
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpack = require('webpack');

var path = require('path');
var fs = require('fs');

var ENV = process.env.NODE_ENV;

var config = {};

config.stats = {
    colors: true,
    reasons: false
};

config.entry = {
    'sg-sample': './core/client/pages/sample/core.sample.module.js',
    'sg-main': './app/client/pages/main/app.main.module.js',
    'sg-admin': './app/client/pages/admin/app.admin.module.js'
};

config.output = {
    publicPath: __dirname,
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    chunkFilename: "[name].js"
};

config.module = {
    preLoaders: [],
    loaders: [{
        test: /\.ejs$/, loader: 'ejs-loader?variable=data'
    }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
    }, {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
            presets: ['es2015']
        }
    }, {
        test: /\.(jpg|png|svg)$/,
        loader: 'file?name=public/images/[name].[ext]'
    }, {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file?name=public/fonts/[name].[ext]'
    }]
};

config.plugins = [
    new webpack.optimize.CommonsChunkPlugin('sg-lib.js'),
    new ExtractTextPlugin("[name].css", {
        allChunks: true
    })
];

if (ENV == 'production') {
    config.plugins.push(
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    )
} else {
    config.devtool = 'source-map';
    // config.watch = true;
    // config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config;