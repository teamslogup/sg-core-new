var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');
gets.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var USER = req.meta.std.user;

        if (req.query.searchItem === undefined) req.query.searchItem = '';
        if (req.query.searchField === undefined) req.query.searchField = '';
        if (req.query.last === undefined) req.query.last = MICRO.now();
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        if (req.query.orderBy === undefined) req.query.orderBy = USER.orderCreate;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;

        req.check('last', '400_18').isMicroTimestamp();
        req.check('searchField', '400_28').isEnum(USER.enumSearchFields);
        req.check('size', '400_5').isInt({min: 1, max: COMMON.loadingMaxLength});
        req.check('orderBy', '400_28').isEnum(USER.enumOrders);
        req.check('sort', '400_28').isEnum(COMMON.enumSortTypes);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.getUsers = function () {
    return function (req, res, next) {
        req.models.User.findAndCountUsersByOption(
            req.query.searchItem,
            req.query.searchField,
            req.query.last,
            req.query.size,
            req.query.orderBy,
            req.query.sort,
            function (status, data) {
                if (status == 200) {
                    req.users = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.users);
    };
};

module.exports = gets;
