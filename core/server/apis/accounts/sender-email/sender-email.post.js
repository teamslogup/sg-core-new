var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        var USER = req.meta.std.user;
        var type = req.body.type;

        // 이메일 연동 / 가입 인증을 할때는 반드시 로그인을 한 상태여야 한다.
        if (!req.isAuthenticated() &&
            (type == USER.emailSenderTypeAdding || type == USER.emailSenderTypeSignUp)) {
            return res.hjson(req, next, 401);
        }

        // 이메일 연동은 자동으로 승인되는 형식일때는 지원하지 않는다.
        if (type == USER.emailSenderTypeAdding && req.meta.std.flag.isAutoVerifiedEmail == true) {
            return res.hjson(req, next, 400, {
                code: '400_38'
            });
        }

        req.check('type', '400_3').isEnum(USER.enumEmailSenderTypes);
        req.check('email', '400_1').isEmail();
        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.checkAlreadySignUp = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        // 가입인증인 경우 이메일 인증이 아직 되어 있지 않아야 한다.
        // 이메일 연동의 경우에도 현재 이메일이 없어야 한다.
        if ((req.body.type == USER.emailSenderTypeSignUp && req.user.isVerifiedEmail) ||
            (req.body.type == USER.emailSenderTypeAdding && req.user.email)) {
            res.hjson(req, next, 400, {code: '400_33'});
        } else {
            next();
        }
    };
};

post.checkAndAddEmail = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        if (req.body.type == USER.emailSenderTypeAdding) {
            req.user.updateEmailAndAuth(req.body.email, function (status, data) {
                if (status == 200) {
                    req.auth = data.auth;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        }
        // 그외 (비번찾기, 가입인증) 경우 이메일로 가입된 계정이 이미 있어야한다.
        else {
            req.user.upsertAuth(req.body.email, function (status, data) {
                if (status == 200) {
                    req.user = data;
                    req.auth = data.auth;
                    next();
                } else if (status == 404) {
                    res.hjson(req, next, 404, {code: '404_10'});
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        }
    };
};

post.sendEmailAuth = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        if (req.body.type == USER.emailSenderTypeAdding) {
            req.coreUtils.notification.email.adding(req, req.auth, function (err) {
                if (err) return res.hjson(req, next, 503, err);
                next();
            });
        } else if (req.body.type == USER.emailSenderTypeFindPass) {
            req.coreUtils.notification.email.findPass(req, req.auth, function (err) {
                if (err) return res.hjson(req, next, 503, err);
                next();
            });
        } else if (req.body.type == USER.emailSenderTypeSignUp) {
            req.coreUtils.notification.email.signup(req, req.user, function (err) {
                if (err) return res.hjson(req, next, 503, err);
                next();
            });
        } else {
            return res.json(req, next, 500);
        }
    };
};

post.supplement = function () {
    return function (req, res, next) {
        if (process.env.NODE_ENV == 'test') {
            var USER = req.meta.std.user;
            var token = '';
            if ((req.body.type == USER.emailSenderTypeAdding) ||
                (req.body.type == USER.emailSenderTypeFindPass)) {
                token = req.auth.token;
            } else if (req.body.type == USER.emailSenderTypeSignUp) {
                token = req.user.auth.token;
            }
            res.hjson(req, next, 200, token);
        } else {
            res.hjson(req, next, 204);
        }
    };
};

module.exports = post;
