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
                acceptable: ['type',],
                essential: ['newPass'],
                resettable: [],
                explains : {
                    'newPass': '새로운 비밀번호'
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
                apiCreator.add(put.changePassword());
                apiCreator.add(put.supplement());
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
                acceptable: ['newPass'],
                essential: ['newPass'],
                resettable: [],
                explains : {
                    'newPass': '새로운 비밀번호'
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

router.put('/' + resource, api.put());
router.post('/' + resource, api.post());

module.exports.router = router;
module.exports.api = api;