var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        req.check('newPass', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);
        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.changePassword = function () {
    return function (req, res, next) {
        req.user.changePassword(req.body.newPass, function (status, data) {
            if (status == 200) {
                req.user = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
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
