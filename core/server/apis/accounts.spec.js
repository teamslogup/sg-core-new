var app = require('../../../app');
var request = require('supertest');
var should = require('should');

var META = require('../../../bridge/metadata/index');
var STD = META.std;
var commonUtils = require('../utils/common');

describe('Email Accounts Api Tests', function () {

    var usersPost = commonUtils.getAPIParams('/accounts/users', 'post');

    var emailUserParam = JSON.parse(JSON.stringify(usersPost.defaults));
    emailUserParam.type = STD.user.signUpTypeEmail;
    emailUserParam.uid = 'gozillacj@naver.com';

    var emailUserParam2 = JSON.parse(JSON.stringify(emailUserParam));
    emailUserParam2.uid = 'gozillacj2@naver.com';

    var normalUserParam = JSON.parse(JSON.stringify(usersPost.defaults));
    normalUserParam.type = STD.user.signUpTypeNormalId;
    normalUserParam.uid = 'gozillacj';

    var phoneUserParam = JSON.parse(JSON.stringify(usersPost.defaults));
    phoneUserParam.type = STD.user.signUpTypePhone;
    phoneUserParam.uid = '+821089981764';

    var phoneIdUserParam = JSON.parse(JSON.stringify(usersPost.defaults));
    phoneIdUserParam.type = STD.user.signUpTypePhoneId;
    phoneIdUserParam.uid = '+821089981764';
    phoneIdUserParam.aid = 'gozillacj';
    phoneIdUserParam.apass = '123qwe';

    var Account = require('./accounts.spec.suite');
    var emailUser = new Account(emailUserParam);
    var emailUser2 = new Account(emailUserParam2);
    var normalIdUser = new Account(normalUserParam);
    var phoneUser = new Account(phoneUserParam);
    var phoneIdUser = new Account(phoneIdUserParam);

    it('should register email user', function (done) {
        emailUser.signup(done);
    });

    it('should verify email', function (done) {
        emailUser.verifyEmail(done);
    });

    it('should fail to verify email', function (done) {
        emailUser.verifyEmailFail(done);
    });

    it('should login email user', function (done) {
        emailUser.loginEmail(done);
    });

    it('should logout user', function (done) {
        emailUser.logout(done);
    });

    it('should login email user', function (done) {
        emailUser.loginEmail(done);
    });

    it('should remove account', function (done) {
        emailUser.removeAccount(done);
    });

    it('should fail to login email user', function (done) {
        emailUser.loginEmailFail(done);
    });

    it('should register email user2', function (done) {
        emailUser2.signup(done);
    });

    it('should load extinct user', function (done) {
        emailUser2.loadExtinct(emailUser.data.id, function () {
            emailUser2.loadAllExtincts(done);
        });
    });

    it('should remove all extinct users', function (done) {
        emailUser2.removeExtincts(done);
    });

    it('should remove account 2', function (done) {
        emailUser2.removeAccount(done);
    });

    it('should register normal id user', function (done) {
        normalIdUser.signup(done);
    });

    it('should logout user', function (done) {
        normalIdUser.logout(done);
    });

    it('should login normal id user', function (done) {
        normalIdUser.loginNormalId(done);
    });

    it('should remove account', function (done) {
        normalIdUser.removeAccount(done);
    });

    it('should fail to login normal id user', function (done) {
        normalIdUser.loginNormalIdFail(done);
    });

    it('should fail to signup phone user', function (done) {
        phoneUser.signupPhoneAuthFail(done);
    });

    it('should send phone auth number', function (done) {
        phoneUser.sendPhoneAuth(done);
    });

    it('should signup phone user', function (done) {
        phoneUser.signup(done);
    });

    it('should remove account', function (done) {
        phoneUser.removeAccount(done);
    });

    it('should send phone auth number', function (done) {
        phoneIdUser.sendPhoneAuth(done);
    });

    it('should signup phoneId user', function (done) {
        phoneIdUser.signup(done);
    });

    it('should remove account', function (done) {
        phoneIdUser.removeAccount(done);
    });
});