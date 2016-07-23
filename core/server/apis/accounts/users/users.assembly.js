"use strict";

var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var gets = require('./' + resource + '.gets.js');
var get = require('./' + resource + '.get.js');
var put = require('./' + resource + '.put.js');
var post = require('./' + resource + '.post.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

var META = require('../../../../../bridge/metadata');
var STD = META.std;
var USER = STD.user;

var api = {
    get: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                    'id': '데이터를 얻을 리소스의 id'
                },
                response: resforms.user,
                param: 'id',
                title: '단일 유저 정보 얻기',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(get.validate());
                apiCreator.add(get.getUser());
                apiCreator.add(get.supplement());
                apiCreator.run();

            }
            else {
                return params;
            }
        };
    },
    gets: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['searchItem', 'searchField', 'last', 'size', 'orderBy', 'sort'],
                essential: [],
                resettable: [],
                explains: {
                    searchItem: '검색할 내용',
                    searchField: '검색할 필드' + STD.user.enumSearchFields.join(", "),
                    last: '마지막 데이터',
                    size: '몇개 로드할지에 대한 사이즈',
                    orderBy: '정렬 기준 필드' + STD.user.enumOrders.join(", "),
                    sort: '정렬 순서' + STD.common.enumSortTypes.join(", ")
                },
                response: {list: [resforms.user]},
                title: '유저 리스트 얻기',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.session.hasAuthorization());
                apiCreator.add(gets.validate());
                apiCreator.add(gets.getUsers());
                apiCreator.add(gets.supplement());
                apiCreator.run();

            }
            else {
                return params;
            }
        };
    },
    post: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [
                    'type',
                    'provider',
                    'uid',
                    'secret',
                    'nick',
                    'aid',
                    'apass',
                    'name',
                    'gender',
                    'birthYear',
                    'birthMonth',
                    'birthDay',
                    'deviceToken',
                    'deviceType',
                    'country',
                    'language',
                    'agreedEmail',
                    'agreedPhoneNum'
                ],
                essential: [
                    'type',
                    'uid',
                    'secret'
                ],
                resettable: [],
                explains: {
                    'type': '가입 형태(제공자타입) ' + USER.enumSignUpTypes.join(", "),
                    'provider': 'type이 소셜이면 반드시 입력해야함. ' + USER.enumProviders.join(", "),
                    'uid': '아이디, 그냥 아이디로만 가입할땐 일반 아이디, 이메일 가입이면 이메일, 전화번호가입이면 전화번호',
                    'secret': '비밀번호 혹은 엑세스토큰, 전화번호가입이면 인증번호',
                    'nick': '닉네임',
                    'aid': '전화번호 가입을 할때 아이디 / 비밀번호를 이용할 경우 아이디',
                    'apass': '전화번호 가입을 할때 아이디 / 비밀번호를 이용할 경우 비밀번호',
                    'name': '이름',
                    'gender': '성별 ' + USER.enumGenders.join(", "),
                    'birthYear': '생년',
                    'birthMonth': '생월',
                    'birthDay': '생일',
                    'deviceToken': '푸시를 위한 디바이스 토큰',
                    'deviceType': '디바이스 기종. ' + USER.enumDeviceTypes.join(", "),
                    'country': '국가',
                    'language': '언어',
                    'agreedEmail': '이메일 수신 동의',
                    'agreedPhoneNum': '휴대폰 수신 동의'
                },
                defaults: {
                    'type': USER.signUpTypeEmail,
                    'provider': '',
                    'uid': 'gozillacj@naver.com',
                    'secret': '123qwe',
                    'nick': 'hwarang',
                    'aid': '',
                    'apass': '',
                    'name': '',
                    'gender': USER.genderMale,
                    'birthYear': 1991,
                    'birthMonth': 5,
                    'birthDay': 17,
                    'deviceToken': '12345678902',
                    'deviceType': USER.deviceTypeIOS,
                    'country': '',
                    'language': '',
                    'agreedEmail': false,
                    'agreedPhoneNum': ''
                },
                response: resforms.user,
                title: '일반회원가입',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(post.checkSocialProvider());
                apiCreator.add(post.createUser());
                apiCreator.add(post.sendEmailAuth());
                apiCreator.add(post.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    },
    put: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['nick', 'name', 'gender', 'birthYear', 'birthMonth', 'birthDay', 'country', 'language', 'role', 'agreedEmail', 'agreedPhoneNum'],
                essential: [],
                resettable: ['nick', 'name', 'gender', 'birthYear', 'birthMonth', 'birthDay', 'country', 'language', 'role'],
                explains: {
                    'id': '데이터 리소스의 id',
                    'nick': '닉네임',
                    'name': '이름',
                    'gender': '성별 (수퍼어드민이상만 가능)' + USER.enumGenders.join(", "),
                    'birthYear': '생년',
                    'birthMonth': '생월',
                    'birthDay': '생일',
                    'country': '국가',
                    'language': '언어',
                    'role': '권한수정 (수퍼어드민이상만 가능) ' + META.std.user.enumRoles.join(", "),
                    'agreedEmail': '이메일 수신 동의',
                    'agreedPhoneNum': '전화번호 수신 동의'
                },
                defaults: {
                    'id': 1,
                    'nick': '닉네임',
                    'name': '이름',
                    'gender': '성별 (수퍼어드민이상만 가능)' + USER.enumGenders.join(", "),
                    'birthYear': '생년',
                    'birthMonth': '생월',
                    'birthDay': '생일',
                    'country': '국가',
                    'language': '언어',
                    'role': '권한수정 (수퍼어드민이상만 가능) ' + META.std.user.enumRoles.join(", "),
                    'agreedEmail': '이메일 수신 동의',
                    'agreedPhoneNum': '전화번호 수신 동의'
                },
                response: resforms.user,
                title: '회원정보수정',
                param: 'id',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.session.hasAuthorization());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
                apiCreator.add(put.dataSet());
                apiCreator.add(put.updateUser());
                apiCreator.add(put.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    },
    delete: function (isOnlyParams) {
        return function (req, res, next) {
            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                    'id': '데이터 리소스의 id'
                },
                title: '',
                param: 'id',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.session.hasAuthorization());
                apiCreator.add(del.destroyUser());
                apiCreator.add(del.validate());
                apiCreator.add(del.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource + '/:id', api.get());
router.get('/' + resource, api.gets());
router.post('/' + resource, api.post());
router.put('/' + resource + '/:id', api.put());
router.delete('/' + resource + '/:id', api.delete());

module.exports.router = router;
module.exports.api = api;