/**
 * Test model module.
 * @module core/server/models/sequelize/test
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var STD = require('../../../../bridge/metadata/standards');
var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

module.exports = {
    fields: {
        'key': {
            'type': Sequelize.STRING,
            'allowNull': false,
            'unique': true
        },
        // 'data': {
        //     'type': Sequelize.STRING,
        //     'allowNull': true
        // },
        // 'img': {
        //     'type': Sequelize.STRING,
        //     'allowNull': true
        // },
        'isStored': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': true,
            'comment': "formApplication form일때 notification-box에 저장할 지 여부"
        },
        'isOption': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': true,
            'comment': "formApplication form일때 user-notification에 switch로 옵션을 조절할 지 여부"
        },
        // 'description': {
        //     'type': Sequelize.STRING,
        //     'allowNull': true
        // },
        'notificationType': {
            'type': Sequelize.ENUM,
            'allowNull': false,
            'values': STD.notification.enumNotificationTypes,
            'defaultValue': STD.notification.notificationTypeApplication,
            'comment': "노티피케이션의 형태, application 모드가 아닌경우 유저 내에서 노티를 받을지 결정할 수 있음, 또한 application모드에서만 isStored가 작동함"
        },
        'notificationBoxTitle': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'notificationBoxBody': {
            'type': Sequelize.STRING,
            'allowNull': true
        }
    },
    options: {
        "indexes": [{
            fields: ['key', 'isStored', 'isOption']
        }],
        'charset': 'utf8',
        'paranoid': true, // deletedAt 추가. delete안함.
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getIncludeNotification': function (key, options, callback) {
                return {
                    model: sequelize.models.NotificationSendType,
                    as: 'notificationSendTypes'
                }
            },
            'loadNotification': function (key, options, callback) {

                var loadedData = null;
                var isSuccess = false;

                sequelize.transaction(function (t) {

                    var query = {
                        where: {
                            key: key
                        }
                    };

                    return sequelize.models.Notification.find(query).then(function (data) {
                        isSuccess = true;
                        // 로드하려는 노티피케이션이 없는경우
                        if (!data) {
                            var notification = sequelize.models.Notification.build(options);
                            return notification.save().then(function (data) {
                                isSuccess = true;
                                loadedData = data;
                            });
                        } else {
                            isSuccess = true;
                            loadedData = data;
                        }
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (isSuccess) {
                        callback(200, loadedData);
                    }
                });

            }
        }),
        'hooks': {}
    }
};
