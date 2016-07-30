module.exports = {
    facebookValidadtor: function (uid, secret, callback) {
        if (process.env.NODE_ENV == "test") {
            return callback(200);
        }
        var request = require('request');
        var rootUri = 'https://graph.facebook.com/me?access_token=';
        var option = {
            method: 'GET',
            uri: rootUri + secret
        };
        request(option, function (error, response, body) {
            if (response.statusCode == 200) {
                body = JSON.parse(body);
                if (body.id == uid) {
                    callback(200);
                } else {
                    callback(403);
                }
            } else {
                callback(403);
            }
        });
    },
    kakaoValidadtor: function (uid, secret, callback) {
        if (process.env.NODE_ENV == "test") {
            return callback(200);
        }
        callback(200);
    },
    googleValidadtor: function (uid, secret, callback) {
        if (process.env.NODE_ENV == "test") {
            return callback(200);
        }
        callback(200);
    },
    twitterValidadtor: function (uid, secret, callback) {
        if (process.env.NODE_ENV == "test") {
            return callback(200);
        }
        callback(200);
    }
};