var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var REPORT = req.meta.std.report;
        req.check('id', '400_12').isInt();
        req.check('body', '400_8').len(REPORT.minBodyLength, REPORT.maxBodyLength);
        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.updateReport = function () {
    return function (req, res, next) {
        var update = {
            body: req.body.body
        };
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

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.report);
    };
};

module.exports = put;
