/**
 * Provider model module.
 * @module core/server/models/sequelize/provider
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var crypto = require('crypto');
var mixin = require('./mixin');

var STD = require('../../../../bridge/metadata/standards');

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
        'expiredAt': Sequelize.BIGINT,
        'allowNull': false
    }, options: {
        'charset': 'utf8',
        'paranoid': true, // deletedAt 추가. delete안함.
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
            checkAndRefreshFacebookToken: function(userId, secret, callback) {
                var request = require('request');
                var rootUri = 'https://graph.facebook.com/me?access_token=';
                var option = {
                    method: 'GET',
                    uri: rootUri + secret
                };
                request(option, function (error, response, body) {
                    if (response.statusCode == 200) {
                        body = JSON.parse(body);
                        if (body.id == userId) {
                            sequelize.models.Provider.updateDataByKey('uid', userId, {
                                uid: userId,
                                token: secret
                            }, function(status, data) {
                                if (status == 404 || status == 204) {
                                    callback(200);
                                } else {
                                    callback(status, data);
                                }
                            });
                        } else {
                            callback(403);
                        }
                    } else {
                        callback(403);
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

