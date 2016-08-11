var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var passport = require('passport');

post.validate = function () {
    return function (req, res, next) {
        const USER = req.meta.std.user;
        const SMS = req.meta.std.sms;
        req.check('type', '400_3').isEnum([USER.signUpTypeEmail, USER.signUpTypePhone, USER.signUpTypePhoneId, USER.signUpTypeNormalId]);

        if (req.body.type == USER.signUpTypeEmail) {
            req.check('uid', '400_1').isEmail();
            req.check('secret', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);
        } else if (req.body.type == USER.signUpTypePhone) {
            req.check('uid', '400_3').len(5, 15);
            var min = '', max = '';
            for (var i = 0; i < SMS.authNumLength; ++i) {
                min += '1';
                max += '9';
            }
            req.check('secret', '400_2').isInt({min: Number(min), max: Number(max)});
        } else if (req.body.type == USER.signUpTypePhone || req.body.type == USER.signUpTypeNormalId) {
            // req.check('uid', '400_55').isId(USER.minIdLength, USER.maxIdLength);
            req.check('secret', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);
        }
        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.getUser = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;

        // 이메일을 통한 로그인일 경우.
        if (req.body.type == USER.signUpTypeEmail ||
            req.body.type == USER.signUpTypePhoneId ||
            req.body.type == USER.signUpTypeNormalId) {

            // body의 aid or email, secret 필드를 통해서 인증을 시도한다.
            req.body.aid = req.body.uid;
            passport.authenticate('local', function (err, user) {
                if (err) {
                    if (err.status && err.code) {
                        return res.hjson(req, next, err.status, {
                            code: err.code
                        });
                    } else {
                        return res.hjson(req, next, 500);
                    }
                }
                req.loadedUser = user;
                next();
            })(req, res);
        }
        // 전화번호로 로그인을 시도하는 경우. uid는 핸드폰번호가 되고, secret은 sender-phone으로 발급받은 인증번호가 된다.
        else {
            // 1. 토큰이 유효한지 체크
            req.models.Auth.checkValidToken(USER.authPhoneLogin, {key: req.body.uid}, req.body.secret, function (status, auth) {

                if (status == 403) {
                    res.hjson(req, next, 403, {code: '403_4'});
                } else if (status == 404) {
                    res.hjson(req, next, 404, {code: '404_4'});
                } else if (status == 200) {

                    // 2. 유효한 토큰이라면 유저정보를 얻어옴.
                    req.models.User.findUserByPhoneNumber(req.body.uid, function (status, data) {
                        if (status == 200) {
                            req.loadedUser = data;

                            // 3. 토큰은 이제 필요 없기 때문에 제거.
                            auth.destroy().then(function () {
                                if (req.loadedUser) {
                                    next();
                                } else {
                                    res.hjson(req, next, 500);
                                }
                            });

                        } else {
                            res.hjson(req, next, status, data);
                        }
                    });
                } else {
                    res.hjson(req, next, 500);
                }
            });
        }
    };
};

post.removeAllSessions = function () {
    return function (req, res, next) {
        if (req.meta.std.flag.isDuplicatedLogin) {
            next();
        } else {
            req.coreUtils.session.removeAllLoginHistoriesAndSessions(req, req.loadedUser.id, function (status, data) {
                if (status == 204 || status == 404) {
                    next();
                }
                else {
                    res.hjson(req, next, status, data);
                }
            });
        }
    };
};

post.logInUser = function () {
    return function (req, res, next) {

        var data = {
            'platform': req.body.platform,
            'device': req.body.device,
            'version': req.body.version,
            'token': req.body.token,
            'ip': req.refinedIP,
            'session': req.sessionID
        };
        req.models.LoginHistory.createLoginHistory(req.loadedUser.id, data, function (status, data) {
            if (status == 200) {
                req.login(req.loadedUser, function (err) {
                    if (err) {
                        var bSearched = false;
                        for (var k in err) {
                            bSearched = true;
                        }
                        if (bSearched) {
                            return res.hjson(req, next, 400);
                        }
                    }
                    next();
                });
            }
            else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.user.toSecuredJSON());
    };
};

module.exports = post;
