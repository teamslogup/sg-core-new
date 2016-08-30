"use strict";
process.on('uncaughtException', function (err) {
    console.error('uncaughtException');
    console.error(err.stack);
});

var fs = require('fs');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./bridge/config/env');
var express = require('./bridge/config/express');
var https = require('./core/server/config/https');
var cluster = require('./core/server/config/cluster');
var passport = require('./core/server/config/passport');
var sequelize = require('./core/server/config/sequelize');
var models = require('./bridge/models/sequelize');
var STD = require('./bridge/metadata/standards');

if (!process.env.AWS_ACCESS_KEY_ID) {
    process.env.AWS_ACCESS_KEY_ID = config.aws.accessKeyId;
}
if (!process.env.AWS_SECRET_ACCESS_KEY) {
    process.env.AWS_SECRET_ACCESS_KEY = config.aws.secretAccessKey;
}

var stat = fs.existsSync(config.app.uploadFileDir);
if (!stat) {
    fs.mkdirSync(config.app.uploadFileDir);
}

var app = express(sequelize);
var server = https(app);

passport();

console.log('database info : ', config.db);
sequelize.sync({force: config.db.force}).then(function (err) {
    if (env === 'production') {
        if (server.isUseHttps) {
            if (STD.flag.isUseCluster) {
                cluster.startCluster(server.https);
            } else {
                server.https.listen(config.app.port);
            }
        } else {
            if (STD.flag.isUseCluster) {
                cluster.startCluster(server.http);
            } else {
                server.http.listen(config.app.port);
            }
        }
        console.log('Server running at ' + config.app.port + ' ' + env + ' mode. logging: ' + config.db.logging);
    } else {
        if (server.isUseHttps) {
            server.https.listen(config.app.port);
        } else {
            server.http.listen(config.app.port);
        }
        console.log('Server running at ' + config.app.port + ' ' + env + ' mode. logging: ' + config.db.logging);
    }
}, function (err) {
    console.log('Unable to connect to the database:', err);
});

module.exports = app;