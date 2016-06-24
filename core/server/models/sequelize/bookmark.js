/**
 * Bookmark model module.
 * @module core/server/models/sequelize/bookmark
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var Comment = require('./comment');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../bridge/metadata/standards');
module.exports = {
    fields: {},
    options: {
        'charset': 'utf8',
        'paranoid': true,
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {})
    }
};