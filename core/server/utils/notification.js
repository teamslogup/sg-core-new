var meta = require('../../../bridge/metadata');
var path = require('path');

var STD = require('../../../bridge/metadata/standards');
var CONFIG = require('../../../bridge/config/env');
var APP_CONFIG = CONFIG.app;
var url = APP_CONFIG.rootUrl + "/" + APP_CONFIG.apiName + '/accounts/auth-email?token=';
var appDir = require('app-root-path').path;
appDir = path.resolve(appDir, "./core/server/views/email");

var sgSender = require('sg-sender');
var sendNoti = sgSender.getSender(CONFIG.sender);
var emailErrorRefiner = sgSender.emailErrorRefiner;
var phoneErrorRefiner = sgSender.phoneErrorRefiner;

var sequelize = require('../../server/config/sequelize');
var errorHandler = require('sg-sequelize-error-handler');
var NOTIFICATION = STD.notification;
var NOTIFICATIONS = require('../../../bridge/metadata/notifications');
var LANGUAGES = require('../../../bridge/metadata/languages');

function makeAuthEmailUrl(redirects, auth) {
    return url + auth.token + "&type=" + auth.type + "&successRedirect=" + (redirects.successRedirect || "") + "&errorRedirect=" + (redirects.errorRedirect || "");
}

module.exports = {
    all: {
        sendNotification: function (userId, notificationKey, payload, callback) {
            var _this = this;
            var user;
            var notification;

            sequelize.models.User.findUserNotificationInfo(userId, function (status, data) {
                if (status == 200) {
                    user = data;

                    _this.loadNotification(notificationKey, function (status, data) {

                        if (status == 200) {

                            notification = data;

                            _this.createdNotificationBox(user, notification, payload, function (status, data) {

                                if (status == 200) {

                                    for (var i = 0; i < notification.notificationSendTypes.length; i++) {

                                        if (notification.notificationType == NOTIFICATION.notificationTypeApplication) {
                                            if (!_this.isNotificationSwitchOn(user, notification.notificationSendTypes[i].id)) {
                                                continue;
                                            }
                                        } else {
                                            if (!_this.isNotificationPublicSwitchOn(user, notification.notificationSendTypes[i].notificationType, notification.notificationSendTypes[i].sendType)) {
                                                continue;
                                            }
                                        }

                                        _this.replaceMagicKey(notification.notificationSendTypes[i], payload, user.language, function (isSuccess, sendType, title, body) {

                                            if (isSuccess) {
                                                _this.send(user, sendType, title, body, function (status, data) {
                                                    if (status == 204) {
                                                        if (callback) callback(status, data);
                                                    } else {
                                                        if (callback) callback(status, data);
                                                    }
                                                });

                                            } else {
                                                if (callback)callback(204);
                                            }

                                        });

                                    }

                                } else {
                                    if (callback) callback(204);
                                }
                            });

                        } else {
                            if (callback) callback(status, data);
                        }
                    });

                } else {
                    if (callback) callback(204);
                }
            });

        },
        loadNotification: function (notificationKey, callback) {

            var notification;

            return sequelize.models.Notification.findOne({
                where: {
                    key: notificationKey
                },
                include: {
                    model: sequelize.models.NotificationSendType,
                    as: 'notificationSendTypes'
                }
            }).then(function (data) {

                if (data) {
                    notification = data;
                    return true;
                } else {
                    sequelize.models.Notification.create(NOTIFICATIONS[notificationKey], {
                        include: {
                            model: sequelize.models.NotificationSendType,
                            as: 'notificationSendTypes'
                        }
                    }).then(function (data) {
                        notification = data;
                        return true;
                    });
                }

            }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                if (isSuccess) {
                    callback(200, notification);
                }
            });

        },
        createdNotificationBox: function (user, notification, payload, callback) {

            var uploadData = payload || notification.payload;
            uploadData = JSON.stringify(uploadData);

            if (notification.isStored) {
                var notificationBox = sequelize.models.NotificationBox.build({
                    userId: user.id,
                    notificationId: notification.id,
                    payload: uploadData
                });
                notificationBox.create(function (status, data) {
                    if (status == 200) {
                        callback(status, data);
                    } else {
                        callback(204);
                    }
                });
            } else {
                callback(204);
            }

        },
        isNotificationSwitchOn: function (user, notificationSendTypeId) {

            var notificationSwitch = user.notificationSwitches;
            for (var i = 0; i < notificationSwitch.length; ++i) {
                if (notificationSwitch[i].notificationSendTypeId == notificationSendTypeId) {
                    return false;
                }
            }

            return true;

        },
        isNotificationPublicSwitchOn: function (user, notificationType, sendType) {

            var notificationPublicSwitch = user.notificationPublicSwitches;
            for (var i = 0; i < notificationPublicSwitch.length; ++i) {
                if (notificationPublicSwitch[i].notificationType == notificationType && notificationPublicSwitch[i].sendType == sendType) {
                    return false;
                }
            }

            return true;

        },
        replaceMagicKey: function (notificationSendType, payload, language, callback) {

            var localLanguage;
            var title;
            var body;

            if (LANGUAGES.hasOwnProperty(language)) {
                localLanguage = LANGUAGES[language];

                if (localLanguage.hasOwnProperty(notificationSendType.title) && localLanguage.hasOwnProperty(notificationSendType.body)) {

                    title = localLanguage[notificationSendType.title];
                    body = localLanguage[notificationSendType.body];

                    for (var key in payload) {
                        if (payload.hasOwnProperty(key)) {
                            body = body.replace(':' + key + ':', "'" + payload[key] + "'");
                        }
                    }

                    return callback(true, notificationSendType.sendType, title, body);
                }
            }

            return callback(false);

        },
        send: function (user, sendType, title, body, callback) {

            if (sendType == NOTIFICATION.sendTypeEmail) {
                sendEmail(callback);
            } else if (sendType == NOTIFICATION.sendTypeMessage) {
                sendSMS(callback);
            } else if (sendType == NOTIFICATION.sendTypePush) {
                sendPush(callback);
            } else {
                callback(500);
            }

            function sendPush(callback) {
                var histories = user.loginHistories;
                histories.forEach(function (history) {
                    sendNoti.fcm(history.token, title, body, function (err) {
                        if (err) {
                            callback(500, err);
                        } else {
                            callback(204);
                        }
                    });
                });
            }

            function sendEmail(callback) {
                if (user.email) {
                    sendNoti.email(user.email, "Notification", {
                        subject: title,
                        dir: appDir,
                        name: 'common',
                        params: {
                            body: body
                        }
                    }, function (err) {
                        if (process.env.NODE_ENV == 'test') return callback(204);
                        if (err) {
                            callback(503, emailErrorRefiner(err));
                        } else {
                            callback(204);
                        }
                    });
                } else {
                    callback(404);
                }
            }

            function sendSMS(callback) {
                if (user.phoneNum) {
                    sendNoti.sms(user.phoneNum, body, null, function (err) {
                        if (err) {
                            callback(err.status, phoneErrorRefiner(err));
                        } else {
                            callback(204);
                        }
                    });
                } else {
                    callback(404);
                }
            }
        }
    },
    email: {
        signup: function (req, redirects, auth, user, callback) {
            console.log(url + auth.token);
            var welcomeMsg = meta.langs[req.language].welcome;
            req.sendNoti.email(user.email, "SignUp", {
                subject: user.nick + welcomeMsg,
                dir: appDir,
                name: 'signup',
                params: {
                    nick: user.nick,
                    url: makeAuthEmailUrl(redirects, auth),
                    expiredAt: auth.expiredAt
                }
            }, function (err) {
                if (process.env.NODE_ENV == 'test') return callback(204);
                if (err) {
                    callback(503, req.emailErrorRefiner(err));
                } else {
                    callback(204);
                }
            });
        },
        findPass: function (req, redirects, auth, callback) {
            var newPassMsg = meta.langs[req.language].newPassExplain;
            req.sendNoti.email(auth.key, "FindPass", {
                subject: newPassMsg,
                dir: appDir,
                name: 'find-pass',
                params: {
                    url: makeAuthEmailUrl(redirects, auth) + "&email=" + auth.key,
                    expiredAt: auth.expiredAt
                }
            }, function (err) {
                if (process.env.NODE_ENV == 'test') return callback(204);
                if (err) {
                    callback(503, req.emailErrorRefiner(err));
                } else {
                    callback(204);
                }
            });
        },
        adding: function (req, redirects, auth, callback) {
            console.log(url + auth.token);
            var addingMsg = meta.langs[req.language].adding;
            req.sendNoti.email(auth.key, "Adding", {
                subject: addingMsg,
                dir: appDir,
                name: 'adding',
                params: {
                    url: makeAuthEmailUrl(redirects, auth),
                    expiredAt: auth.expiredAt
                }
            }, function (err) {
                if (process.env.NODE_ENV == 'test') return callback(204);
                if (err) {
                    callback(503, req.emailErrorRefiner(err));
                } else {
                    callback(204);
                }
            });
        },
        findId: function (req, redirects, user, callback) {
            var findIdTitleMsg = meta.langs[req.language].findIdTitleExplain;
            req.sendNoti.email(user.email, "FindId", {
                subject: findIdTitleMsg,
                dir: appDir,
                name: 'find-id',
                params: {
                    userId: user.aid
                }
            }, function (err) {
                if (process.env.NODE_ENV == 'test') return callback(204);
                if (err) {
                    callback(503, req.emailErrorRefiner(err));
                } else {
                    callback(204);
                }
            });
        }
    },
    sms: {
        sendAuth: function (req, phoneNum, token, callback) {
            var MAGIC = req.meta.std.magic;
            var lang = req.meta.langs[req.language];
            var msg = lang.smsAuthExplain;
            var min = req.meta.std.user.expiredPhoneTokenMinutes;
            msg = msg.replace(MAGIC.authNum, token);
            msg = msg.replace(MAGIC.minute, min);
            console.log(phoneNum, token, msg);
            if (req.sendNoti.sms) {
                req.sendNoti.sms(phoneNum, msg, null, function (err) {
                    if (err) {
                        callback(err.status, req.phoneErrorRefiner(err));
                    } else {
                        callback(204);
                    }
                });
            }
            else {
                callback(204);
            }
        },
        newPass: function (req, phoneNum, pass, callback) {
            var MAGIC = req.meta.std.magic;
            var lang = req.meta.langs[req.language];
            var msg = lang.findPassExplain;
            msg = msg.replace(MAGIC.pass, pass);
            console.log(phoneNum, msg);
            if (req.sendNoti.sms) {
                req.sendNoti.sms(phoneNum, msg, null, function (err) {
                    if (err) {
                        callback(err.status, req.phoneErrorRefiner(err));
                    } else {
                        callback(204);
                    }
                });
            }
            else {
                callback(204);
            }
        }
    },
    init: function (callback) {
        var bodyArray = Object.keys(NOTIFICATIONS).map(function (key) {
            return NOTIFICATIONS[key];
        });

        sequelize.transaction(function (t) {

            return sequelize.models.Notification.findAll({
                include: {
                    model: sequelize.models.NotificationSendType,
                    as: 'notificationSendTypes'
                },
                transaction: t
            }).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < bodyArray.length; j++) {
                        if (bodyArray[j].key == data[i].key) {
                            bodyArray.splice(j, 1);
                        }
                    }
                }

                if (bodyArray.length > 0) {
                    var promises = [];

                    for (var i = 0; i < bodyArray.length; i++) {
                        var newPromise = sequelize.models.Notification.create(bodyArray[i], {
                            include: {
                                model: sequelize.models.NotificationSendType,
                                as: 'notificationSendTypes'
                            },
                            transaction: t
                        });
                        promises.push(newPromise);
                    }

                    return Promise.all(promises);

                } else {
                    return true;
                }

            }).then(function (data) {
                return true;
            });

        }).then(function (data) {
            callback();
        });
    }
};