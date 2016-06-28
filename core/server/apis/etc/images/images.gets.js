var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime');
gets.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var IMAGE = req.meta.std.image;
        
        if (req.query.last === undefined) req.query.last = MICRO.now();
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        if (req.query.orderBy === undefined) req.query.orderBy = IMAGE.orderCreate;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;

        if (req.query.authorId !== undefined) {
            req.check('authorId', '400_12').isInt();
        } else {
            req.query.authorId = null;
        }
        
        req.check('last', '400_12').isMicroTimestamp();
        req.check('size', '400_5').isInt({min: 1, max: COMMON.loadingMaxLength});
        req.check('orderBy', '400_28').isEnum(IMAGE.enumOrders);
        req.check('sort', '400_28').isEnum(COMMON.enumSortTypes);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.getImages = function () {
    return function (req, res, next) {
        req.models.Image.findImagesByOption(
            req.query.authorId,
            req.query.last,
            req.query.size,
            req.query.orderBy,
            req.query.sort,
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
        var temp = [];
        for (var i = 0; i < req.images.length; i++) {
            temp.push(req.images[i].dataValues);
        }
        res.hjson(req, next, 200, temp);
    };
};

module.exports = gets;
