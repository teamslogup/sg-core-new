var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var put = require('./' + resource + '.put.js');
var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['newPass'],
                essential: ['newPass'],
                resettable: [],
                explains : {
                    'newPass': '신규 비밀번호'
                },
                title: '이메일이 추가로 연동되어 있는경우 비번설정, 이메일이 연동된 상태고 아직 비번이 설정되지 않았을 경우에 사용.',
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
                apiCreator.add(post.changePassword());
                apiCreator.add(post.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    put : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['newPass', 'oldPass', 'token'],
                essential: ['newPass'],
                resettable: [],
                explains : {
                    'newPass': '새로운 비밀번호',
                    'oldPass': '오래된 비밀번호',
                    'token': '이메일로 보낸 토큰 값, token, oldPass중 하나는 값이 존재해야 한다. token이 있는경우 비밀번호 찾기이고, oldPass가 있는 경우는 비번 변경인 경우.'
                },
                title: '비밀번호 변경',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
                apiCreator.add(put.loadUser());
                apiCreator.add(put.changePassword());
                apiCreator.add(put.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    }
};

router.post('/' + resource, api.post());
router.put('/' + resource, api.put());

module.exports.router = router;
module.exports.api = api;