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
        'phoneNum': {
            'type': Sequelize.STRING,
            'unique': true,
            'allowNull': false
        }
    },
    options: {
        "indexes": [{
            name: 'phoneNum',
            fields: ['phoneNum']
        }],
        'timestamps': true,
        'charset': 'utf8',
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            "createMassNotificationPhoneNums": function (phoneNumArray, callback) {
                sequelize.transaction(function (t) {
                    return sequelize.models.MassNotificationPhoneNum.bulkCreate(phoneNumArray, {
                        ignoreDuplicates: true,
                        transaction: t
                    }).then(function () {
                        return true;
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            "countMassNotificationPhoneNum": function (callback) {
                var count = 0;

                sequelize.models.MassNotificationPhoneNum.count().then(function (data) {
                    if (data > 0) {
                        count = data;
                        return 200;
                    } else {
                        return 404;
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (status) {
                    if (status == 200) {
                        callback(status, count);
                    } else if (status == 404) {
                        callback(status, {
                            code: "404_13"
                        });
                    }
                });
            },
            "findMassNotificationPhoneNums": function (options, callback) {
                var where = {};
                var query = {
                    where: where,
                    order: [[STD.common.id, STD.common.ASC]],
                    limit: parseInt(options.size)
                };

                if (options.last !== undefined) {
                    where[STD.common.id] = {
                        "gt": options.last
                    }
                }

                sequelize.models.MassNotificationPhoneNum.findAllDataForQuery(query, callback);
            }
        })
    }
};