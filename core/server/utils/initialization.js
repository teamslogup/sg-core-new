var STD = require('../../../bridge/metadata/standards');
var sequelize = require('../../../core/server/config/sequelize');
var errorHandler = require('sg-sequelize-error-handler');

module.exports = {
    initialize: function (callback) {
        if (STD.flag.isUseRedis) {
            callback(204);
        } else {
            sequelize.transaction(function (t) {
                console.log("initLoginHistories");
                return sequelize.models.LoginHistory.destroy({
                    where: {},
                    transaction: t
                }).then(function () {
                    var query = 'ALTER TABLE LoginHistories AUTO_INCREMENT = 1';
                    return sequelize.query(query, {
                        transaction: t
                    }).then(function () {
                        return true;
                    });
                });
            }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                if (isSuccess) {
                    callback(204);
                }
            });
        }
    },
    initMobileVersion: function (callback) {

        sequelize.transaction(function (t) {

            return sequelize.models.MobileVersion.findOne({
                where: {
                    type: STD.mobile.osTypeAndroid
                },
                limit: 1,
                transaction: t
            }).then(function (data) {
                if (data) {
                    return true;
                } else {
                    return sequelize.models.MobileVersion.create({
                        type: STD.mobile.osTypeAndroid,
                        version: '0.0.1'
                    }, {
                        transaction: t
                    });
                }
            }).then(function () {

                return sequelize.models.MobileVersion.findOne({
                    where: {
                        type: STD.mobile.osTypeIos
                    },
                    limit: 1,
                    transaction: t
                });

            }).then(function (data) {

                if (data) {
                    return true;
                } else {
                    return sequelize.models.MobileVersion.create({
                        type: STD.mobile.osTypeIos,
                        version: '0.0.1'
                    }, {
                        transaction: t
                    });
                }
            });

        }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
            if (isSuccess) {
                callback(204);
            }
        });
    }
};