var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var gets = require('./' + resource + '.gets.js');
var post = require('./' + resource + '.post.js');
var put = require('./' + resource + '.put.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    gets: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['sendType'],
                essential: ['sendType'],
                resettable: [],
                explains: {'sendType': '알림 전송 형태' + STD.notification.enumSendTypes.join(',')},
                response: {rows: [resforms.notification]},
                title: '알림 전체 얻기',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                // apiCreator.add(req.middles.role.userIdChecker('query', 'userId', STD.role.account));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(gets.validate());
                apiCreator.add(gets.getNotificationSwitch());
                apiCreator.add(gets.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    },
    post: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['notificationType', 'sendType'],
                essential: ['notificationType', 'sendType'],
                resettable: [],
                explains: {
                    'notificationType': "노티피케이션 형태 " + STD.notification.enumNotificationTypes.join(", "),
                    'sendType': "노티피케이션 전송 형태 " + STD.notification.enumSendTypes.join(", ")
                },
                response: resforms.notification,
                title: '알림 수신거부 설정',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(post.createNotificationSwitch());
                apiCreator.add(post.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    },
    put: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['notificationType', 'sendType', 'switch'],
                essential: ['notificationType', 'sendType', 'switch'],
                resettable: [],
                explains: {
                    'notificationType': "노티피케이션 형태 " + STD.notification.enumNotificationTypes.join(", "),
                    'sendType': "노티피케이션 전송 형태 " + STD.notification.enumSendTypes.join(", "),
                    'switch': '온오프 여부'
                },
                response: resforms.notification,
                title: '알림 스위칭',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
                apiCreator.add(top.hasAuthorization());
                apiCreator.add(put.updateReport());
                apiCreator.add(put.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    },
    delete: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['notificationType', 'sendType'],
                essential: ['notificationType', 'sendType'],
                resettable: [],
                explains: {
                    'notificationType': "노티피케이션 형태 " + STD.notification.enumNotificationTypes.join(", "),
                    'sendType': "노티피케이션 전송 형태 " + STD.notification.enumSendTypes.join(", ")
                },
                response: resforms.notification,
                title: '알림 수신거부 해제',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(del.validate());
                apiCreator.add(del.deleteNotificationSwitch());
                apiCreator.add(del.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    },
};

router.get('/' + resource, api.gets());
router.post('/' + resource, api.post());
router.put('/' + resource, api.put());
router.delete('/' + resource, api.delete());

module.exports.router = router;
module.exports.api = api;