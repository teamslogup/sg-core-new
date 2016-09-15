/**
 * Report model module.
 * @module core/server/models/sequelize/report
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
module.exports = {
    fields: {
        'body': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'email': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'authorId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'author',
            asReverse: 'reports',
            allowNull: true
        },
        'nick': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'reply': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'isSolved': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': false
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'deletedAt': {
            'type': Sequelize.DATE,
            'allowNull': true
        },
    },
    options: {
        'timestamps': true,
        'charset': 'utf8',
        'createdAt': false,
        'updatedAt': false,
        'paranoid': true, // deletedAt 추가. delete안함.
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getReportInclude': function () {
                return [{
                    'model': sequelize.models.User,
                    'as': 'author',
                    'attributes': sequelize.models.User.getUserFields()
                }];
            },
            'findReportsByOptions': function (options, callback) {
                var where = {};

                if (options.authorId !== undefined) where.authorId = options.authorId;
                if (options.isSolved !== undefined) where.isSolved = options.isSolved;

                if (options.searchField) {
                    where[options.searchField] = {
                        '$like': "%" + options.searchItem + "%"
                    };
                }

                where.createdAt = {
                    '$lt': options.last
                };

                var query = {
                    'limit': parseInt(options.size),
                    'where': where,
                    'order':[['createdAt', options.sort]],
                    'include': sequelize.models.Report.getReportInclude()
                };

                sequelize.models.Report.findAndCountAll(query).then(function (data) {
                    if (data.rows.length > 0) {
                        return data;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                    if (data) {
                        callback(200, data);
                    }
                });
            },
            'findReportById': function (id, callback) {
                sequelize.models.Report.findDataById(id, callback);
            }
        })
    }
};