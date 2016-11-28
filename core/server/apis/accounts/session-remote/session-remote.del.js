var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
        next();
    };
};

del.logout = function () {
    return function (req, res, next) {
        req.models.LoginHistory.findDataById(req.body.id, function (status, data) {
            if (status == 200) {
                var user = data;
                req.models.LoginHistory.destroyDataById(req.body.id, null, function(status, data) {
                    if (status == 204) {
                        if (req.user.id != user.userId) {
                            return res.hjson(req, next, 403);
                        }
                        var sessionId = user.session;
                        req.sessionStore.destroy(sessionId, function(err) {

                            if (err) {
                                res.hjson(req, next, 500);
                            } else {
                                res.hjson(req, next, 204);
                            }
                        });
                    } else {
                        res.hjson(req, next, status, data);
                    }
                });
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

module.exports = del;
