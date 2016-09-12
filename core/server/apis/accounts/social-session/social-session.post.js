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
        req.models.Provider.checkAndRefreshToken(req.body.provider, req.body.pid, req.body.accessToken, function(status, data) {
            if (status == 200) {
                next();
            } else {
                res.hjson(req, next, 403);
            }
        });
    };
};

post.removeAllSessions = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;

        req.loadedUser = null;
        req.providerUserProfile = {
            type: USER.signUpTypeSocial,
            uid: req.body.pid,
            provider: req.body.provider,
            secret: req.body.accessToken
        };

        req.models.Provider.findDataIncluding({
                'type': req.providerUserProfile.provider,
                'uid': req.providerUserProfile.uid
            }, [{
                model: req.models.User,
                as: 'user',
                include: [{
                    model: sequelize.models.Profile,
                    as: 'profile'
                }, {
                    model: sequelize.models.Provider,
                    as: 'providers',
                    attributes: sequelize.models.Provider.getProviderFields()
                }, {
                    model: sequelize.models.LoginHistory,
                    as: 'loginHistories',
                    attributes: sequelize.models.LoginHistory.getLoginHistoryFields()
                }]
            }],
            function (status, data) {
                if (status == 200) {
                    req.loadedUser = data.user;
                    if (req.meta.std.flag.isDuplicatedLogin) {
                        next();
                    } else {
                        req.coreUtils.session.removeAllLoginHistoriesAndSessions(req, data.user.id, function (status, data) {
                            if (status == 204 || status == 404) {
                                next();
                            }
                            else {
                                res.hjson(req, next, status, data);
                            }
                        });
                    }
                }
                else {
                    next();
                }
            }
        );
    };
};

post.logInUser = function () {
    return function (req, res, next) {
        req.models.User.checkAccountForProvider(req, req.loadedUser, req.providerUserProfile, function (status, data) {
            if (status == 200) {
                next();
            } else {
                res.hjson(req, next, 403);
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