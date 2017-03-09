var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

const META = require('../../../../../bridge/metadata/index');
const STD = META.std;

var api = {
    post: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [
                    "sendType",
                    "gender",
                    "minBirthYear",
                    "maxBirthYear",
                    "platform",
                    "notificationName",
                    "messageTitle",
                    "messageBody"
                ],
                essential: [
                    "sendType",
                    "messageBody"
                ],
                resettable: [],
                explains: {
                    "sendType": STD.notification.enumSendTypes.join(", "),
                    "gender": "성별",
                    "minBirthYear": "최소 생년",
                    "maxBirthYear": "최대 생년",
                    "platform": "all, android, ios",
                    "notificationName": "알림 이름",
                    "messageTitle": "제목",
                    "messageBody": "내용"

                },
                role: STD.user.roleAdmin,
                title: '조건 선택 메세지 전송',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(post.createMassNotification());
                apiCreator.add(post.sendMassNotification());
                apiCreator.add(post.supplement());
                apiCreator.run();

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    }
};

router.post('/' + resource, api.post());

module.exports.router = router;
module.exports.api = api;