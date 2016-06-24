var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {

        var USER = req.meta.std.user;

        // token 값이 없으면 반드시 로그인 되어 있는 상태로 바꿔야한다.
        // token 값이 유효하면 로그인 되어 있지 않아도 바꿀 수 있다.
        if (req.body.token === undefined && !req.isAuthenticated()) {
            return res.hjson(req, next, 401);
        }

        // 이메일이 없으면 로그인이 되어 있더라도 비밀번호를 설정 할 수 없다.
        if (req.isAuthenticated() && !req.user.email) {
            return res.hjson(req, next, 403);
        }

        // newPass는 반드시 필요하다.
        req.check('newPass', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);

        // 토큰값이 있으면 토큰을 검사하고, 없으면 oldPass를 검사한다. 즉 둘중 하나는 무조건 있어야 한다.
        if (req.body.token !== undefined) req.check('token', '400_17').len(1, 2000);
        else req.check('oldPass', '400_2').len(USER.minSecretLength, USER.maxSecretLength);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.loadUser = function () {
    return function (req, res, next) {

        // 토큰이 있는 경우 토큰값을 통해서 유저를 로드해야한다.
        if (req.body.token !== undefined) {

            // 1. 토큰값으로 인증객체 조회.
            req.models.Auth.checkValidEmailToken({token: req.body.token}, req.body.token, function (status, data) {
                if (status == 404) {
                    return res.hjson(req, next, status, {code: '404_5'});
                } else if (status == 403) {
                    return res.hjson(req, next, status, {code: '403_4'});
                } else if (status == 200){
                    req.auth = data;
                    // 2. 얻어온 인증객체의 key값을 통해서 이메일을 얻어오고 해당 이메일의 유저를 로드함.
                    req.models.User.findUserByEmail(req.auth.key, function (status, data) {
                        if (status == 200) {
                            req.user = data;
                            next();
                        } else {
                            return res.hjson(req, next, data.status, data.body);
                        }
                    });
                } else {
                    return res.hjson(req, next, status, data);
                }
            });
        }
        else {
            next();
        }
    };
};

put.changePassword = function () {
    return function (req, res, next) {

        // 토큰 값이 없으면 로그인 된 상태에서 이전 비번값을 확인.
        // 토큰 값이 있으면 바로 넘어감.
        if ((req.body.token === undefined && req.user.authenticate(req.body.oldPass))
            || req.body.token !== undefined) {

            // req.auth가 없으면 auth지우는 작업을 하지 않는다.
            var user = req.user;
            user.changePassword(req.auth, req.body.newPass, function(status, data) {
                if (status == 200) {
                    req.user = data;
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }
            });

        } else {
            return res.hjson(req, next, 403, {
                code: '403_1'
            });
        }
    };
};

put.supplement = function () {
    return function (req, res, next) {

        // 토큰이 있으면 로그인 시키고 종료함.
        if (req.body.token !== undefined) {
            req.login(req.user, function (err) {
                if (err) {
                    return res.hjson(req, next, 400);
                }
                return res.hjson(req, next, 204);
            });
        }
        else {
            res.hjson(req, next, 204);
        }
    };
};

module.exports = put;
