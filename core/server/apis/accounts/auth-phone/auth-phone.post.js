var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var passport = require('passport');

post.validate = function () {
    return function (req, res, next) {
        const USER = req.meta.std.user;
        const SMS = req.meta.std.sms;
        req.check('token', '400_13').len(SMS.authNumLength, SMS.authNumLength);
        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.getUser = function () {
    return function (req, res, next) {

        req.loadedAuth = null;
        var USER = req.meta.std.user;
        req.models.Auth.findOne({
            where: {
                userId: req.user.id,
                type: USER.signUpTypePhone
            }
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

post.updateUser = function() {
    return function (req, res, next) {

        req.user.addPhoneNumber(req.loadedAuth, function(status, data) {
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
        res.hjson(req, next, 200, req.user.toSecuredJSON());
    };
};

module.exports = post;
