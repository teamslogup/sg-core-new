"use strict";
var url = require('url'),
    fs = require('fs'),
    path = require('path');

var express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    favicon = require('serve-favicon'),
    minify = require('express-minify'),
    cookieParser = require('cookie-parser'),
    RedisStore = require('connect-redis')(session),
    validator = require('express-validator'),
    ipRefiner = require('sg-ip-refiner'),
    languageParser = require('sg-language-parser'),
    sgcSender = require('sg-sender'),
    sgcResponder = require('sg-responder'),
    sgcUploadManager = require('sg-upload-manager'),
    sgcSequelizeErrorHandler = require('sg-sequelize-error-handler'),
    sgCommonUtils = require('sg-common-utils'),
    middles = require('../middles'),
    ejsEngine = require('ejs-locals'),
    helmet = require('helmet'),
    expressSanitizer = require('express-sanitizer'),
    expressDefend = require('express-defend'),
    blacklist = require('express-blacklist'),
    xmlParser = require('express-xml-bodyparser'),
    appRootPath = require("app-root-path").path;
var multiViews = require('multi-views');
var bridgeUtils = require('../../../bridge/utils');
var models = require('../../../bridge/models/sequelize');
var CONFIG = require('../../../bridge/config/env'),
    META = require('../../../bridge/metadata');
var LOCAL = META.std.local;
var FILE = META.std.file;

require('../../../bridge/config/extend-validator')();
var globalVariables = require('./ejs/index');


var sessionSettings = {
    secret: CONFIG.app.secret,
    name: 'slogupSessionId',
    saveUninitialized: true,
    rolling: true,
    resave: false,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: CONFIG.app.sessionExpiredSeconds,
        expires: CONFIG.app.sessionExpiredSeconds * 1000
    }
};

if (META.std.flag.isUseRedis) {
    var urlObj = url.parse(CONFIG.db.redis);
    var auth = urlObj.auth;
    var auth = (auth && auth.split(":")) || null;
    console.log('redis info', urlObj);
    sessionSettings.store = new RedisStore({
        'host': urlObj.hostname,
        'port': urlObj.port,
        'pass': auth && auth[1] || null,
        'ttl': CONFIG.app.sessionExpiredSeconds
    });
} else {
    var MemoryStore = session.MemoryStore;
    sessionSettings.store = new MemoryStore({
        'expires': CONFIG.app.sessionExpiredSeconds
    });
}

var sessionMiddleware = session(sessionSettings);

module.exports.sessionMiddleware = sessionMiddleware;
module.exports.init = function (sequelize) {

    var stat = fs.existsSync(appRootPath + '/' + LOCAL.uploadUrl);
    if (!stat) {
        fs.mkdirSync(appRootPath + '/' + LOCAL.uploadUrl);
    }

    stat = fs.existsSync(appRootPath + '/' + LOCAL.tempUrl);
    if (!stat) {
        fs.mkdirSync(appRootPath + '/' + LOCAL.tempUrl);
    }

    var i = 0;
    var fileFolderDir;

    for (i = 0; i < FILE.enumFolders.length; ++i) {
        fileFolderDir = appRootPath + '/' + LOCAL.uploadUrl + '/' + FILE.enumFolders[i];
        stat = fs.existsSync(fileFolderDir);
        if (!stat) {
            fs.mkdirSync(fileFolderDir);
        }
    }

    for (i = 0; i < FILE.enumImageFolders.length; ++i) {
        fileFolderDir = appRootPath + '/' + LOCAL.uploadUrl + '/' + FILE.folderImages + '/' + FILE.enumImageFolders[i];
        stat = fs.existsSync(fileFolderDir);
        if (!stat) {
            fs.mkdirSync(fileFolderDir);
        }
    }

    for (i = 0; i < FILE.enumAudioFolders.length; ++i) {
        fileFolderDir = appRootPath + '/' + LOCAL.uploadUrl + '/' + FILE.folderAudios + '/' + FILE.enumAudioFolders[i];
        stat = fs.existsSync(fileFolderDir);
        if (!stat) {
            fs.mkdirSync(fileFolderDir);
        }
    }

    for (i = 0; i < FILE.enumVideoFolders.length; ++i) {
        fileFolderDir = appRootPath + '/' + LOCAL.uploadUrl + '/' + FILE.folderVideos + '/' + FILE.enumVideoFolders[i];
        stat = fs.existsSync(fileFolderDir);
        if (!stat) {
            fs.mkdirSync(fileFolderDir);
        }
    }

    for (i = 0; i < FILE.enumEtcFolders.length; ++i) {
        fileFolderDir = appRootPath + '/' + LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.enumEtcFolders[i];
        stat = fs.existsSync(fileFolderDir);
        if (!stat) {
            fs.mkdirSync(fileFolderDir);
        }
    }

    var hasAppDir = fs.existsSync(path.resolve(__dirname, '../../../app'));

    var app = express();
    app.engine('ejs', ejsEngine);
    multiViews.setupMultiViews(app);

    var staticDirs = [path.resolve(__dirname, '../views')];
    if (hasAppDir) {
        staticDirs.push(path.resolve(__dirname, '../../../app/server/views'));
    }

    app.set('views', staticDirs);

    app.set('view engine', 'ejs');
    app.set("trust proxy", true);
    app.set("jsonp callback", true);

    globalVariables.board(app);

    if (process.env.NODE_ENV !== 'production') {
        app.use(morgan('dev'))
    } else if (process.env.NODE_ENV === 'production') {
        //app.use(compress());
        //app.use(minify());
    }

    app.use(function () {
        return function (req, res, next) {
            req.originalUrl = unescape(req.originalUrl);
            next();
        };
    }());

    app.use(ipRefiner());
    //app.use(favicon(__dirname + '/public/images/favicon.ico'));

    app.use(languageParser(META.local));
    app.use(function (req, res, next) {
        var contentType = (req.headers['Content-type'] || req.headers['Content-Type'] || req.headers['content-Type'] || req.headers['content-type']);
        if (!contentType || contentType.indexOf("charset") === -1 || contentType.toLowerCase().indexOf("utf-8") > -1) {
            if (!contentType || contentType.indexOf("xml") == -1) {
                bodyParser.json({limit: CONFIG.app.maxUploadFileSizeMBVersion})(req, res, function () {
                    bodyParser.urlencoded({extended: true})(req, res, function () {
                        next();
                    });
                });
            } else {
                xmlParser()(req, res, function () {
                    next();
                });
            }
        } else {
            var urlNotEncodedParser = function (req, res, next) {
                var rawBody = '';
                req.on('data', function (chunk) {
                    rawBody += chunk;
                    if (rawBody.length > 1e6) req.connection.destroy();
                });
                req.on('end', function () {
                    req.rawBody = rawBody;
                    next();
                });
            };
            urlNotEncodedParser(req, res, function () {
                next();
            });
        }
    });
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));

    app.use(cookieParser(CONFIG.app.secret));
    app.use(sessionMiddleware);

    app.use(flash());
    app.use(sgcResponder.connect());
    app.use(sgCommonUtils.connect());
    app.use(middles.connect(CONFIG.aws));
    app.use(validator());
    if (META.std.flag.isUseS3Bucket) {
        // s3이용시 템프에 넣고 지움.
        console.log('prepare s3 bucket');
        app.use(sgcUploadManager(appRootPath + '/' + LOCAL.tempUrl, CONFIG.app.maxUploadFileSize));
    } else {
        // 로컬 이용시 바로 업로드 폴더 이용
        console.log('local image folders');
        app.use(sgcUploadManager(appRootPath + '/' + LOCAL.uploadUrl, CONFIG.app.maxUploadFileSize));
    }
    app.use(function (req, res, next) {
        var country = req.country;
        req.meta = META;
        req.meta.std = bridgeUtils.mix(META.std, META.stdLocal[country]);
        req.config = CONFIG;
        req.models = models;
        req.sequelize = sequelize;

        req.coreUtils = require('../utils');
        next();
    });

    app.use(sgcSender.connect(CONFIG.sender));
    app.use(sgcSequelizeErrorHandler.connect());

    var staticOptions = {};
    if (process.env.NODE_ENV == 'production') {
        staticOptions = {
            maxage: '2400h'
        }
    } else if (process.env.NODE_ENV === 'development') {

    }

    if (hasAppDir) {
        app.use(express.static('app/client', staticOptions));
    }

    app.use(express.static('core/client', staticOptions));
    app.use(express.static('dist', staticOptions));

    if (!META.std.flag.isUseS3Bucket) {
        app.use('/', express.static("uploads", staticOptions));
    }

    app.use(passport.initialize());
    app.use(passport.session());

    // security

    app.use(blacklist.blockRequests('blacklist.txt'));
    app.use(expressDefend.protect({
        maxAttempts: 5,                   // (default: 5) number of attempts until "onMaxAttemptsReached" gets triggered
        dropSuspiciousRequest: true,      // respond 403 Forbidden when max attempts count is reached
        consoleLogging: true,             // (default: true) enable console logging
        logFile: 'suspicious.log',        // if specified, express-defend will log it's output here
        onMaxAttemptsReached: function (ipAddress, url) {
            console.log('IP address ' + ipAddress + ' is considered to be malicious, URL: ' + url);
        }
    }));
    app.use(helmet());
    app.disable('x-powered-by');

    return app;
};