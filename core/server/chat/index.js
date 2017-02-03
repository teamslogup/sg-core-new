var redisAdapter = require('socket.io-redis');
var url = require('url');
var redis = require('redis');

var CONFIG = require('../../../bridge/config/env');
var STD = require('../../../bridge/metadata/standards');

var models = require('../models/sequelize');
var Binder = require('./binder');
var middles = require('./middlewares');

module.exports.init = function (io) {

    if (STD.flag.isUseRedis) {
        var redisAuth;
        var redisUrl = url.parse(CONFIG.db.socketRedis);

        redisAuth = redisUrl.auth.split(':');

        if (!redisAuth) {
            redisAuth = ["", ""];
        }

        var pub = redis.createClient(redisUrl.port, redisUrl.hostname, {
            auth_pass: redisAuth[1]
        });

        var sub = redis.createClient(redisUrl.port, redisUrl.hostname, {
            detect_buffers: true,
            auth_pass: redisAuth[1]
        });

        io.adapter(redisAdapter({pubClient: pub, subClient: sub}));
    }

    io.set('authorization', middles.authorization);

    io.on('connection', function (socket) {
        console.log(socket.id + ' Client connected...');
        console.log('session', socket.request.session);

        socket.join(STD.chat.userRoomPrefix + socket.request.session.passport.user);
        // socket.emit('connect');

        socket.on(STD.chat.clientCreateRoom, function (body) {
            var joinBinder = new Binder(io, socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.createRoom());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientJoinRoom, function (body) {
            var joinBinder = new Binder(io, socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.validateJoinRoom());
            joinBinder.add(middles.joinRoom());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientRequestJoinRoom, function (body) {
            var joinBinder = new Binder(io, socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.requestJoinRoom());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientJoinAllRooms, function (body) {
            var joinBinder = new Binder(io, socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.joinAllRoomsFromDB());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientLeaveRoom, function (body) {
            var joinBinder = new Binder(io, socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.validateLeaveRoom());
            joinBinder.add(middles.leaveRoom());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientTyping, function (body) {
            var joinBinder = new Binder(io, socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.validateTyping());
            joinBinder.add(middles.onTyping());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientSendMessage, function (body) {
            var joinBinder = new Binder(io, socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.validateSendMessage());
            joinBinder.add(middles.checkPrivateChatRoomUser());
            joinBinder.add(middles.sendMessage());
            joinBinder.bind();

        });

        socket.on(STD.chat.clientReadMessage, function (body) {
            var joinBinder = new Binder(io, socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.validateReadMessage());
            joinBinder.add(middles.readMessage());
            joinBinder.bind();

        });

        socket.on('disconnect', function () {
            console.log('disconnect', socket.request.session);
            socket.disconnect();
        });

    });

    function findClientsSocketByRoomId(roomId) {
        var res = []
            , room = io.sockets.adapter.rooms[roomId];
        if (room) {
            for (var id in room) {
                res.push(io.sockets.adapter.nsp.connected[id]);
            }
        }
        return res;
    }

};