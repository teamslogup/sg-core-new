/**
 * Profile model module.
 * @module core/server/models/sequelize/profile
 */

/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var MICRO = require('microtime');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');

module.exports = {
    'fields': {
        'userId': {
            'reference': 'User',
            'referenceKey': 'id',
            'as': 'user',
            'asReverse': 'loginHistories',
            'onDelete': 'cascade',
            'allowNull': false
        },
        'platform': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'device': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'version': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'token': {
            'type': Sequelize.STRING,
            'allowNull': true,
            'indicesType': 'SPATIAL'
        },
        'ip': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'session': {
            'type': Sequelize.STRING,
            'allowNull': false,
            'unique': true
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': false
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': false
        }
    },
    'options': {
        indexes: [{
            'unique': true,
            fields: ['userId', 'device', 'token']
        }],
        'timestamps': true,
        'charset': 'utf8',
        'paranoid': false,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            getLoginHistoryFields: function () {
                var fields = ['id', 'platform', 'device', 'version', 'token'];
                return fields;
            },
            createLoginHistory: function(id, data, callback) {
                if (!data.ip || !data.session) return callback(500);
                var update = {
                    platform: data.platform || "",
                    version: data.version || "",
                    ip: data.ip,
                    createdAt: MICRO.now(),
                    updatedAt: MICRO.now(),
                    userId: id,
                    device: data.device || '',
                    token: data.token || '',
                    session: data.session
                };

                var query = {
                    where: {
                        userId: id,
                        device: data.device || '',
                        token: data.token || ''
                    }
                };

                this.upsertData(update, query, callback);
            },
            removeLoginHistory: function(sessionId, callback) {
                this.destroyData({
                    session: sessionId
                }, false, callback)
            },
            removeAllLoginHistory: function(userId, callback) {
                var self = this;
                var loadedData = null;

                sequelize.transaction(function (t) {

                    var query = {
                        where: {
                            userId: userId
                        },
                        transaction: t
                    };

                    return self.findAll(query).then(function (histories) {
                        return self.destroy(query).then(function () {
                            loadedData = histories;
                        });
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedData) {
                        if (loadedData.length == 0) {
                            return callback(404);
                        }
                        return callback(200, loadedData);
                    }
                });
            }
        })
    }
};