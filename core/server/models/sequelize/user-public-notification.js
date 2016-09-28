/**
 * Test model module.
 * @module core/server/models/sequelize/test
 */

var Sequelize = require('sequelize');
var STD = require('../../../../bridge/metadata/standards');
var mixin = require('./mixin');

module.exports = {
    fields: {
        'userId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'author',
            asReverse: 'reports',
            allowNull: false
        },
        'type': {
            'type': Sequelize.ENUM,
            'allowNull': false,
            'values': STD.notification.enumForms,
            'defaultValue': STD.notification.formApplication,
            'comment': "노티피케이션의 형태, application 모드가 아닌 경우 유저 내에서 노티를 받을지 결정할 수 있음, 또한 user-noticiation테이블의 application모드에서만 isStored가 작동함"
        },
        'switch': {
            'type': Sequelize.BOOLEAN,
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
            unique: true,
            fields: ['userId', 'type']
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
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {})
    }
};
