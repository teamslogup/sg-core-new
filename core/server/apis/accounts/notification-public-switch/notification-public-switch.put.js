var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {

        var NOTIFICATION = req.meta.std.notification;

        req.check('notificationType', '400_28').isEnum(NOTIFICATION.enumNotificationTypes);
        req.check('sendType', '400_28').isEnum(NOTIFICATION.enumSendTypes);
        req.check('switch', '400_20').isBoolean();
        req.sanitize('switch').toBoolean();

        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.updateReport = function () {
    return function (req, res, next) {

        if (req.body.switch) {

            req.models.NotificationPublicSwitch.deleteNotificationPublicSwitch(req.user.id, req.body.notificationType, req.body.sendType, function (status, data) {

                if (status == 204) {
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }

            });

        } else {

            var body = {
                userId: req.user.id,
                notificationType: req.body.notificationType,
                sendType: req.body.sendType
            };

            var instance = req.models.NotificationPublicSwitch.build(body);
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
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = put;
