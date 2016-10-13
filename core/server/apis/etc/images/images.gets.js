var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');
gets.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var IMAGE = req.meta.std.image;
        var FILE = req.meta.std.file;
        
        if (req.query.last === undefined) req.query.last = MICRO.now();
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        if (req.query.orderBy === undefined) req.query.orderBy = IMAGE.orderCreate;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;

        if (req.query.authorId !== undefined) {
            req.check('authorId', '400_12').isInt();
        } else {
            req.query.authorId = null;
        }
        
        req.check('last', '400_18').isMicroTimestamp();
        req.check('size', '400_5').isInt({min: 1, max: COMMON.loadingMaxLength});
        req.check('orderBy', '400_28').isEnum(IMAGE.enumOrders);
        req.check('sort', '400_28').isEnum(COMMON.enumSortTypes);

        if (req.query.folder !== undefined) {
            req.check('folder', '400_12').isEnum(FILE.enumFolders);
        }

        if (req.query.authorized !== undefined) {
            req.check('authorized', '400_12').isBoolean();
            req.sanitize('authorized').toBoolean();
        }

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.getImages = function () {
    return function (req, res, next) {

        req.models.Image.findImagesByOption(
            req.query,
            function (status, data) {
                if (status == 200) {
                    req.images = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        )
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.images);
    };
};

module.exports = gets;
