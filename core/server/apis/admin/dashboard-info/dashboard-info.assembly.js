"use strict";

var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var get = require('./' + resource + '.get.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

var META = require('../../../../../bridge/metadata');
var STD = META.std;
var USER = STD.user;

var api = {
    get: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['year', 'months'],
                essential: ['year', 'months'],
                resettable: [],
                explains: {
                },
                response: {},
                title: '단일 얻기',
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
                apiCreator.add(get.validate());
                apiCreator.add(get.getUsersStatus());
                apiCreator.add(get.getUsersStatusByMonth());
                apiCreator.add(get.getReportsStatus());
                apiCreator.add(get.getReportsStatusByMonth());
                apiCreator.add(get.getImagesStatus());
                apiCreator.add(get.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource, api.get());

module.exports.router = router;
module.exports.api = api;