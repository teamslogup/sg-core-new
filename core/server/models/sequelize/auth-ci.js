/**
 * Auth-ci model module.
 * @module core/server/models/sequelize/auth-ci
 */

/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var crypto = require('crypto');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');
var STD = require('../../../../bridge/metadata/standards');

module.exports = {
    fields: {
        'ci': {
            'type': Sequelize.STRING,
            'allowNull': false,
            'unique': true
        },
        'di': {
            'type': Sequelize.STRING,
            'allowNull': true,
        },
        'transactionNo': {
            'type': Sequelize.STRING,
            'allowNull': true,
        },
        'name': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'birth': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'gender': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'phoneNum': {
            'type': Sequelize.STRING,
            'allowNull': false
        }
    },
    options: {
        'charset': 'utf8',
        'paranoid': false,
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {

            // 'checkCi': function (ci, callback) {
            //
            //     sequelize.models.AuthCi.findOne({
            //         where: {
            //             ci: ci
            //         }
            //     }).then(function (data) {
            //
            //         if (data) {
            //             return true;
            //         } else {
            //             throw new errorHandler.CustomSequelizeError(404);
            //         }
            //
            //     }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
            //         if (isSuccess) {
            //             callback(204);
            //         }
            //     });
            //
            // }
        })
    }
};
