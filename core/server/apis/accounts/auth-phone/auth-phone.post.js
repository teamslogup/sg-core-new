var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var passport = require('passport');
var errorHandler = require('sg-sequelize-error-handler');

post.validate = function () {
    return function (req, res, next) {
        const SMS = req.meta.std.sms;
        const USER = req.meta.std.user;
        req.check('type', '400_3').isEnum([USER.authPhoneAdding, USER.authPhoneFindPass]);
        req.check('token', '400_13').len(SMS.authNumLength, SMS.authNumLength);
        req.utils.common.checkError(req, res, next);
        if (!req.isAuthenticated() && req.body.type == USER.authEmailAdding) {
            return res.hjson(req, next, 403);
        }
        next();
    };
};

post.getUser = function () {
    return function (req, res, next) {

        var USER = req.meta.std.user;
        req.loadedAuth = null;
        var where = {};
        if (req.body.type == USER.authPhoneAdding) {
            where = {
                userId: req.user.id,
                type: req.body.type
            }
        } else {
            where = {
                token: req.body.token,
                type: req.body.type
            };
        }

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
        } else {
            var loadedUser = null;
            req.newPass = req.user.createHashPassword(req.user.createRandomPassword());

            req.sequelize.models.transaction(function(t) {
                return req.user.updateAttributes({
                    secret: req.newPass
                }, {
                    transaction: t
                }).then(function (user) {
                    if (user) {
                        loadedUser = user;
                    } else {
                        loadedUser = null;
                        return res.hjson(req, next, 404);
                    }
                }).catch(errorHandler.catchCallback(function(status, data) {
                    return res.hjson(req, next, status, data);
                })).done(function () {
                    if (loadedUser) {
                        next();
                    }
                });
            });
        }
    };
};

post.sendPassword = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        if (req.body.type == USER.authPhoneFindPass) {
            req.coreUtils.notification.sms.newPass(req, req.body.phoneNum, req.newPass, function (err) {
                if (err) {}
            });
            next();
        } else {
            next();
        }
    };
};

post.supplement = function () {
    return function (req, res, next) {
        if (process.env.NODE_ENV == "test") {
            return res.hjson(req, next, 200, req.newPass);
        }
        res.hjson(req, next, 204);
    };
};

module.exports = post;
