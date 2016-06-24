var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var get = require('./' + resource + '.get.js');
var post = require('./' + resource + '.post.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');

var config = require('../../../../../bridge/config/env');
const META = require('../../../../../bridge/metadata/index');
const STD = META.std;
const FILE = STD.file;

var api = {
    get : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains : {
                    'id': '데이터를 얻을 리소스의 id'
                },
                param: 'id',
                title: '단일 얻기',
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
                apiCreator.add(get.validate());
                apiCreator.add(get.setParam());
                apiCreator.add(get.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['folder', 'offsetX', 'offsetY', 'width', 'height'],
                essential: ['folder'],
                resettable: [],
                explains : {
                    'folder': '이미지를 올릴 폴더 ' + FILE.enumFolders.join(", "),
                    'offsetX': 'x 위치',
                    'offsetY': 'y 위치',
                    'width': '너비',
                    'height': '높이'
                },
                title: '이미지 업로드',
                file: 'file',
                files_cnt: 5,
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.upload.refineFiles());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(req.middles.upload.checkImageType(FILE.enumValidImageExtensions));
                apiCreator.add(req.middles.upload.checkFileCount(FILE.minCount, FILE.maxCount));
                apiCreator.add(req.middles.upload.createPrefixName());
                apiCreator.add(req.middles.upload.createResizeOptions());
                apiCreator.add(req.middles.upload.normalizeImages());
                if (!STD.flag.isUseS3Bucket) apiCreator.add(req.middles.upload.moveFileDir());
                if (STD.flag.isUseS3Bucket) apiCreator.add(req.middles.s3.sendFiles(config.aws.bucketName));
                if (STD.flag.isUseS3Bucket) apiCreator.add(req.middles.upload.removeLocalFiles());
                apiCreator.add(post.bulkCreate());
                apiCreator.add(post.getImages());
                apiCreator.add(post.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    delete : function(isOnlyParams) {
        return function(req, res, next) {
            var params = {
                acceptable: ['folder', 'image'],
                essential: ['folder', 'image'],
                resettable: [],
                explains : {
                    'folder': '지울 이미지 폴더',
                    'image': '지울 이미지 정보'
                },
                title: '파일 제거',
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
                apiCreator.add(del.checkSession());
                apiCreator.add(del.validate());
                if (!STD.flag.isUseS3Bucket) {
                    apiCreator.add(req.middles.upload.removeLocalFiles());
                } else {
                    apiCreator.add(req.middles.s3.removeFiles(config.aws.bucketName));
                }
                apiCreator.add(del.destroy());
                apiCreator.add(del.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource + '/:id', api.get());
router.post('/' + resource, api.post());
router.delete('/' + resource, api.delete());

module.exports.router = router;
module.exports.api = api;