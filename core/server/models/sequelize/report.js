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
        }
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
                    'order': [['createdAt', options.sort]],
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
            },
            'getReportsStatus': function (callback) {

                var reportsStatus = {};

                sequelize.transaction(function (t) {

                    return sequelize.models.Report.count({
                        transaction: t
                    }).then(function (reportsTotal) {
                        reportsStatus.total = reportsTotal;

                        return sequelize.models.Report.count({
                            where: {
                                isSolved: true
                            },
                            transaction: t
                        });

                    }).then(function (reportsSolved) {
                        reportsStatus.solved = reportsSolved;

                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, reportsStatus);
                    }
                });

            },
            'getReportsStatusByMonth': function (year, months, callback) {

                var reportsStatusByMonth = {};

                sequelize.transaction(function (t) {
                    var query = 'SELECT ReportsByMonth.month, count(ReportsByMonth.month) as count FROM ' +
                        '(SELECT YEAR(FROM_UNIXTIME(createdAt/1000000)) as year, MONTH(FROM_UNIXTIME(createdAt/1000000)) as month FROM Reports) as ReportsByMonth ' +
                        'WHERE year = ' + year + ' AND month IN ( + ' + months + ') GROUP BY ReportsByMonth.month ';

                    return sequelize.query(query, {
                        type: sequelize.QueryTypes.SELECT,
                        raw: true
                    }).then(function (createdUser) {
                        reportsStatusByMonth.createdReports = createdUser;

                        var query = 'SELECT ReportsByMonth.month, count(ReportsByMonth.month) as count FROM ' +
                            '(SELECT YEAR(deletedAt) as year, MONTH(deletedAt) as month FROM Reports) as ReportsByMonth ' +
                            'WHERE year = ' + year + ' AND month IN ( + ' + months + ') GROUP BY ReportsByMonth.month ';

                        return sequelize.query(query, {
                            type: sequelize.QueryTypes.SELECT,
                            raw: true
                        });
                    }).then(function (deletedReports) {
                        reportsStatusByMonth.deletedReports = deletedReports;
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, reportsStatusByMonth);
                    }
                });

            }
        })
    }
};