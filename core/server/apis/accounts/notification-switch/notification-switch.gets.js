var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');

gets.validate = function () {
    return function (req, res, next) {
        var NOTIFICATION = req.meta.std.notification;

        req.check('sendType', '400_28').isEnum(NOTIFICATION.enumSendTypes);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

// gets.getNotification = function () {
//     return function (req, res, next) {
//
//         var where = {
//             type: req.meta.std.notification.formApplication
//         };
//
//         req.models.Notification.findAllDataForQuery({
//             where: where
//         }, function (status, data) {
//             req.notification = data;
//             next();
//         });
//     };
// };
//
// gets.getUserNotification = function () {
//     return function (req, res, next) {
//
//         var where = {
//             userId: req.loadedUser.id
//         };
//
//         req.models.UserNotification.findAllDataForQuery({
//             where: where,
//             include: [
//                 {
//                     model: req.models.Notification,
//                     as: 'notification'
//                 }
//             ]
//         }, function (status, data) {
//             req.userNotification = data;
//             next();
//         });
//     };
// };
//
// gets.getUserPublicNotification = function () {
//     return function (req, res, next) {
//
//         var where = {
//             userId: req.loadedUser.id
//         };
//
//         req.models.UserPublicNotification.findAllDataForQuery({
//             where: where
//         }, function (status, data) {
//             req.userPublicNotification = data;
//             next();
//         });
//     };
// };

gets.getNotificationSwitch = function () {
    return function (req, res, next) {

        var notificationSwitch = [];

        req.models.NotificationSendType.findAll({
            where: {
                sendType: req.query.sendType
            },
            include: [{
                model: req.models.NotificationSwitch,
                as: 'notificationSwitches',
                where: {
                    userId: req.user.id
                },
                required: false
            }]
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
