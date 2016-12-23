var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {

        req.check('userId', '400_12').isInt();
        req.check('notificationSendTypeId', '400_12').isInt();
        req.check('switch', '400_20').isBoolean();
        req.sanitize('switch').toBoolean();

        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.updateReport = function () {
    return function (req, res, next) {

        if (req.body.switch) {

            req.models.NotificationSwitch.deleteNotificationSwitch(req.body.userId, req.body.notificationSendTypeId, function (status, data) {

                if (status == 204) {
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }

            });

        } else {

            var body = {
                userId: req.body.userId,
                notificationSendTypeId: req.body.notificationSendTypeId
            };

            var instance = req.models.NotificationSwitch.build(body);
            instance.create(function (status, data) {
                if (status == 200) {
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
