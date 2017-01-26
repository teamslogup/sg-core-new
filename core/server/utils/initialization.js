var STD = require('../../../bridge/metadata/standards');
var sequelize = require('../../../core/server/config/sequelize');
var errorHandler = require('sg-sequelize-error-handler');

module.exports = {
    initialize: function (callback) {
        sequelize.transaction(function (t) {
            if (STD.flag.isUseRedis) {
                return true;
            } else {
                console.log("initLoginHistories");
                return sequelize.models.LoginHistory.destroy({
                    where: {},
                    transaction: t
                }).then(function () {
                    var query = 'ALTER TABLE LoginHistories AUTO_INCREMENT = 1';
                    return sequelize.query(query, {
                        transaction: t
                    });
                });
            }
        }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
            if (isSuccess) {
                callback(204);
            }
        });
    }
};