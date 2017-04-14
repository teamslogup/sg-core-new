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

                var query = "INSERT INTO BrowserCounts (domain, ip, browser, version, count) VALUES ('" + body.domain + "', '" + body.ip + "', '" + body.browser + "', '" + body.version + "', 0) ON DUPLICATE KEY UPDATE domain = '" + body.domain + "', ip = '" + body.ip + "', browser = '" + body.browser + "', version = '" + body.version + "', count = count + 1";

                sequelize.query(query, {
                    type: sequelize.QueryTypes.UPSERT,
                    raw: true
                }).then(function (data) {
                    console.log(data);
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