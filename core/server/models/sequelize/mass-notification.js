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
        'notificationType': {
            'type': Sequelize.ENUM,
            'allowNull': false,
            'values': STD.notification.enumPublicNotificationTypes,
            'defaultValue': STD.notification.notificationTypeNotice,
            'comment': "노티피케이션의 형태"
        },
        'sendType': {
            'type': Sequelize.ENUM,
            'values': STD.notification.enumSendTypes,
            'allowNull': false,
            'defaultValue': STD.notification.sendTypeEmail
        },
        'isStored': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': true,
            'comment': "formApplication form일때 notification-box에 저장할 지 여부"
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
        "indexes": [{
            name: 'notificationType',
            fields: ['notificationType']
        }, {
            name: 'sendType',
            fields: ['sendType']
        }, {
            name: 'isStored',
            fields: ['isStored']
        }, {
            name: 'createdAt',
            fields: ['createdAt']
        }],
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
            "findMassNotificationsByOptions": function (options, callback) {
                var count = 0;
                var foundData = [];
                var where = {};
                var query = {
                    limit: parseInt(options.size),
                    order: [options.orderBy, options.sort],
                    where: where
                };

                if (options.isStored !== undefined) {
                    where.isStored = options.isStored;
                }

                if (options.notificationType !== undefined) {
                    where.notificationType = options.notificationType;
                }

                if (options.sendType !== undefined) {
                    where.sendType = options.sendType;
                }

                sequelize.models.MassNotification.count(query).then(function (data) {
                    count = data;
                    if (count > 0) {
                        return sequelize.models.MassNotification.findAll(query).then(function (data) {
                            foundData = data;
                            return true;
                        });
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, {
                            count: count,
                            rows: foundData
                        });
                    }
                });
            }
        })
    }
};
