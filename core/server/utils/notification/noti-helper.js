var path = require('path');
var appDir = require('app-root-path').path;
appDir = path.resolve(appDir, "./core/server/views/email");

var CONFIG = require('../../../../bridge/config/env');
var sgSender = require('sg-sender');
var sendNoti = sgSender.getSender(CONFIG.sender);
var emailErrorRefiner = sgSender.emailErrorRefiner;
var phoneErrorRefiner = sgSender.phoneErrorRefiner;

module.exports = {
    sendPush: function (token, title, body, badge, data, platform, callback) {

        if (token) {
            sendNoti.fcm(token, title, body, badge, data, platform, function (err) {
                if (err) {
                    callback(500, err);
                } else {
                    callback(204);
                }
            });
        } else {
            callback(404);
        }

    },
    sendEmail: function (email, title, body, callback) {
        if (email) {
            sendNoti.email(email, title, "Notification", {
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
                console.log('email error', err);
            });
        } else {
            callback(404);
            console.log('email 404');
        }
    },
    sendSMS: function (phoneNum, title, callback) {
        if (phoneNum) {
            sendNoti.sms(null, phoneNum, title, body, function (err) {
                if (err) {
                    callback(err.status, phoneErrorRefiner(err));
                } else {
                    callback(204);
                }
            });

        } else {
            callback(404);
        }

    },
    sendMMS: function (phoneNum, title, body, file, callback) {
        if (phoneNum) {
            sendNoti.mms(null, phoneNum, title, body, file, function (err) {
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
};