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
        return function (socket, payload, next) {
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
        return function (socket, payload, next) {

            var body = {
                name: ''
            };

            var instance = sequelize.models.ChatRoom.build(body);
            instance.create(function (status, data) {
                if (status == 200) {
                    var roomId = data.id;

                    socket.join(roomId);
                    socket.broadcast.to(roomId).emit('join_user', data);

                    console.log('JOIN ROOM LIST', socket.adapter.rooms[roomId]);
                } else {
                    console.log(socket.id + ' fail to join');
                    return socket.emit('request_fail', status, data);
                }

                next();
            });

        }
    },
    joinRoom: function () {
        return function (socket, payload, next) {

            var user = socket.request.user;

            var body = {
                userId: user.id,
                roomId: payload.roomId
            };

            sequelize.models.ChatRoomUser.findOrCreateChatRoomUser(body, function (status, data) {

                if (status == 200) {

                    var roomId = body.roomId;

                    socket.join(roomId);
                    socket.broadcast.to(roomId).emit('join_user', data);
                    console.log('JOIN ROOM LIST', socket.adapter.rooms[roomId]);

                } else {
                    console.log(socket.id + ' fail to join');
                    return socket.emit('request_fail', status, data);
                }

                next();

            });

        }
    },
    leaveRoom: function () {
        return function (socket, payload, next) {

            var roomId = payload.roomId;

            var where = {
                userId: socket.session.id,
                roomId: roomId
            };

            sequelize.models.ChatRoomUser.deleteChatRoomUser(where, true, function (status, data) {
                console.log(status, data);
                if (status == 204) {
                    socket.leave(roomId);//룸퇴장
                    socket.broadcast.to(roomId).emit('leave_user', socket.id, socket.adapter.rooms[roomId]);
                    console.log('OUT ROOM LIST', socket.adapter.rooms[roomId]);
                } else {
                    console.log(socket.id + ' fail to leave');
                    return socket.emit('request_fail', status, data);
                }

                next();
            });

        }
    },
    sendMessage: function () {
        return function (socket, payload, next) {

            var user = socket.request.user;

            var body = {
                userId: user.id,
                roomId: payload.roomId,
                message: payload.message,
                type: payload.type
            };

            var instance = sequelize.models.ChatHistory.build(body);
            instance.create(function (status, data) {
                if (status == 200) {
                    socket.emit('check_message', data);
                    socket.broadcast.to(payload.roomId).emit('receive_message', data);
                } else {
                    console.log(socket.id + ' fail to join');
                    return socket.emit('request_fail', status, data);
                }

                next();
            });

        }
    },
    onTyping: function () {
        return function (socket, payload, next) {

            socket.broadcast.to(payload.roomId).emit("is_typing", {isTyping: payload.isTyping, person: socket.id});

            next();
        }
    }
};

module.exports = middles;