var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        req.check('newPass', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);
        req.check('type', '400_2').isEnum(USER.enumLinkIdPassTypes);
        req.check('token', '400_2').len(1, 2000);

        if (req.body.email !== undefined) {
            req.check('email', '400_1').isEmail();
        }

        // 이메일로 비번을 찾을려는 경우 반드시 이메일이 필요하다.
        if (req.body.type == USER.linkIdPassEmail && req.body.email === undefined) {
            return res.hjson(req, next, 400, {
                code: '400_14'
            });
        }

        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.checkToken = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;

        // 이메일 token값을 갖고 비번을 초기화 하는 경우.
        if (req.body.type == USER.linkIdPassEmail) {
            req.models.Auth.findDataIncluding({
                type: USER.authEmailFindPass,
                key: req.body.email,
                token: req.body.token
            }, null, function(status, data) {
                if (status == 200) {
                    var now = new Date();
                    if (data.expiredAt < now || data.token.toString() != req.body.token.toString()) {
                        data.delete(function(status, data){});
                        return res.hjson(req, next, 403);
                    }
                    req.loadedAuth = data;
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        }
        // 일반 비번 변경인 경우
        else {
            // 일반 비번 변경의 경우 반드시 로그인이 되어 있어야 한다.
            if (!req.isAuthenticated()) {
                return res.hjson(req, next, 403);
            } else {
                if (req.user.authenticate(req.body.token)) {
                    next();
                } else {
                    return res.hjson(req, next, 403);
                }
            }
        }
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

put.removeAuth = function() {
    return function (req, res, next) {
        req.loadedAuth.delete(function(status, data){
            next();
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = put;
