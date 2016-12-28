var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {

        req.check('notificationSendTypeId', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
        next();
    };
};

del.deleteNotificationSwitch = function () {
    return function (req, res, next) {

        req.models.NotificationSwitch.deleteNotificationSwitch(req.user.id, req.body.notificationSendTypeId, function (status, data) {

            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
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
