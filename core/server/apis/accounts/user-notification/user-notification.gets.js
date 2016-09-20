var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime');

gets.validate = function () {
    return function (req, res, next) {

        req.check('userId', '400_17').isInt();

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.setParam = function () {
    return function (req, res, next) {

        var where = {
            userId: req.loadedUser.id
        };

        req.models.UserNotification.findAllDataForQuery({
            where: where
        }, function (status, data) {
            req.data = data;
            next();
        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        var ret = {
            rows: req.data
        };
        res.hjson(req, next, 200, ret);
    };
};

module.exports = gets;
