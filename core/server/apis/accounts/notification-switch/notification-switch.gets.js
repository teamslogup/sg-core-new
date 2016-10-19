var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');

gets.validate = function () {
    return function (req, res, next) {

        req.check('userId', '400_17').isInt();

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.getNotification = function () {
    return function (req, res, next) {

        var where = {
            type: req.meta.std.notification.formApplication
        };

        req.models.Notification.findAllDataForQuery({
            where: where
        }, function (status, data) {
            req.notification = data;
            next();
        });
    };
};

gets.getUserNotification = function () {
    return function (req, res, next) {

        var where = {
            userId: req.loadedUser.id
        };

        req.models.UserNotification.findAllDataForQuery({
            where: where,
            include: [
                {
                    model: req.models.Notification,
                    as: 'notification'
                }
            ]
        }, function (status, data) {
            req.userNotification = data;
            next();
        });
    };
};

gets.getUserPublicNotification = function () {
    return function (req, res, next) {

        var where = {
            userId: req.loadedUser.id
        };

        req.models.UserPublicNotification.findAllDataForQuery({
            where: where
        }, function (status, data) {
            req.userPublicNotification = data;
            next();
        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        var ret = {
            notification: req.notification,
            application: req.userNotification,
            public: req.userPublicNotification
        };

        if ((!req.notification || req.notification.length == 0) &&
            (!req.userNotification || req.userNotification.length == 0) &&
            (!req.userPublicNotification || req.userPublicNotification.length == 0)) {
            res.hjson(req, next, 404);
        } else {
            res.hjson(req, next, 200, ret);
        }
    };
};

module.exports = gets;
