var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        req.check('imageIds', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.setParam = function () {
    return function (req, res, next) {

        var body = {};

        if (req.body.imageIds !== undefined) body.imageIds = req.body.imageIds;

        var instance = req.models.AppUserImage.build(body);
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
        req.instance.reload().then(function () {
            res.hjson(req, next, 200, req.instance);
        });
    };
};

module.exports = post;