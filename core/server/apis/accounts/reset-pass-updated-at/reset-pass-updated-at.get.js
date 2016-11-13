var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var micro = require('microtime-nodejs');

get.validate = function () {
    return function (req, res, next) {
        req.utils.common.checkError(req, res, next);
        next();
    };
};

get.resetPasswordUpdatedAt = function () {
    return function (req, res, next) {
        req.user.updateFields({
            passUpdatedAt: micro.now()
        }, function (status, data) {
            if (status == 200) {
                req.user = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.user.toSecuredJSON());
    };
};

module.exports = get;
