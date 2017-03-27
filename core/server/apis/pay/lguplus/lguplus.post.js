var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var micro = require('microtime-nodejs');

post.validate = function () {
    return function (req, res, next) {

        var USER = req.meta.std.user;

        req.check('LGD_AMOUNT', '400_5').isInt();
        req.check('LGD_BUYER', '400_51').len(USER.minNickLength, USER.maxNickLength);
        req.check('LGD_PRODUCTINFO', '400_51').len(1, 1000);

        if (req.body.LGD_BUYEREMAIL !== undefined) {
            req.check('LGD_BUYEREMAIL', '400_1').isEmail();
        }

        req.check('LGD_CUSTOM_USABLEPAY', '400_8').len(6, 6);

        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var LGUPLUS = req.meta.std.pay.lguplus;

        var body = req.body;
        body.status = LGUPLUS.statusWait;

        var timestamp = micro.now();
        body.LGD_OID = 'sg' + timestamp;
        body.LGD_TIMESTAMP = timestamp;

        var instance = req.models.Lguplus.build(body);
        instance.create(function (status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.instance);
    };
};

module.exports = post;
