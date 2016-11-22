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
            'findChatHistoriesByOptions': function (options, callback) {

                var where = {};

                if (options.userId !== undefined) {
                    where.userId = options.userId
                }

                where.createdAt = {
                    '$lt': options.last
                };

                sequelize.transaction(function (t) {

                    return sequelize.models.ChatHistory.findAll({
                        'offset': parseInt(options.offset),
                        'limit': parseInt(options.size),
                        'where': where,
                        'order': [[options.orderBy, options.sort]],
                        'include': [{
                            model: sequelize.models.User,
                            as: 'user'
                        }, {
                            model: sequelize.models.ChatRoom,
                            as: 'room'
                        }],
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
        })
    }
};