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
            'findAllReports': function (searchItem, option, last, size, isSolved, sorted, callback) {
                var where = {};

                if (isSolved != null) where.isSolved = isSolved;
                
                var query = {
                    'limit': parseInt(size),
                    'where': where
                };

                if (option) {
                    query.where[option] = {
                        '$like': "%" + searchItem + "%"
                    };
                }

                query.where.createdAt = {
                    '$lt': last
                };
                
                if (sorted) query.order = [['createdAt', sorted]];

                sequelize.models.Report.findAllDataForQuery(query, callback);

                // sequelize.models.Report.findAllDataIncludingForBlog(where, null, [{
                //     'model': sequelize.models.User,
                //     'as': 'author',
                //     'attributes': sequelize.models.User.getUserFields()
                // }], size, last, callback);
            },
            'findReportById': function (id, callback) {
                sequelize.models.Report.findDataById(id, callback);
            }
        })
    }
};