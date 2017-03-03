var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var gets = require('./' + resource + '.gets.js');
var get = require('./' + resource + '.get.js');
var put = require('./' + resource + '.put.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');

var config = require('../../../../../bridge/config/env');
const META = require('../../../../../bridge/metadata/index');
const STD = META.std;

var api = {
    get: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                    'id': '데이터를 얻을 리소스의 id'
                },
                param: 'id',
                title: '단일 얻기',
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
                apiCreator.add(get.validate());
                apiCreator.add(get.setParam());
                apiCreator.add(get.supplement());
                apiCreator.run();

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    },
    gets: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['userId', 'last', 'size'],
                essential: [],
                resettable: [],
                explains: {
                    'userId': '유저 id',
                    'last': '마지막 데이터',
                    'size': '몇개 로드할지에 대한 사이즈'
                },
                title: '유저 이미지 목록 조회',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(gets.validate());
                apiCreator.add(gets.setParam());
                apiCreator.add(gets.supplement());
                apiCreator.run();

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    },
    put: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['imageIds', 'imageIdsToBeDeleted'],
                essential: ['imageIds'],
                resettable: ['imageIds'],
                explains: {
                    'imageIds': '이미지 ids',
                    'imageIdsToBeDeleted': '지워질 이미지 ids'
                },
                title: '유저 이미지 수정',
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
                apiCreator.add(put.validate());
                apiCreator.add(put.update());
                // apiCreator.add(put.findImagesToBeDeleted());
                if (!STD.flag.isUseS3Bucket) {
                    apiCreator.add(req.middles.upload.removeLocalFiles());
                } else {
                    apiCreator.add(req.middles.s3.removeFiles(config.aws.bucketName));
                }
                apiCreator.add(put.supplement());
                apiCreator.run();

                delete apiCreator;
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
                    'id': '데이터 리소스의 id'
                },
                title: '제거',
                param: 'id',
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
                apiCreator.add(del.validate());
                apiCreator.add(del.destroy());
                apiCreator.add(del.supplement());
                apiCreator.run();

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource + '/:id', api.get());
router.get('/' + resource, api.gets());
router.put('/' + resource, api.put());
router.delete('/' + resource + '/:id', api.delete());

module.exports.router = router;
module.exports.api = api;