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
var MICRO = require('microtime-nodejs');

module.exports = {
    fields: {
        'userId': {
            'reference': 'User',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'user',
            'allowNull': false
        },
        'termsId': {
            'reference': 'Terms',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'terms',
            'allowNull': false
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        }
    },
    options: {
        'timestamps': true,
        'createdAt': false,
        'updatedAt': false,
        'charset': 'utf8',
        'paranoid': false,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            "findOptionalTermsByOptions": function (userId, callback) {

                var query = {
                    'where': {
                        userId: userId
                    },
                    'order': [['createdAt', 'DESC']],
                    'include': [{
                        'model': sequelize.models.User,
                        'as': 'user'
                    }, {
                        'model': sequelize.models.Terms,
                        'as': 'terms'
                    }]
                };

                sequelize.models.OptionalTerms.findAndCountAll(query).then(function (data) {
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