var top = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

top.hasAuthorization = function () {
    return function (req, res, next) {
        if (req.user.role >= req.meta.std.user.roleAdmin) {
            return next();
        }

        if (req.user.id == req.body.userId) {
            return next();
        } else {
            res.hjson(req, next, 403);
        }

    };
};

module.exports = top;