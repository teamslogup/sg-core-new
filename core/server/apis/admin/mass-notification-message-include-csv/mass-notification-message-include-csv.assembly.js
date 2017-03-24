var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

const META = require('../../../../../bridge/metadata/index');
const STD = META.std;

var api = {
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [
                    "folder",
                    "sendMethod",
                    "title",
                    "message",
                    "mmsTitle"
                ],
                essential: [
                    "folder",
                    "sendMethod",
                    "title",
                    "message"
                ],
                resettable: [],
                explains: {
                    "folder": "mms 이미지 저장될 폴더" + STD.file.folderNotification,
                    "sendMethod": "전송방식 " + STD.notification.enumSendMethods.join(", "),
                    "title": "전송 제목",
                    "message": "메세지 내용",
                    "mmsTitle": "MMS 메세지 제목"
                },
                title: '문자 메세지 전송',
                file: 'file',
                files_cnt: 2,
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.upload.refineFiles());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(req.middles.upload.checkFileFormat(STD.file.enumValidCsvExtensions.concat(STD.file.enumValidImageExtensions)));
                apiCreator.add(req.middles.upload.checkInvalidFileType(STD.file.enumInvalidFileExtensions));
                apiCreator.add(req.middles.upload.checkFileCount(1, 2));
                apiCreator.add(post.validate());
                apiCreator.add(post.checkNCreatePart());
                apiCreator.add(post.series());
                apiCreator.add(post.supplement());
                apiCreator.run();

                delete apiCreator;
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