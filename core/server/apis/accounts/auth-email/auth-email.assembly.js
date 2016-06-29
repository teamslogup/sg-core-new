var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var get = require('./' + resource + '.get.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;
const USER = STD.user;

var api = {
    get: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['token'],
                essential: ['token'],
                resettable: [],
                explains: {
                    'token': 'email token'
                },
                title: '이메일연동',
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
                apiCreator.add(get.consent());
                apiCreator.add(get.supplement());
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
                explains: {
                    id: 'user id'
                },
                title: '이메일연동해제',
                param: 'id',
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
                apiCreator.add(del.removeEmail());
                apiCreator.add(del.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource, api.get());
router.delete('/' + resource + '/:id', api.delete());

module.exports.router = router;
module.exports.api = api;