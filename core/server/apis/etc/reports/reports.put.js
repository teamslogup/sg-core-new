var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var REPORT = req.meta.std.report;
        var MAGIC = req.meta.std.magic;
        req.check('id', '400_12').isInt();

        if (req.body.body !== undefined) req.check('body', '400_8').len(REPORT.minBodyLength, REPORT.maxBodyLength);
        if (req.body.reply !== undefined && req.body.reply !== MAGIC.reset) req.check('reply', '400_8').len(REPORT.minReplyLength, REPORT.maxReplyLength);
        if (req.body.isSolved !== undefined) req.check('isSolved', '400_20').isBoolean();
        
        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.updateReport = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;
        var update = req.body;
        if (update.reply == MAGIC.reset) update.reply = null;

        req.report.updateFields(update, function (status, data) {
            if (status == 200) {
                req.report = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.sendNotifications = function () {

};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.report);
    };
};

module.exports = put;
