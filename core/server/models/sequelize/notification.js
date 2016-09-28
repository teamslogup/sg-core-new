/**
 * Test model module.
 * @module core/server/models/sequelize/test
 */

var Sequelize = require('sequelize');
var STD = require('../../../../bridge/metadata/standards');
var mixin = require('./mixin');

module.exports = {
    fields: {
        'country': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'language': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
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
            'defaultValue': true,
            'comment': "formApplication form일때 notification-box에 저장할 지 여부"
        },
        'isOption': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': true,
            'comment': "formApplication form일때 user-notification에 switch로 옵션을 조절할 지 여"
        },
        'description': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'form': {
            'type': Sequelize.ENUM,
            'allowNull': false,
            'values': STD.notification.enumForms,
            'defaultValue': STD.notification.formApplication,
            'comment': "노티피케이션의 형태, application 모드가 아닌경우 유저 내에서 노티를 받을지 결정할 수 있음, 또한 application모드에서만 isStored가 작동함"
        }
    },
    options: {
        "indexes": [{
            fields: ['type', 'isStored', 'isOption', 'form']
        }],
        'charset': 'utf8',
        'paranoid': true, // deletedAt 추가. delete안함.
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {}),
        'hooks': {}
    }
};
