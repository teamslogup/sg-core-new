var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        req.check('slug', '400_8').isAlphanumeric();
        req.utils.common.toArray(req.body, 'categories');

        if (req.body.roleRead !== undefined) {
            req.check('roleRead', '400_3').isEnum(req.meta.std.user.enumRoles);
        }

        if (req.body.roleWrite !== undefined) {
            req.check('roleWrite', '400_3').isEnum(req.meta.std.user.enumRoles);
        }

        if (req.body.isVisible !== undefined) {
            req.check('isVisible', '400_20').isBoolean();
            req.sanitize('isVisible').toBoolean();
        }

        if (req.body.isAnnoy !== undefined) {
            req.check('isAnnoy', '400_20').isBoolean();
            req.sanitize('isAnnoy').toBoolean();
        }

        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.createBoard = function () {
    return function (req, res, next) {
        req.models.Board.createBoardWithCategories(req.body, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 201, req.data);
    };
};

module.exports = post;
