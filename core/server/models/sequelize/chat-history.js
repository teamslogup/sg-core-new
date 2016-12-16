/**
 * Category model module.
 * @module app/server/models/sequelize/app-chat-history
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
            'referenceType': 'one',
            'as': 'room',
            'allowNull': false
        },
        'message': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.chatHistory.chatHistoryEnum,
            'allowNull': false
        },
        'imageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'image',
            'allowNull': true
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
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'createChatHistory': function (body, callback) {

                var chatHistory;

                sequelize.transaction(function (t) {

                    return sequelize.models.ChatHistory.create(body, {
                        'include': [{
                            model: sequelize.models.User,
                            as: 'user',
                            attributes: sequelize.models.User.getUserFields(),
                            include: [{
                                model: sequelize.models.LoginHistory,
                                as: 'loginHistories',
                            }, {
                                model: sequelize.models.UserNotification,
                                as: 'userNotifications',
                                attributes: sequelize.models.UserNotification.getUserNotificationFields()
                            }, {
                                model: sequelize.models.UserPublicNotification,
                                as: 'userPublicNotifications',
                                attributes: sequelize.models.UserPublicNotification.getUserPublicNotificationFields()
                            }, {
                                model: sequelize.models.UserImage,
                                as: 'userImages',
                                include: {
                                    model: sequelize.models.Image,
                                    as: 'image'
                                }
                            }]
                        }, {
                            model: sequelize.models.Image,
                            as: 'image'
                        }]
                    }).then(function (data) {

                        chatHistory = data;

                        return sequelize.models.ChatRoomUser.update({
                            noView: sequelize.literal('noView + 1')
                        }, {
                            'where': {
                                roomId: body.roomId
                            },
                            'paranoid': false,
                            'transaction': t
                        }).then(function (data) {
                            if (data[0] > 0) {
                                return true;
                            } else {
                                throw new errorHandler.CustomSequelizeError(400);
                            }
                        });

                    }).then(function () {

                        return sequelize.models.ChatRoomUser.update({
                            noView: 0,
                            updatedAt: micro.now()
                        }, {
                            'where': {
                                userId: body.userId,
                                roomId: body.roomId
                            },
                            'paranoid': false,
                            'transaction': t
                        }).then(function (data) {

                            if (data[0] > 0 || data[1][0]) {
                                return true;
                            } else {
                                throw new errorHandler.CustomSequelizeError(400);
                            }

                        });

                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        chatHistory.reload().then(function () {
                            callback(200, chatHistory);
                        });
                    }
                });
            },
            'findChatHistoriesByOptions': function (options, userId, callback) {

                var where = {};

                if (options.userId !== undefined) {
                    where.userId = options.userId
                }

                if (options.roomId !== undefined) {
                    where.roomId = options.roomId
                }

                where.createdAt = {
                    '$and': [{
                        '$lt': options.last
                    }]
                };

                sequelize.transaction(function (t) {

                    return sequelize.models.ChatRoomUser.findOne({
                        'where': {
                            userId: userId,
                            roomId: options.roomId
                        },
                        'paranoid': false,
                        'transaction': t
                    }).then(function (data) {

                        if (data) {
                            where.createdAt.$and.unshift({
                                '$gt': data.createdAt
                            });

                            return sequelize.models.ChatHistory.findAndCountAll({
                                'offset': parseInt(options.offset),
                                'limit': parseInt(options.size),
                                'where': where,
                                'order': [[options.orderBy, options.sort]],
                                'include': [{
                                    model: sequelize.models.User,
                                    as: 'user',
                                    attributes: sequelize.models.User.getUserFields()
                                }, {
                                    model: sequelize.models.ChatRoom,
                                    as: 'room'
                                }, {
                                    model: sequelize.models.Image,
                                    as: 'image'
                                }],
                                'transaction': t
                            });
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    }).then(function (data) {
                        if (data.rows.length > 0) {
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
            'getNewNotificationCount': function (body, callback) {

                sequelize.transaction(function (t) {

                    return sequelize.models.ChatRoomUser.findAll({
                        where: {
                            userId: body.userId
                        },
                        transaction: t
                    }).then(function (data) {

                        if (data.length > 0) {

                            for (var i = 0; i < data.length; i++) {

                            }

                            return sequelize.models.ChatHistory.count({
                                where: {
                                    createdAt: data.updatedAt
                                }
                            });

                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    }).then(function (data) {

                        if (data) {
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

            }
        })
    }
};