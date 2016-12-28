var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');
var NOTIFICATIONS = require('../../../../../bridge/metadata/notifications');

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

        var notificationSwitch = [];

        req.models.NotificationSendType.findAll({
            where: {
                sendType: req.query.sendType
            },
            include: [{
                model: req.models.Notification,
                as: 'notification',
                where: {
                    notificationType: req.meta.std.notification.notificationTypeApplication
                }
            },{
                model: req.models.NotificationSwitch,
                as: 'notificationSwitches',
                where: {
                    userId: req.query.userId
                },
                required: false
            }],
            order: [['notificationId', 'ASC']]
        }).then(function (data) {

            for (var i = 0; i < data.length; i++) {

                if (data[i].notificationSwitches.length > 0) {
                    notificationSwitch.push({
                        title: data[i].title,
                        notificationSendTypeId: data[i].id,
                        switch: false
                    });
                } else {
                    notificationSwitch.push({
                        title: data[i].title,
                        notificationSendTypeId: data[i].id,
                        switch: true
                    });
                }

            }

            req.data = notificationSwitch;
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
