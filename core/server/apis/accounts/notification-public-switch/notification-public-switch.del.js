var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {

        var NOTIFICATION = req.meta.std.notification;

        req.check('notificationType', '400_28').isEnum(NOTIFICATION.enumNotificationTypes);
        req.check('sendType', '400_28').isEnum(NOTIFICATION.enumSendTypes);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

del.deleteNotificationSwitch = function () {
    return function (req, res, next) {

        req.models.NotificationPublicSwitch.deleteNotificationPublicSwitch(req.user.id, req.body.notificationType, req.body.sendType, function (status, data) {

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
