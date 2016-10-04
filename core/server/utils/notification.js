var meta = require('../../../bridge/metadata');
var path = require('path');

var CONFIG = require('../../../bridge/config/env');
var APP_CONFIG = CONFIG.app;
var url = APP_CONFIG.rootUrl + "/" + APP_CONFIG.apiName + '/accounts/auth-email?token=';
var appDir = require('app-root-path').path;
appDir = path.resolve(appDir, "./core/server/views/email");


function makeAuthEmailUrl(redirects, auth) {
    return url + auth.token + "&type=" + auth.type + "&successRedirect=" + (redirects.successRedirect || "") + "&errorRedirect=" + (redirects.errorRedirect || "");
}

module.exports = {
    all: {
        sendNotification: function (req, user, notification, data, callback) {
            var NOTIFICATION = req.meta.std.notification;
            function sendPush(callback) {
                var histories = user.loginHistories;
                histories.forEach(function (history) {
                    req.sendNoti.fcm(history.token, notification.title, data || notification.data, function (err) {
                        if (err) {
                            if (callback) callback(500, err);
                        } else {
                            if (callback) callback(204);
                        }
                    });
                });
            }

            function sendEmail(callback) {
                req.sendNoti.email(user.email, "Notification", {
                    subject: notification.title,
                    dir: appDir,
                    name: 'common',
                    params: {
                        body: notification.body
                    }
                }, function (err) {
                    if (process.env.NODE_ENV == 'test') return callback(204);
                    if (err) {
                        if (callback) callback(503, req.emailErrorRefiner(err));
                    } else {
                        if (callback) callback(204);
                    }
                });
            }

            function sendEmailAndPush(callback) {
                sendEmail(function (status, data) {
                    if (status == 204) {
                        sendPush(callback);
                    } else {
                        if (callback) callback(status, data);
                    }
                });
            }

            function sendSMS(callback) {
                if (user.phoneNum) {
                    req.sendNoti.sms(user.phoneNum, notification.body, null, function (err) {
                        if (err) {
                            if (callback) callback(err.status, req.phoneErrorRefiner(err));
                        } else {
                            if (callback) callback(204);
                        }
                    });
                } else {
                    if (callback) callback(404);
                }
            }

            function send(callback) {

                // application 타입일 경우 userNotification에서 보낼지 여부를 찾아야함
                if (notification.type == NOTIFICATION.formApplication) {
                    // userNotifiction에 없거나, true 이면 발송
                    // userNotification에 false이면 미발송

                    var userNotifications = user.userNotifications;
                    for (var i = 0; i < userNotifications.length; ++i) {
                        var userNoti = userNotifications[i];
                        if (userNoti.notificationId == notification.id && userNoti.switch == false) {
                            if (callback) return callback(204);
                        }
                    }
                }
                // application 타입 이외의 경우 userPublicNotification 에서 찾아야함
                else {
                    var userPublicNotifications = user.userPublicNotifications;
                    for (var i = 0; i < userPublicNotifications.length; ++i) {
                        var userPublicNoti = userPublicNotifications[i];
                        if (userPublicNoti.type == notification.type && userPublicNoti.switch == false) {
                            if (callback) return callback(204);
                        }
                    }
                }

                if (notification.type == NOTIFICATION.notificationEmail) {
                    sendEmail(callback);
                } else if (notification.type == NOTIFICATION.notificationEmailPush) {
                    sendEmailAndPush(callback);
                } else if (notification.type == NOTIFICATION.notificationSms) {
                    sendSMS(callback);
                } else if (notification.type == NOTIFICATION.notificationPush) {
                    sendPush(callback);
                } else {
                    if (callback) callback(500);
                }
            }

            var uploadData = data || notification.data;
            uploadData = JSON.stringify(uploadData);

            if (notification.isStored) {
                var notificationBox = req.models.NotificationBox.build({
                    userId: user.id,
                    notificationId: notification.id,
                    data: uploadData
                });
                notificationBox.create(function (status, data) {
                    if (status == 200) {
                        send(callback)
                    } else {
                        if (callback) callback(status, data);
                    }
                });
            } else {
                send(callback)
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
    }
};