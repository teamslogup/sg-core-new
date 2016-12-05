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

                // var where = {};
                //
                // if (options.userId !== undefined) {
                //     where.userId = options.userId
                // }
                //
                // where.createdAt = {
                //     '$lt': options.last
                // };
                //
                // sequelize.transaction(function (t) {
                //
                //     return sequelize.models.ChatRoomUser.findAll({
                //         'offset': parseInt(options.offset),
                //         'limit': parseInt(options.size),
                //         'where': where,
                //         'order': [[options.orderBy, options.sort]],
                //         'include': sequelize.models.ChatRoomUser.getIncludeChatRoomUser(),
                //         'paranoid': true,
                //         'transaction': t
                //     }).then(function (data) {
                //         if (data.length > 0) {
                //             return data;
                //         } else {
                //             throw new errorHandler.CustomSequelizeError(404);
                //         }
                //     });
                //
                // }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                //     if (data) {
                //         callback(200, data);
                //     }
                // });

                var query = "SELECT v1.roomId as roomId, v2.nick as title, v2.deletedAt as deletedAt, v1.count as noReadCount, v2.folder as folder, v2.url as url " +
                    "FROM (SELECT room.id as roomId, count(case when chatHistory.createdAt > roomUser.updatedAt then 1 else null end) as count, max(chatHistory.createdAt) as createdAt " +
                    "FROM `ChatRooms` as room " +
                    "LEFT JOIN `ChatRoomUsers` as roomUser ON room.id = roomUser.roomId " +
                    "LEFT JOIN `ChatHistories` as chatHistory ON room.id = chatHistory.roomId " +
                    "LEFT JOIN `Users` as user ON user.id = roomUser.userId " +
                    "WHERE room.isPrivate = TRUE AND roomUser.userId = " + options.userId + " AND roomUser.deletedAt IS NULL " +
                    "GROUP BY room.id) as v1 " +
                    "INNER JOIN (SELECT roomUser.roomId as roomId, user.nick as nick, user.id as roomUserId, user.deletedAt as deletedAt, image.folder as folder, image.name as url FROM ChatRoomUsers as roomUser " +
                    "LEFT JOIN Users as user ON user.id = roomUser.userId " +
                    "LEFT JOIN UserImages as userImages ON userImages.userId = user.id " +
                    "LEFT JOIN Images as image ON image.id = userImages.imageId " +
                    "WHERE roomUser.userId <> " + options.userId + ") as v2 ON v1.roomId = v2.roomId GROUP BY roomUserId " +
                    "ORDER BY createdAt DESC";

                sequelize.query(query, {
                    type: sequelize.QueryTypes.SELECT,
                    raw: true
                }).then(function (result) {
                    return result;
                }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                    if (data) {
                        callback(200, data);
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

                            data[0].setDataValue('createdAt', micro.now());
                            data[0].setDataValue('deletedAt', null);
                            return data[0].save({paranoid: false});
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
                    }).then(function (data) {
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