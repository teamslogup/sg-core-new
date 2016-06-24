/**
 * Notice model module.
 * @module core/server/models/sequelize/notice
 */


var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');

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
            'findAllNotices': function (searchItem, option, last, size, country, type, sorted, callback) {
                
                var where = {};
                
                if(country) where.country = country;
                if(type) where.type = type;

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
                
                if(sorted) query.order = [['createdAt', sorted]];

                sequelize.models.Notice.findAllDataForQuery(query, callback);
            }

        })
    }
};