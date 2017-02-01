/**
 * Test model module.
 * @module core/server/models/sequelize/test
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var STD = require('../../../../bridge/metadata/standards');
var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

module.exports = {
    fields: {
        'userId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'author',
            asReverse: 'reports',
            allowNull: false
        },
        'key': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'payload': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'view': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': false
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
        'charset': 'utf8',
        'createdAt': false,
        'updatedAt': false,
        'paranoid': true, // deletedAt 추가. delete안함.
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getNotificationBoxInclude': function () {
                return [{
                    model: sequelize.models.Notification,
                    as: 'notification'
                }]
            },
            'findNotificationBoxesByOptions': function (options, userId, callback) {

                var where = {};

                where.createdAt = {
                    '$lt': options.last
                };

                where.userId = userId;

                sequelize.transaction(function (t) {
                    return sequelize.models.NotificationBox.findAndCountAll({
                        'offset': parseInt(options.offset),
                        'limit': parseInt(options.size),
                        'where': where,
                        'order': [[options.orderBy, options.sort]],
                        'transaction': t
                    }).then(function (data) {
                        if (data && data.rows.length > 0) {
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
            "findNewNotificationCount": function (userId, callback) {

                sequelize.models.NotificationBox.count({
                    where: {
                        userId: userId,
                        view: false
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                    if (data) {
                        callback(200, data);
                    }
                });

            }
        })
    }
};
