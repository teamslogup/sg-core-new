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
var MICRO = require('microtime-nodejs');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');

module.exports = {
    'fields': {
        'check': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': false
        },
        'company': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'address': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'tel1': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'tel2': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'fax': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'email': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'chef': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'companyNumber': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'communicationSellNumber': {
            'type': Sequelize.STRING,
            'allowNull': true
        }
    },
    'options': {
        'timestamps': true,
        'charset': 'utf8',
        'paranoid': false,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {

        })
    }
};