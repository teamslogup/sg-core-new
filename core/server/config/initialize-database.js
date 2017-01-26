var META = require('../../../bridge/metadata');
var sequelize = require('../config/sequelize');
var coreUtils = require('../utils');

module.exports = function (callback) {
    coreUtils.initialization.initialize(function (status, data) {
        if (status == 204) {

            coreUtils.initialization.initMobileVersion(function (status, data) {

                if (status == 204) {
                    return callback();
                } else {
                    console.log(status, data);
                }
            });

        } else {
            console.log(status, data);
        }
    });
};