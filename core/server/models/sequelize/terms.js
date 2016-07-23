
/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../../../core/server/config/sequelize');

var mixin = require('../../../../core/server/models/sequelize/mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
module.exports = {
    fields: {
        'authorId': {
            'reference': 'User',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'author'
        },
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.terms.enumTypes,
            'defaultValue': STD.terms.defaultType,
            'allowNull': false
        },
        'country': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'title': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'content': {
            'type': Sequelize.TEXT(STD.terms.contentDataType),
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
        'createdAt': false,
        'updatedAt': false,
        'paranoid': true,
        'charset': 'utf8',
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            "findTermsByOptions": function (options, callback) {
                var where = {};
                var query = {
                    "limit": parseInt(options.size),
                    "order": [[options.orderBy, options.sort]],
                    "where": where
                };

                if (options.sort == STD.common.DESC) {
                    where[options.orderBy] = {
                        "$lt": options.last
                    };
                } else {
                    where[options.orderBy] = {
                        "$gt": options.last
                    }
                }

                if (options.searchItem && options.searchField) {
                    where[options.searchField] = {
                        "$like": "%" + options.searchItem + "%"
                    };
                } else if (options.searchItem) {
                    if (STD.terms.enumSearchFields.length > 0) where.$or = [];
                    for (var i=0; i<STD.terms.enumSearchFields.length; i++) {
                        var body = {};
                        body[STD.terms.enumSearchFields[i]] = {
                            "$like": "%" + options.searchItem + "%"
                        };
                        where.$or.push(body);
                    }
                }
                
                if (options.type) {
                    where.type = options.type;
                }
                
                if (options.user) {
                    if (options.user.role >= STD.user.roleAdmin) {
                        query.include = [{
                            "model": sequelize.models.User,
                            "as": "author"
                        }];
                    }
                }
                
                sequelize.models.Terms.findAllDataForQuery(query, callback);
            },
            "deleteTerms": function (now, callback) {
                var query = 'UPDATE Terms SET deletedAt = "' + now + '" WHERE id != (SELECT x.id FROM (SELECT MAX(t.id) AS id FROM Terms t) x)';
                
                var deleteTermsData = null;
                sequelize.query(query).then(function () {
                    deleteTermsData = true;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (deleteTermsData) {
                        callback(204);
                    }
                });
            }
        })
    }
};