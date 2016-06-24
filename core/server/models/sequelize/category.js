
/**
 * Category model module.
 * @module core/server/models/sequelize/category
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var Article = require('./article');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
module.exports = {
    fields: {
        'boardId': {
            reference: 'Board',
            referenceKey: 'id',
            'as': 'board',
            'asReverse': 'categories',
            'onDelete': 'cascade',
            allowNull: false
        },
        'name': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'isVisible': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': true
        }
    },
    options: {
        'charset': 'utf8',
        indexes: [{
            unique: true,
            fields: ['boardId', 'name'],
            name: 'board_id_name'
        }],
        'paranoid': false,
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            getCategoryFields: function () {
                return ['id', 'name', 'isVisible'];
            }
        })
    }
};