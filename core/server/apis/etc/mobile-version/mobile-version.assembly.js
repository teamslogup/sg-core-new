var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var get = require('./' + resource + '.get.js');
var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    get: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['type'],
                essential: ['type'],
                resettable: [],
                explains: {
                    'type': '모바일 플랫폼 ' + STD.mobile.enumOsType.join(", ")
                },
                title: '모바일 버전 얻기',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(get.validate());
                apiCreator.add(get.setParams());
                apiCreator.add(get.supplement());
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
                acceptable: ['type', 'version'],
                essential: ['type', 'version'],
                resettable: [],
                explains: {
                    'type': '모바일 플랫폼 ' + STD.mobile.enumOsType.join(", "),
                    'version': '버전'
                },
                title: '모바일 버전 갱신',
                state: 'staging'
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
                apiCreator.add(post.setParams());
                apiCreator.add(post.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource, api.get());
router.post('/' + resource, api.post());

module.exports.router = router;
module.exports.api = api;