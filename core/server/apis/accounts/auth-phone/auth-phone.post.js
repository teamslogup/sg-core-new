var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var passport = require('passport');
var errorHandler = require('sg-sequelize-error-handler');

post.validate = function () {
    return function (req, res, next) {
        const SMS = req.meta.std.sms;
        const USER = req.meta.std.user;
        req.check('type', '400_3').isEnum([USER.authPhoneAdding, USER.authPhoneFindPass, USER.authPhoneFindId]);
        req.check('token', '400_13').len(SMS.authNumLength, SMS.authNumLength);
        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.checkAuth = function () {
    return function (req, res, next) {

        var USER = req.meta.std.user;
        req.loadedAuth = null;
        var where = {
            type: req.body.type
        };
        if (req.body.type == USER.authPhoneAdding) {
            where.userId = req.user.id;
        } else {
            where.token = req.body.token;
        }

        req.authWhere = where;
        req.models.Auth.findOne({
            where: where
        }).then(function (auth) {
            req.loadedAuth = auth;
        }).catch(req.sequeCatch(req, res, next)).done(function () {
            if (!req.loadedAuth) return res.hjson(req, next, 404);
            else {
                if (req.loadedAuth.token == req.body.token && req.loadedAuth.expiredAt >= new Date()) {
                    next();
                } else {
                    if (req.loadedAuth.expiredAt < new Date()) {
                        return res.hjson(req, next, 403, {code: '403_4'});
                    } else {
                        return res.hjson(req, next, 403, {code: '403_2'});
                    }
                }
            }
        });
    };
};

post.updateUser = function () {
    return function (req, res, next) {

        var USER = req.meta.std.user;
        if (req.body.type == USER.authPhoneAdding) {
            req.user.addPhoneNumber(req.loadedAuth, function (status, data) {
                if (status == 200) {
                    req.user = data;
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }
            });
        } else if (req.body.type == USER.authPhoneFindId || req.body.type == USER.authPhoneFindPass) {
            req.models.User.findUserByPhoneNumber(req.loadedAuth.key, function (status, data) {
                if (status == 200 && data.aid) {
                    req.user = data;
                    next();
                } else {
                    res.hjson(req, next, 404);
                }
            });
        }
    };
};

post.updateNewPass = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        if (req.body.type == USER.authPhoneFindPass) {
            var t = false;
            req.newPass = req.user.createRandomPassword();

            req.user.updateAttributes({
                secret: req.user.createHashPassword(req.newPass)
            }).then(function (user) {
                t = true;
                req.user = user;
            }).catch(errorHandler.catchCallback(function (status, data) {
                return res.hjson(req, next, status, data);
            })).done(function () {
                if (t == true) {
                    next();
                }
            });
        } else {
            next();
        }
    }
};

post.sendPassword = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        if (req.body.type == USER.authPhoneFindPass) {
            req.coreUtils.notification.sms.newPass(req, req.user.phoneNum, req.newPass, function (status, data) {
            });
            next();
        } else {
            next();
        }
    };
};

post.removeAuth = function () {
    return function (req, res, next) {
        req.loadedAuth.delete(function (status, data) {
            next();
        });
    }
};

post.supplement = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        if (process.env.NODE_ENV == "test") {
            if (req.body.type == USER.authPhoneFindId) {
                return res.hjson(req, next, 200, {aid: req.user.aid});
            }
            else if (req.body.type == USER.authPhoneFindPass) {
                return res.hjson(req, next, 200, req.newPass);
            } else {
                return res.hjson(req, next, 200, req.user.toSecuredJSON());
            }
        } else {
            if (req.body.type == USER.authPhoneFindId) {
                return res.hjson(req, next, 200, {aid: req.user.aid});
            } else {
                return res.hjson(req, next, 204);
            }
        }
    };
};

module.exports = post;
