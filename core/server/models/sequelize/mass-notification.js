/**
 * Test model module.
 * @module core/server/models/sequelize/test
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var STD = require('../../../../bridge/metadata/standards');
var NOTIFICATIONS = require('../../../../bridge/metadata/notifications');
var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

module.exports = {
    fields: {
        'authorId': {
            'reference': 'User',
            'referenceKey': 'id',
            'as': 'author',
            'asReverse': 'massNotifications',
            'allowNull': false
        },
        'key': {
            'type': Sequelize.ENUM,
            'values': Object.keys(NOTIFICATIONS.public),
            'defaultValue': Object.keys(NOTIFICATIONS.public)[0],
            'allowNull': false
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
        'title': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'body': {
            'type': Sequelize.TEXT(STD.notification.bodyDataType),
            'allowNull': false
        },
        'sendCount': {
            'type': Sequelize.INTEGER,
            'defaultValue': STD.notification.defaultCount,
            'allowNull': false
        },
        'emptyDestinationCount': {
            'type': Sequelize.INTEGER,
            'defaultValue': STD.notification.defaultCount,
            'allowNull': false
        },
        'wrongDestinationCount': {
            'type': Sequelize.INTEGER,
            'defaultValue': STD.notification.defaultCount,
            'allowNull': false
        },
        'failCount': {
            'type': Sequelize.INTEGER,
            'defaultValue': STD.notification.defaultCount,
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
        "indexes": [{
            name: 'authorId',
            fields: ['authorId']
        }, {
            name: 'key',
            fields: ['key']
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
                var countWhere = {};
                var where = {};
                var query = {
                    limit: parseInt(options.size),
                    order: [options.orderBy, options.sort],
                    where: where
                };

                if (options.searchField && options.searchItem) {
                    if (options.searchField == STD.common.id) {
                        where[options.searchField] = options.searchItem;
                        countWhere[options.searchField] = options.searchItem;
                    } else {
                        where[options.searchField] = {
                            "$like": "%" + options.searchItem + "%"
                        };
                        countWhere[options.searchField] = {
                            "$like": "%" + options.searchItem + "%"
                        };
                    }
                } else if (options.searchItem && STD.notification.enumSearchFields.length) {
                    where.$or = [];
                    countWhere.$or = [];
                    for (var i=0; i<STD.notification.enumSearchFields.length; i++) {
                        var body = {};
                        if (STD.notification.enumSearchFields[i] == STD.common.id) {
                            body[STD.notification.enumSearchFields[i]] = options.searchItem;
                        } else {
                            body[STD.notification.enumSearchFields[i]] = {
                                "$like": "%" + options.searchItem + "%"
                            };
                        }
                        where.$or.push(body);
                        countWhere.$or.push(body);
                    }
                }

                if (options.isStored !== undefined) {
                    countWhere.isStored = options.isStored;
                    where.isStored = options.isStored;
                }

                if (options.key !== undefined) {
                    countWhere.key = options.key;
                    where.key = options.key;
                }

                if (options.sendType !== undefined) {
                    countWhere.sendType = options.sendType;
                    where.sendType = options.sendType;
                }

                if (options.sort == STD.common.DESC) {
                    where[options.orderBy] = {
                        "$lt": options.last
                    };
                } else {
                    where[options.orderBy] = {
                        "$gt": options.last
                    };
                }

                sequelize.models.MassNotification.count({
                    where: countWhere
                }).then(function (data) {
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
