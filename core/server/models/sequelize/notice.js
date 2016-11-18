/**
 * Notice model module.
 * @module core/server/models/sequelize/notice
 */


var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var NOTICE = STD.notice;

module.exports = {
    fields: {
        'title': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'body': {
            'type': Sequelize.TEXT,
            'allowNull': false
        },
        'country': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.notice.enumNoticeTypes,
            'allowNull': false
        },
        'startDate': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'endDate': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'thumbnailImageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'as': 'thumbnailImage',
            'allowNull': true
        },
        'bigImageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'as': 'bigImage',
            'allowNull': true
        },
        'smallImageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'as': 'smallImage',
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
        indexes: [{
            fields: ['type'],
            name: 'notice_type'
        }],
        'paranoid': true,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'findAllNotices': function (searchItem, searchField, last, size, country, type, sort, offset, callback) {

                var where = {};

                if (country) where.country = country;
                if (type) where.type = type;

                if (searchField && searchItem) {
                    if (searchField == STD.common.id) {
                        where[searchField] = searchItem;
                    } else {
                        where[searchField] = {
                            '$like': '%' + searchItem + '%'
                        };
                    }
                } else if (searchItem) {
                    if (STD.notice.enumFields.length > 0) where.$or = [];
                    for (var i = 0; i < STD.user.enumFields.length; i++) {
                        var body = {};
                        if (STD.notice.enumFields[i] == STD.common.id) {
                            body[STD.notice.enumFields[i]] = searchItem;
                        } else {
                            body[STD.notice.enumFields[i]] = {
                                '$like': '%' +searchItem + '%'
                            };
                        }
                        where.$or.push(body);
                    }
                }

                where.createdAt = {
                    '$lt': last
                };

                if (!sort) sort = STD.common.DESC;

                var query = {
                    'limit': parseInt(size),
                    'offset': parseInt(offset),
                    'where': where,
                    'order': [['createdAt', sort]],
                    'include': [{
                        'model': sequelize.models.Image,
                        'as': 'thumbnailImage'
                    },{
                        'model': sequelize.models.Image,
                        'as': 'bigImage'
                    },{
                        'model': sequelize.models.Image,
                        'as': 'smallImage'
                    }]
                };

                // sequelize.models.Notice.findAllDataForQuery(query, callback);

                sequelize.models.Notice.findAndCountAll(query).then(function (data) {
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
            }

        })
    }
};