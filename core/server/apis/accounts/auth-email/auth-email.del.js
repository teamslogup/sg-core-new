var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        if (req.user.id.toString() == req.params.id.toString() || req.user.role >= req.meta.std.user.roleAdmin) {
            return next();
        } else {
            res.hjson(req, next, 403);
        }
        req.utils.common.checkError(req, res, next);
        next();
    };
};

del.removeEmail = function () {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user.email) {
            req.user.updateFields({
                email: null,
                isVerifiedEmail: req.meta.std.flag.isAutoVerifiedEmail
            }, function (status, data) {
                if (status == 200) {
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        } else {
            res.hjson(req, next, 403);
        }
    };
};

del.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = del;
