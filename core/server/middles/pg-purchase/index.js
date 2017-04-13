var STD = require('../../../../bridge/metadata/standards');


var lguplus = require('./lguplus');

module.exports = function () {

    function PgPurchase() {
    }

    PgPurchase.prototype.startPay = function () {
        return function (req, res, next) {

            switch (req.body.pgType) {
                case STD.pgPurchase.pgTypeLguplus:
                    lguplus.startValidate(req, res, next);
                    break;
                default:
                     return false;
                    break;
            }

        }
    };

    PgPurchase.prototype.finishPay = function () {
        return function (req, res, next) {

            switch (req.body.pgType) {
                case STD.pgPurchase.pgTypeLguplus:
                    lguplus.finishValidate(req, res, next);
                    break;
                default:
                    return false;
                    break;
            }
        }
    };

    return new PgPurchase();
};