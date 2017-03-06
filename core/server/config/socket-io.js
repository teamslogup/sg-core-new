var STD = require('../../../bridge/metadata/standards');

var CONFIG = require('../../../bridge/config/env');
var chat = require('../chat');

var sessionMiddleware = require('../config/express').sessionMiddleware;

module.exports = function (server, app) {

    var io;

    if (CONFIG.flag.isUseChat) {
        // var http = require('http').Server(app);
        io = require('socket.io')(server.http);

        io.use(function (socket, next) {
            sessionMiddleware(socket.request, socket.request.res, next);
        });
        app.use(sessionMiddleware);

        chat.init(io);

        // http.listen(3002, function () {
        //     console.log('socket.io listening on 3002');
        // });
    }

    return server;
};