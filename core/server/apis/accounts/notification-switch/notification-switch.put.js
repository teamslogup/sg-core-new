var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {

        req.check('userId', '400_12').isInt();
        req.check('notificationId', '400_12').isInt();

        req.check('switch', '400_20').isBoolean();
        req.sanitize('switch').toBoolean();

        req.check('type', '400_3').isEnum(req.meta.std.notification.enumForms);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.updateReport = function () {
    return function (req, res, next) {

        var NOTIFICATION = req.meta.std.notification;
        if (req.body.type == NOTIFICATION.formApplication) {
            req.models.UserNotification.upsertData({
                userId: req.body.userId,
                notificationId: req.body.notificationId,
                switch: req.body.switch
            }, {
                userId: req.body.userId,
                notificationId: req.body.notificationId
            }, function (status, data) {
                if (status == 200) {
                    req.data = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        } else {
            req.models.UserPublicNotification.upsertData({
                userId: req.body.userId,
                type: req.body.type,
                switch: req.body.switch
            }, {
                userId: req.body.userId,
                type: req.body.type,
            }, function (status, data) {
                if (status == 200) {
                    req.data = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        }
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = put;
