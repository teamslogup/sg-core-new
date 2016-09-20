/**
 * Test model module.
 * @module core/server/models/sequelize/test
 */

var Sequelize = require('sequelize');
var STD = require('../../../../bridge/metadata/standards');
var mixin = require('./mixin');

module.exports = {
    fields: {
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.notification.enumNotificationTypes,
            'allowNull': false,
            'defaultValue': STD.notification.notificationEmailPush
        },
        'key': {
            'type': Sequelize.STRING,
            'allowNull': false,
            'unique': true
        },
        'title': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'body': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'data': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'img': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'isStored': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': true
        },
        'isOption': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': true
        },
        'description': {
            'type': Sequelize.STRING,
            'allowNull': false
        }
    },
    options: {
        "indexes": [{
            fields: ['type', 'isStored', 'isOption']
        }],
        'charset': 'utf8',
        'paranoid': true, // deletedAt 추가. delete안함.
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {}),
        'hooks': {}
    }
};
