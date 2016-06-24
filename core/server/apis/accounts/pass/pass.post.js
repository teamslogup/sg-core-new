var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        req.check('newPass', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);

        // 이메일이 없는 경우는 불가능함.
        if (!req.user.email) {
            return res.hjson(req, next, 403);
        }
        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.changePassword = function () {
    return function (req, res, next) {
        var user = req.user;
        user.changePassword(null, req.body.newPass, function(status, data) {
            if (status == 200) {
                req.user = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = post;
