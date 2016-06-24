var meta = require('../../../bridge/metadata');
var path = require('path');

var APP_CONFIG = require('../../../bridge/config/env').app;
var url = APP_CONFIG.rootUrl + "/" + APP_CONFIG.apiName + '/accounts/auth-email?token=';
var appDir = require('app-root-path').path;
appDir = path.resolve(appDir, "./core/server/views/email");

module.exports = {

    email: {
        signup: function (req, user, callback) {
            var welcomeMsg = meta.langs[req.language].welcome;
            req.sendNoti.email(user.email, "SignUp", {
                subject: user.nick + welcomeMsg,
                dir: appDir,
                name: 'signup',
                params: {
                    nick: user.nick,
                    url: url + user.auth.token,
                    expiredAt: user.auth.expiredAt
                }
            }, callback);
        },
        adding: function (req, auth, callback) {
            var addingMsg = meta.langs[req.language].adding;
            req.sendNoti.email(auth.key, "Adding", {
                subject: addingMsg,
                dir: appDir,
                name: 'adding',
                params: {
                    url: url + auth.token,
                    expiredAt: auth.expiredAt
                }
            }, callback);
        },
        newPass: function (req, redirect, auth, callback) {
            var url = APP_CONFIG.rootUrl + "/" + redirect;
            url = url + "?token=" + auth.token;
            var newPassMsg = meta.langs[req.language].newPassExplain;
            req.sendNoti.email(auth.key, "NewPass", {
                subject: newPassMsg,
                dir: appDir,
                name: 'new-pass',
                params: {
                    url: url,
                    expiredAt: auth.expiredAt
                }
            }, callback);
        }
    },
    sms: {
        signup: function (req, phoneNum, token, callback) {

            var MAGIC = req.meta.std.magic;
            var lang = req.meta.langs[req.language];
            var msg = lang.smsAuthExplain;
            var min = req.meta.std.user.expiredPhoneTokenMinutes;

            msg = msg.replace(MAGIC.authNum, token);
            msg = msg.replace(MAGIC.minute, min);

            console.log(phoneNum, token, msg);
            req.sendNoti.sms(phoneNum, msg, null, callback);
        }
    }
};