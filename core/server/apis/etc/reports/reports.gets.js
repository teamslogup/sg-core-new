var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var REPORT = req.meta.std.report;

        // if (req.query.last === undefined) req.query.last = new Date();
        // if (req.query.size === undefined) req.query.size = req.meta.std.common.defaultLoadingLength;
        // req.check('last', '400_18').isDate();
        // req.check('size', '400_5').isInt();
        // if (req.query.userId !== undefined) req.check('userId', '400_12').isInt();

        if (req.query.searchItem === undefined) req.query.searchItem = '';
        if (req.query.option === undefined) {
            req.query.option = '';
        } else {
            req.check('order', '400_28').isEnum(REPORT.enumOptions);
        }
        if (req.query.last === undefined) req.query.last = new Date();
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;

        if (req.query.isSolved === undefined) {
            req.query.isSolved = null;
        } else {
            req.check('isSolved', '400_28').isEnum(REPORT.enumOrders);

            if(req.query.isSolved == REPORT.enumOrders[0]){
                req.query.isSolved = null
            } else if(req.query.isSolved == REPORT.enumOrders[1]){
                req.query.isSolved = false
            } else {
                req.query.isSolved = true
            }
        }
        if (req.query.sorted === undefined) {
            req.query.sorted = '';
        } else {
            req.check('sorted', '400_28').isEnum(REPORT.enumSorted);
        }

        req.check('last', '400_18').isDate();
        req.check('size', '400_5').isInt({min: 1, max: COMMON.loadingMaxLength});

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.setParam = function () {
    return function (req, res, next) {
        // var size = req.query.size;
        // var last = req.query.last;
        // var where = {};
        //
        // // 어드민이 아니라면 자신의 것만 볼수 있음.
        // if (req.user.role < req.meta.std.user.roleAdmin) {
        //     req.query.authorId = req.user.id;
        //     delete req.query.email;
        //     delete req.query.nick;
        // }
        // req.models.Report.findAllReports(size, last, req.query.authorId, req.query.email, req.query.nick, req.query.order, function(status, data) {
        //     if (status == 200) {
        //         req.data = data;
        //         next();
        //     } else {
        //         res.hjson(req, next, status, data);
        //     }
        // });

        if (req.user.role < req.meta.std.user.roleAdmin) {
            req.query.authorId = req.user.id;
            delete req.query.email;
            delete req.query.nick;
        }

        req.models.Report.findAllReports(req.query.searchItem, req.query.option, req.query.last, req.query.size, req.query.isSolved, req.query.sorted, function (status, data) {
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
            list: req.data
        };
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
