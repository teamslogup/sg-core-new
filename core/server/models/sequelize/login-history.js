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
var MICRO = require('microtime-nodejs');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');
var UAParser = require('ua-parser-js');

var STD = require('../../../../bridge/metadata/standards');

var loginHistoryTypes = STD.user.enumSignUpTypes.concat(STD.user.enumProviders);

for (var i = 0; i < loginHistoryTypes.length; ++i) {
    if (loginHistoryTypes[i] == STD.user.signUpTypeSocial) {
        break;
    }
}

loginHistoryTypes.splice(i, 1);

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
        'type': {
            'type': Sequelize.ENUM,
            'values': loginHistoryTypes,
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
        'browser': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'version': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'token': {
            'type': Sequelize.STRING,
            'allowNull': true
            // 'indicesType': 'SPATIAL'
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
        // 'indexes': [{
        //     fields: ['userId']
        // },{
        //
        // }],
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
                var fields = ['id', 'type', 'platform', 'device', 'browser', 'version', 'token', 'ip', 'updatedAt', 'createdAt'];
                return fields;
            },
            parseLoginHistory: function (req, body) {

                var parser = new UAParser();
                var ua = req.headers['user-agent'];
                var result = parser.setUA(ua).getResult();

                if (body.platform === undefined) {
                    req.body.platform = result.os.name;
                }

                if (body.device === undefined) {
                    req.body.device = result.device.model;
                }

                if (body.browser === undefined) {
                    req.body.browser = result.browser.name;
                }

                var data = {
                    'platform': body.platform,
                    'device': body.device,
                    'browser': body.browser,
                    'version': body.version,
                    'token': body.token,
                    'ip': req.refinedIP,
                    'session': req.sessionID
                };

                if (body.provider) {
                    data.type = body.provider;
                } else {
                    data.type = body.type;
                }

                return data;
            },
            createLoginHistory: function (id, data, callback) {
                if (!data.ip || !data.session) return callback(500);
                var update = {
                    type: data.type,
                    device: data.device || undefined,
                    platform: data.platform || undefined,
                    browser: data.browser || undefined,
                    version: data.version || undefined,
                    ip: data.ip,
                    createdAt: MICRO.now(),
                    updatedAt: MICRO.now(),
                    userId: id,
                    token: data.token || undefined,
                    session: data.session
                };

                var query = {
                    where: {
                        userId: id
                    }
                };

                if (data.device !== undefined) {
                    query.where.device = data.device;
                }

                if (data.device !== undefined) {
                    query.where.token = data.token;
                }

                this.upsertData(update, query, callback);
            },
            removeLoginHistory: function (sessionId, callback) {
                this.destroyData({
                    session: sessionId
                }, false, callback)
            },
            removeAllLoginHistory: function (userId, callback) {
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
            },
            checkLoginHistoryCountAndRemove: function (userId, callback) {

                sequelize.models.LoginHistory.findAll({
                    where: {
                        userId: userId,
                        token: null
                    },
                    order: [['createdAt', 'ASC']]
                }).then(function (data) {

                    if (data.length > STD.loginHistory.maxDuplicateLoginCount) {

                        var toBeDeletedIdArray = [];
                        for (var i = 0; i < data.length - STD.loginHistory.maxDuplicateLoginCount; i++) {
                            toBeDeletedIdArray.push(data[i].id);
                        }

                        return sequelize.models.LoginHistory.destroy({
                            where: {
                                id: toBeDeletedIdArray
                            }
                        });

                    }
                }).then(function () {

                    return true;

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            }
        })
    }
};