var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var moment = require('moment');

del.destroy = function () {
    return function (req, res, next) {
        var now = moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss");
        req.models.Terms.deleteTerms(now, function (status, data) {
            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

del.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = del;
