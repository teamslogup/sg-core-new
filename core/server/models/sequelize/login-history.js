/**
 * Profile model module.
 * @module core/server/models/sequelize/profile
 */

/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');

module.exports = {
    'fields': {
        'userId': {
            'reference': 'User',
            'referenceKey': 'id',
            'as': 'user',
            'asReverse': 'loginHistories',
            'onDelete': 'cascade',
            'allowNull': false
        },
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.user.enumSignUpTypes,
            'allowNull': false
        },
        'platform': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'device': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'version': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'token': {
            'type': Sequelize.STRING,
            'allowNull': false,
            'unique': true
        },
        'ip': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': false
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': false
        }
    },
    'options': {
        'timestamps': true,
        'createdAt': false,
        'updatedAt': false,
        'charset': 'utf8',
        'paranoid': false,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            getLoginHistoryFields: function () {
                var fields = ['platform', 'device', 'version', 'type', 'token'];
                return fields;
            }
        })
    }
};