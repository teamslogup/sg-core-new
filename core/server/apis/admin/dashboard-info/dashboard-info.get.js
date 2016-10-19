var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');
get.validate = function () {
    return function (req, res, next) {

        var DASHBOARD_INFO = req.meta.std.dashboardInfo;

        req.check('year', '400_28').isYear();
        req.check('months', '400_28').isMonthArray(DASHBOARD_INFO.minMonthArrayLength, DASHBOARD_INFO.maxMonthArrayLength);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

get.getUsersStatus = function () {
    return function (req, res, next) {
        req.data = {};

        req.models.User.getUsersStatus(
            function (status, data) {
                if (status == 200) {
                    req.data.usersStatus = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

get.getUsersStatusByMonth = function () {
    return function (req, res, next) {
        req.query.months = req.query.months.split(',');

        req.models.User.getUsersStatusByMonth(req.query.year, req.query.months, function (status, data) {
                if (status == 200) {
                    req.data.usersStatusByMonth = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

get.getReportsStatus = function () {
    return function (req, res, next) {

        req.models.Report.getReportsStatus(
            function (status, data) {
                if (status == 200) {
                    req.data.reportsStatus = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

get.getReportsStatusByMonth = function () {
    return function (req, res, next) {

        req.models.Report.getReportsStatusByMonth(req.query.year, req.query.months, function (status, data) {
                if (status == 200) {
                    req.data.reportsStatusByMonth = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

get.getImagesStatus = function () {
    return function (req, res, next) {

        req.models.Image.getImagesStatus(
            function (status, data) {
                if (status == 200) {
                    req.data.imagesStatus = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = get;
