var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.utils.common.checkError(req, res, next);

        if (!req.user.email) {
            return res.hjson(req, next, 400, {
                code: '400_50'
            });
        }

        next();
    };
};

del.removePhone = function () {
    return function (req, res, next) {
        req.user.removePhoneNumber(function(status, data) {
            if (status == 200) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

del.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = del;
