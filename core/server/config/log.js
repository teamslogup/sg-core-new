var CONFIG = require('../../../bridge/config/env');
var META = require('../../../bridge/metadata');
var LOG = META.std.log;

var path = require('path');
var fs = require('fs');
var appRoot = require('app-root-path');

var cron = require('node-cron');
var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: CONFIG.aws.accessKeyId,
    secretAccessKey: CONFIG.aws.secretAccessKey,
    region: CONFIG.aws.region
});

var s3 = new AWS.S3();

var Logger = require('sg-logger');
var logger = new Logger(__filename);

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

module.exports = function () {
    cron.schedule('*/10 * * * * *', function () {

        var logs = fs.readdirSync(appRoot + '/' + LOG.folderName);

        logs.forEach(function (log) {

            if (path.extname(log) === ".gz") {

                var logPath = appRoot + '/' + LOG.folderName + '/' + log;

                sendToS3(logPath, CONFIG.aws.bucketName, LOG.folderName, function (error, data) {
                    if (error) {
                        logger.e(error.code);
                        console.log('error', error.code);
                    } else {
                        fs.unlinkSync(logPath);
                        console.log('deleted', logPath);
                    }
                });
            }
        });
    });
};