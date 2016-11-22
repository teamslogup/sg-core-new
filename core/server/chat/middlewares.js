var async = require('async');
var sequelize = require('../../server/config/sequelize');

var utils = require('./utils');

var middles = {

    authorization: function (handshake, callback) {

        if (handshake.session && handshake.session.passport && handshake.session.passport.user) {

            var userId = handshake.session.passport.user;

            sequelize.models.User.findUserById(userId, function (status, data) {

                if (status == 200) {
                    handshake.user = data;
                    callback(null, true);
                } else {
                    callback(null, false);
                }

            });

        } else {
            callback(null, false);
        }

    },
    isLoggedIn: function () {
        return function (socket, io, payload, next) {
            if (socket.request.session) {

                next();

            } else {
                return socket.emit('req_error', {
                    code: '401_3',
                    payload: payload
                });
            }
        }
    },
    createRoom: function () {
        return function (socket, io, payload, next) {

            // var roomId = body.roomId;

            var body = {
                name: ''
            };

            var instance = sequelize.models.ChatRoom.build(body);
            instance.create(function (status, data) {
                if (status == 200) {

                    var roomId = data.id;

                    socket.join(roomId); //룸입장
                    io.to(roomId).emit('join user', socket.id, socket.adapter.rooms[roomId], data);
                    console.log('JOIN ROOM LIST', socket.adapter.rooms[roomId]);
                } else {
                    io.sockets.connected(socket.id).emit('request fail', status, data);
                    console.log(socket.id + ' fail to join');
                }

                next();
            });

        }
    },
    joinRoom: function () {
        return function (socket, io, payload, next) {

            var user = socket.request.user;

            var body = {
                userId: user.id,
                roomId: payload.roomId
            };

            sequelize.models.ChatRoomUser.findOrCreateChatRoomUser(body, function (status, data) {

                if (status == 200) {

                    var roomId = body.roomId;

                    socket.join(roomId); //룸입장
                    io.to(roomId).emit('join user', socket.id, socket.adapter.rooms[roomId], data);
                    console.log('JOIN ROOM LIST', socket.adapter.rooms[roomId]);

                } else {

                    socket.emit('request fail', status, data);
                    console.log(socket.id + ' fail to join');

                }

                next();

            });

        }
    },
    leaveRoom: function () {
        return function (socket, io, payload, next) {

            var roomId = payload.roomId;

            var where = {
                userId: socket.session.id,
                roomId: roomId
            };

            sequelize.models.ChatRoomUser.deleteChatRoomUser(where, true, function (status, data) {
                console.log(status, data);
                if (status == 204) {
                    socket.leave(roomId);//룸퇴장
                    socket.broadcast.to(roomId).emit('leave user', socket.id, socket.adapter.rooms[roomId]);
                    console.log('OUT ROOM LIST', socket.adapter.rooms[roomId]);
                } else {
                    socket.emit('request fail', status, data);
                    console.log(socket.id + ' fail to leave');
                }

                next();
            });

        }
    },
    sendMessage: function () {
        return function (socket, io, payload, next) {

            var body = {
                userId: payload.userId,
                roomId: payload.roomId,
                message: payload.message,
                type: payload.type
            };

            var instance = sequelize.models.ChatHistory.build(body);
            instance.create(function (status, data) {
                if (status == 200) {
                    io.to(data.roomId).emit('chat message', socket.id, data.body);
                } else {
                    socket.emit('request fail', status, data);
                    console.log(socket.id + ' fail to join');
                }

                next();
            });

        }
    },
    onTyping: function () {
        return function (socket, io, payload, next) {

            io.to(payload.roomId).emit("isTyping", {isTyping: payload.isTyping, person: socket.id});

            next();
        }
    }
};

module.exports = middles;