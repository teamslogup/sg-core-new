var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var put = require('./' + resource + '.put.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    put : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['token'],
                essential: ['token'],
                resettable: [],
                explains : {
                    'token': '푸시에 사용될 디바이스 토큰',
                },
                title: '토큰 업데이트',
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
                apiCreator.add(put.validate());
                apiCreator.add(put.updateToken());
                apiCreator.add(put.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    }
};

router.put('/' + resource, api.put());

module.exports.router = router;
module.exports.api = api;