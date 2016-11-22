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
                    attributes: sequelize.models.User.getUserFields()
                }, {
                    model: sequelize.models.ChatRoom,
                    as: 'room',
                    include: [
                        {
                            model: sequelize.models.ChatRoomUser,
                            as: 'roomUsers',
                            include: {
                                model: sequelize.models.User,
                                as: 'user',
                                attributes: sequelize.models.User.getUserFields(),
                                include: {
                                    model: sequelize.models.UserImage,
                                    as: 'userImages'
                                }
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
                        paranoid: true,
                        transaction: t
                    }).then(function (data) {

                        if (data) {

                            chatRoomUser = data;

                            return sequelize.models.ChatRoomUser.update(body, {
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

                        chatRoomUser.reload(function () {
                            callback(200, chatRoomUser);
                        });

                    }
                });

            },
            'findChatRoomUsersByOptions': function (options, callback) {

                var where = {};

                if (options.userId !== undefined) {
                    where.userId = options.userId
                }

                where.createdAt = {
                    '$lt': options.last
                };

                sequelize.transaction(function (t) {

                    return sequelize.models.ChatRoomUser.findAll({
                        'offset': parseInt(options.offset),
                        'limit': parseInt(options.size),
                        'where': where,
                        'order': [[options.orderBy, options.sort]],
                        'include': sequelize.models.ChatRoomUser.getIncludeChatRoomUser(),
                        'transaction': t
                    }).then(function (data) {
                        if (data.length > 0) {
                            return data;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                    if (data) {
                        callback(200, data);
                    }
                });

            },
            'deleteChatRoomUser': function (where, callback) {

            }
        })
    }
};