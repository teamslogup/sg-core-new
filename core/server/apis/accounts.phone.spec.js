var app = require('../../../app');
var request = require('supertest');
var should = require('should');

var META = require('../../../bridge/metadata/index');
var STD = META.std;
var commonUtils = require('../utils/common');

describe('Phone Accounts Api Tests', function () {

    var flexture = {
        'type': STD.user.signUpTypePhone,
        'uid': '+821089981764',
        'gender': STD.user.genderMale,
        'nick': (Math.floor(Math.random() * 100000)) % 1000000,
        'secret': 'qqqqqq',
        'deviceType': STD.user.phoneAndroid,
        'deviceToken': Math.random(),
        'country': 'kr',
        'language': 'ko'
    };

    var user;
    var cookie;
    var token = '';

    it('should send phone auth', function (done) {
        request(app).post('/api/accounts/sender-phone')
            .send({
                phoneNum: flexture.uid,
                type: STD.user.phoneSenderTypeSignUp
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                flexture.secret = '1000';
                done();
            });
    });

    it('should fail to register user', function (done) {
        request(app).post('/api/accounts/users')
            .send(flexture)
            .expect(403)
            .end(function (err, res) {
                res.status.should.exactly(403);
                flexture.secret = token;
                done();
            });
    });

    it('should send phone auth', function (done) {
        request(app).post('/api/accounts/sender-phone')
            .send({
                phoneNum: flexture.uid,
                type: STD.user.phoneSenderTypeSignUp
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                flexture.secret = res.body;
                done();
            });
    });

    it('should register user', function (done) {
        request(app).post('/api/accounts/users')
            .send(flexture)
            .expect(201)
            .end(function (err, res) {
                res.status.should.exactly(201);
                cookie = res.header['set-cookie'][0];
                user = res.body;
                done();
            });
    });

    it('should logout', function (done) {
        request(app).post('/api/accounts/session')
            .set("Cookie", cookie)
            .send({
                _method: 'DELETE'
            })
            .expect(204)
            .end(function (err, res) {
                res.status.should.exactly(204);
                done();
            });
    });

    it('should fail getting user info', function (done) {
        request(app).get('/api/accounts/session')
            .set("Cookie", cookie)
            .expect(401)
            .end(function (err, res) {
                res.status.should.exactly(401);
                done();
            });
    });

    it('should send phone auth', function (done) {
        request(app).post('/api/accounts/sender-phone')
            .send({
                phoneNum: flexture.uid,
                type: STD.user.phoneSenderTypeLogIn
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                token = res.body;
                done();
            });
    });

    it('should login', function (done) {
        request(app).post('/api/accounts/session')
            .set("Cookie", cookie)
            .send({
                type: STD.user.signUpTypePhone,
                uid: flexture.uid,
                secret: token
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                res.body.should.have.property('id');
                done();
            });
    });

    it('should send email token', function (done) {
        request(app).post('/api/accounts/sender-email')
            .set("Cookie", cookie)
            .send({
                type: STD.user.emailSenderTypeAdding,
                email: 'gozillacj@naver.com'
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                token = res.body;
                done();
            });
    });

    it('should add email', function (done) {
        request(app).get('/api/accounts/auth-email?token=' + token)
            .set("Cookie", cookie)
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                done();
            });
    });

    it('should remove user', function (done) {
        request(app).post('/api/accounts/users/' + user.id)
            .set("Cookie", cookie)
            .send({'_method': 'DELETE'})
            .expect(204)
            .end(function (err, res) {
                res.status.should.exactly(204);
                done();
            });
    });
});