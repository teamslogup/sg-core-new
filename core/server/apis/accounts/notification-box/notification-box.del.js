var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.check('userId', '400_8').isInt();
        if (req.body.notificationId !== undefined) req.check('notificationId', '400_8').isInt();
        req.utils.common.checkError(req, res, next);
        next();
    };
};

del.destroy = function () {
    return function (req, res, next) {
        var where = {
            userId: req.body.userId
        };
        if (req.body.notificationId !== undefined) {
            where.notificationId = req.body.notificationId;
        }
        req.models.NotificationBox.destroyData(where, function (status, data) {
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
        res.hjson(req, next, 204);
    };
};

module.exports = del;
