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
            }, function(err) {
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
            }, function(err) {
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
                req.sendNoti.sms(phoneNum, msg, null, function(err) {
                    if (err) {
                        callback(err.status, err);
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
                req.sendNoti.sms(phoneNum, msg, null,  function(err) {
                    if (err) {
                        callback(err.status, err);
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