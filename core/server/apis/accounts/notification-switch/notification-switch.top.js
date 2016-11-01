var top = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

top.hasAuthorization = function () {
    return function (req, res, next) {
        if (req.user.role >= req.meta.std.user.roleAdmin) {
            return next();
        }

        if (req.user.id == req.body.userId) {
            return next();
        } else {
            res.hjson(req, next, 403);
        }

        // if (req.params.type == req.meta.std.formApplication) {
        //
        //     req.models.UserNotification.findDataByAuthenticatedId(req.params.id, 'userId', req.user.id, function (status, data) {
        //         if (status == 200) {
        //             req.data = data;
        //             next();
        //         } else {
        //             res.hjson(req, next, status, data);
        //         }
        //     });
        //
        // } else {
        //
        //     req.models.UserPublicNotification.findDataByAuthenticatedId(req.params.id, 'userId', req.user.id, function (status, data) {
        //         if (status == 200) {
        //             req.data = data;
        //             next();
        //         } else {
        //             res.hjson(req, next, status, data);
        //         }
        //     });
        //
        // }

    };
};

module.exports = top;
