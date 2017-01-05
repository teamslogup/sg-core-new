var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        // var USER = req.meta.std.user;
        // req.utils.common.checkError(req, res, next);

        // if (req.refinedIP != '::ffff:' + req.config.authCi.allowedIp) {
        //     return res.hjson(req, next, 403);
        // }

        next();
    };
};

post.setParams = function () {
    return function (req, res, next) {

        var body = req.body;
        var instance = req.models.AuthCi.build(body);
        instance.create(function (status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });

    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = post;
