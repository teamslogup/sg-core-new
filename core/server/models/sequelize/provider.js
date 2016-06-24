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
        }
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
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {}),
        'hooks': {
            beforeValidate: function (provider, options) {
                provider.tokenEncryption();
            }
        }
    }
};

