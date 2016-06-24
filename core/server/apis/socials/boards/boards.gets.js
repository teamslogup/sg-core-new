var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var BOARD = req.meta.std.board;
        // if (req.query.last === undefined) req.query.last = new Date();
        // if (req.query.size === undefined) req.query.size = req.meta.std.common.defaultLoadingLength;
        // req.check('last', '400_18').isDate();
        // req.check('size', '400_5').isInt();

        if (req.query.searchItem === undefined) req.query.searchItem = '';
        if (req.query.option === undefined) req.query.option = '';
        if (req.query.last === undefined) req.query.last = new Date();
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;

        if (req.query.isVisible === undefined) {
            req.query.isVisible = null
        } else {
            req.check('isVisible', '400_28').isEnum(BOARD.enumVisible);

            if (req.query.isVisible == BOARD.enumVisible[0]) {
                req.query.isVisible = null;
            } else if (req.query.isVisible == BOARD.enumVisible[1]) {
                req.query.isVisible = true;
            } else {
                req.query.isVisible = false;
            }
        }

        if (req.query.isAnony === undefined) {
            req.query.isAnony = null;
        } else {
            req.check('isAnony', '400_28').isEnum(BOARD.enumAnony);

            if (req.query.isAnony == BOARD.enumAnony[0]) {
                req.query.isAnony = null;
            } else if (req.query.isAnony == BOARD.enumAnony[1]) {
                req.query.isAnony = true;
            } else {
                req.query.isAnony = false;
            }
        }

        if (req.query.sorted === undefined) {
            req.query.sorted = '';
        } else {
            req.check('sorted', '400_28').isEnum(BOARD.enumSorted);
        }

        req.check('last', '400_18').isDate();
        req.check('size', '400_5').isInt({min: 1, max: COMMON.loadingMaxLength});

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.setParam = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};
        var size = req.query.size;
        var last = req.query.last;
        var where = {};
        // req.models.Board.findBoardForBlog(req.user.role, where, size, last, function (status, data) {
        //     if (status == 200) {
        //         req.data = data;
        //        
        //         next();
        //     } else {
        //         res.hjson(req, next, status, data);
        //     }
        // });

        req.models.Board.findAllBoards(req.query.searchItem, req.query.option, last, size, req.query.isVisible, req.query.isAnony, req.query.sorted, function (status, data) {
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