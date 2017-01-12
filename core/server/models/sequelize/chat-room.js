/**
 * Category model module.
 * @module app/server/models/sequelize/app-chat-room
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

var coreUtils = require('../../utils');

module.exports = {
    fields: {
        'name': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'isPrivate': {
            'type': Sequelize.BOOLEAN,
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
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            // 'findChatRoomsByOption': function (options, callback) {
            //     var where = {};
            //
            //     where.createdAt = {
            //         '$lt': options.last
            //     };
            //
            //     sequelize.transaction(function (t) {
            //
            //         return sequelize.models.ChatRoom.findAndCountAll({
            //             'offset': parseInt(options.offset),
            //             'limit': parseInt(options.size),
            //             'where': where,
            //             'order': [[options.orderBy, options.sort]],
            //             'transaction': t
            //         }).then(function (data) {
            //             if (data.rows.length > 0) {
            //                 return data;
            //             } else {
            //                 throw new errorHandler.CustomSequelizeError(404);
            //             }
            //         });
            //
            //     }).catch(errorHandler.catchCallback(callback)).done(function (data) {
            //         if (data) {
            //             callback(200, data);
            //         }
            //     });
            // },
            'findChatRoomsByOption': function (options, callback) {

                var where = {};

                if (options.userId !== undefined) {
                    where.userId = options.userId
                }

                where.createdAt = {
                    '$lt': options.last
                };

                // sequelize.transaction(function (t) {
                //
                //     return sequelize.models.ChatRoom.findAll({
                //         'order': [[options.orderBy, options.sort]],
                //         'paranoid': true,
                //         include: [{
                //             model: sequelize.models.ChatRoomUser,
                //             as: 'roomUsers',
                //             where: where
                //         }],
                //         'transaction': t
                //     }).then(function (data) {
                //         if (data.length > 0) {
                //
                //             var roomIds = [];
                //
                //             for (var i = 0; i < data.length; i++) {
                //                 roomIds.push(data[i].id);
                //             }
                //
                //             return sequelize.models.ChatRoomUser.findAll({
                //                 where: {
                //                     roomId: roomIds,
                //                     userId: {
                //                         $ne: options.userId
                //                     }
                //                 },
                //                 paranoid: false,
                //                 include: [{
                //                     model: sequelize.models.User,
                //                     as: 'user',
                //                     attributes: sequelize.models.User.getUserFields(),
                //                     paranoid: false,
                //                     include: [{
                //                         model: sequelize.models.UserImage,
                //                         as: 'userImages',
                //                         include: {
                //                             model: sequelize.models.Image,
                //                             as: 'image'
                //                         }
                //                     }]
                //                 }],
                //                 transaction: t
                //             });
                //
                //         } else {
                //             throw new errorHandler.CustomSequelizeError(404);
                //         }
                //
                //     }).then(function (data) {
                //         return data;
                //     });
                //
                // }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                //     if (data) {
                //         callback(200, {
                //             count: data.length,
                //             rows: data
                //         });
                //     }
                // });

                var chatRoom = {
                    count: 0,
                    rows: []
                };

                var query = "SELECT v1.roomId as id, v2.roomUserId as 'user.id', v2.nick as 'user.nick', v2.deletedAt as 'user.deletedAt', v1.count as noReadCount, v2.userImageId as 'user.userImages.id', v2.imageId as 'user.userImages.image.id', v2.folder as 'user.userImages.image.folder', v2.dateFolder as 'user.userImages.image.dateFolder', v2.name as 'user.userImages.image.name', v1.chatId as 'chatHistories.id', v1.chatType as 'chatHistories.type', v1.chatMessage as 'chatHistories.message', v1.chatCreatedAt as 'chatHistories.createdAt' " +
                    "FROM (SELECT a.roomId, a.chatId, a.chatType, a.chatMessage, a.chatCreatedAt, count(case when a.chatCreatedAt > a.roomUserUpdatedAt then 1 else null end) as count FROM (SELECT room.id as roomId, chatHistory.id as chatId, chatHistory.type as chatType, chatHistory.message as chatMessage, chatHistory.createdAt as chatCreatedAt, roomUser.updatedAt as roomUserUpdatedAt " +
                    "FROM `ChatRooms` as room " +
                    "LEFT JOIN `ChatRoomUsers` as roomUser ON room.id = roomUser.roomId " +
                    "LEFT JOIN (SELECT chatHistory.* FROM ChatHistories as chatHistory LEFT JOIN ChatRoomUsers as roomUser ON chatHistory.roomId = roomUser.roomId WHERE roomUser.userId = " + options.userId + " AND chatHistory.createdAt > roomUser.createdAt) as chatHistory ON room.id = chatHistory.roomId " +
                    "LEFT JOIN `Users` as user ON user.id = roomUser.userId " +
                    "WHERE room.isPrivate = TRUE AND roomUser.userId = " + options.userId + " AND roomUser.deletedAt IS NULL " +
                    "ORDER BY chatHistory.createdAt DESC) AS a GROUP BY a.roomId ) as v1 " +
                    "INNER JOIN (SELECT roomUser.roomId as roomId, user.nick as nick, user.id as roomUserId, user.deletedAt as deletedAt, userImages.id as userImageId, image.id as imageId, image.folder as folder, image.dateFolder as dateFolder, image.name as name FROM ChatRoomUsers as roomUser " +
                    "LEFT JOIN Users as user ON user.id = roomUser.userId " +
                    "LEFT JOIN UserImages as userImages ON userImages.userId = user.id " +
                    "LEFT JOIN Images as image ON image.id = userImages.imageId " +
                    "WHERE roomUser.userId <> " + options.userId + ") as v2 ON v1.roomId = v2.roomId GROUP BY roomUserId " +
                    "ORDER BY chatCreatedAt DESC";

                sequelize.query(query, {
                    type: sequelize.QueryTypes.SELECT,
                    raw: true
                }).then(function (result) {

                    if (result.length > 0) {
                        chatRoom.count = result.length;
                        chatRoom.rows = coreUtils.objectify.convert(result, {
                            user: {
                                userImages: [{
                                    image: {}
                                }]
                            },
                            chatHistories: [{}]
                        });

                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, chatRoom);
                    }
                });

            },
            'findOrCreatePrivateChatRoom': function (userId, partnerId, callback) {

                var chatRoom;

                sequelize.transaction(function (t) {

                    // return sequelize.models.ChatRoom.findAll({
                    //     'where': {
                    //         isPrivate: true
                    //     },
                    //     'include': {
                    //         model: sequelize.models.ChatRoomUser,
                    //         as: 'roomUsers',
                    //         paranoid: false,
                    //         where: {
                    //             $or: [{
                    //                 userId: userId
                    //             }, {
                    //                 userId: partnerId
                    //             }]
                    //         }
                    //     },
                    //     'transaction': t
                    // }).then(function (data) {
                    //     if (data) {
                    //         chatRoom = data;
                    //         for (var i = 0; i < data.roomUsers.length; i++) {
                    //             var roomUser = data.roomUsers[i];
                    //             if (roomUser.userId == userId && roomUser.deletedAt !== null) {
                    //                 roomUser.setDataValue('createdAt', micro.now());
                    //                 roomUser.setDataValue('deletedAt', null);
                    //                 return roomUser.save({paranoid: false});
                    //             }
                    //         }
                    //     } else {
                    //         return true;
                    //     }
                    // }).then(function () {
                    //     return true;
                    // })

                    return sequelize.models.ChatRoomUser.findAll({
                        'where': {
                            userId: userId
                        },
                        'include': [{
                            model: sequelize.models.ChatRoom,
                            as: 'room',
                            where: {
                                isPrivate: true
                            },
                            include: {
                                model: sequelize.models.ChatRoomUser,
                                as: 'roomUsers',
                                paranoid: false,
                                where: {
                                    userId: partnerId
                                }
                            }
                        }],
                        'paranoid': false,
                        'transaction': t
                    }).then(function (data) {
                        if (data && data[0]) {
                            chatRoom = data[0].room;

                            if (data[0].deletedAt != null) {
                                data[0].setDataValue('createdAt', micro.now());
                                data[0].setDataValue('deletedAt', null);
                                return data[0].save({paranoid: false});
                            } else {
                                return true;
                            }

                        } else {

                            return sequelize.models.ChatRoom.create({
                                isPrivate: true
                            }, {
                                'transaction': t
                            }).then(function (data) {
                                chatRoom = data;

                                var chatRoomUsers = [];
                                chatRoomUsers.push({
                                    userId: userId,
                                    roomId: data.id
                                });
                                chatRoomUsers.push({
                                    userId: partnerId,
                                    roomId: data.id,
                                    deletedAt: new Date()
                                });

                                return sequelize.models.ChatRoomUser.bulkCreate(chatRoomUsers, {
                                    'individualHooks': true,
                                    'transaction': t
                                });

                            });
                        }
                    }).then(function () {
                        return true;
                    })

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        return chatRoom.reload().then(function () {
                            delete chatRoom.dataValues.roomUsers;
                            callback(200, chatRoom);
                        });
                    }
                });

            }
        })
    }
};