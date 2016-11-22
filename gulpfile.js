var extend = require('extend');
var path = require('path');

var gulp = require('gulp');
const webpack = require('gulp-webpack');
const rename = require("gulp-rename");
const clean = require('gulp-clean');
const injectString = require('gulp-inject-string');
const inject = require('gulp-inject');
const htmlmin = require('gulp-html-minifier');
const gulpIf = require('gulp-if');
const args = require('get-gulp-args')();
// const mocha = require('gulp-mocha');
const mocha = require('gulp-spawn-mocha');
var gulpsync = require('gulp-sync')(gulp);

var appPackage = require('./app/package.json');
var corePackage = require('./package.json');

if (!args.ejs) {
    args.ejs = "./core/server/views/sample.ejs";
}

if (!args.env) {
    args.env = process.env.NODE_ENV = "development";
} else {
    process.env.NODE_ENV = args.env;
}

function getJsName() {
    var url = args.ejs;
    var pathArr = url.split("/");
    var jsName = pathArr[4].split(".")[0];
    return jsName;
}

function getRootType() {
    var url = args.ejs;
    return url.indexOf("core/") != -1 ? "core" : "app";
}

gulp.task('webpack', () => {
    console.log('webpack');
    return gulp.src('')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist'));
});

gulp.task('injection', ['webpack'], () => {
    var url = args.ejs;
    console.log('injection');
    var jsName = getJsName();
    var src = gulp.src(url);
    var source = gulp.src([
        './dist/sg-lib.js', './dist/sg-' + jsName + '.js',
        './dist/sg-lib.css', './dist/sg-' + jsName + '.css'
    ], {read: false});

    return src.pipe(inject(source))
        .pipe(injectString.replace('sg-lib.js', "sg-lib.js?v=" + corePackage.version))
        .pipe(injectString.replace('\"/dist/', "\""))
        .pipe(injectString.replace('sg-' + jsName + '.js', "sg-" + jsName + ".js?v=" + ((getRootType() == 'core') ? corePackage.version : appPackage.version)))
        .pipe(injectString.replace('sg-' + jsName + '.css', "sg-" + jsName + ".css?v=" + ((getRootType() == 'core') ? corePackage.version : appPackage.version)))
        .pipe(gulp.dest('./' + getRootType() + '/server/views/dist'));
});

gulp.task('rename', ['injection'], () => {
    var jsName = getJsName();
    return gulp.src("./" + getRootType() + "/server/views/dist/" + jsName + ".ejs")
        .pipe(rename("./" + jsName + "-" + args.env + ".ejs"))
        .pipe(gulp.dest("./" + getRootType() + "/server/views"));
});

gulp.task('clean', ["rename"], () => {
    var jsName = getJsName();
    return gulp.src("./" + getRootType() + "/server/views/dist/" + jsName + ".ejs")
        .pipe(clean({force: true}));
});

gulp.task('minify', ["clean"], () => {
    return gulp.src("./" + getRootType() + "/server/views/" + getJsName() + "-" + args.env + ".ejs")
        .pipe(gulpIf(args.env == 'production', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('./' + getRootType() + '/server/views'));
});

gulp.task('webpack-watch', ['minify'],  () => {
    var webpackconfig = require('./webpack.config.js');
    if (args.env == 'development') {
        webpackconfig.watch = true;
    } else {
        webpackconfig.watch = false;
    }
    return gulp.src('')
        // .pipe(gulpIf(args.env == 'development', webpack(webpackconfig)))
        .pipe(webpack(webpackconfig))
        .pipe(gulp.dest('dist'));
});

gulp.task('test-mocha', (cb) => {
    process.env.NODE_ENV = "test";
    gulp.src('*/server/apis/*.spec.js', {read: false})
        .pipe(mocha({
            reporter: 'nyan',
            env: {'NODE_ENV': 'test'}
        }))
        .pipe(gulp.dest('dist'))
        .on('end', cb);
});

gulp.task('build', ['webpack-watch']);
gulp.task('test', ['test-mocha']);
