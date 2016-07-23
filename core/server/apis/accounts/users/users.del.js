var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_17').isInt();
        req.utils.common.checkError(req, res, next);
        next();
    };
};

del.destroyUser = function () {
    return function (req, res, next) {
        req.models.User.destroyUser(req.params.id, function (status, data) {
            if (status == 204) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

del.supplement = function () {
    return function (req, res, next) {
        req.logout();
        res.hjson(req, next, 204);
    };
};

module.exports = del;