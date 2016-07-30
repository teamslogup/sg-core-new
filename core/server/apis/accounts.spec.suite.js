var app = require('../../../app');
var request = require('supertest');
var should = require('should');
var tester = require('../utils/response-tester');
var util = require('util');

var META = require('../../../bridge/metadata/index');
var STD = META.std;
var resform = require('../resforms');
var Super = require('./super.spec.suite');


var url = {
    users: "/api/accounts/users",
    session: "/api/accounts/session",
    extinctUsers: "/api/accounts/extinct-users",
    senderPhone: "/api/accounts/sender-phone",
    authEmail: "/api/accounts/auth-email",
    socialSession: "/api/accounts/social-session",
    senderEmail: "/api/accounts/sender-email",
    authPhone: "/api/accounts/auth-phone",
    authIdPass: "/api/accounts/auth-id-pass",
    authSocial: "/api/accounts/auth-social",
    pass: "/api/accounts/pass"
};

function Account(fixture) {
    fixture.deviceToken = (Math.random() * 100000000) % 100000000 + 123412;
    Account.super_.call(this, fixture);
    this.authToken = '';
}

util.inherits(Account, Super);

Account.prototype.loadUser = function (callback) {
    var self = this;
    request(app).get(url.users + "/" + self.getData('id'))
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.data = res.body;
            callback();
        });
};

Account.prototype.sendPhoneAuth = function (callback) {
    var self = this;
    request(app).post(url.senderPhone)
        .send({
            phoneNum: self.getFixture('uid'),
            type: STD.user.phoneSenderTypeSignUp
        })
        .end(function (err, res) {
            res.status.should.exactly(200);
            res.body.should.be.an.String;
            self.setFixture('secret', res.body);
            callback();
        });
};

Account.prototype.signup = function (callback) {
    var self = this;
    request(app).post(url.users)
        .set("Cookie", self.cookie)
        .send(self.fixture)
        .end(function (err, res) {
            if (res.status !== 201) {
                console.error(res.body);
            }
            res.status.should.exactly(201);
            self.cookie = res.header['set-cookie'][0];
            self.data = res.body;
            if (self.data.auth && self.data.auth.token) {
                self.authToken = self.data.auth.token;
            }
            tester.do(resform.user, self.data);
            callback();
        });
};

Account.prototype.logout = function (callback) {
    var self = this;
    request(app).del(url.session)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(204);
            self.cookie = res.header['set-cookie'][0];
            callback();
        });
};

Account.prototype.loginEmail = function (callback) {
    var self = this;
    request(app).post(url.session)
        .set("Cookie", self.cookie)
        .send({
            type: STD.user.signUpTypeEmail,
            uid: self.fixture.uid,
            secret: self.fixture.secret
        })
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.cookie = res.header['set-cookie'][0];
            self.data = res.body;
            tester.do(resform.user, self.data);
            callback();
        });
};

Account.prototype.verifyEmail = function (callback) {
    var self = this;
    request(app).get(url.authEmail + "?token=" + self.authToken)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.data = res.body;
            tester.do(resform.user, self.data);
            self.data.isVerifiedEmail.should.exactly(true);
            callback();
        });
};

Account.prototype.verifyEmailFail = function (callback) {
    var self = this;
    request(app).get(url.authEmail + "?token=" + self.authToken)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.within(400, 404);
            callback();
        });
};

Account.prototype.loginNormalId = function (callback) {
    var self = this;
    request(app).post(url.session)
        .set("Cookie", self.cookie)
        .send({
            type: STD.user.signUpTypeNormalId,
            uid: self.getFixture('uid'),
            secret: self.getFixture('secret')
        })
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.cookie = res.header['set-cookie'][0];
            self.data = res.body;
            tester.do(resform.user, self.data);
            callback();
        });
};

Account.prototype.loginSocial = function (callback) {
    var self = this;
    request(app).post(url.socialSession)
        .set("Cookie", self.cookie)
        .send({
            provider: STD.user.providerFacebook,
            pid: self.getFixture('uid'),
            accessToken: self.getFixture('secret')
        })
        .end(function (err, res) {
            if (res.status !== 200) console.error(res.body);
            res.status.should.exactly(200);
            self.data = res.body;
            tester.do(resform.user, self.data);
            callback();
        });
};

Account.prototype.removeAccount = function (callback) {
    var self = this;
    request(app).del(url.users + "/" + self.data.id)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(204);
            self.cookie = '';
            callback();
        });
};

Account.prototype.loadExtinct = function (id, callback) {
    var self = this;
    request(app).get(url.extinctUsers + "/" + id)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(200);
            tester.do(resform.user, self.data);
            callback();
        });
};

Account.prototype.loadAllExtincts = function (callback) {
    var self = this;
    request(app).get(url.extinctUsers)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(200);
            res.body.should.have.property('list');
            res.body.list.length.should.greaterThan(0);
            tester.do([resform.user], res.body.list);
            callback();
        });
};

Account.prototype.removeExtincts = function (callback) {
    var self = this;
    request(app).del(url.extinctUsers)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(204);
            callback();
        });
};

Account.prototype.changePassword = function (pass, callback) {
    var self = this;
    request(app).put(url.pass)
        .set("Cookie", self.cookie)
        .send({
            newPass: pass
        })
        .end(function (err, res) {
            res.status.should.exactly(204);
            callback();
        });
};


/**
 * account link methods.
 phone
 - aid, apass > authIdPass
 - email, apass > authIdPass
 - email > sender-email > auth-email : sender-email만 해도 email은 등록되고 auth-email을 통해서 인증된 이메일로 바꿔야함.
 - social > auth-social
 - phone > sender-phone > auth-phone : 번호 변경시

 phoneId
 - email
 - social
 - phone > sender-phone > auth-phone : 번호 변경시

 normalId
 - email
 - phone
 - social

 email
 - phone
 - social

 social
 - aid, apass
 - email, apass
 - email
 - phone
 */

Account.prototype.removeEmail = function (callback) {
    var self = this;
    request(app).del(url.authEmail + "/" + self.data.id)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.data = res.body;
            tester.do(resform.user, self.data);
            self.data.should.property('email', null);
            callback();
        });
};

Account.prototype.removePhone = function (callback) {
    var self = this;
    request(app).del(url.authPhone + "/" + self.data.id)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.data = res.body;
            tester.do(resform.user, self.data);
            self.data.should.property('phoneNum', null);
            callback();
        });
};

Account.prototype.addSocial = function (provider, id, accessToken, callback) {
    var self = this;
    request(app).post(url.authSocial)
        .set("Cookie", self.cookie)
        .send({
            provider: provider,
            id: id,
            accessToken: accessToken
        })
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.data = res.body;
            tester.do(resform.user, self.data);
            var providers = self.data.providers;
            providers.length.should.greaterThan(0);

            for (var i = 0; i < providers.length; ++i) {
                if (providers[i].type == provider) {
                    providers[i].uid.should.exactly(id);
                }
            }

            callback();
        });
};

Account.prototype.removeSocial = function (provider, callback) {
    var self = this;
    request(app).del(url.authSocial + "/" + self.data.id)
        .set("Cookie", self.cookie)
        .send({
            provider: provider
        })
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.data = res.body;
            tester.do(resform.user, self.data);
            var providers = self.data.providers;

            for (var i = 0; i < providers.length; ++i) {
                if (providers[i].type == provider) {
                    should.throw("error");
                }
            }

            callback();
        });
};

Account.prototype.addIdAndPass = function (type, id, pass, callback) {
    var self = this;
    request(app).post(url.authIdPass)
        .set("Cookie", self.cookie)
        .send({
            type: type,
            id: id,
            pass: pass
        })
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.data = res.body;
            tester.do(resform.user, self.data);
            self.data.aid.should.exactly(id);
            callback();
        });
};

Account.prototype.addEmailIdAndPass = function (id, pass, callback) {
    this.addIdAndPass(STD.user.linkIdPassEmail, id, pass, callback);
};

Account.prototype.addNormalIdAndPass = function (id, pass, callback) {
    this.addIdAndPass(STD.user.linkIdPassNormal, id, pass, callback);
};

Account.prototype.sendAddingEmailAuth = function (email, callback) {
    var self = this;
    request(app).post(url.senderEmail)
        .set("Cookie", self.cookie)
        .send({
            type: STD.user.emailSenderTypeAdding,
            email: email
        })
        .end(function (err, res) {
            res.status.should.exactly(200);
            res.body.should.be.an.String;
            self.authToken = res.body;
            callback();
        });
};

Account.prototype.sendSignupEmailAuth = function (callback) {
    var self = this;
    request(app).post(url.senderEmail)
        .set("Cookie", self.cookie)
        .send({
            type: STD.user.emailSenderTypeSignUp,
            email: self.getFixture('uid')
        })
        .end(function (err, res) {
            res.status.should.exactly(200);
            res.body.should.be.an.String;
            self.authToken = res.body;
            callback();
        });
};

Account.prototype.sendAddingPhoneAuth = function (phoneNum, callback) {
    var self = this;
    request(app).post(url.senderPhone)
        .set("Cookie", self.cookie)
        .send({
            type: STD.user.phoneSenderTypeAdding,
            phoneNum: phoneNum
        })
        .end(function (err, res) {
            res.status.should.exactly(200);
            res.body.should.be.an.String;
            self.authToken = res.body;
            callback();
        });
};

Account.prototype.checkAddingPhoneAuth = function (phoneNum, callback) {
    var self = this;
    request(app).post(url.authPhone)
        .set("Cookie", self.cookie)
        .send({
            token: self.authToken
        })
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.data = res.body;
            self.data.should.have.a.property('phoneNum');
            self.data.phoneNum.should.exactly(phoneNum);
            tester.do(resform.user, self.data);
            callback();
        });
};

/**
 * fail methods.
 */

Account.prototype.signupPhoneAuthFail = function (callback) {
    var self = this;
    request(app).post(url.users)
        .set("Cookie", self.cookie)
        .send(self.fixture)
        .end(function (err, res) {
            res.status.should.within(403, 404);
            callback();
        });
};

Account.prototype.loginNormalIdFail = function (callback) {
    var self = this;
    request(app).post(url.session)
        .set("Cookie", self.cookie)
        .send({
            type: STD.user.signUpTypeNormalId,
            uid: self.fixture.uid,
            secret: self.fixture.secret
        })
        .end(function (err, res) {
            res.status.should.exactly(404);
            callback();
        });
};

Account.prototype.loginEmailFail = function (callback) {
    var self = this;
    request(app).post(url.session)
        .set("Cookie", self.cookie)
        .send({
            type: STD.user.signUpTypeEmail,
            uid: self.fixture.uid,
            secret: self.fixture.secret
        })
        .end(function (err, res) {
            res.status.should.exactly(404);
            callback();
        });
};

Account.prototype.sendAddingEmailAuthFail = function (email, callback) {
    var self = this;
    request(app).post(url.senderEmail)
        .set("Cookie", self.cookie)
        .send({
            type: STD.user.emailSenderTypeAdding,
            email: email
        })
        .end(function (err, res) {
            res.status.should.exactly(409);
            callback();
        });
};

Account.prototype.addSocialFail = function (provider, id, accessToken, callback) {
    var self = this;
    request(app).post(url.authSocial)
        .set("Cookie", self.cookie)
        .send({
            provider: provider,
            id: id,
            accessToken: accessToken
        })
        .end(function (err, res) {
            res.status.should.exactly(409);

            callback();
        });
};

Account.prototype.removePhoneFail = function (callback) {
    var self = this;
    request(app).del(url.authPhone + "/" + self.data.id)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.within(400, 499);
            callback();
        });
};

module.exports = Account;