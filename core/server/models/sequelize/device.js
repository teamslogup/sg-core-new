
/**
 * Device model module.
 * @module core/server/models/sequelize/device
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var mixin = require('./mixin');

var STD = require('../../../../bridge/metadata/standards');
var User = require('./user');

module.exports = {
    fields: {
        'userId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'user',
            asReverse: 'devices',
            allowNull: false
        },
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.user.enumDeviceTypes,
            'allowNull': false
        },
        'token': {
            'type': Sequelize.STRING,
            'allowNull': false,
            'unique': true
        }
    }, options: {
        'charset': 'utf8',
        'paranoid': false, // deletedAt 추가. delete안함.
        'instanceMethods': {},
        'hooks': {},
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            getDeviceFields: function () {
                var fields = ['id', 'type'];
                return fields;
            }
        })
    }
};
