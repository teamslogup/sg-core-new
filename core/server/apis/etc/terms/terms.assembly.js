var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var gets = require('./' + resource + '.gets.js');
var get = require('./' + resource + '.get.js');
var post = require('./' + resource + '.post.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata/index');
const STD = META.std;

var api = {
    get : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                    'id': '데이터를 얻을 리소스의 id'
                },
                defaults: {
                    
                },
                response: {
                    
                },
                param: 'id',
                title: '단일 얻기',
                state: 'development'
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

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    },
    gets : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ["searchItem", "searchField", "orderBy", "sort", "last", "size", "type"],
                essential: [],
                resettable: [],
                explains: {
                    "searchItem": "검색할 내용",
                    "searchField": "검색할 필드 " + STD.terms.enumSearchFields.join(", "),
                    "orderBy": "정렬 기준 " + STD.terms.enumOrderBys.join(", "),
                    "sort": "정렬 방식 " + STD.common.enumSortTypes.join(", "),
                    "last": "조회 기준 마지막 데이터 일자",
                    "size": "가져올 데이터 갯수",
                    "type": "이용약관 유형 " + STD.terms.enumTypes.join(", ")
                },
                defaults: {

                },
                response: {

                },
                title: '이용약관 조회',
                state: 'development'
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

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    },
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ["type", "title", "content", "country"],
                essential: ["type", "country"],
                resettable: [],
                explains: {
                    "type": "이용약관 유형 " + STD.terms.enumTypes.join(", "),
                    "title": "이용약관 제목",
                    "content": "이용약관 내용",
                    "country": "국가 코드 KR"
                },
                defaults: {

                },
                response: {

                },
                role: STD.user.roleAdmin,
                title: '이용약관 생성',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.session.hasAuthorization(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(post.setParam());
                apiCreator.add(post.supplement());
                apiCreator.run();

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    },
    delete : function(isOnlyParams) {
        return function(req, res, next) {
            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                    
                },
                defaults: {

                },
                response: {

                },
                role: STD.user.roleAdmin,
                title: '이용약관 제거',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.session.hasAuthorization(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(del.destroy());
                apiCreator.add(del.supplement());
                apiCreator.run();

                delete apiCreator;
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
router.delete('/' + resource, api.delete());

module.exports.router = router;
module.exports.api = api;