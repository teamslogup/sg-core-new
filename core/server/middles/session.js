module.exports = function () {
    function Session() {
    }

    Session.prototype.loggedIn = function () {
        return function (req, res, next) {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.hjson(req, next, 401);
            }
        }
    };

    Session.prototype.isVerifiedEmailSession = function() {
        return function (req, res, next) {
            if (req.isAuthenticated() && req.user.isVerifiedEmail == true) {
                next();
            } else {
                res.hjson(req, next, 401);
            }
        }
    };

    Session.prototype.loggedIn = function () {
        return function (req, res, next) {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.hjson(req, next, 401);
            }
        }
    };

    Session.prototype.loggedInPoint = function (point) {
        return function (req, res, next) {
            if (req.isAuthenticated() && req.user.point >= point) {
                next();
            } else {
                res.hjson(req, next, 401);
            }
        }
    };

    Session.prototype.hasAuthorization = function (role) {
        return function (req, res, next) {
            if (role) {
                if ((req.isAuthenticated() && req.user.id == req.params.id)
                    || (req.user.role >= role)) {
                    next();
                } else {
                    res.hjson(req, next, 403);
                }
            } else {
                if ((req.isAuthenticated() && req.user.id == req.params.id)
                    || (req.user.role >= req.meta.std.user.roleAdmin)) {
                    next();
                } else {
                    res.hjson(req, next, 403);
                }
            }
        }
    };

    Session.prototype.loggedInRole = function (role) {
        return function (req, res, next) {
            if (req.user && req.user.role >= role) next();
            else res.hjson(req, next, 401);
        }
    };

    Session.prototype.notLoggedIn = function () {
        return function (req, res, next) {
            if (!req.isAuthenticated()) {
                next();
            } else {
                res.hjson(req, next, 403);
            }
        };
    };

    return new Session();
};
