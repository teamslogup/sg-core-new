var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_17').isInt();
        req.utils.common.checkError(req, res, next);
        next();
    };
};

del.checkUser = function () {
    return function (req, res, next) {
        req.models.User.findUserById(req.params.id, function (status, data) {
            if (status == 200) {
                req.foundUser = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

del.updateFields = function () {
    return function (req, res, next) {
        /*
         탈퇴시에는 모든 정보를 폐기해야한다. 단 요청에 의해서 몇개월간 개인정보를 보관해야할 필요가 있는데,
         이럴땐 del-user 테이블을 이용하여 임시저장 처리해야한다.
         */
        var removePrivacy = function () {
            var deletedUserPrefix = req.config.app.deletedUserPrefix;
            req.models.User.updateDataById(req.params.id, {
                aid: deletedUserPrefix + req.params.id,
                email: deletedUserPrefix + req.params.id,
                phoneNum: deletedUserPrefix + req.params.id,
                name: deletedUserPrefix + req.params.id,
                nick: deletedUserPrefix + req.params.id
            }, function (status, data) {
                if (status == 204) {
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }
            });
        };

        // 탈퇴유저 개인정보 보관 일 수가 0보다 클때는 저장해야함.
        if (req.meta.std.user.deletedUserStoringDay > 0) {
            var userDel = req.models.ExtinctUser.build({
                userId: req.params.id,
                data: JSON.stringify(req.foundUser)
            });
            userDel.create(function (status, data) {
                if (status == 200) {
                    removePrivacy();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        } else {
            removePrivacy();
        }
    };
};

del.setParam = function () {
    return function (req, res, next) {
        req.models.User.destroyDataById(req.params.id, true, function (status, data) {
            if (status == 204) {
                return res.hjson(req, next, 204);
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

del.supplement = function () {
    return function (req, res, next) {
        req.logout();
        res.hjson(req, next, 204);
    };
};

module.exports = del;