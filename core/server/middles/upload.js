var path = require('path');
var fs = require('fs');
var async = require('async');
var gm = require('gm').subClass({imageMagick: true});
var STD = require('../../../bridge/metadata/standards');
var appRootPath = require("app-root-path").path;

var Logger = require('sg-logger');
var logger = new Logger(__filename);

module.exports = function () {
    function Upload() {
    }

    Upload.prototype.refineFiles = function () {
        return function (req, res, next) {
            req.refineFiles(function (err) {
                if (err) {
                    if (err.message == 'exceed') {
                        return res.hjson(req, next, 400, {
                            code: '400_54'
                        });
                    } else {
                        return res.hjson(req, next, 400, {
                            code: '400_4'
                        });
                    }
                }
                req.fileNames = [];
                req.files.forEach(function (file) {
                    req.fileNames.push(path.basename(file.path));
                });

                next();
            });
        };
    };

    Upload.prototype.checkFileCount = function (min, max) {

        return function (req, res, next) {
            if (req.files) {
                if (!max) max = 99999;
                var len = req.files.length;
                if (len < min || len > max) {
                    return res.hjson(req, next, 400, {code: '400_21'});
                }
            }
            next();
        };
    };

    Upload.prototype.checkFileFormat = function (types) {
        return function (req, res, next) {

            if (req.files) {
                var joinedTypes = types.join("|");
                var f = req.files;
                for (var i = 0; i < f.length; ++i) {
                    var name = f[i].name;
                    var regexp = new RegExp(".(" + joinedTypes + ")$", "i");

                    if (!name.match(regexp)) {
                        return res.hjson(req, next, 400, {code: '400_22'});
                    }
                }
            }
            next();
        };
    };

    Upload.prototype.checkInvalidFileType = function (types) {
        return function (req, res, next) {

            if (req.files) {
                var joinedTypes = types.join("|");
                var f = req.files;
                for (var i = 0; i < f.length; ++i) {
                    var name = f[i].name;
                    var regexp = new RegExp(".(" + joinedTypes + ")$", "i");

                    if (name.match(regexp)) {
                        return res.hjson(req, next, 400, {code: '400_22'});
                    }
                }
            }
            next();
        };
    };

    Upload.prototype.createPrefixName = function () {
        return function (req, res, next) {
            var date = new Date();
            var datePrefix = date.getYear().toString();
            datePrefix = datePrefix.substr(2, 2);
            datePrefix += date.getMonth();
            datePrefix += date.getDay();

            if (req.user) {
                req.prefix = req.user.id + "_" + datePrefix;
            }
            else {
                req.prefix = datePrefix;
            }
            next();
        };
    };

    Upload.prototype.createResizeOptions = function () {
        return function (req, res, next) {

            var FILE = req.meta.std.file;
            req.imageOptions = null;

            if (req.body.folder == FILE.folderUser) {
                req.imageOptions = FILE.userSize;
            }
            else if (req.body.folder == FILE.folderBg) {
                req.imageOptions = FILE.bgSize;
            }
            else {
                req.imageOptions = FILE.commonSize;
            }

            next();
        };
    };

    Upload.prototype.normalizeImages = function () {
        return function (req, res, next) {
            if (req.files && req.files.length > 0) {
                var FILE = req.meta.std.file;

                var funcs = [];

                req.files.forEach(function (file) {

                    funcs.push(function (n) {

                        var filePath = file.path;
                        var dir = path.dirname(filePath);
                        var bn = path.basename(filePath);

                        gm(filePath).size(function (err, value) {

                            if (err) {
                                console.error('size', err, value);
                                return n(err, null);
                            }

                            if (req.body.width == 0) req.body.width = value.width;
                            if (req.body.height == 0) req.body.height = value.height;

                            gm(filePath).crop(req.body.width, req.body.height, req.body.offsetX, req.body.offsetY).stream(function (err, stdout, stderr) {
                                if (err) {
                                    console.error('crop', err);
                                    return n(err, null);
                                }

                                var subFuncs = [];
                                for (var i = 0; i < req.imageOptions.length; ++i) {
                                    (function (i) {
                                        subFuncs.push(function (nn) {

                                            var option = req.imageOptions[i];
                                            if (option.w && option.w > value.width) {
                                                option.w = value.width;
                                            }

                                            if (option.h && option.h > value.height) {
                                                option.h = value.height;
                                            }

                                            // !는 강제로 비율을 맞추는 역할.
                                            var resizePath = dir + '/' + FILE.enumPrefixes[i] + bn;
                                            gm(stdout).quality(75).resize(option.w, option.h).write(resizePath, function (err, stdout, stderr, command) {
                                                if (err) return nn(err, null);
                                                req.files.push({
                                                    path: resizePath,
                                                    type: file.type
                                                });
                                                nn(null, null);
                                            });
                                        });
                                    })(i);
                                }

                                async.parallel(subFuncs, function (err, results) {
                                    if (err) {
                                        n(err, null);
                                    } else {
                                        n(null, null);
                                    }
                                });
                            });
                        });
                    });

                });

                async.parallel(funcs, function (err, results) {
                    if (err) {
                        logger.e(err);
                        return res.hjson(req, next, 400, {
                            code: '400_4'
                        })
                    } else {
                        next();
                    }
                });
            }
            else {
                next();
            }
        };
    };

    Upload.prototype.removeLocalFiles = function () {
        return function (req, res, next) {
            if (!STD.flag.isUseS3Bucket) {
                var localPath = path.join(__dirname, "../../../" + STD.local.uploadUrl + '/');
                for (var i=0; i<req.files.length; i++) {
                    if (req.files[i].path) {
                        req.files[i].path = localPath + req.files[i].path;
                    }
                }
            }
            req.removeLocalFiles(function (err) {
                next();
            });
        };
    };

    Upload.prototype.generateFolder = function (parentFolder) {
        return function (req, res, next) {
            var now = new Date();
            req.dateFolder = now.getUTCFullYear() + '-' + (now.getUTCMonth() + 1) + '-' + now.getUTCDate();
            req.folder = parentFolder + '/' + req.body.folder + '/' + req.dateFolder;
            next();
        };
    };

    Upload.prototype.moveFileDir = function () {
        return function (req, res, next) {
            if (req.files && req.folder) {
                var stat = fs.existsSync(appRootPath + '/' + STD.local.uploadUrl + '/' + req.folder);
                if (!stat) {
                    fs.mkdirSync(appRootPath + '/' + STD.local.uploadUrl + '/' + req.folder);
                }

                var files = req.files;
                var funcs = [];

                for (var i = 0; i < files.length; ++i) {
                    var file = files[i];
                    (function (file) {
                        funcs.push(function (n) {
                            var originPath = file.path;
                            file.path = file.path.replace(STD.local.uploadUrl + '/', STD.local.uploadUrl + '/' + req.folder + '/');
                            fs.rename(originPath, file.path, function (err) {
                                if (err) {
                                    n(err, null);
                                } else {
                                    n(null, true);
                                }
                            });
                        });
                    })(file);
                }

                async.parallel(funcs, function (err, results) {
                    if (err) {
                        console.error(err);
                        return res.hjson(req, next, 500);
                    }
                    return next();
                });
            } else {
                next();
            }
        };
    };

    return new Upload();
};