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

            // var params = {
            //     acceptable: ['last', 'size', 'type', 'country', ],
            //     essential: [],
            //     resettable: [],
            //     explains: {
            //         'last': '마지막 데이터',
            //         'size': '몇개 로드할지에 대한 사이즈',
            //         'type': '공지타입(없으면 전체) ' + STD.notice.enumNoticeTypes.join(", "),
            //         'country': '공지를 필터할 국가, 없으면 전체'
            //     },
            //     title: '공지리스트얻기',
            //     state: 'staging'
            // };

            var params = {
                acceptable: ['searchItem', 'option', 'last', 'size', 'country', 'type', 'sorted'],
                essential: [],
                resettable: [],
                explains : {
                    searchItem: '검색할 내용',
                    option: '검색할 항목 ' + STD.notice.enumSeFields.join(", "),
                    last: '마지막 데이터',
                    size: '몇개 로드할지에 대한 사이즈',
                    country: '국가 필터 ' + STD.notice.enumCountries.join(", "),
                    type: '유형 필터 ' + STD.notice.enumNoticeTypes.join(", "),
                    sorted: '정렬 순서 ' + STD.common.enumSortTypes.join(", ")
                },
                title: '신고리스트얻기',
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
                acceptable: ['title', 'body', 'country', 'type'],
                essential: ['title', 'body', 'type'],
                resettable: [],
                explains: {
                    'title': '공지제목',
                    'body': '공지내용',
                    'country': '공지를 보여줄 국가 ' + STD.notice.enumCountries.join(", "),
                    'type': '공지타입 ' + STD.notice.enumNoticeTypes.join(", ")
                },
                defaults: {},
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
                acceptable: ['title', 'body', 'country', 'type'],
                essential: [],
                resettable: ['country'],
                explains: {
                    'title': '공지제목',
                    'body': '공지내용',
                    'country': '공지를 보여줄 국가 ' + STD.notice.enumCountries.join(", "),
                    'type': '공지타입 ' + STD.notice.enumNoticeTypes.join(", ")
                },
                title: '공지 내용 수정',
                param: 'id',
                state: 'design'
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
                apiCreator.add(put.updateReport());
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
                title: '신고 제거',
                param: 'id',
                state: 'design'
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