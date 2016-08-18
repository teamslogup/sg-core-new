var webpack = require('webpack');


var path = require('path');
var corePackage = require('./package.json');
var appPackage = require('./app/package.json');

var ENV = process.env.NODE_ENV;

var config = {
    stats: {
        colors: true,
        reasons: false
    },
    devtool: 'source-map',
    entry: {
        'core': './core/client/pages/sample/core.sample.module.js',
        'app': './app/client/pages/main/app.main.module.js'
    },
    output: {
        path: path.join(__dirname, "./dist"),
        filename: "[name].js",
        chunkFilename: "[name].js"
    },
    module: {
        preLoaders: [],
        loaders: [{
            test: require.resolve("angular"),
            loader: 'expose?angular'
        }, {
            test: /\.scss$/,
            loader: 'style!css!scss'
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
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('lib.js')
    ],
};


if (ENV == 'production') {
    config.plugins.push(
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
            }
        })
    )
}

config.devServer = {
    contentBase: './src/public',
    stats: 'minimal'
};

module.exports = config;