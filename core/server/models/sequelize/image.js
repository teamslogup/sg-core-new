
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
            'type': Sequelize.INTEGER,
            'allowNull': false
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
        }
    },
    options: {
        'charset': 'utf8',
        'indexes': [{
            unique: true,
            fields: ['id']
        }],
        'paranoid': true,
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'createImages': function(array, callback) {
                var loadedImage = null;
                sequelize.models.Image.bulkCreate(array).then(function (data) {
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
            'findImagesByIds': function (idArray, callback) {
                sequelize.models.Image.findAllDataForQuery({ where: { id: idArray } }, function (status, data) {
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