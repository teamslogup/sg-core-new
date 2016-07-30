var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['type', 'key', 'token'],
                essential: ['type', 'key', 'token'],
                resettable: [],
                explains : {
                    type: '',
                    key: '이메일 혹은 전화번호',
                },
                defaults: {
                    body: '디폴트내용'
                },
                response: {},
                title: '',
                state: 'design'
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
                apiCreator.add(post.setParam());
                apiCreator.add(post.supplement());
                apiCreator.run();

                
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