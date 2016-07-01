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
        }
    },
    options: {
        'charset': 'utf8',
        'paranoid': true,
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'findReportsByOptions': function (options, callback) {
                var where = {};

                if (options.authorId !== undefined) where.authorId = options.authorId;
                if (options.isSolved !== undefined) where.isSolved = options.isSolved;
                
                var query = {
                    'limit': parseInt(options.size),
                    'where': where,
                    'include': {
                        'model': sequelize.models.User,
                        'as': 'author'
                    }
                };

                if (options.searchField) {
                    query.where[options.searchField] = {
                        '$like': "%" + options.searchItem + "%"
                    };
                }

                query.where.createdAt = {
                    '$lt': options.last
                };
                
                if (options.sort !== undefined) query.order = [['createdAt', options.sort]];

                sequelize.models.Report.findAllDataForQuery(query, callback);
            },
            'findReportById': function (id, callback) {
                sequelize.models.Report.findDataById(id, callback);
            }
        })
    }
};