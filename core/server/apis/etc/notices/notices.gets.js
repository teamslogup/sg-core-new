var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function(){
    return function(req, res, next){
        
        var COMMON = req.meta.std.common;
        var NOTICE = req.meta.std.notice;
        // if (req.query.last === undefined) req.query.last = new Date();
        // if (req.query.size === undefined) req.query.size = req.meta.std.common.defaultLoadingLength;
        // req.check('last', '400_18').isDate();
        // req.check('size', '400_5').isInt();
        // if (req.query.type !== undefined) {
        //     req.check('type', '400_3').isEnum(req.meta.std.notice.enumNoticeTypes);
        // }
        // if (req.body.country !== undefined) {
        //     req.check('country', '400_3').isEnum(req.utils.common.getCountryEnum(req));
        // }

        if (req.query.searchItem === undefined) req.query.searchItem = '';
        if (req.query.option === undefined) req.query.option = '';
        if (req.query.last === undefined) req.query.last = new Date();
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        
        if (req.query.country !== undefined) req.check('country', '400_28').isEnum(NOTICE.enumCountries);
        if (req.query.type !== undefined) req.check('type', '400_28').isEnum(NOTICE.enumNoticeTypes);
        if (req.query.sorted !== undefined) req.check('sorted', '400_28').isEnum(NOTICE.enumSorted);

        req.check('last', '400_18').isDate();
        req.check('size', '400_5').isInt({min: 1, max: COMMON.loadingMaxLength});
        
        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.setParam = function() {
    return function(req, res, next) {
        var size = req.query.size;
        var last = req.query.last;

        req.models.Notice.findAllNotices(req.query.searchItem, req.query.option, last, size, req.query.country, req.query.type, req.query.sorted, function(status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function(){
    return function(req, res, next){
        var ret = {
            list: req.data
        };
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
