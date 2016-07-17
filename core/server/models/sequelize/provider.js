/**
 * Provider model module.
 * @module core/server/models/sequelize/provider
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var crypto = require('crypto');
var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');

function requestFacebookValidadtor(uid, secret, callback) {
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
}

module.exports = {
    fields: {
        'userId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'user',
            asReverse: 'providers',
            allowNull: false
        },
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.user.enumProviders,
            'allowNull': false
        },
        'uid': {
            'type': Sequelize.STRING,
            'allowNull': false,
            'unique': true
        },
        'token': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'salt': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'allowNull': false
    }, options: {
        'charset': 'utf8',
        'paranoid': false, // deletedAt 추가. delete안함.
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {
            'tokenAuthenticate': function (token) {
                return this.token == this.createHashPassword(token);
            },
            'createHashToken': function (token) {
                return crypto.pbkdf2Sync(token, this.salt, 15000, 64).toString('base64');
            },
            'tokenEncryption': function () {
                this.salt = crypto.randomBytes(20).toString('base64');
                this.token = this.createHashToken(this.token);
                return this;
            }
        }),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            getProviderFields: function() {
                var fields = ['id', 'type', 'uid'];
                return fields;
            },
            updateFacebookToken: function(userId, uid, secret, callback) {
                requestFacebookValidadtor(uid, secret, function(status, data) {
                    if (status == 200) {
                        var finalStatus = 400;
                        sequelize.models.Provider.create({
                            type: STD.user.providerFacebook,
                            uid: uid,
                            token: secret,
                            userId: userId
                        }).then(function(data) {
                            if (data) {
                                finalStatus = 200;
                            } else {
                                finalStatus = 404;
                            }
                        }).catch(errorHandler.catchCallback(callback)).done(function (provider) {
                            if (finalStatus != 400) {
                                callback(finalStatus, provider);
                            }
                        });
                    } else {
                        callback(status, data);
                    }
                });
            },
            checkAndRefreshFacebookToken: function(uid, secret, callback) {
                requestFacebookValidadtor(uid, secret, function(status, data) {
                    if (status == 200) {
                        sequelize.models.Provider.updateDataByKey('uid', uid, {
                            uid: uid,
                            token: secret
                        }, function(status, data) {
                            if (status == 404 || status == 204) {
                                callback(200);
                            } else {
                                callback(status, data);
                            }
                        });
                    } else {
                        callback(status, data);
                    }
                });
            }
        }),
        'hooks': {
            beforeValidate: function (provider, options) {
                provider.tokenEncryption();
            }
        }
    }
};

