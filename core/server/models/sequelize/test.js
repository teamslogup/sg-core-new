/**
 * Test model module.
 * @module core/server/models/sequelize/test
 */

var Sequelize = require('sequelize');
var STD = require('../../../../bridge/metadata/standards');
var mixin = require('./mixin');
var config = require('../../../../bridge/config/env');

module.exports = {
    fields: {
        'authorId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'author',
            asReverse: 'tests',
            allowNull: false
        },
        'userId': {
            'type': Sequelize.STRING(191),
            'allowNull': false
        },
        'body': {
            'type': Sequelize.STRING(191),
            'allowNull': false
        }
    },
    options: {
        'charset': config.db.charset,
        'paranoid': true, // deletedAt 추가. delete안함.
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {}),
        'hooks': {}
    }
};
