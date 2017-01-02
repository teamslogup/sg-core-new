var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function () {
    return function (req, res, next) {
        var NOTIFICATION = req.meta.std.notification;

        req.check('userId', '400_12').isInt();
        req.check('sendType', '400_28').isEnum(NOTIFICATION.enumSendTypes);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.getNotificationSwitch = function () {
    return function (req, res, next) {

        var NOTIFICATION = req.meta.std.notification;

        var notificationPublicSwitch = [];

        req.models.NotificationPublicSwitch.findAll({
            where: {
                userId: req.query.userId,
                sendType: req.query.sendType
            },
            order: [['createdAt', 'ASC']]
        }).then(function (data) {

            for (var i = 0; i < NOTIFICATION.enumNotificationTypes.length; i++) {

                if (NOTIFICATION.enumNotificationTypes[i] == NOTIFICATION.notificationTypeApplication || NOTIFICATION.enumNotificationTypes[i] == NOTIFICATION.notificationTypeReport) {
                    break;
                }

                notificationPublicSwitch.push({
                    notificationType: NOTIFICATION.enumNotificationTypes[i],
                    sendType: req.query.sendType,
                    switch: true
                });

                for (var j = 0; j < data.length; j++) {

                    if (data[j].notificationType == NOTIFICATION.enumNotificationTypes[i]) {
                        notificationPublicSwitch[i].switch = false;
                        break;
                    }
                }

            }

            req.data = notificationPublicSwitch;
            next();

        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        var ret = {
            count: req.data.length,
            rows: req.data
        };

        res.hjson(req, next, 200, ret);
    };
};

module.exports = gets;
