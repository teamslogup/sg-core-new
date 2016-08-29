export default function sessionManager(Session, usersManager, metaManager, SenderEmail, Pass) {
    var currentSession = window.session || null;
    this.session = (currentSession.id && currentSession) || {};
    this.isLoggedIn = isLoggedIn;
    this.loginWithPhone = loginWithPhone;
    this.loginWithEmail = loginWithEmail;
    this.logout = logout;
    this.signup = signup;
    this.getSession = getSession;
    this.sendFindPassEmail = sendFindPassEmail;
    this.changePassWithToken = changePassWithToken;

    function sendFindPassEmail(email, callback) {
        var body = {
            type: metaManager.std.user.emailSenderTypeFindPass,
            email: email
        };
        var senderEmail = new SenderEmail(body);
        senderEmail.$save(function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function changePassWithToken(newPass, token, callback) {
        var where = {};
        var body = {
            'newPass': newPass,
            'token': token
        };
        Pass.update(where, body, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data);
        });
    }

    function isLoggedIn() {
        return currentSession && currentSession.id ? true : false;
    }

    function loginWithPhone(phoneNumber, authNum, callback) {
        var body = {
            type: metaManager.std.user.signUpTypePhone,
            uid: phoneNumber,
            secret: authNum
        };
        var self = this;
        var session = new Session(body);
        session.$save(function (data) {
            currentSession = self.session = data;
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function loginWithEmail(email, pass, callback) {
        var body = {
            type: metaManager.std.user.signUpTypeEmail,
            uid: email,
            secret: pass
        };
        var self = this;
        var session = new Session(body);
        session.$save(function (data) {
            currentSession = self.session = data;
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function logout(callback) {
        if (currentSession && currentSession.id) {
            var self = this;
            var session = new Session(self.session);
            session.$delete(function () {
                currentSession = self.session = null;
                callback(204);
            }, function (data) {
                callback(data.status, data.data);
            });
        }
    }

    function getSession(callback) {
        var self = this;
        Session.get({}, function (data) {
            currentSession = self.session = data;
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function signup(body, callback) {
        var self = this;
        usersManager.signup(body, function (status, data) {
            if (status == 201) {
                currentSession = self.session = data;
            }
            callback(status, data);
        });
    }
}