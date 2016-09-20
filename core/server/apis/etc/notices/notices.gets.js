var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var micro = require('microtime');

gets.validate = function () {
    return function (req, res, next) {

        var COMMON = req.meta.std.common;
        var NOTICE = req.meta.std.notice;
        var enumCountry = req.coreUtils.common.getCountryEnum(req);
        
        if (req.query.searchItem === undefined) req.query.searchItem = '';
        if (req.query.searchField === undefined) req.query.searchField = '';
        if (req.query.last === undefined) req.query.last = micro.now();
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;

        if (req.query.country !== undefined) req.check('country', '400_28').isEnum(enumCountry);
        if (req.query.type !== undefined) req.check('type', '400_28').isEnum(NOTICE.enumNoticeTypes);
        if (req.query.sort !== undefined) req.check('sort', '400_28').isEnum(COMMON.enumSortTypes);

        req.check('last', '400_18').isMicroTimestamp();
        req.check('size', '400_5').isInt({min: 1, max: COMMON.loadingMaxLength});

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.setParam = function () {
    return function (req, res, next) {
        var size = req.query.size;
        var last = req.query.last;

        req.models.Notice.findAllNotices(req.query.searchItem, req.query.searchField, last, size, req.query.country, req.query.type, req.query.sort, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        var ret = {
            rows: req.data
        };
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
