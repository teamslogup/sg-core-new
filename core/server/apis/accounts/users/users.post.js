'use strict';

var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var path = require('path');
var request = require('request');

post.validate = function () {
    return function (req, res, next) {

        var USER = req.meta.std.user;
        var SMS = req.meta.std.sms;
        req.check('type', '400_3').isEnum(USER.enumSignUpTypes);

        var type = req.body.type;

        if (type == USER.signUpTypeEmail) {
            req.check('uid', '400_1').isEmail();
            req.check('secret', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);
        } else if (type == USER.signUpTypePhone || type == USER.signUpTypePhoneId) {
            req.check('uid', '400_3').len(5, 15);
            req.check('secret', '400_51').len(SMS.authNumLength, SMS.authNumLength);
            if (req.body.aid !== undefined && req.body.apass !== undefined) {
                req.check('aid', '400_55').isId(USER.minIdLength, USER.maxIdLength);
                req.check('apass', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);
            }
            // 둘 중에 하나만 있을 경우 필수 요청 값 에러 출력.
            if (type == USER.signUpTypePhoneId && (req.body.aid === undefined || req.body.apass === undefined)) {
                req.check('aid', '400_14').onlyError();
            }
        } else if (type == USER.signUpTypeSocial) {
            req.check('uid', '400_8').len(1, 200);
            req.check('provider', '400_3').isEnum(USER.enumProviders);
        } else if (type == USER.signUpTypeNormalId) {
            req.check('uid', '400_55').len(USER.minIdLength, USER.maxIdLength);
            req.check('secret', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);
        }

        if (req.body.name !== undefined) {
            req.check('name', '400_8').len(USER.minNameLength, USER.maxNameLength);
        }

        if (req.body.nick !== undefined) {
            req.check('nick', '40400_260_8').len(USER.minNickLength, USER.maxNickLength);
        }

        if (req.body.gender !== undefined) req.check('gender', '400_3').isEnum(USER.enumGenders);
        if (req.body.birthYear !== undefined && req.body.birthMonth !== undefined && req.body.birthDay !== undefined) {
            req.check('birthYear', '400_35').isYear();
            req.check('birthMonth', '400_36').isMonth();
            req.check('birthDay', '400_37').isDay();
            req.sanitize('birthYear').toInt();
            req.sanitize('birthMonth').toInt();
            req.sanitize('birthDay').toInt();
        }

        if (req.body.country !== undefined) {
            var enumCountry = req.coreUtils.common.getCountryEnum(req);
            req.check('country', '400_3').isEnum(enumCountry);
        }

        if (req.body.language !== undefined) {
            var enumLanguage = req.coreUtils.common.getLanguageEnum(req);
            req.check('language', '400_3').isEnum(enumLanguage);
        }

        if (req.body.agreedEmail !== undefined) {
            req.check('agreedEmail', '400_20').isBoolean();
            req.sanitize('agreedEmail').toBoolean();
        } else {
            req.body.agreedEmail = USER.defaultAgreedEmail;
        }

        if (req.body.agreedPhoneNum !== undefined) {
            req.check('agreedPhoneNum', '400_20').isBoolean();
            req.sanitize('agreedPhoneNum').toBoolean();
        } else {
            req.body.agreedPhoneNum = USER.defaultAgreedPhoneNum;
        }

        if (req.body.platform !== undefined) {
            req.check('platform', '400_8').isKeywords(["iOS", "android"], true, true);
        }

        if (req.body.device !== undefined) {
            req.check('device', '400_8').len(1, 100);
        }

        if (req.body.version !== undefined) {
            req.check('version', '400_57').isVersion();
        }

        if (req.body.token !== undefined) {
            req.check('token', '400_8').len(5, 500);
        }

        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.checkSocialProvider = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        if (req.body.type == USER.signUpTypeSocial) {
            req.models.Provider.checkAndRefreshToken(req.body.provider, req.body.uid, req.body.secret, function(status, data) {
                if (status == 200) {
                    next();
                } else {
                    res.hjson(req, next, status);
                }
            });
        } else {
            next();
        }
    };
};

post.createUser = function () {
    return function (req, res, next) {

        var birth = null;
        if (req.body.birthYear !== undefined && req.body.birthMonth !== undefined && req.body.birthDay !== undefined) {
            birth = req.utils.common.makeBirthString(req.body.birthYear, req.body.birthMonth, req.body.birthDay);
        }

        var data = {
            type: req.body.type,
            uid: req.body.uid,
            aid: req.body.aid,
            apass: req.body.apass,
            provider: req.body.provider,
            secret: req.body.secret,
            name: req.body.name,
            nick: req.body.nick || null,
            gender: req.body.gender,
            birth: birth,
            country: req.body.country || req.country,
            language: req.body.language || req.language,
            agreedEmail: req.body.agreedEmail,
            agreedPhoneNum: req.body.agreedPhoneNum
        };

        data.history = {
            platform: req.body.platform || null,
            device: req.body.device || null,
            version: req.body.version || null,
            token: req.body.token || null,
            ip: req.refinedIP,
            session: req.sessionID
        };

        req.models.User.createUserWithType(data, function (status, user) {
            if (status == 200) {
                req.createdUser = user;
                next();
            } else {
                // 핸드폰으로 가입할때 잘못된 인증번호일 경우 403을 뿌려준다.
                if (status == 403) return res.hjson(req, next, status, {code: '403_2'});
                // 인증 중인 번호가 없을때
                if (status == 404) return res.hjson(req, next, status, {code: '404_4'});
                // data필드의 값을 잘못넣었을경우 (서버에서 잘못처리함, 단위테스트시 이용)
                if (status == 400) return res.hjson(req, next, status, {code: '400_14'});

                req.utils.common.refineError(user, 'nick', '409_3');
                req.utils.common.refineError(user, 'uid', '409_2');
                return res.hjson(req, next, status, user);
            }
        });
    };
};

post.sendEmailAuth = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        var FLAG = req.meta.std.flag;

        if (req.body.type == USER.signUpTypeEmail && !FLAG.isAutoVerifiedEmail) {
            req.coreUtils.notification.email.signup(req, req.createdUser, function (err) {
                // if (err) return res.hjson(req, next, 503, err);
                next();
            });
        }
        else {
            next();
        }
    };
};

post.supplement = function () {
    return function (req, res, next) {
        req.login(req.createdUser, function (err) {

            var bSearched = false;
            if (err) {
                for (var k in err) {
                    bSearched = true;
                    break;
                }
            }

            if (err && bSearched) {
                logger.e(err);
                res.hjson(req, next, 500, err);
            } else {
                if (process.env.NODE_ENV == 'test') {
                    var user = req.createdUser.toSecuredJSON();
                    if (req.createdUser.auth) {
                        user.auth = req.createdUser.auth.dataValues;
                    }
                    return res.hjson(req, next, 201, user);
                }
                res.hjson(req, next, 201, req.createdUser.toSecuredJSON());
            }
        });
    };
};

module.exports = post;
