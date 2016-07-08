
/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../../../core/server/config/sequelize');

var mixin = require('../../../../core/server/models/sequelize/mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
module.exports = {
    fields: {
        'authorId': {
            'reference': 'User',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'author'
        },
        'folder': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'name': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'authorized': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': true
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'deletedAt': {
            'type': Sequelize.DATE,
            'allowNull': true
        }
    },
    options: {
        'timestamps': true,
        'updatedAt': false,
        'charset': 'utf8',
        'paranoid': true,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'createImages': function(array, callback) {
                var loadedImage = null;
                sequelize.models.Image.bulkCreate(array, {individualHooks: true}).then(function (data) {
                    loadedImage = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedImage) {
                        callback(201, loadedImage);
                    }
                });
            },
            'findImagesByObj': function(images, callback) {
                var where = {
                    '$or': []
                };
                
                for (var i=0; i<images.length; i++) {
                    var body = {
                        name: { '$eq': images[i].name }
                    };
                    where.$or.push(body);
                }
                
                var query = {
                    'where': where
                };
                
                sequelize.models.Image.findAllDataForQuery(query, function (status, data) {
                    callback(status, data);
                });
            },
            'findImagesByOption': function (authorId, last, size, orderBy, sort, callback) {
                var where = {};
                
                if (authorId) {
                    where.authorId = authorId;
                }
                
                var query = {
                    'limit': parseInt(size),
                    'where': where
                };
                
                if (orderBy == STD.image.orderUpdate) {
                    where.updatedAt = {
                        '$lt': last
                    };
                    query.order = [['updatedAt', sort]];
                } else {
                    where.createdAt = {
                        'lt': last
                    };
                    query.order = [['createdAt', sort]];
                }
                
                sequelize.models.Image.findAllDataForQuery(query, callback);
            },
            'findImagesByIds': function (idArray, user, callback) {
                var where = {
                    id: idArray
                };
                
                if (user) {
                    if (user.role < STD.user.roleAdmin) {
                        where.authorId = user.id;
                    }
                } else {
                    return callback(403);
                }
                
                sequelize.models.Image.findAllDataForQuery({ where: where }, function (status, data) {
                    callback(status, data);
                });
            },
            'deleteImagesByIds': function (idArray, callback) {
                var loadedImage = null;
                sequelize.models.Image.destroy({ where: { id: idArray }, cascade: true }).then(function (data) {
                    loadedImage = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedImage) {
                        callback(204, loadedImage);
                    }
                });
            }
        })
    }
};