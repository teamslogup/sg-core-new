/**
 * Test model module.
 * @module core/server/models/sequelize/test
 */

var Sequelize = require('sequelize');
var STD = require('../../../../bridge/metadata/standards');
var mixin = require('./mixin');

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
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'body': {
            'type': Sequelize.STRING,
            'allowNull': false
        }
    },
    options: {
        'charset': 'utf8',
        'paranoid': true, // deletedAt 추가. delete안함.
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {}),
        'hooks': {}
    }
};
