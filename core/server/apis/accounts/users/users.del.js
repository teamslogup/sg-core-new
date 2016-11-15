var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var async = require('async');

del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_17').isInt();
        req.utils.common.checkError(req, res, next);
        next();
    };
};

del.removeAllSessions = function () {
    return function (req, res, next) {
        req.coreUtils.session.removeAllLoginHistoriesAndSessions(req, req.user.id, function(status, data) {
            if (status == 204) {
                next();
            }
            else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

del.destroyUser = function () {
    return function (req, res, next) {

        // function sample(t, callback) {
        //     return req.models.Report.destroy({
        //         where: {id: 1},
        //         transaction: t
        //     }).then(function (data) {
        //         console.log('Report.destroy', data);
        //         callback(t);
        //     });
        // }

        req.models.User.destroyUser(req.params.id, null, function (status, data) {
            if (status == 204) {
                res.hjson(req, next, 204);
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

module.exports = del;