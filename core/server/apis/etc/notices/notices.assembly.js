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


const META = require('../../../../../bridge/metadata');
const STD = META.std;

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
                param: 'id',
                response: {
                    title: "공지사항 제목",
                    body: "공지사항 내용",
                    country: "KR",
                    type: "normal",
                    startDate: "2016-03-23",
                    endDate: "2016-03-26",
                    imageId: 1,
                    id: 1,
                    createAt: "2016-03-22",
                    updateAt: "2016-03-22",
                    deletedAt: null
                },
                title: '단일 공지 얻기',
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
                apiCreator.add(get.setParam());
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
                acceptable: ['searchItem', 'option', 'last', 'size', 'country', 'type', 'sort'],
                essential: [],
                resettable: [],
                explains: {
                    searchItem: '검색할 내용',
                    option: '검색할 항목 ' + STD.notice.enumFields.join(", "),
                    last: '마지막 데이터',
                    size: '몇개 로드할지에 대한 사이즈',
                    country: '국가 필터 ' + STD.notice.enumCountries.join(", ") + ', 없으면 전체',
                    type: '유형 필터 ' + STD.notice.enumNoticeTypes.join(", "),
                    sort: '정렬 순서 ' + STD.common.enumSortTypes.join(", ")
                },
                response: [{
                    title: "공지사항 제목",
                    body: "공지사항 내용",
                    country: "KR",
                    type: "normal",
                    startDate: "2016-03-23",
                    endDate: "2016-03-26",
                    imageId: 1,
                    id: 1,
                    createAt: "2016-03-22",
                    updateAt: "2016-03-22",
                    deletedAt: null
                }],
                title: '공지리스트얻기',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(gets.validate());
                apiCreator.add(gets.setParam());
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
                acceptable: ['title', 'body', 'country', 'type', 'startDate', 'endDate', 'imageId'],
                essential: ['title', 'body', 'country', 'type'],
                resettable: [],
                explains: {
                    'title': '공지제목',
                    'body': '공지내용',
                    'country': '공지를 보여줄 국가 ' + STD.notice.enumCountries.join(", "),
                    'type': '공지타입 ' + STD.notice.enumNoticeTypes.join(", "),
                    'startDate': '시작날짜',
                    'endDate': '마감날짜',
                    'imageId': '이미지 id'
                },
                defaults: {
                    country: 'KR',
                    type: 'normal'
                },
                role: STD.user.roleAdmin,
                title: '공지쓰기',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(post.setParam());
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
                acceptable: ['title', 'body', 'country', 'type', 'startDate', 'endDate', 'imageId'],
                essential: [],
                resettable: [],
                explains: {
                    'title': '공지제목',
                    'body': '공지내용',
                    'country': '공지를 보여줄 국가 ' + STD.notice.enumCountries.join(", "),
                    'type': '공지타입 ' + STD.notice.enumNoticeTypes.join(", "),
                    'startDate': '시작날짜',
                    'endDate': '마감날짜',
                    'imageId': '이미지 id'
                },
                role: STD.user.roleAdmin,
                title: '공지 내용 수정',
                param: 'id',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
                apiCreator.add(put.update());
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
                role: STD.user.roleAdmin,
                title: '신고 제거',
                param: 'id',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(del.validate());
                apiCreator.add(del.destroy());
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