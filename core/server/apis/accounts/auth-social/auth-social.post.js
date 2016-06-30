var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var passport = require('passport');

post.validate = function () {
    return function (req, res, next) {
        const USER = req.meta.std.user;
        req.check('id', '400_8').len(1, 200);
        req.check('provider', '400_3').isEnum(USER.enumProviders);
        req.check('accessToken', '400_8').len(1, 1000);
        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.createProvider = function () {
    return function (req, res, next) {
        req.provider = {};
        var USER = req.meta.std.user;
        var body = req.body;
        if (body.provider == USER.providerFacebook) {
            req.models.Provider.updateFacebookToken(req.user.id, body.id, body.accessToken, function (status, data) {
                if (status == 200) {
                    req.provider = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        } else {
            next();
        }
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.provider);
    };
};

module.exports = post;
