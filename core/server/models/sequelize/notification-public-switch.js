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
            asReverse: 'notificationPublicSwitches',
            allowNull: false
        },
        'notificationType': {
            'type': Sequelize.ENUM,
            'allowNull': false,
            'values': STD.notification.enumNotificationTypes
        },
        'sendType': {
            'type': Sequelize.ENUM,
            'allowNull': false,
            'values': STD.notification.enumSendTypes,
            'defaultValue': STD.notification.sendTypePush
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
            fields: ['userId', 'notificationType', 'sendType']
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
            getUserPublicNotificationFields: function () {
                return ['notificationType', 'sendType'];
            },
            'deleteNotificationPublicSwitch': function (userId, notificationType, sendType, callback) {

                sequelize.models.NotificationPublicSwitch.destroy({
                    where: {
                        userId: userId,
                        notificationType: notificationType,
                        sendType: sendType
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