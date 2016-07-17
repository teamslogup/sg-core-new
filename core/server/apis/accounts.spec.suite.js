var app = require('../../../app');
var request = require('supertest');
var should = require('should');
var tester = require('../utils/response-tester');

var META = require('../../../bridge/metadata/index');
var STD = META.std;
var resform = require('../resforms');

var url = {
    users: "/api/accounts/users",
    session: "/api/accounts/session",
    extinctUsers: "/api/accounts/extinct-users"
};

function User(fixture) {
    this.cookie = '';
    this.data = {};
    this.authToken = '';
    this.fixture = fixture;
}

User.prototype.signupEmail = function (callback) {
    var self = this;
    request(app).post(url.users)
        .set("Cookie", self.cookie)
        .send(self.fixture)
        .expect(201)
        .end(function (err, res) {
            res.status.should.exactly(201);
            self.cookie = res.header['set-cookie'][0];
            self.data = res.body;
            self.authToken = self.data.auth.token;
            tester.do(resform.user, self.data);
            callback();
        });
};

User.prototype.signupPhone = function (callback) {
    var self = this;
    request(app).post(url.users)
        .set("Cookie", self.cookie)
        .send(self.fixture)
        .expect(201)
        .end(function (err, res) {
            res.status.should.exactly(201);
            self.cookie = res.header['set-cookie'][0];
            self.data = res.body;
            tester.do(resform.user, self.data);
            callback();
        });
};

User.prototype.logout = function (callback) {
    var self = this;
    request(app).del(url.session)
        .set("Cookie", self.cookie)
        .expect(204)
        .end(function (err, res) {
            res.status.should.exactly(204);
            self.cookie = res.header['set-cookie'][0];
            callback();
        });
};

User.prototype.loginEmail = function (callback) {
    var self = this;
    request(app).post(url.session)
        .set("Cookie", self.cookie)
        .send({
            type: STD.user.signUpTypeEmail,
            uid: self.fixture.uid,
            secret: self.fixture.secret
        })
        .expect(200)
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.cookie = res.header['set-cookie'][0];
            self.data = res.body;
            tester.do(resform.user, self.data);
            callback();
        });
};

User.prototype.loginEmailFail = function (callback) {
    var self = this;
    request(app).post(url.session)
        .set("Cookie", self.cookie)
        .send({
            type: STD.user.signUpTypeEmail,
            uid: self.fixture.uid,
            secret: self.fixture.secret
        })
        .expect(404)
        .end(function (err, res) {
            res.status.should.exactly(404);
            callback();
        });
};

User.prototype.removeAccount = function(callback) {
    var self = this;
    request(app).del(url.users + "/" + self.data.id)
        .set("Cookie", self.cookie)
        .expect(204)
        .end(function (err, res) {
            res.status.should.exactly(204);
            self.cookie = '';
            callback();
        });
};

User.prototype.loadExtinct = function(id, callback) {
    var self = this;
    request(app).get(url.extinctUsers + "/" + id)
        .set("Cookie", self.cookie)
        .expect(200)
        .end(function (err, res) {
            res.status.should.exactly(200);
            tester.do(resform.user, self.data);
            callback();
        });
};

User.prototype.loadAllExtincts = function(callback) {
    var self = this;
    request(app).get(url.extinctUsers)
        .set("Cookie", self.cookie)
        .expect(200)
        .end(function (err, res) {
            res.status.should.exactly(200);
            res.body.should.have.property('list');
            res.body.list.length.should.greaterThan(0);
            tester.do([resform.user], res.body.list);
            callback();
        });
};

User.prototype.removeExtincts = function(callback) {
    var self = this;
    request(app).del(url.extinctUsers)
        .set("Cookie", self.cookie)
        .expect(204)
        .end(function (err, res) {
            res.status.should.exactly(204);
            callback();
        });
};


module.exports = {
    User: User
};