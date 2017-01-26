var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var MOBILE = req.meta.std.mobile;

        req.check('type', '400_3').isEnum(MOBILE.enumOsType);
        req.check('version', '400_3').len(MOBILE.minVersionLength, MOBILE.maxVersionLength);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.setParams = function () {
    return function (req, res, next) {

        var body = req.body;
        var instance = req.models.MobileVersion.build(body);
        instance.create(function (status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    }
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.instance);
    };
};

module.exports = post;
