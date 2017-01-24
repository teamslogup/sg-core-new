/**
 * Category model module.
 * @module app/server/models/sequelize/app-chat-room-user
 */

/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../../../core/server/config/sequelize');

var mixin = require('../../../../core/server/models/sequelize/mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var micro = require('microtime-nodejs');

module.exports = {
    fields: {
        'userId': {
            'reference': 'User',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'user',
            'allowNull': false
        },
        'roomId': {
            'reference': 'ChatRoom',
            'referenceKey': 'id',
            'referenceType': 'many',
            'as': 'room',
            'asReverse': 'roomUsers',
            'allowNull': false
        },
        'noView': {
            'type': Sequelize.INTEGER,
            'allowNull': false,
            'defaultValue': 0
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'deletedAt': {
            'type': Sequelize.DATE,
            'allowNull': true
        }
    },
    options: {
        'timestamps': true,
        'updatedAt': false,
        'charset': 'utf8',
        'paranoid': true,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt,
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getIncludeChatRoomUser': function () {
                return [{
                    model: sequelize.models.User,
                    as: 'user',
                    attributes: sequelize.models.User.getUserFields(),
                    include: sequelize.models.User.getIncludeUser()
                }, {
                    model: sequelize.models.ChatRoom,
                    as: 'room',
                    include: [
                        {
                            model: sequelize.models.ChatRoomUser,
                            as: 'roomUsers',
                            paranoid: false,
                            include: {
                                model: sequelize.models.User,
                                as: 'user',
                                attributes: sequelize.models.User.getUserFields(),
                                include: sequelize.models.User.getIncludeUser()
                            }
                        }
                    ]
                }]
            },
            'findOrCreateChatRoomUser': function (body, callback) {

                var chatRoomUser;

                sequelize.transaction(function (t) {

                    return sequelize.models.ChatRoomUser.findOne({
                        where: {
                            userId: body.userId,
                            roomId: body.roomId
                        },
                        include: sequelize.models.ChatRoomUser.getIncludeChatRoomUser(),
                        paranoid: false,
                        transaction: t
                    }).then(function (data) {

                        if (data) {

                            chatRoomUser = data;

                            return sequelize.models.ChatRoomUser.update({
                                userId: body.userId,
                                roomId: body.roomId,
                                deletedAt: null
                            }, {
                                where: {
                                    id: data.id
                                },
                                transaction: t
                            });
                        } else {
                            return sequelize.models.ChatRoomUser.create(body, {
                                transaction: t,
                                include: sequelize.models.ChatRoomUser.getIncludeChatRoomUser()
                            }).then(function (data) {
                                chatRoomUser = data;

                                return true;
                            });
                        }

                    }).then(function () {
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {

                        chatRoomUser.reload().then(function () {
                            callback(200, chatRoomUser);
                        });

                    }
                });

            },
            'findChatRoomUsersByOptions': function (options, callback) {

                var where = {};

                if (options.roomId !== undefined) {
                    where.roomId = options.roomId
                }

                if (options.userId !== undefined) {
                    where.userId = options.userId
                }

                var chatRoomUser = {
                    count: 0,
                    rows: []
                };

                sequelize.transaction(function (t) {

                    return sequelize.models.ChatRoomUser.findAll({
                        'where': where,
                        'include': sequelize.models.ChatRoomUser.getIncludeChatRoomUser(),
                        'paranoid': false,
                        'transaction': t
                    }).then(function (data) {
                        if (data.length > 0) {
                            chatRoomUser.count = data.length;
                            chatRoomUser.rows = data;
                            return true;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, chatRoomUser);
                    }
                });

            },
            'deleteChatRoomUser': function (userId, roomId, callback) {
                return sequelize.models.ChatRoomUser.destroy({
                    where: {
                        userId: userId,
                        roomId: roomId
                    }
                }).then(function (data) {
                    return true;
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        return callback(204);
                    }
                });
            },
            /**
             * 상대방이 방을 나가있으면 해당 유저의 deleteAt을 지워서 다시 방에 초대한다.
             * @param roomId
             * @param sendUserId
             * @param callback
             */
            'findOrUpdatePrivateChatRoomUser': function (roomId, sendUserId, callback) {
                sequelize.transaction(function (t) {

                    return sequelize.models.ChatRoomUser.findAll({
                        'where': {
                            roomId: roomId
                        },
                        'paranoid': false,
                        'transaction': t
                    }).then(function (data) {
                        if (data.length > 0) {

                            var indexToBeUpdated;

                            for (var i = 0; i < data.length; i++) {
                                if (data[i].userId != sendUserId && data[i].deletedAt) {
                                    indexToBeUpdated = i;
                                }
                            }

                            if (indexToBeUpdated !== undefined) {
                                var chatRoomUser = data[indexToBeUpdated];
                                chatRoomUser.setDataValue('createdAt', micro.now());
                                chatRoomUser.setDataValue('deletedAt', null);
                                return chatRoomUser.save({paranoid: false});
                            } else {
                                return true;
                            }

                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    }).then(function (data) {
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });

            },
            'updateChatRoomUserUpdatedAt': function (userId, roomId, callback) {

                var chatRoomUser;

                sequelize.models.ChatRoomUser.update({
                    noView: 0,
                    updatedAt: micro.now()
                }, {
                    'where': {
                        userId: userId,
                        roomId: roomId
                    },
                    'paranoid': false
                }).then(function (data) {

                    if (data[0] > 0 || data[1][0]) {
                        chatRoomUser = data[1][0];
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(400);
                    }

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204, chatRoomUser);
                    }
                });

            },
            "getNewChatMessageCount": function (userId, callback) {

                var rowQuery = "SELECT sum(noView) as count FROM ChatRoomUsers WHERE userId = " + userId;

                sequelize.query(rowQuery, {
                    type: sequelize.QueryTypes.SELECT,
                    raw: true
                }).then(function (data) {
                    if (data.length > 0) {
                        return data;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                    if (data) {
                        callback(200, data[0].count);
                    }
                });

            }
        })
    }
};