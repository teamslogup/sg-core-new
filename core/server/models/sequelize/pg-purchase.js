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
var coreUtils = require('../../utils');

var micro = require('microtime-nodejs');

module.exports = {
    fields: {
        'userId': {
            'reference': 'User',
            'referenceKey': 'id',
            'as': 'user',
            'allowNull': false
        },
        'pgType': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'status': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'orderNo': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'transactionNo': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'price': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'name': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'email': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'payload': {
            'type': Sequelize.TEXT,
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
            'startPay': function (body, t) {

                var PG_PURCHASE = STD.pgPurchase;

                if (body.pgPurchase !== undefined) {

                    body.pgPurchase.status = PG_PURCHASE.statusWait;
                    body.pgPurchase.orderNo = 'sg' + micro.now();

                    return sequelize.models.PgPurchase.create(body, {
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return data;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    });

                } else {
                    throw new errorHandler.CustomSequelizeError(404);
                }

            },
            'finishPay': function (update, t) {

                var PG_PURCHASE = STD.pgPurchase;

                if (update.pgPurchase !== undefined) {
                    update.pgPurchase.status = PG_PURCHASE.statusFinish;

                    return sequelize.models.PgPurchase.update(update, {
                        where: {
                            'orderNo': update.pgPurchase.orderNo
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data[0] > 0) {
                            return true;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    });
                } else {
                    throw new errorHandler.CustomSequelizeError(404);
                }

            }
        })
    }
};