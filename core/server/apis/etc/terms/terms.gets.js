var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');
gets.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var TERMS = req.meta.std.terms;

        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;
        if (req.query.type !== undefined) req.check("type", "400_3").isEnum(TERMS.enumTypes);
        if (req.query.language !== undefined) {
            var enumLanguages = req.coreUtils.common.getLanguageEnum(req);
            req.check("language", "").isEnum(enumLanguages);
        }

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.setParam = function () {
    return function (req, res, next) {
        var options = {
            sort: req.query.sort,
            language: req.query.language
        };

        req.models.Terms.findTermsByOptions(options, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
