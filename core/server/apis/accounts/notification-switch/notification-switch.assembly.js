var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var gets = require('./' + resource + '.gets.js');
var put = require('./' + resource + '.put.js');

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
                acceptable: ['userId'],
                essential: ['userId'],
                resettable: [],
                explains: {
                    'userId': 'userId'
                },
                response: {rows:[resforms.notification]},
                role: STD.role.account,
                title: '노티피케이션 전체 얻기',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.role.account));
                apiCreator.add(req.middles.role.userIdChecker('query', 'userId', STD.role.account));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(gets.validate());
                apiCreator.add(gets.getNotification());
                apiCreator.add(gets.getUserNotification());
                apiCreator.add(gets.getUserPublicNotification());
                apiCreator.add(gets.supplement());
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
                acceptable: ['userId', 'notificationId', 'switch', 'type'],
                essential: ['userId', 'notificationId', 'switch', 'type'],
                resettable: [],
                explains: {
                    'userId': '유저 아이디',
                    'notificationId': "노티피케이션 아이디, type이 appication일 경우만 가능함.",
                    'switch': '온오프 여부',
                    'type': "노티피케이션 형태 " + STD.notification.enumForms.join(", ")
                },
                response: resforms.notification,
                role: STD.role.account,
                title: '노티피케이션 스위칭',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleSupervisor));
                apiCreator.add(req.middles.role.userIdChecker('body', 'userId', STD.role.account));
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
    }
};

router.get('/' + resource, api.gets());
router.put('/' + resource + '/:key', api.put());

module.exports.router = router;
module.exports.api = api;