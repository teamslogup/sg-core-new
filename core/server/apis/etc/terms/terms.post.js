var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var TERMS = req.meta.std.terms;
        req.check("type", "400_3").isEnum(TERMS.enumTypes);
        var enumCountry = req.coreUtils.common.getCountryEnum(req);
        req.check("country", "400_3").isEnum(enumCountry);
        if (req.body.title !== undefined) req.check("title", "400_8").len(TERMS.minTitleLength, TERMS.maxTitleLength);
        if (req.body.content !== undefined) req.check("content", "400_8").len(TERMS.minTitleLength, TEMRS.maxTitleLength);
        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var body = {
            authorId: req.user.id,
            type: req.body.type,
            country: req.body.country
        };
        if (req.body.title !== undefined) body.title = req.body.title;
        if (req.body.content !== undefined) body.content = req.body.content;
        var instance = req.models.Terms.build(body);
        instance.create(function(status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                req.utils.common.refineError(data, 'name', '400_1');
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
