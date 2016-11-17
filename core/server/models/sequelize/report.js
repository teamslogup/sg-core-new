/**
 * Report model module.
 * @module core/server/models/sequelize/report
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var micro = require('microtime-nodejs');

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
        // 'isSolved': {
        //     'type': Sequelize.BOOLEAN,
        //     'allowNull': false,
        //     'defaultValue': false
        // },
        'solvedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
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
                    'attributes': sequelize.models.User.getUserFields(),
                    'include': {
                        'model': sequelize.models.UserImage,
                        'as': 'userImages',
                        'include': {
                            'model': sequelize.models.Image,
                            'as': 'image'
                        }
                    }
                }];
            },
            'findReportsByOptions': function (options, callback) {
                var where = {};

                if (options.authorId !== undefined) where.authorId = options.authorId;
                if (options.isSolved !== undefined) {
                    where.solvedAt = options.isSolved ? micro.now() : false;
                }

                if (options.searchField && options.searchItem) {

                    if (options.searchField == STD.common.id) {
                        where[options.searchField] = options.searchItem;
                    } else {
                        where[options.searchField] = {
                            '$like': options.searchItem + '%'
                        };
                    }

                } else if (options.searchItem) {
                    if (STD.report.enumSearchFields.length > 0) where.$or = [];

                    for (var i = 0; i < STD.report.enumSearchFields.length; i++) {
                        var body = {};

                        if (STD.report.enumSearchFields[i] == STD.common.id) {
                            body[STD.report.enumSearchFields[i]] = options.searchItem;
                        } else {
                            body[STD.report.enumSearchFields[i]] = {
                                '$like': options.searchItem + '%'
                            };
                        }

                        where.$or.push(body);
                    }
                }

                where.createdAt = {
                    '$lt': options.last
                };

                var reports = {};

                sequelize.transaction(function (t) {

                    return sequelize.models.Report.findAll({
                        'limit': parseInt(options.size),
                        'where': where,
                        'order': [['createdAt', options.sort]],
                        'include': sequelize.models.Report.getReportInclude(),
                        'transaction': t
                    }).then(function (data) {
                        if (data.length > 0) {
                            reports.rows = data;
                            return sequelize.models.Report.count({
                                'where': where,
                                'transaction': t
                            });

                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    }).then(function (count) {
                        reports.count = count;

                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, reports);
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
                                solvedAt: {
                                    $not: null
                                }
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
                        raw: true,
                        transaction: t
                    }).then(function (createdReport) {
                        reportsStatusByMonth.createdReports = createdReport;

                        var query = 'SELECT ReportsByMonth.month, count(ReportsByMonth.month) as count FROM ' +
                            '(SELECT YEAR(FROM_UNIXTIME(solvedAt/1000000)) as year, MONTH(FROM_UNIXTIME(solvedAt/1000000)) as month FROM Reports WHERE solvedAt IS NOT NULL) as ReportsByMonth ' +
                            'WHERE year = ' + year + ' AND month IN ( + ' + months + ') GROUP BY ReportsByMonth.month ';

                        return sequelize.query(query, {
                            type: sequelize.QueryTypes.SELECT,
                            raw: true,
                            transaction: t
                        });
                    }).then(function (deletedReports) {
                        reportsStatusByMonth.solvedReports = deletedReports;
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