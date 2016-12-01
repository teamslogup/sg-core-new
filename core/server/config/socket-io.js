var STD = require('../../../bridge/metadata/standards');

var CONFIG = require('../../../bridge/config/env');
var chat = require('../chat');

var session = require('express-session');
var sessionSetting = require('../config/express').sessionSetting;
sessionSetting.test = true;
var sessionMiddleware = session(sessionSetting);

module.exports = function (server, app) {

    var io;

    if (STD.flag.isUseChat) {
        io = require('socket.io')(server.http);
        io.use(function (socket, next) {
            sessionMiddleware(socket.request, socket.request.res, next);
        });
        app.use(sessionMiddleware);

        chat.init(io);
    }

    return server;
};