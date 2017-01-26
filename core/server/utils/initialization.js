var STD = require('../../../bridge/metadata/standards');
var sequelize = require('../../../core/server/config/sequelize');
var errorHandler = require('sg-sequelize-error-handler');

module.exports = {
    initialize: function (callback) {
        if (STD.flag.isUseRedis) {
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
        } else {
            callback(204);
        }
    }
};