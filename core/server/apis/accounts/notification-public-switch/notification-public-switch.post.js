var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        var NOTIFICATION = req.meta.std.notification;

        req.check('notificationType', '400_28').isEnum(NOTIFICATION.enumNotificationTypes);
        req.check('sendType', '400_28').isEnum(NOTIFICATION.enumSendTypes);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.createNotificationSwitch = function () {
    return function (req, res, next) {

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
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.instance);
    };
};

module.exports = post;
