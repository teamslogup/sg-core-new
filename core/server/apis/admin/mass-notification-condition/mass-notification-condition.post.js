var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var async = require('async');
var sequelize = require('../../../../../core/server/config/sequelize');


post.validate = function () {
    return function (req, res, next) {
        var NOTIFICATION = req.meta.std.notification;
        var USER = req.meta.std.user;

        req.check("sendType", "400_3").isEnum(NOTIFICATION.enumSendTypes);

        if (req.body.gender !== undefined) {
            req.check("gender", "400_3").isEnum(USER.enumGenders);
        }

        if (req.body.minBirthYear !== undefined) {
            req.check("minBirthYear", "400_35").isYear();
        }

        if (req.body.maxBirthYear !== undefined) {
            req.check("maxBirthYear", "400_35").isYear();
        }

        if (req.body.platform !== undefined) {
            req.check("platform", "400_3").isEnum(USER.enumPhones);
        }

        req.check("notificationName", "400_51").len(NOTIFICATION.minTitleLength, NOTIFICATION.maxTitleLength);

        if (req.body.messageTitle !== undefined) {
            req.check("messageTitle", "400_51").len(NOTIFICATION.minTitleLength, NOTIFICATION.maxTitleLength);
        }

        if (req.body.sendType == NOTIFICATION.sendTypePush) {
            req.check("messageBody", "400_51").len(NOTIFICATION.minPushBodyLength, NOTIFICATION.maxPushBodyLength);
        } else {
            req.check("messageBody", "400_51").len(NOTIFICATION.minBodyLength, NOTIFICATION.maxBodyLength);
        }

        req.utils.common.checkError(req, res, next);
    };
};

post.createMassNotification = function () {
    return function (req, res, next) {

        var massNotification = {
            authorId: req.user.id,
            key: 'notice',
            sendType: req.body.sendType,
            notificationName: req.body.notificationName,
            messageBody: req.body.messageBody
        };

        if (req.body.messageTitle !== undefined) {
            massNotification.messageTitle = req.body.messageTitle;
        }

        req.models.MassNotification.createMassNotification(massNotification, function (status, data) {
            if (status == 201) {
                req.massNotification = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.setImage = function () {
    return function (req, res, next) {

        if (req.files.length > 0) {
            req.image = req.files[0];
        }

        next();

    }
};

post.sendMassNotification = function () {
    return function (req, res, next) {
        var STD = req.meta.std;
        var notificationNotice = req.meta.notifications.public.notice;

        var query = {
            where: {},
            order: [[STD.common.id, STD.common.DESC]],
            include: [{
                model: req.models.LoginHistory,
                as: 'loginHistories',
                separate: true
            }, {
                model: req.models.NotificationSwitch,
                as: 'notificationSwitches',
                attributes: req.models.NotificationSwitch.getUserNotificationFields(),
                separate: true
            }, {
                model: req.models.NotificationPublicSwitch,
                as: 'notificationPublicSwitches',
                attributes: req.models.NotificationPublicSwitch.getUserPublicNotificationFields(),
                separate: true
            }],
            paranoid: true
        };

        if (req.body.gender !== undefined) {
            query.where.gender = req.body.gender;

        }

        if (req.body.minBirthYear !== undefined) {

            if (query.where.$and === undefined) {
                query.where.$and = [];
            }

            query.where.$and.push({
                birth: {
                    $gte: req.body.minBirthYear
                }
            });
        }

        if (req.body.maxBirthYear !== undefined) {

            if (query.where.$and === undefined) {
                query.where.$and = [];
            }

            query.where.$and.push({
                birth: {
                    $gte: req.body.maxBirthYear
                }
            });
        }

        if (req.body.platform) {
            query.include[0].where = {
                platform: req.body.platform
            };
        }

        var total;
        var finishArray = [];
        var sendCount = 0;
        var wrongDestinationCount = 0;
        var failCount = 0;
        var size = 2000;
        var repeatCount;

        req.models.User.count(query).then(function (data) {
            total = data;

            req.models.MassNotification.updateDataById(req.massNotification.id, {
                totalCount: total
            }, function (status) {

                if (status == 204) {
                    repeatCount = Math.ceil(total / size);

                    query.limit = size;

                    var funcs = [];

                    for (var i = 0; i < repeatCount; i++) {
                        (function (quer) {
                            funcs.push(function (funcCallback) {

                                query.limit = size;

                                for (var i = 0; i < repeatCount; i++) {

                                    req.models.User.findAllDataForQuery(quer, function (status, data) {

                                        if (status == 200) {

                                            funcCallback(null, data);

                                            query.where = {
                                                id: {
                                                    $lt: data[data.length - 1].id
                                                }
                                            };

                                        } else {
                                            funcCallback(status, data);
                                        }
                                    });
                                }
                            });
                        })(query);
                    }

                    async.series(funcs, function (errorCode, results) {
                        if (errorCode) {
                            console.log('mass-notification-condition findAllDataForQuery error', errorCode);
                        } else {

                            var sendNotiFunction = [];

                            console.log('total', total);

                            results[0].forEach(function (user) {
                                (function (user) {
                                    sendNotiFunction.push(function (func2subCallback) {
                                        req.coreUtils.notification.all.sendNotificationBySendType(notificationNotice, req.body.messageTitle, req.body.messageBody, req.body.sendType, user, {}, req.image, function (status, data) {
                                            finishArray.push(user.id);

                                            var progress = Math.ceil(finishArray.length / total * 100);
                                            // console.log(finishArray.length + '/' + total + '=' + progress);

                                            if (status == 204) {

                                                func2subCallback(null, {
                                                    progress: progress,
                                                    sendCount: ++sendCount
                                                });
                                            } else if (status == 404) {

                                                func2subCallback(null, {
                                                    progress: progress,
                                                    wrongDestinationCount: ++wrongDestinationCount
                                                });
                                            } else {

                                                func2subCallback(null, {
                                                    progress: progress,
                                                    failCount: ++failCount
                                                });
                                            }
                                        });
                                    });
                                })(user);
                            });

                            async.series(sendNotiFunction, function (errorCode, results) {
                                if (errorCode) {
                                    console.log('mass-notification-condition fail progress error');
                                } else {

                                    var body = results[results.length - 1];

                                    body.sendCount = sendCount;
                                    body.wrongDestinationCount = wrongDestinationCount;
                                    body.failCount = failCount;

                                    req.models.MassNotification.updateDataById(req.massNotification.id, body, function (status) {

                                        if (status != 204) {
                                            console.log('mass-notification-condition progress error');
                                        }

                                    });
                                }
                            });

                        }
                    });

                } else {
                    return res.hjson(req, next, status, data);
                }

            });

        });

        next();

    }
};

post.supplement = function () {
    return function (req, res, next) {
        return res.hjson(req, next, 200, req.massNotification);
    };
};

module.exports = post;
