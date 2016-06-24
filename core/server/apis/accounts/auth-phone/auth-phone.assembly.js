var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var post = require('./' + resource + '.post.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    post: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['token'],
                essential: ['token'],
                resettable: [],
                explains: {
                    'token': '인증번호'
                },
                title: '전화번호 연동',
                state: 'staging'
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
                apiCreator.add(post.getUser());
                apiCreator.add(post.updateUser());
                apiCreator.add(post.supplement());
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
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {},
                title: '전화번호 제거 (이메일, 소셜 연동없이 전화번호로 가입만 되어 있는경우 제거 불가.',
                state: 'staging'
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
                apiCreator.add(del.removePhone());
                apiCreator.add(del.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    }
};

router.post('/' + resource, api.post());
router.delete('/' + resource, api.delete());

module.exports.router = router;
module.exports.api = api;