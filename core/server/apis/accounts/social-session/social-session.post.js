var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var passport = require('passport');

post.validate = function () {
    return function (req, res, next) {
        const USER = req.meta.std.user;
        req.check('provider', '400_3').isEnum(USER.enumProviders);
        req.check('pid', '400_8').len(1, 200);
        req.check('accessToken', '400_8').len(1, 1000);
        
        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.getUser = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        var provider = req.body.provider;

        if (provider == USER.providerFacebook) {
            req.models.Provider.checkAndRefreshFacebookToken(req.body.pid, req.body.accessToken, function(status, data) {
                if (status == 200) {
                    next();
                } else {
                    res.hjson(req, next, 403);
                }
            });
        }
        else if (provider == USER.providerTwitter) {
            next();
        }
        else if (provider == USER.providerGoogle) {
            next();
        }
        else if (provider == USER.providerKakao) {
            next();
        }
        else {
            res.hjson(req, next, 403);
        }
    };
};

post.logInUser = function () {
    return function (req, res, next) {

        var USER = req.meta.std.user;
        var provider = req.body.provider;

        if (provider == USER.providerFacebook) {
            var providerUserProfile = {
                type: USER.signUpTypeSocial,
                uid: req.body.pid,
                provider: USER.providerFacebook,
                secret: req.body.accessToken
            };
            req.models.User.checkAccountForProvider(req, providerUserProfile, function (status, data) {
                if (status == 200) {
                    next();
                } else {
                    res.hjson(req, next, 403);
                }
            });
        }
        else if (provider == USER.providerTwitter) {
            next();
        }
        else if (provider == USER.providerGoogle) {
            next();
        }
        else if (provider == USER.providerKakao) {
            next();
        }
        else {
            res.hjson(req, next, 403);
        }
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.user.toSecuredJSON());
    };
};

module.exports = post;
