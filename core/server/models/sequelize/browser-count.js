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

module.exports = {
    'fields': {
        'domain': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'ip': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'browser': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'version': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'deviceModel': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'deviceType': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'deviceVendor': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'engineName': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'engineVersion': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'osName': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'osVersion': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'userAgent': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'count': {
            'type': Sequelize.INTEGER,
            'allowNull': false,
            'defaultValue': 0
        }
    },
    'options': {
        'indexes': [{
            unique: true,
            fields: ['domain', 'ip', 'browser'],
            name: 'browser_count_domain_ip_browser'
        }],
        'timestamps': false,
        'charset': 'utf8',
        'paranoid': false,
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'upsertBrowserCount': function (body, callback) {

                var query = "INSERT INTO BrowserCounts (domain, ip, browser, version, count) VALUES ('" + body.domain + "', '" + body.ip + "', '" + body.browser + "', '" + body.version + "', '" + body.deviceModel + "', '" + body.deviceType + "', '" + body.deviceVendor + "', '" + body.engineName + "', '" + body.engineVersion + "', '" + body.osName + "', '" + body.osVersion + "', '" + body.userAgent + "', 1) " +
                    "ON DUPLICATE KEY UPDATE domain = '" + body.domain + "', ip = '" + body.ip + "', browser = '" + body.browser + "', version = '" + body.version + "', deviceModel = '" + body.deviceModel + "', deviceType = '" + body.deviceType + "', deviceVendor = '" + body.deviceVendor + "', engineName = '" + body.engineName + "', engineVersion = '" + body.engineVersion + "', osName = '" + body.osName + "', osVersion = '" + body.osVersion + "', userAgent = '" + body.userAgent + "', count = count + 1";

                sequelize.query(query, {
                    type: sequelize.QueryTypes.UPSERT,
                    raw: true
                }).then(function (data) {
                    if (data.length > 1) {
                        return true;
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });

            }
        })
    }
};