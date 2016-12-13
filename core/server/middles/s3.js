/**
 * @namespace 2번 이상 쓰일 미들웨어 모듈.
 */

var path = require('path');
var fs = require('fs');
var async = require('async');

module.exports = function(config) {

    var AWS = require('aws-sdk');
    AWS.config.update({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        region: config.region
    });

    var s3 = new AWS.S3();

    var Logger = require('sg-logger');
    var logger = new Logger(__filename);

    function S3() {
    }

    function sendToS3(file, bucket, folder, callback) {
        fs.readFile(file.path, function (err, fileData) {

            if (err) {
                return callback({code: '500_4'});
            }

            var bn = path.basename(file.path);
            var params = {
                Bucket: bucket,
                Key: folder + '/' + bn,
                Body: fileData,
                ContentType: file.type
            };

            s3.putObject(params, function (err, data) {

                if (err) {
                    logger.e(err);
                    return callback({code: '500_5'});
                }

                callback(null, data);
            });
        });
    }

    S3.prototype.sendFiles = function (bucket) {
        return function (req, res, next) {

            if (req.files) {
                var folder = req.folder;
                var funcs = [];

                for (var i = 0; i < req.files.length; ++i) {
                    var f = req.files[i];
                    (function (f) {
                        funcs.push(function (n) {
                            sendToS3(f, bucket, folder, function (err, data) {
                                if (err) n(err);
                                else n(null, data);
                            });
                        });
                    })(f);
                }

                async.parallel(funcs, function (err, results) {
                    if (err) {
                        logger.e(err);
                        return res.hjson(req, next, 500, {
                            code: err.code
                        });
                    }
                    next();
                });
            }
            else {
                next();
            }
        };
    };

    S3.prototype.removeFiles = function (bucket) {
        return function (req, res, next) {

            if (req.files) {
                var files = req.files;
                var deleteObject = {
                    Objects: []
                };

                for (var i = 0; i < files.length; ++i) {
                    var path = files[i].path;
                    deleteObject.Objects.push({
                        Key: path
                    });
                }

                s3.deleteObjects({
                    Bucket: bucket,
                    Delete: deleteObject
                }, function (err, data) {
                    if (err) {
                        logger.e(err);
                    }
                });
            }

            next();
        };
    };

    return new S3();
};
