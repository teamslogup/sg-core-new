var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime');
gets.validate = function(){
    return function(req, res, next){
        var COMMON = req.meta.std.common;
        var TERMS = req.meta.std.terms;
        if (req.query.orderBy === undefined) req.query.orderBy = TERMS.defaultOrderBy;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;
        if (req.query.last === undefined) req.query.last = MICRO.now();
        if (req.query.size === undefined) req.query.size = COMMON.loadingMaxLength;

        if (req.query.searchItem !== undefined) req.check("searchItem", "400_8").len(COMMON.minSearchLength, COMMON.maxSearchLength);
        if (req.query.searchField !== undefined) req.check("searchField", "400_3").isEnum(TERMS.enumSearchFields);
        if (req.query.orderBy !== undefined) req.check("orderBy", "400_3").isEnum(TERMS.enumOrderBys);
        if (req.query.sort !== undefined) req.check("sort", "400_3").isEnum(COMMON.enumSortTypes);
        if (req.query.last !== undefined) req.check("last", "400_18").isMicroTimestamp();
        if (req.query.size !== undefined) req.check("size", "400_5").isInt({
            min: 1,
            max: COMMON.loadingMaxLength
        });
        if (req.query.type !== undefined) req.check("type", "400_3").isEnum(TERMS.enumTypes);
        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.setParam = function() {
    return function(req, res, next) {
        var options = {
            orderBy: req.query.orderBy,
            sort: req.query.sort,
            last: req.query.last,
            size: req.query.size
        };
        if (req.query.searchItem !== undefined) options.searchItem = req.query.searchItem;
        if (req.query.searchField !== undefined) options.searchField = req.query.searchField;
        if (req.query.type !== undefined) options.type = req.query.type;
        if (req.user) options.user = req.user;
        req.models.Terms.findTermsByOptions(options, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function(){
    return function(req, res, next){
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
