var META = require('../../../bridge/metadata');
var sequelize = require('../config/sequelize');
var coreUtils = require('../utils');

module.exports = function (callback) {
    coreUtils.notification.init(function () {
        callback();
    });
};