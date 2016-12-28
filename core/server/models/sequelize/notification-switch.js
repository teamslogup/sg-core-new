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
            as: 'user',
            asReverse: 'notificationSwitches',
            allowNull: false
        },
        'notificationSendTypeId': {
            reference: 'NotificationSendType',
            referenceKey: 'id',
            as: 'notificationSendType',
            asReverse: 'notificationSwitches',
            allowNull: false
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        }
    },
    options: {
        "indexes": [{
            unique: true,
            fields: ['userId', 'notificationSendTypeId']
        }],
        'timestamps': true,
        'charset': 'utf8',
        'createdAt': false,
        'updatedAt': false,
        'paranoid': false,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            getUserNotificationFields: function () {
                return ['notificationSendTypeId'];
            },
            'deleteNotificationSwitch': function (userId, notificationSendTypeId, callback) {

                sequelize.models.NotificationSwitch.destroy({
                    where: {
                        userId: userId,
                        notificationSendTypeId: notificationSendTypeId
                    }
                }).then(function () {
                    return true
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });

            }
        })
    }
};
