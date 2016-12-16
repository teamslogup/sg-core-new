var async = require('async');
var sequelize = require('../../server/config/sequelize');

var coreUtils = require('../utils');
var STD = require('../../../bridge/metadata/standards');

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
                return socket.emit(STD.chat.serverRequestFail, 401);
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
                    socket.broadcast.to(roomId).emit(STD.chat.serverJoinUser, data);

                    console.log('JOIN ROOM LIST', socket.adapter.rooms[roomId]);
                } else {
                    console.log(socket.id + ' fail to join');
                    return socket.emit(STD.chat.serverRequestFail, status, data);
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
                    socket.emit(STD.chat.serverJoinRoom, roomId);
                    socket.broadcast.to(roomId).emit(STD.chat.serverJoinUser, roomId);
                    console.log('JOIN ROOM LIST', socket.adapter.rooms[roomId]);

                } else {
                    console.log(socket.id + ' fail to join');
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }

                next();

            });

        }
    },
    joinAllRoomsFromDB: function () {
        return function (socket, payload, next) {
            var user = socket.request.user;

            var body = {
                userId: user.id
            };

            sequelize.models.ChatRoomUser.findChatRoomUsersByOptions(body, function (status, data) {
                if (status == 200) {

                    for (var i = 0; i < data.length; i++) {
                        socket.join(data[i].roomId);
                    }

                    socket.emit(STD.chat.serverJoinAllRooms, data);

                } else {
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }

                next();
            });

        }
    },
    leaveRoom: function () {
        return function (socket, payload, next) {

            var user = socket.request.user;
            var roomId = payload.roomId;

            sequelize.models.ChatRoomUser.deleteChatRoomUser(user.id, roomId, function (status, data) {
                console.log(status, data);
                if (status == 204) {
                    socket.leave(roomId);
                    socket.emit(STD.chat.serverLeaveRoom, roomId);
                    socket.broadcast.to(roomId).emit(STD.chat.serverLeaveUser, user.id);
                    console.log('OUT ROOM LIST', socket.adapter.rooms[roomId]);
                } else {
                    console.log(socket.id + ' fail to leave');
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }

                next();
            });

        }
    },
    validateLeaveRoom: function () {
        return function (socket, payload, next) {

            if (payload.roomId === undefined) {
                return socket.emit(STD.chat.serverRequestFail, 400, {});
            }

            next();
        }
    },
    validateTyping: function () {
        return function (socket, payload, next) {

            if (payload.isTyping === undefined) {
                return socket.emit(STD.chat.serverRequestFail, 400, {});
            }

            if (payload.roomId === undefined) {
                return socket.emit(STD.chat.serverRequestFail, 400, {});
            }

            next();
        }
    },
    validateSendMessage: function () {
        return function (socket, payload, next) {

            if (payload.roomId === undefined) {
                return socket.emit(STD.chat.serverRequestFail, 400, {});
            }

            if (payload.type === undefined) {
                return socket.emit(STD.chat.serverRequestFail, 400, {});
            }

            if (payload.type == STD.chatHistory.text && !payload.message) {
                return socket.emit(STD.chat.serverRequestFail, 400, {});
            }

            if (payload.type == STD.chatHistory.image && !payload.imageId) {
                return socket.emit(STD.chat.serverRequestFail, 400, {});
            }

            next();
        }
    },
    validateReadMessage: function () {
        return function (socket, payload, next) {

            if (payload.roomId === undefined) {
                return socket.emit(STD.chat.serverRequestFail, 400, {});
            }

            next();
        }
    },
    checkPrivateChatRoomUser: function () {
        return function (socket, payload, next) {

            if (payload.isPrivate) {
                var user = socket.request.user;

                sequelize.models.ChatHistory.findOrUpdatePrivateChatRoomUser(payload.roomId, user.id, function (status, data) {
                    if (status == 204) {
                        next();
                    } else {
                        return socket.emit(STD.chat.serverRequestFail, status, data);
                    }
                });
            } else {
                next();
            }

        }
    },
    sendMessage: function () {
        return function (socket, payload, next) {

            var notification = socket.request.notification;
            var user = socket.request.user;

            var body = {
                userId: user.id,
                roomId: payload.roomId,
                message: payload.message,
                type: payload.type,
                imageId: payload.imageId
            };

            sequelize.models.ChatHistory.createChatHistory(body, function (status, data) {
                if (status == 200) {
                    socket.emit(STD.chat.serverCheckMessage, data);
                    socket.broadcast.to(payload.roomId).emit(STD.chat.serverReceiveMessage, data);

                    coreUtils.notification.all.sendNotification(data.user, notification, {
                        user: user.nick
                    });

                } else {
                    console.log(socket.id + ' fail to join');
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }

                // console.log(socket.adapter.rooms[roomId]);

                next();
            });
        }
    },
    readMessage: function () {
        return function (socket, payload, next) {

            var user = socket.request.user;

            sequelize.models.ChatRoomUser.updateChatRoomUserUpdatedAt(user.id, payload.roomId, function (status, data) {
                if (status == 204) {
                    socket.emit(STD.chat.serverReadMessage, data);
                    socket.broadcast.to(payload.roomId).emit(STD.chat.serverReadMessage, data);

                } else {
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }

                next();
            });

        }
    },
    onTyping: function () {
        return function (socket, payload, next) {

            var user = socket.request.user;

            socket.broadcast.to(payload.roomId).emit(STD.chat.serverTyping, {
                isTyping: payload.isTyping,
                userId: user.id,
                roomId: payload.roomId
            });

            next();
        }
    },
    loadNotification: function (key, options) {
        return function (socket, payload, next) {

            sequelize.models.Notification.loadNotification(key, options, function (status, data) {
                if (status == 200) {
                    socket.request.notification = data;
                    next();
                } else {
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }
            });

        }
    }
};

module.exports = middles;