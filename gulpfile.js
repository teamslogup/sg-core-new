var extend = require('extend');
var path = require('path');

var parseArgs = require('minimist');
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var rename = require("gulp-rename");
var clean = require('gulp-clean');
var injectString = require('gulp-inject-string');
var inject = require('gulp-inject');
var htmlmin = require('gulp-html-minifier');
var merge = require('merge-stream');
var gulpIf = require('gulp-if');
var args = require('get-gulp-args')();

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

gulp.task('webpack', function () {
    return gulp.src('')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist'));
});

gulp.task('injection', ['webpack'], function () {

    var url = args.ejs;
    var jsName = getJsName();

    var src = gulp.src(url);
    var source = gulp.src(['./dist/sg-lib.js', './dist/sg-' + jsName + '.js'], {read: false});

    return src.pipe(inject(source))
        .pipe(injectString.replace('sg-lib.js', "sg-lib.js?v=" + corePackage.version))
        .pipe(injectString.replace('/dist/', ""))
        .pipe(injectString.replace('sg-' + jsName + '.js', "sg-" + jsName + ".js?v=" + ((getRootType() == 'core') ? corePackage.version : appPackage.version)))
        .pipe(gulp.dest('./' + getRootType() + '/server/views/dist'));
});

gulp.task('rename', ['injection'], function () {
    var jsName = getJsName();
    return gulp.src("./" + getRootType() + "/server/views/dist/" + jsName + ".ejs")
        .pipe(rename("./" + jsName + "-" + args.env + ".ejs"))
        .pipe(gulp.dest("./" + getRootType() + "/server/views"));
});

gulp.task('clean', ["rename"], function () {
    var jsName = getJsName();
    return gulp.src("./" + getRootType() + "/server/views/dist/" + jsName + ".ejs")
        .pipe(clean({force: true}));
});

gulp.task('minify', ["clean"], function () {
    return gulp.src("./" + getRootType() + "/server/views/" + getJsName() + "-" + args.env + ".ejs")
        .pipe(gulpIf(args.env == 'production', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('./' + getRootType() + '/server/views'));
});

gulp.task('build', ['minify']);
