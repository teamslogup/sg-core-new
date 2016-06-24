var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function(){
    return function(req, res, next){
        req.check('id', '400_17').isInt();
        req.utils.common.checkError(req, res, next);
        next();
    };
};

del.updateFields = function() {
    return function(req, res, next) {
        var deletedUserPrefix = req.config.app.deletedUserPrefix;
        req.models.User.updateDataById(req.params.id, {
            nick: deletedUserPrefix + req.params.id,
            phoneNum: deletedUserPrefix + req.params.id,
            email: deletedUserPrefix + req.params.id
        }, function (status, data) {
            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

del.setParam = function() {
    return function(req, res, next) {
        req.models.User.destroyDataById(req.params.id, true, function (status, data) {
            if (status == 204) {
                return res.hjson(req, next, 204);
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

del.supplement = function(){
    return function(req, res, next){
        res.hjson(req, next, 204);
    };
};

module.exports = del;