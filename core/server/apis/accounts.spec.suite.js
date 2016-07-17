var app = require('../../../app');
var request = require('supertest');
var should = require('should');
var tester = require('../utils/response-tester');

var META = require('../../../bridge/metadata/index');
var STD = META.std;
var resform = require('../resforms');

var url = {
    users: "/api/accounts/users",
    session: "/api/accounts/session"
};

function User(fixture) {
    this.cookie;
    this.data;
    this.authToken;
    this.fixture = fixture;
}

User.prototype.signupEmail = function (callback) {
    var self = this;
    request(app).post(url.users)
        .send(self.fixture)
        .expect(201)
        .end(function (err, res) {
            res.status.should.exactly(201);
            self.cookie = res.header['set-cookie'][0];
            var data = self.data = res.body;
            self.authToken = data.auth.token;
            tester.do(resform.user, data);
            callback();
        });
};

User.prototype.signupPhone = function (callback) {
    var self = this;
    request(app).post(url.users)
        .send(self.fixture)
        .expect(201)
        .end(function (err, res) {
            res.status.should.exactly(201);
            self.cookie = res.header['set-cookie'][0];
            self.data = res.body;
            self.authToken = user.auth.token;
            tester.do(resform.user);
            callback();
        });
};

User.prototype.loginEmail = function (callback) {
    var self = this;
    request(app).post(url.session)
        .send({
            type: STD.user.signUpTypeEmail,
            uid: self.fixture.email,
            secret: self.fixture.secret
        })
        .expect(201)
        .end(function (err, res) {
            res.status.should.exactly(201);
            self.cookie = res.header['set-cookie'][0];
            self.data = res.body;
            self.authToken = user.auth.token;
            tester.do(resform.user);
            callback();
        });
};

module.exports = {
    User: User
};