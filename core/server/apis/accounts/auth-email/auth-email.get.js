var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('token', '400_17').len(1, 2000);
        req.query.token = decodeURIComponent(req.query.token);
        req.utils.common.checkError(req, res, next);
        next();
    };
};

get.consent = function () {
    return function (req, res, next) {
        if (!req.isAuthenticated()) {

            if (process.env.NODE_ENV == 'test') {
                return res.hjson(req, next, 401);
            }

            res.status(401);
            return res.render('verification-error', {
                params: {
                    language: req.language,
                    meta: req.meta,
                    text: req.coreUtils.common.errorTranslator({code: '401'})
                }
            });
        }

        req.user.verifyEmail(req.query.token, function (status, body) {
            if (status == 200) return next();

            res.status(status);
            req.logout();

            var text = '';
            var err = {};

            if (status == 404) {
                // 해당 토큰이 존재하지 않음.
                err = {code: '404_5'};
            } else if (status == 400) {
                // 이미 인증되었음.
                err = {code: '400_33'};
            } else if (status == 403) {
                // 만기되었거나 잘못된 인증정보.
                err = {code: '403_4'};
            } else {
                err = body;
            }

            if (process.env.NODE_ENV == 'test') {
                return res.hjson(req, next, status, err);
            }

            text = req.coreUtils.common.errorTranslator(err);

            return res.render('verification-error', {
                params: {
                    language: req.language,
                    meta: req.meta,
                    text: text
                }
            });
        });
    };
};

get.supplement = function () {
    return function (req, res, next) {
        if (process.env.NODE_ENV == 'test') {
            return res.hjson(req, next, 200, req.user);
        }

        res.redirect('/');
    };
};

module.exports = get;
