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

module.exports = {
    fields: {
        'companyName': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'representative': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'regNum': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'privateInfoManager': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'address': {
            'type': Sequelize.STRING(1024),
            'allowNull': false
        },
        'contact': {
            'type': Sequelize.STRING,
            'allowNull': true
        }
    },
    options: {
        'timestamps': true,
        'charset': 'utf8',
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {

        })
    }
};