var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {

        req.check('userId', '400_12').isInt();
        req.check('notificationId', '400_12').isInt();

        req.check('switch', '400_20').isBoolean();
        req.sanitize('switch').toBoolean();

        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.updateReport = function () {
    return function (req, res, next) {

        req.models.UserNotification.upsertData({
            userId: req.body.userId,
            notificationId: req.body.notificationId,
            switch: req.body.switch
        }, {
            userId: req.body.userId,
            notificationId: req.body.notificationId
        }, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = put;
