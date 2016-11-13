var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        req.check('termsId', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.isOptionalTerms = function () {
    return function (req, res, next) {

        var TERMS = req.meta.std.terms;

        req.models.Terms.findDataById(req.body.termsId, function (status, data) {
            if (status == 200) {
                if(data.type == TERMS.typeOptional){
                    next();
                } else {
                    return res.hjson(req, next, 404);
                }

            } else {
                return res.hjson(req, next, status, data);
            }
        });

    };
};

post.setParam = function () {
    return function (req, res, next) {
        var body = {
            userId: req.user.id,
            termsId: req.body.termsId,
        };
        var instance = req.models.OptionalTerms.build(body);
        instance.create(function (status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 201, req.instance);
    };
};

module.exports = post;
