var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.destroy = function () {
    return function (req, res, next) {
        req.models.Terms.deleteTerms(function (status, data) {
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
