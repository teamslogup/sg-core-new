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
    socialSession: "/api/accounts/social-session"
};

function Account(fixture) {
    fixture.deviceToken = (Math.random() * 100000000) % 100000000 + 123412;
    Account.super_.call(this, fixture);
    this.authToken = '';
}

util.inherits(Account, Super);

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
            uid: self.fixture.uid,
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

Account.prototype.removeAccount = function(callback) {
    var self = this;
    request(app).del(url.users + "/" + self.data.id)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(204);
            self.cookie = '';
            callback();
        });
};

Account.prototype.loadExtinct = function(id, callback) {
    var self = this;
    request(app).get(url.extinctUsers + "/" + id)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(200);
            tester.do(resform.user, self.data);
            callback();
        });
};

Account.prototype.loadAllExtincts = function(callback) {
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

Account.prototype.removeExtincts = function(callback) {
    var self = this;
    request(app).del(url.extinctUsers)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(204);
            callback();
        });
};


/**
 * account link methods.
 phone
 - aid, apass
 - email, apass
 - email
 - social

 phoneId
 - email
 - social

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


module.exports = Account;