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
                acceptable: ['provider', 'id', 'accessToken'],
                essential: ['provider', 'id', 'accessToken'],
                resettable: [],
                explains: {
                    'provider': STD.user.enumProviders.join(", "),
                    'id': "발급받은 소셜아아디",
                    'accessToken': "액세스토큰"
                },
                title: '소셜 연동',
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
                apiCreator.add(post.createProvider());
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
                acceptable: ['provider'],
                essential: ['provider'],
                resettable: [],
                explains: {
                    'provider': STD.user.enumProviders.join(", ")
                },
                title: '소셜 연동 해제',
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
                apiCreator.add(del.removeProvider());
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