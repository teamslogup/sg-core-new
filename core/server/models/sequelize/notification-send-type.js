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
        'notificationId': {
            reference: 'Notification',
            referenceKey: 'id',
            as: 'notification',
            asReverse: 'notificationSendTypes',
            allowNull: false
        },
        'sendType': {
            'type': Sequelize.ENUM,
            'values': STD.notification.enumSendTypes,
            'allowNull': false,
            'defaultValue': STD.notification.sendTypePush
        },
        'title': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'body': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'mmsImageId': {
            reference: 'Image',
            referenceKey: 'id',
            as: 'mmsImage',
            allowNull: true
        },
        'androidBannerImageId': {
            reference: 'Image',
            referenceKey: 'id',
            as: 'androidBannerImage',
            allowNull: true
        }
    },
    options: {
        'charset': 'utf8',
        'paranoid': true,
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
        }),
        'hooks': {}
    }
};
