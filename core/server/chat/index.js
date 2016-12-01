var redisAdapter = require('socket.io-redis');
var url = require('url');
var redis = require('redis');

var CONFIG = require('../../../bridge/config/env');
var STD = require('../../../bridge/metadata/standards');

var models = require('../models/sequelize');
var Binder = require('./binder');
var middles = require('./middlewares');

module.exports.init = function (io) {

    // if (STD.flag.isUseRedis) {
    //
    //     var redisAuth;
    //     var redisUrl = url.parse(CONFIG.db.redis);
    //
    //     if (redisUrl.auth) redisAuth = redisUrl.auth.split(':');
    //     else redisAuth = [null, null];
    //
    //     var pub = redis.createClient(redisUrl.port, redisUrl.hostname, {
    //         auth_pass: redisAuth[1]
    //     });
    //
    //     var sub = redis.createClient(redisUrl.port, redisUrl.hostname, {
    //         detect_buffers: true,
    //         auth_pass: redisAuth[1]
    //     });
    //
    //     io.adapter( redisAdapter({pubClient: pub, subClient: sub}) );
    // }

    io.set('authorization', middles.authorization);

    io.on('connection', function (socket) {
        console.log(socket.id + ' Client connected...');
        console.log('session', socket.request.session);

        socket.on(STD.chat.clientCreateRoom, function (body) {
            var joinBinder = new Binder(socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.createRoom());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientJoinRoom, function (body) {
            var joinBinder = new Binder(socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.joinRoom());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientJoinAllRooms, function (body) {
            var joinBinder = new Binder(socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.joinAllRoomsFromDB());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientLeaveRoom, function (body) {
            var joinBinder = new Binder(socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.leaveRoom());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientTyping, function (body) {
            var joinBinder = new Binder(socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.onTyping());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientSendMessage, function (body) {

            var joinBinder = new Binder(socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.validateSendMessage());
            joinBinder.add(middles.checkPrivateChatRoomUser());
            joinBinder.add(middles.sendMessage());
            joinBinder.bind();

        });

        socket.on(STD.chat.clientReadMessage, function (body) {

            var joinBinder = new Binder(socket, body);
            joinBinder.add(middles.isLoggedIn());
            joinBinder.add(middles.readMessage());
            joinBinder.bind();

        });

        socket.on('disconnect', function () {
            console.log('disconnect');
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