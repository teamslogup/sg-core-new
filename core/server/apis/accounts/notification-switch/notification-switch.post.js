var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        req.check('notificationSendTypeId', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.createNotificationSwitch = function () {
    return function (req, res, next) {

        var body = {
            userId: req.user.id,
            notificationSendTypeId: req.body.notificationSendTypeId
        };

        var instance = req.models.NotificationSwitch.build(body);
        instance.create(function (status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.instance);
    };
};

module.exports = post;
