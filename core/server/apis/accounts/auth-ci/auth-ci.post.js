var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        if (req.refinedIP != '::ffff:' + req.config.authCi.allowedIp) {
            return res.hjson(req, next, 403);
        }

        var USER = req.meta.std.user;

        req.check('ci', '400_51').len(USER.minCiLength, USER.maxCiLength);
        if (req.body.di !== undefined) {
            req.check('di', '400_51').len(USER.minDiLength, USER.maxDiLength);
        }
        if (req.body.transactionNo !== undefined) {
            req.check('transactionNo', '400_51').len(USER.minTransactionLength, USER.maxTransactionLength);
        }

        if (req.body.name !== undefined) {
            req.check('name', '400_8').len(USER.minNameLength, USER.maxNameLength);
        }

        if (req.body.gender !== undefined) req.check('gender', '400_3').isEnum(USER.enumGenders);
        if (req.body.birthYear !== undefined && req.body.birthMonth !== undefined && req.body.birthDay !== undefined) {
            req.check('birthYear', '400_35').isYear();
            req.check('birthMonth', '400_36').isMonth();
            req.check('birthDay', '400_37').isDay();
            req.sanitize('birthYear').toInt();
            req.sanitize('birthMonth').toInt();
            req.sanitize('birthDay').toInt();
        }

        req.check('phoneNum', '400_7').len(5, 18);

        req.utils.common.checkError(req, res, next);

        next();
    };
};

post.setParams = function () {
    return function (req, res, next) {
        var body = req.body;

        req.models.User.findDataWithQuery({
            where: {
                ci: body.ci
            }
        }, function (status, data) {
            if (status == 200) {

                req.models.User.updateDataById(data.id, {
                    phoneNum: req.query.phoneNum
                }, function (status, data) {
                    if (status == 204) {
                        next();
                    } else {
                        return res.hjson(req, next, status, data);
                    }
                });

            } else {

                req.models.AuthCi.upsertAuthCi(body, function (status, data) {
                    if (status == 200) {
                        next();
                    } else {
                        return res.hjson(req, next, status, data);
                    }
                });

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
