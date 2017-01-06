var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        if (req.refinedIP != '::ffff:' + req.config.authCi.allowedIp) {
            return res.hjson(req, next, 403);
        }

        var USER = req.meta.std.user;

        if (req.body.name !== undefined) {
            req.check('name', '400_8').len(USER.minNameLength, USER.maxNameLength);
        }

        if (req.body.gender !== undefined) req.check('gender', '400_3').isEnum(USER.enumGenders);
        console.log(req.body.gender);
        if (req.body.birthYear !== undefined && req.body.birthMonth !== undefined && req.body.birthDay !== undefined) {
            req.check('birthYear', '400_35').isYear();
            req.check('birthMonth', '400_36').isMonth();
            req.check('birthDay', '400_37').isDay();
            req.sanitize('birthYear').toInt();
            req.sanitize('birthMonth').toInt();
            req.sanitize('birthDay').toInt();
        }
        console.log(req.body.birthYear);
        console.log(req.body.birthMonth);
        console.log(req.body.birthDay);

        req.check('phoneNum', '400_7').len(5, 18);
        console.log(req.body.phoneNum);

        req.utils.common.checkError(req, res, next);

        next();
    };
};

post.setParams = function () {
    return function (req, res, next) {

        var body = req.body;
        req.models.AuthCi.upsertAuthCi(body, function (status, data) {
            if (status == 200) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });

    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = post;
