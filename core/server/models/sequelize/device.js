
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
            allowNull: false,
            onDelete: 'cascade'
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
        'paranoid': true,
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            getDeviceFields: function () {
                var fields = ['id', 'type'];
                return fields;
            }
        })
    }
};
