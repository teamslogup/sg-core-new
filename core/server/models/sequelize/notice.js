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
            'type': Sequelize.STRING,
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
            'type': Sequelize.DATE,
            'allowNull': true
        },
        'endDate': {
            'type': Sequelize.DATE,
            'allowNull': true
        },
        'imageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'as': 'eventImage',
            'allowNull': false
        }
    },
    options: {
        'charset': 'utf8',
        indexes: [{
            fields: ['type'],
            name: 'notice_type'
        }],
        'paranoid': true,
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'findAllNotices': function (searchItem, option, last, size, country, type, sort, callback) {

                var where = {};

                if (country) where.country = country;
                if (type) where.type = type;

                var query = {
                    'limit': parseInt(size),
                    'where': where
                };

                if (searchItem && option) {
                    query.where[option] = {
                        '$like': "%" + searchItem + "%"
                    };
                } else if (searchItem) {
                    if (NOTICE.enumFields.length > 0) query.where.$or = [];
                    for (var i = 0; i < NOTICE.enumFields.length; i++) {
                        var body = {};
                        body[NOTICE.enumFields[i]] = {
                            '$like': '%' + searchItem + '%'
                        };
                        query.where.$or.push(body);
                    }
                }

                query.where.createdAt = {
                    '$lt': last
                };

                if (sort) query.order = [['createdAt', sort]];

                sequelize.models.Notice.findAllDataForQuery(query, callback);
            }

        })
    }
};