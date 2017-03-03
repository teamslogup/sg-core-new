var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var fs = require('fs');
var path = require('path');
var async = require('async');
var json2csv = require('json2csv');
var events = require('events');
var Converter = require('csvtojson').Converter;
var iconv = require('iconv-lite');
var Iconv = require('iconv').Iconv;
var euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');
var utf82utf8 = new Iconv('UTF-8', 'UTF-8');
var formData = require('form-data');

post.validate = function () {
    return function (req, res, next) {
        var NOTIFICATION = req.meta.std.notification;
        var COMMON = req.meta.std.common;
        if (!req.body.folder || req.body.folder != req.meta.std.file.folderNotification) {
            return res.hjson(req, next, 400, {
                code: "400_3"
            });
        }
        req.check("sendMethod", "400_3").isEnum(NOTIFICATION.enumSendMethods);
        req.check("title", "400_8").len(COMMON.minLength, COMMON.maxLength);
        if (!req.body.message || !req.body.message.length) {
            return res.hjson(req, next, 400, {
                code: "400_8"
            });
        }
        if (req.body.mmsTitle !== undefined) req.check("mmsTitle", "400_8").len(NOTIFICATION.minMmsTitleLength, NOTIFICATION.maxMmsTitleLength);
        req.utils.common.checkError(req, res, next);
    };
};

post.checkNCreatePart = function () {
    return function (req, res, next) {
        var NOTIFICATION = req.meta.std.notification;
        var massNotification = {
            authorId: 1,
            sendType: NOTIFICATION.sendTypeMessage,
            sendMethod: req.body.sendMethod,
            title: req.body.title,
            body: req.body.message,
            massNotificationImportHistory: {
                fileName: req.fileNames[0]
            }
        };
        req.models.MassNotification.createMassNotification(massNotification, function (status, data) {
            if (status == 201) {
                data.reload().then(function (data) {
                    req.massNotification = data;
                    next();
                });
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.series = function () {
    return function (req, res, next) {
        req.wrongDestinationCount = 0;

        var FLAG = req.meta.std.flag;
        var funcs = [];

        funcs.push(function (callback) {
            post.seriesSplitFile(req, callback);
        });

        if (FLAG.isUseS3Bucket) {
            funcs.push(function (callback) {
                post.seriesSendImportFile(req, callback);
            });
        } else {
            funcs.push(function (callback) {
                post.seriesMoveImportFile(req, callback);
            });
        }

        funcs.push(function (callback) {
            post.seriesReadSplitFileCreateMassNotificationPhoneNum(req, callback);
        });

        funcs.push(function (callback) {
            post.seriesRemoveSplitFiles(req, callback);
        });

        funcs.push(function (callback) {
            post.seriesCountMassNotificationPhoneNum(req, callback);
        });

        funcs.push(function (callback) {
            post.seriesFindMassNotificationPhoneNumNSendMessage(req, callback);
        });

        if (FLAG.isUseS3Bucket) {
            funcs.push(function (callback) {
                post.seriesSendMessageFile(req, callback);
            });
        }

        next();

        async.series(funcs, function (errorCode, results) {
            var update = {};
            if (errorCode) {
                update = {
                    errorCode: errorCode
                };
                if (errorCode != "400_66" && errorCode != "400_67" && errorCode != "404_13") {
                    post.seriesRemoveSplitFiles(req, function (err) {
                        if (err) {
                            console.log("remove split files fail");
                        }
                    });
                }
            } else {
                update = {
                    sendCount: req.phoneNumCount,
                    wrongDestinationCount: req.wrongDestinationCount,
                    progress: 100
                };
            }
            req.models.MassNotification.updateDataById(req.massNotification.id, update, function (status, data) {
                if (status == 204) {
                    if (errorCode) {
                        console.log("csv export file error:", errorCode);
                    } else {
                        console.log("csv export progress:", update.progress);
                    }
                } else {
                    console.log("update exportHistory fail", new Date());
                }
            });
        });
    };
};

post.seriesSplitFile = function (req, callback) {
    req.splitTimes = 0;

    var LOCAL = req.meta.std.local;
    var MASS_NOTIFICATION_IMPORT_HISTORY = req.meta.std.massNotificationImportHistory;
    var converter = new Converter({});
    var FILE = req.meta.std.file;
    var COMMON_UTIL = req.coreUtils.common;
    var NOTIFICATION_UTIL = req.coreUtils.notification;
    var maxSize = MASS_NOTIFICATION_IMPORT_HISTORY.maxRawSize;
    var importedFile = '';
    var eventEmitter = new events.EventEmitter();
    eventEmitter.setMaxListeners(eventEmitter.getMaxListeners() + 1);

    if (req.meta.std.flag.isUseS3Bucket) {
        importedFile = path.join(__dirname, "../../../../../" + LOCAL.tempUrl + '/' + req.massNotification.massNotificationImportHistory.fileName);
    } else {
        importedFile = path.join(__dirname, "../../../../../" + LOCAL.uploadUrl + '/' + req.massNotification.massNotificationImportHistory.fileName);
    }
    var splitFile = LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.folderNotification + '/';

    var inputError = false;
    var checkFinish = false;
    var checkIndex = {};

    var phoneNumArray = [];

    fs.createReadStream(importedFile)
        .pipe(euckr2utf8)
        .on('error', function () {
            fs.createReadStream(importedFile)
                .pipe(utf82utf8)
                .on('error', function () {
                    if (!inputError) {
                        inputError = true;
                        COMMON_UTIL.removeLocalFiles(req.files, function (status, data) {
                            if (status == 400) {
                                console.log("remove local file fail:", data.code);
                            }
                            callback("400_66", false);
                        });
                    }
                })
                .pipe(converter)
                .on('error', function () {
                    if (!inputError) {
                        inputError = true;
                        COMMON_UTIL.removeLocalFiles(req.files, function (status, data) {
                            if (status == 400) {
                                console.log("remove local file fail:", data.code);
                            }
                            callback("400_67", false);
                        });
                    }
                });
        })
        .pipe(converter)
        .on('error', function () {
            if (!inputError) {
                inputError = true;
                COMMON_UTIL.removeLocalFiles(req.files, function (status, data) {
                    if (status == 400) {
                        console.log("remove local file fail:", data.code);
                    }
                    callback("400_67", false);
                });
            }
        });

    converter.on("record_parsed", function (resultRow) {
        if (resultRow.phoneNum) {
            phoneNumArray.push({phoneNum: NOTIFICATION_UTIL.massNotification.message.returnPhoneNum(resultRow.phoneNum)});
        } else {
            if (!inputError) {
                inputError = true;
                eventEmitter.emit('inputError', "400_68")
            }
        }
        if (phoneNumArray.length == maxSize) {
            var array = phoneNumArray.slice();
            phoneNumArray = [];
            req.splitTimes++;

            (function (currentTime) {
                var splitFilePath = splitFile + currentTime + req.massNotification.massNotificationImportHistory.fileName;
                NOTIFICATION_UTIL.massNotification.import.writeSplitFile(array, currentTime, ["phoneNum"], splitFilePath, function () {
                    eventEmitter.emit('checkFinish', currentTime);
                }, function (errorCode) {
                    if (!inputError) {
                        inputError = true;
                        eventEmitter.emit('inputError', errorCode);
                    }
                });
            })(req.splitTimes - 1);
        }
    });

    converter.on('end_parsed', function () {
        checkFinish = true;
        if (phoneNumArray.length > 0) {
            req.splitTimes++;
            (function (currentTime) {
                var splitFilePath = splitFile + currentTime + req.massNotification.massNotificationImportHistory.fileName;
                NOTIFICATION_UTIL.massNotification.import.writeSplitFile(phoneNumArray, currentTime, ["phoneNum"], splitFilePath, function () {
                    eventEmitter.emit('checkFinish', currentTime);
                }, function (errorCode) {
                    if (!inputError) {
                        inputError = true;
                        eventEmitter.emit('inputError', errorCode);
                    }
                });
            })(req.splitTimes - 1);
        }
        eventEmitter.emit('checkFinish');
    });

    eventEmitter.on('inputError', function (errorCode) {
        callback(errorCode, false);
    });

    eventEmitter.on('checkFinish', function (currentIndex) {
        if (currentIndex !== undefined) checkIndex[currentIndex] = true;
        if (checkFinish) {
            var isFinish = true;
            for (var i=0; i<req.splitTimes; i++) {
                if (!checkIndex[i]) {
                    isFinish = false;
                    break;
                }
            }
            if (isFinish) {
                if (!inputError) {
                    callback(null, true);
                }
            }
        }
    });
};

post.seriesSendImportFile = function (req, callback) {
    var FILE = req.meta.std.file;
    var LOCAL = req.meta.std.local;
    var importFilePath = path.join(__dirname, "../../../../../" + LOCAL.tempUrl + '/' + req.massNotification.massNotificationImportHistory.fileName);
    var file = {
        path: importFilePath,
        type: 'text/csv'
    };
    var folder = FILE.folderEtc + '/' + FILE.folderNotification;
    req.coreUtils.common.sendToS3(file, folder, function (status, data) {
        if (status == 200) {
            callback(null, true);
        } else {
            callback(data.code, false);
        }
    });
};

post.seriesMoveImportFile = function (req, callback) {
    var FILE = req.meta.std.file;
    var LOCAL = req.meta.std.local;
    var importFilePath = path.join(__dirname, "../../../../../" + LOCAL.uploadUrl + '/' + req.massNotification.massNotificationImportHistory.fileName);
    var filePath = importFilePath.replace(LOCAL.uploadUrl, LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.folderNotification);
    req.coreUtils.common.moveFileDir(importFilePath, filePath, function (status, data) {
        if (status == 204) {
            callback(null, true);
        } else {
            callback(data.code, false);
        }
    });
};

post.seriesReadSplitFileCreateMassNotificationPhoneNum = function (req, callback) {
    var LOCAL = req.meta.std.local;
    var FILE = req.meta.std.file;
    var NOTIFICATION = req.meta.std.notification;
    var funcs = [];

    for (var i=0; i<req.splitTimes; i++) {
        (function (currentTime) {
            var phoneNumArray = [];
            funcs.push(function (subCallback) {
                var converter = new Converter({});
                var splitFilePath = path.join(__dirname, "../../../../../" + LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.folderNotification + '/' + currentTime + req.massNotification.massNotificationImportHistory.fileName);
                fs.createReadStream(splitFilePath)
                    .pipe(iconv.decodeStream('utf8'))
                    .pipe(iconv.encodeStream('utf8'))
                    .pipe(converter);
                converter.on("record_parsed", function (resultRow) {
                    if (resultRow.phoneNum == NOTIFICATION.wrongPhoneNum) {
                        req.wrongDestinationCount++;
                    } else {
                        phoneNumArray.push({phoneNum: resultRow.phoneNum});
                    }
                });
                converter.on("end_parsed", function () {
                    req.models.MassNotificationPhoneNum.createMassNotificationPhoneNums(phoneNumArray, function (status, data) {
                        if (status == 204) {
                            var progress = Math.floor(currentTime * 50 / req.splitTimes);
                            req.models.MassNotification.updateDataById(req.massNotification.id, {
                                progress: progress
                            }, function (status) {
                                if (status == 204) {
                                    console.log("csv export progress:", progress);
                                }
                                subCallback(null, true);
                            });
                        } else {
                            subCallback(data.code, false);
                        }
                    });
                });
            });
        })(i);
    }

    async.series(funcs, function (errorCode, results) {
        if (errorCode) {
            callback(errorCode, false);
        } else {
            callback(null, true);
        }
    });
};

post.seriesRemoveSplitFiles = function (req, callback) {
    var COMMON_UTIL = req.coreUtils.common;
    var LOCAL = req.meta.std.local;
    var FILE = req.meta.std.file;
    var files = [];
    var splitPath = path.join(__dirname, "../../../../../" + LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.folderNotification + '/');
    for (var i=0; i<req.splitTimes; i++) {
        files.push({
            path: splitPath + i + req.massNotification.massNotificationImportHistory.fileName
        });
    }
    COMMON_UTIL.removeLocalFiles(files, function (status, data) {
        if (status == 400) {
            console.log("remove split file fail:", data.code);
        }
        callback(null, true);
    });
};

post.seriesCountMassNotificationPhoneNum = function (req, callback) {
    req.models.MassNotificationPhoneNum.countMassNotificationPhoneNum(function (status, data) {
        if (status == 200) {
            req.phoneNumCount = data;
            callback(null, true);
        } else {
            callback(data.code, false);
        }
    });
};

post.seriesFindMassNotificationPhoneNumNSendMessage = function (req, callback) {
    var NOTIFICATION_UTIL = req.coreUtils.notification;
    var MASS_NOTIFICATION_IMPORT_HISTORY = req.meta.std.massNotificationImportHistory;
    var NOTIFICATION = req.meta.std.notification;
    var funcs = [];
    var file = null;

    if (req.body.sendMethod == NOTIFICATION.sendMethodMms && req.fileNames.length > 1) {
        file = req.files[1];
    }

    var options = {
        size: MASS_NOTIFICATION_IMPORT_HISTORY.maxRawSize
    };

    for (var i=0; i<req.splitTimes; i++) {
        (function (currentTime) {
            funcs.push(function (subCallback) {
                req.models.MassNotificationPhoneNum.findMassNotificationPhoneNums(options, function (status, data) {
                    if (status == 200) {
                        var sendTargetArray = [];
                        for (var i=0; i<data.length; i++) {
                            sendTargetArray.push({
                                phoneNum: data[i].phoneNum,
                                message: req.body.message
                            })
                        }
                        options.last = data[data.length - 1].id;
                        NOTIFICATION_UTIL.massNotification.message.sendAll(req, sendTargetArray, file, function (failArray) {
                            if (failArray) {
                                /**
                                 * fail array method
                                 */
                            }
                            var progress = 50 + Math.floor(currentTime * 50 / req.splitTimes);
                            req.models.MassNotification.updateDataById(req.massNotification.id, {
                                progress: progress
                            }, function (status, data) {
                                if (status == 204) {
                                    console.log("csv export progress:", progress);
                                }
                                subCallback(null, true);
                            });
                        });
                    } else {
                        subCallback(null, true);
                    }
                });
            });
        })(i);
    }

    async.series(funcs, function (errorCode, results) {
        if (errorCode) {
            callback(errorCode, false);
        } else {
            callback(null, true);
        }
    });
};

post.seriesSendMessageFile = function (req, callback) {
    var LOCAL = req.meta.std.local;
    var FILE = req.meta.std.file;
    var messageFilePath = path.join(__dirname, "../../../../../" + LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.folderMessage + '/' + req.massNotification.id + '.csv');
    var file = {
        path: messageFilePath,
        type: 'text/csv'
    };
    var folder = file.folderEtc + '/' + FILE.folderMessage;
    req.coreUtils.common.sendToS3(file, folder, function (status, data) {
        if (status == 200) {
            callback(null, true);
        } else {
            callback(data.code, false);
        }
    });
};

post.supplement = function () {
    return function (req, res, next) {
        res.set('cache-control', 'no-cache, no-store, must-revalidate');
        res.set('pragma',  'no-cache');
        res.set('expires', 0);
        return res.hjson(req, next, 200);
    };
};

module.exports = post;
