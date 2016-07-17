var app = require('../../../app');
var request = require('supertest');
var should = require('should');

var META = require('../../../bridge/metadata/index');
var STD = META.std;
var commonUtils = require('../utils/common');

describe('Email Accounts Api Tests', function () {

    var usersPost = commonUtils.getAPIParams('/accounts/users', 'post');
    var suiteAccounts = require('./accounts.spec.suite');
    var User = suiteAccounts.User;
    var user = new User(usersPost.defaults);

    var params = JSON.parse(JSON.stringify(usersPost.defaults));
    params.uid = 'gozillacj2@naver.com';
    params.nick = 'gozillacj2';
    params.deviceToken = usersPost.defaults.deviceToken + "1";

    var user2 = new User(params);

    it('should register email user', function (done) {
        user.signupEmail(done);
    });

    it('should logout user', function (done) {
        user.logout(done);
    });

    it('should login email user', function (done) {
        user.loginEmail(done);
    });

    it('should remove account', function (done) {
        user.removeAccount(done);
    });

    it('should fail to login email user', function (done) {
        user.loginEmailFail(done);
    });

    it('should register email user2', function (done) {
        user2.signupEmail(done);
    });

    it('should load extinct user', function (done) {
        user2.loadExtinct(user.data.id, function() {
            user2.loadAllExtincts(done);
        });
    });

    it('should remove all extinct users', function (done) {
        user2.removeExtincts(done);
    });

    it('should remove account 2', function (done) {
        user2.removeAccount(done);
    });
});