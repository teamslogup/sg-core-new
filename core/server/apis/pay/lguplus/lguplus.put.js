var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {

        var LGUPLUS = req.meta.std.lguplus;

        req.check('LGD_OID', '400_51').len(1, 1000);

        if (req.body.LGD_CARDACQUIRER !== undefined) {
            req.check('LGD_CARDACQUIRER', '400_51').isInt();
        }
        if (req.body.LGD_IFOS !== undefined) {
            req.check('LGD_IFOS', '400_51').len(1, 1000);
        }
        if (req.body.LGD_MID !== undefined) {
            req.check('LGD_MID', '400_51').len(1, 1000);
        }
        if (req.body.LGD_FINANCENAME !== undefined) {
            req.check('LGD_FINANCENAME', '400_51').len(1, 1000);
        }
        if (req.body.LGD_PCANCELFLAG !== undefined) {
            req.check('LGD_PCANCELFLAG', '400_20').isBoolean();
            req.sanitize('LGD_PCANCELFLAG').toBoolean();
        }
        if (req.body.LGD_FINANCEAUTHNUM !== undefined) {
            req.check('LGD_FINANCEAUTHNUM', '400_51').len(1, 1000);
        }
        if (req.body.LGD_DELIVERYINFO !== undefined) {
            req.check('LGD_DELIVERYINFO', '400_51').len(1, 1000);
        }
        if (req.body.LGD_AFFILIATECODE !== undefined) {
            req.check('LGD_AFFILIATECODE', '400_51').len(1, 1000);
        }
        if (req.body.LGD_TRANSAMOUNT !== undefined) {
            req.check('LGD_TRANSAMOUNT', '400_51').len(1, 1000);
        }
        if (req.body.LGD_BUYERID !== undefined) {
            req.check('LGD_BUYERID', '400_51').len(1, 1000);
        }
        if (req.body.LGD_CARDNUM !== undefined) {
            req.check('LGD_CARDNUM', '400_51').len(1, 1000);
        }
        if (req.body.LGD_RECEIVERPHONE !== undefined) {
            req.check('LGD_RECEIVERPHONE', '400_51').len(1, 1000);
        }
        if (req.body['2TR_FLAG'] !== undefined) {
            req.check('2TR_FLAG', '400_20').isBoolean();
            req.sanitize('2TR_FLAG').toBoolean();
        }
        if (req.body.LGD_DEVICE !== undefined) {
            req.check('LGD_DEVICE', '400_51').len(1, 1000);
        }
        if (req.body.LGD_TID !== undefined) {
            req.check('LGD_TID', '400_51').len(1, 1000);
        }
        if (req.body.LGD_FINANCECODE !== undefined) {
            req.check('LGD_FINANCECODE', '400_51').len(1, 1000);
        }
        if (req.body.LGD_CARDNOINTYN !== undefined) {
            req.check('LGD_CARDNOINTYN', '400_20').isBoolean();
            req.sanitize('LGD_CARDNOINTYN').toBoolean();
        }
        if (req.body.LGD_PCANCELSTR !== undefined) {
            req.check('LGD_PCANCELSTR', '400_51').len(1, 1000);
        }
        if (req.body.LGD_IDPKEY !== undefined) {
            req.check('LGD_IDPKEY', '400_51').len(1, 1000);
        }
        if (req.body.LGD_BUYERPHONE !== undefined) {
            req.check('LGD_BUYERPHONE', '400_51').len(1, 1000);
        }
        if (req.body.LGD_ESCROWYN !== undefined) {
            req.check('LGD_ESCROWYN', '400_51').len(1, 1000);
        }
        if (req.body.LGD_PAYTYPE !== undefined) {
            req.check('LGD_PAYTYPE', '400_51').len(1, 1000);
        }
        if (req.body.LGD_VANCODE !== undefined) {
            req.check('LGD_VANCODE', '400_51').len(1, 1000);
        }
        if (req.body.LGD_EXCHANGERATE !== undefined) {
            req.check('LGD_EXCHANGERATE', '400_51').len(1, 1000);
        }
        if (req.body.LGD_BUYERSSN !== undefined) {
            req.check('LGD_BUYERSSN', '400_51').len(1, 1000);
        }
        if (req.body.LGD_CARDINSTALLMONTH !== undefined) {
            req.check('LGD_CARDINSTALLMONTH', '400_51').len(1, 1000);
        }
        if (req.body.LGD_PAYDATE !== undefined) {
            req.check('LGD_PAYDATE', '400_51').len(1, 1000);
        }
        if (req.body.LGD_PRODUCTCODE !== undefined) {
            req.check('LGD_PRODUCTCODE', '400_51').len(1, 1000);
        }
        if (req.body.LGD_HASHDATA !== undefined) {
            req.check('LGD_HASHDATA', '400_51').len(1, 1000);
        }
        if (req.body.LGD_CARDGUBUN1 !== undefined) {
            req.check('LGD_CARDGUBUN1', '400_51').len(1, 1000);
        }
        if (req.body.LGD_CARDGUBUN2 !== undefined) {
            req.check('LGD_CARDGUBUN2', '400_51').len(1, 1000);
        }
        if (req.body.LGD_BUYERADDRESS !== undefined) {
            req.check('LGD_BUYERADDRESS', '400_51').len(1, 1000);
        }
        if (req.body.LGD_RECEIVER !== undefined) {
            req.check('LGD_RECEIVER', '400_51').len(1, 1000);
        }
        if (req.body.LGD_RESPCODE !== undefined) {
            req.check('LGD_RESPCODE', '400_51').len(1, 1000);
        }
        if (req.body.LGD_RESPMSG !== undefined) {
            req.check('LGD_RESPCODE', '400_51').len(1, 1000);
        }

        req.utils.common.checkError(req, res, next);
    };
};

put.finishPay = function () {
    return function (req, res, next) {
        var LGUPLUS = req.meta.std.lguplus;

        var update = req.body;
        update.status = LGUPLUS.statusFinish;

        req.models.Lguplus.finishPay(req.body.LGD_OID, update, function (status, data) {
            if (status == 200) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = put;
