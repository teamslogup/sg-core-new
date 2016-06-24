var app = require('../../../app');
var request = require('supertest');
var should = require('should');

var META = require('../../../bridge/metadata/index');
var STD = META.std;
var commonUtils = require('../utils/common');

describe('Email Accounts Api Tests', function () {

    var flexture = {
        'type': STD.user.signUpTypeEmail,
        'uid': 'gozillacj' + '@naver.com',
        'gender': STD.user.genderMale,
        'nick': (Math.floor(Math.random() * 100000)) % 1000000,
        'secret': 'qqqqqq',
        'deviceType': 'ios',
        'deviceToken': Math.random(),
        'country': 'us',
        'language': 'en'
    };
    var phoneNum = '+821089981764';

    var user;
    var cookie;
    var token = '';

    it('should register user', function (done) {
        request(app).post('/api/accounts/users')
            .send(flexture)
            .expect(201)
            .end(function (err, res) {
                res.status.should.exactly(201);
                res.body.should.have.property('auth');
                cookie = res.header['set-cookie'][0];
                user = res.body;
                token = user.auth.token;
                done();
            });
    });

    it('should fail to verify email', function (done) {
        request(app).get('/api/accounts/auth-email?token=' + token + "0323")
            .set("Cookie", cookie)
            .expect(403)
            .end(function (err, res) {
                res.status.should.exactly(403);
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

    it('should login', function (done) {
        request(app).post('/api/accounts/session')
            .set("Cookie", cookie)
            .send({
                type: STD.user.signUpTypeEmail,
                uid: flexture.uid,
                secret: flexture.secret
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                res.body.should.have.property('id');
                done();
            });
    });

    it('should send verification email', function (done) {
        request(app).post('/api/accounts/sender-email')
            .set("Cookie", cookie)
            .send({
                type: STD.user.emailSenderTypeSignUp,
                email: flexture.uid
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                should.exist(res.body);
                res.body.should.be.a.String;
                token = res.body;
                done();
            });
    });

    it('should verify email', function (done) {
        request(app).get('/api/accounts/auth-email?token=' + token)
            .set("Cookie", cookie)
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                res.body.should.have.property('isVerifiedEmail', true);
                done();
            });
    });

    it('should update info', function (done) {
        request(app).post('/api/accounts/users/' + user.id)
            .set("Cookie", cookie)
            .send({
                '_method': 'PUT',
                'gender': STD.user.genderFemale,
                'birthYear': '1987',
                'birthMonth': '3',
                'birthDay': '23'
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(204);
                done();
            });
    });

    it('should change password', function (done) {
        request(app).post('/api/accounts/pass')
            .set("Cookie", cookie)
            .send({
                '_method': 'PUT',
                'newPass': 'qqqqqq2',
                'oldPass': 'qqqqqq'
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(204);
                flexture.secret = 'qqqqqq2';
                done();
            });
    });

    it('should get user info for session', function (done) {
        request(app).get('/api/accounts/session')
            .set("Cookie", cookie)
            .expect(200)
            .end(function (err, res) {
                res.body.should.have.property('id', user.id);
                res.body.should.have.property('gender', STD.user.genderFemale);
                res.body.should.have.property('birth', '1987-03-23');
                done();
            });
    });

    it('should get user info for user get', function (done) {
        request(app).get('/api/accounts/users/' + user.id)
            .set("Cookie", cookie)
            .expect(200)
            .end(function (err, res) {
                res.body.should.have.property('id', user.id);
                res.body.should.have.property('gender', STD.user.genderFemale);
                res.body.should.have.property('birth', '1987-03-23');
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
                commonUtils.errorTranslator(res.body);
                res.status.should.exactly(204);
                done();
            });
    });

    it('should fail to get user info', function (done) {
        request(app).get('/api/accounts/session')
            .set("Cookie", cookie)
            .expect(401)
            .end(function (err, res) {
                res.status.should.exactly(401);
                done();
            });
    });

    it('should fail to send phone auth', function (done) {
        request(app).post('/api/accounts/sender-phone')
            .send({
                phoneNum: phoneNum,
                type: STD.user.phoneSenderTypeAdding
            })
            .set("Cookie", cookie)
            .expect(401)
            .end(function (err, res) {
                res.status.should.exactly(401);
                done();
            });
    });

    it('should login', function (done) {
        request(app).post('/api/accounts/session')
            .set("Cookie", cookie)
            .send({
                type: STD.user.signUpTypeEmail,
                uid: flexture.uid,
                secret: flexture.secret
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                res.body.should.have.property('id');
                done();
            });
    });

    it('should send phone auth', function (done) {
        request(app).post('/api/accounts/sender-phone')
            .send({
                phoneNum: phoneNum,
                type: STD.user.phoneSenderTypeAdding
            })
            .set("Cookie", cookie)
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                token = res.body;
                done();
            });
    });

    it('should add phone', function (done) {
        request(app).post('/api/accounts/auth-phone')
            .set("Cookie", cookie)
            .send({
                token: token
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.exactly(200);
                res.body.should.have.property('id', user.id);
                res.body.should.have.property('phoneNum', phoneNum);
                done();
            });
    });

    it('should remove phone', function (done) {
        request(app).post('/api/accounts/auth-phone')
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