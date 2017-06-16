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
var config = require('../../../../bridge/config/env');

module.exports = {
    'fields': {
        'check': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': false
        },
        'company': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        },
        'address': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        },
        'tel1': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        },
        'tel2': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        },
        'fax': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        },
        'email': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        },
        'chef': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        },
        'companyNumber': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        },
        'communicationSellNumber': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        }
    },
    'options': {
        'timestamps': true,
        'charset': config.db.charset,
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