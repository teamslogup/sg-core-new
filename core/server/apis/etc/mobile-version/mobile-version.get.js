var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        var MOBILE = req.meta.std.mobile;

        req.check('type', '400_3').isEnum(MOBILE.enumOsType);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

get.setParams = function () {
    return function (req, res, next) {
        req.models.MobileVersion.findMobileVersionByType(req.query.type, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    }
};

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = get;
