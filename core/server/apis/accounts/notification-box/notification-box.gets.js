var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var micro = require('microtime-nodejs');

gets.validate = function () {
    return function (req, res, next) {

        var NOTIFICATION_BOX = req.meta.std.notificationBox;
        var COMMON = req.meta.std.common;

        if (req.query.last === undefined) req.query.last = micro.now();
        if (req.query.size === undefined) req.query.size = NOTIFICATION_BOX.defaultLoadingLength;
        req.check('last', '400_18').isMicroTimestamp();
        req.check('size', '400_5').isInt();

        if (req.query.offset === undefined) {
            req.query.offset = 0;
        } else {
            req.check('offset', '400_5').isInt();
        }

        if (req.query.orderBy === undefined) {
            req.query.orderBy = NOTIFICATION_BOX.defaultOrderBy;
        } else {
            req.check('orderBy', '400_3').isEnum(NOTIFICATION_BOX.enumOrders);
        }

        if (req.query.sort === undefined) {
            req.query.sort = COMMON.DESC;
        } else {
            req.check('sort', '400_3').isEnum(COMMON.enumSortTypes);
        }

        req.check('userId', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.setParam = function () {
    return function (req, res, next) {

        req.models.NotificationBox.findNotificationBoxesByOptions(req.query, function (status, data) {
            req.data = data;
            next();
        });

    };
};

gets.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;