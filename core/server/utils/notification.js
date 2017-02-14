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
        sendNotification: function (userId, notification, payload, callback) {
            var _this = this;
            var user;

            sequelize.models.User.findUserNotificationInfo(userId, function (status, data) {
                if (status == 200) {
                    user = data;

                    _this.createdNotificationBox(user, notification, payload, function (status, data) {

                        if (status == 204) {

                            var sendTypes = notification.sendTypes;

                            for (var sendType in sendTypes) {

                                if (!_this.isNotificationSwitchOn(user, notification.key, sendType)) {
                                    continue;
                                }

                                _this.replaceMagicKey(sendTypes[sendType], payload, user.language, function (isSuccess, title, body) {

                                    payload['key'] = notification.key;

                                    if (isSuccess) {

                                        _this.getNewNotificationCount(user.id, function (isSuccess, result) {

                                            var badge = result.newNotificationCount + result.newChatMessageCount;
                                            payload['newNotificationCount'] = result.newNotificationCount;
                                            payload['newChatMessageCount'] = result.newChatMessageCount;

                                            if (isSuccess) {
                                                _this.send(user, sendType, title, body, badge, payload, function (status, data) {
                                                    if (status == 204) {
                                                        if (callback) callback(status, data);
                                                    } else {
                                                        console.log(status, data);
                                                        if (callback) callback(status, data);
                                                    }
                                                });
                                            } else {
                                                if (callback)callback(204);
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
                    if (callback) callback(204);
                }
            });

        },
        createdNotificationBox: function (user, notification, payload, callback) {

            var uploadData = payload || notification.payload;
            uploadData = JSON.stringify(uploadData);

            if (notification.isStored) {
                var notificationBox = sequelize.models.NotificationBox.build({
                    userId: user.id,
                    key: notification.key,
                    payload: uploadData
                });
                notificationBox.create(function (status, data) {
                    if (status == 200) {
                        callback(204);
                    } else {
                        callback(status);
                    }
                });
            } else {
                callback(204);
            }

        },
        isNotificationSwitchOn: function (user, notificationKey, sendType) {

            var notificationSwitch = user.notificationSwitches;
            for (var i = 0; i < notificationSwitch.length; ++i) {
                if (notificationSwitch[i].key == notificationKey) {
                    if (notificationSwitch[i].sendType == sendType) {
                        return false;
                    }
                }
            }

            var notificationPublicSwitch = user.notificationPublicSwitches;
            for (var i = 0; i < notificationPublicSwitch.length; ++i) {
                if (notificationSwitch[i].key == notificationKey) {
                    if (notificationPublicSwitch[i].sendType == sendType) {
                        return false;
                    }
                }
            }

            return true;

        },
        replaceMagicKey: function (sendType, payload, language, callback) {

            var localLanguage;
            var title;
            var body;

            if (LANGUAGES.hasOwnProperty(language)) {
                localLanguage = LANGUAGES[language];

                if (localLanguage.hasOwnProperty(sendType.title) && localLanguage.hasOwnProperty(sendType.body)) {

                    title = localLanguage[sendType.title];
                    body = localLanguage[sendType.body];

                    for (var key in payload) {
                        if (payload.hasOwnProperty(key)) {
                            body = body.replace(':' + key + ':', "'" + payload[key] + "'");
                        }
                    }

                    return callback(true, title, body);
                }
            }

            return callback(false);

        },
        getNewNotificationCount: function (userId, callback) {

            var result = {};

            sequelize.models.NotificationBox.findNewNotificationCount(userId, function (status, data) {
                if (status == 200) {
                    result.newNotificationCount = data;

                    sequelize.models.ChatRoomUser.getNewChatMessageCount(userId, function (status, data) {
                        if (status == 200 || status == 404) {
                            result.newChatMessageCount = data;

                            return callback(true, result);
                        } else {
                            return callback(false);
                        }
                    });

                } else {
                    return callback(false);
                }
            });

        },
        send: function (user, sendType, title, body, badge, data, callback) {

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
                    if (history.token) {
                        sendNoti.fcm(history.token, title, body, badge, data, history.platform, function (err) {
                            if (err) {
                                callback(500, err);
                            } else {
                                callback(204);
                            }
                        });
                    } else {
                        callback(204);
                    }

                });
            }

            function sendEmail(callback) {
                if (user.email) {
                    sendNoti.email(user.email, title, "Notification", {
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
                    sendNoti.sms(null, user.phoneNum, title, body, function (err) {
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
            req.sendNoti.email(user.email, '', "SignUp", {
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
            req.sendNoti.email(auth.key, '', "FindPass", {
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
            req.sendNoti.email(auth.key, '', "Adding", {
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
            req.sendNoti.email(user.email, '', "FindId", {
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
                req.sendNoti.sms(null, phoneNum, '', msg, function (err) {
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
                req.sendNoti.sms(null, phoneNum, '', msg, function (err) {
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
    }
};