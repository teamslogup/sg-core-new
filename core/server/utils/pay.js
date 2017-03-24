var appUtils = require('../../../app/server/utils');
var errorHandler = require('sg-sequelize-error-handler');

module.exports = {
    generateOrderNumber: function () {
        var today = new Date();
        var y = today.getFullYear();
        var m = today.getMonth() + 1;
        var d = today.getDate();
        var time = today.getTime();
        if (parseInt(m) < 10) {
            m = "0" + m;
        }
        if (parseInt(m) < 10) {
            d = "0" + d;
        }
        var orderIdxx = y + "" + m + "" + d + "" + time;
        return orderIdxx;
    },
    finishPay: function (t, callback) {

        if (appUtils.pay && appUtils.pay.finishPay) {
            appUtils.pay.finishPay(t, function () {
                return true;
            });
        } else {
           return true;
        }

    }
};