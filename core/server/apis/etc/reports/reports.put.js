var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var micro = require('microtime-nodejs');

put.validate = function () {
    return function (req, res, next) {
        var REPORT = req.meta.std.report;
        var MAGIC = req.meta.std.magic;
        req.check('id', '400_12').isInt();

        if (req.body.body !== undefined) req.check('body', '400_8').len(REPORT.minBodyLength, REPORT.maxBodyLength);
        if (req.body.reply !== undefined && req.body.reply !== MAGIC.reset) req.check('reply', '400_8').len(REPORT.minReplyLength, REPORT.maxReplyLength);
        if (req.body.isSolved !== undefined) {
            req.check('isSolved', '400_20').isBoolean();
            req.sanitize('isSolved').toBoolean();
        }

        if (req.body.isPushOn !== undefined) {
            req.check('isPushOn', '400_20').isBoolean();
            req.sanitize('isPushOn').toBoolean();
        }

        if (req.body.isEmailOn !== undefined) {
            req.check('isEmailOn', '400_20').isBoolean();
            req.sanitize('isEmailOn').toBoolean();
        }

        if (req.body.isMessageOn !== undefined) {
            req.check('isMessageOn', '400_20').isBoolean();
            req.sanitize('isMessageOn').toBoolean();
        }

        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.updateReport = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;
        var update = {};
        if (req.body.body !== undefined) update.body = req.body.body;
        if (req.body.reply !== undefined) update.reply = req.body.reply;
        if (req.body.isSolved !== undefined) update.solvedAt = req.body.isSolved ? micro.now() : null;
        if (update.reply == MAGIC.reset) update.reply = null;

        req.report.updateFields(update, function (status, data) {
            if (status == 200) {
                req.report = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.sendNotifications = function () {
    return function (req, res, next) {

        var NOTIFICATION = req.meta.std.notification;
        var notificationReport = req.meta.notifications.report;

        if (req.body.isSolved !== undefined && req.body.isSolved == true && req.body.reply !== undefined && req.report.authorId != null) {

            var user;

            req.models.User.findUserNotificationInfo(req.report.authorId, function (status, data) {
                if (status == 200) {
                    user = data;

                    for (var key in notificationReport.sendTypes) {

                        var sendType = notificationReport.sendTypes[key];

                        if (key == NOTIFICATION.sendTypeEmail) {
                            if (!req.body.isEmailOn) {
                                continue;
                            }
                        }

                        if (key == NOTIFICATION.sendTypePush) {
                            if (!req.body.isPushOn) {
                                continue;
                            }
                        }

                        if (key == NOTIFICATION.sendTypeMessage) {
                            if (!req.body.isMessageOn) {
                                continue;
                            }
                        }

                        if (req.coreUtils.notification.all.isNotificationSwitchOn(user, key)) {

                            req.coreUtils.notification.all.replaceMagicKey(sendType, {
                                userId: req.report.userId,
                                nick: req.report.nick,
                                body: req.report.body,
                                reply: req.report.reply
                            }, user.language, function (isSuccess, title, body) {

                                if (isSuccess) {
                                    req.coreUtils.notification.all.send(user, key, title, body, function (status, data) {
                                        console.log('reportNoti', status);
                                    });
                                }

                            });
                        }
                    }
                }

            });
        }

        next();

    }

};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.report);
    };
};

module.exports = put;
