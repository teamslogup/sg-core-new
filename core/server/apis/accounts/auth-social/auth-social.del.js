var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        const USER = req.meta.std.user;
        req.check('provider', '400_3').isEnum(USER.enumProviders);
        req.utils.common.checkError(req, res, next);
        next();
    };
};

del.removeProvider = function () {
    return function (req, res, next) {
        var isSearched = false;
        var providers = req.user.providers;
        var body = req.body;
        for (var i = 0; i < providers.length; ++i) {
            if (providers[i].type == body.provider) {
                isSearched = true;
                break;
            }
        }

        if (isSearched == false) {
            return res.hjson(req, next, 403);
        }
        
        var provider = providers[i];
        req.models.Provider.destroyData({
            id: provider.id
        }, false, function(status, data) {
            if (status == 204) {
                next();
            } else {
                res.hjson(req, next, status, data);
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
