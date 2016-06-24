var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
gets.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var USER = req.meta.std.user;

        if (req.query.searchItem === undefined) req.query.searchItem = '';
        if (req.query.option === undefined) req.query.option = '';
        if (req.query.last === undefined) req.query.last = new Date();
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        if (req.query.order === undefined) req.query.order = USER.orderCreate;
        if (req.query.sorted === undefined) req.query.sorted = USER.DESC;

        req.check('last', '400_18').isDate();
        req.check('size', '400_5').isInt({min: 1, max: COMMON.loadingMaxLength});
        req.check('order', '400_28').isEnum(USER.enumOrders);
        req.check('sorted', '400_28').isEnum(USER.enumSorted);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.getUsers = function () {
    return function (req, res, next) {
        //req.models.User.findAllData()
        req.models.User.findUsersByOption(
            req.query.searchItem,
            req.query.option,
            req.query.last,
            req.query.size,
            req.query.order,
            req.query.sorted,
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
        var temp = [];
        for (var i = 0; i < req.users.length; i++) {
            temp.push(req.users[i].dataValues);
        }
        res.hjson(req, next, 200, temp);
    };
};

module.exports = gets;
