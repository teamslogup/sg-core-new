/**
 * Notice model module.
 * @module core/server/models/sequelize/notice
 */


var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var NOTICE = STD.notice;
var config = require('../../../../bridge/config/env');

module.exports = {
    fields: {
        'companyName': {
            'type': Sequelize.STRING(191),
            'allowNull': false
        },
        'representative': {
            'type': Sequelize.STRING(191),
            'allowNull': false
        },
        'regNum': {
            'type': Sequelize.STRING(191),
            'allowNull': false
        },
        'privateInfoManager': {
            'type': Sequelize.STRING(191),
            'allowNull': false
        },
        'address': {
            'type': Sequelize.STRING(191),
            'allowNull': false
        },
        'communicationsRetailReport': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        },
        'contact': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        },
        'contact2': {
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
        'hostUrl': {
            'type': Sequelize.STRING(191),
            'allowNull': true
        }
    },
    options: {
        'timestamps': true,
        'charset': config.db.charset,
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {})
    }
};