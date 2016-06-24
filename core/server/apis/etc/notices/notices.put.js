var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var NOTICE = req.meta.std.notice;
        req.check('title', '400_8').len(NOTICE.minTitleLength, NOTICE.maxTitleLength);
        req.check('body', '400_8').len(NOTICE.minBodyLength, NOTICE.maxBodyLength);
        req.check('type', '400_8').len(NOTICE.minBodyLength, NOTICE.maxBodyLength);
        if (req.body.country !== undefined) {
            req.check('country', '400_3').isEnum(req.coreUtils.common.getCountryEnum(req));
        }
        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.updateReport = function () {
    return function (req, res, next) {
        var update = req.body;
        req.models.Notice.updateDataById(req.params.id, update, function (status, data) {
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
