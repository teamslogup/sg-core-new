var STD = require('../../../bridge/metadata/standards');

var CONFIG = require('../../../bridge/config/env');

var session = require('express-session');
var sessionSetting = require('../config/express').sessionSetting;
var sessionMiddleware = session(sessionSetting);

module.exports = function (server, app) {

    var chat = require('../chat/index');
    var io;

    if (STD.flag.isUseChat) {
        if (!io) {
            io = require('socket.io')(server.http);
        }

        io.use(function (socket, next) {
            sessionMiddleware(socket.request, socket.request.res, next);
        });
        app.use(sessionMiddleware);

        io.on('connection', function (socket) {

        });
        app.use(function (req, res, next) {
            req.io = io;
            next();
        });


        // chat.init(io);
    }

    return server;
};