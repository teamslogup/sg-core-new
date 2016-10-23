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
                if (req.user.id != data.userId) {
                    return res.hjson(req, next, 403);
                }
                var sessionId = data.session;
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
    };
};

module.exports = del;
