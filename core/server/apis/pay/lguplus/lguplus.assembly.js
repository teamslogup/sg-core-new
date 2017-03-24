var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var gets = require('./' + resource + '.gets.js');
var get = require('./' + resource + '.get.js');
var put = require('./' + resource + '.put.js');
var post = require('./' + resource + '.post.js');

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
                title: '단일 얻기',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
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
                acceptable: ['last', 'size', 'userId'],
                essential: [],
                resettable: [],
                explains: {
                    'userId': '유저별 필터링',
                    'last': '마지막 데이터',
                    'size': '몇개 로드할지에 대한 사이즈'
                },
                title: '',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
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
                acceptable: ['LGD_AMOUNT', 'LGD_BUYER', 'LGD_PRODUCTINFO', 'LGD_BUYEREMAIL', 'LGD_CUSTOM_USABLEPAY'],
                essential: ['LGD_AMOUNT', 'LGD_BUYER', 'LGD_PRODUCTINFO', 'LGD_CUSTOM_USABLEPAY'],
                resettable: [],
                explains: {
                    'LGD_AMOUNT': '결제금액',
                    'LGD_BUYER': '구매자',
                    'LGD_PRODUCTINFO': '상품정보',
                    'LGD_BUYEREMAIL': '구매자 이메일',
                    'LGD_CUSTOM_USABLEPAY': '결제수단'
                },
                defaults: {
                    "LGD_AMOUNT": "1000",
                    "LGD_BUYER": "유영진",
                    "LGD_PRODUCTINFO": "02돌집게",
                    "LGD_BUYEREMAIL": "ac12bd@slogup.com",
                    'LGD_CUSTOM_USABLEPAY': 'SC0010'
                },
                title: '결제 준비',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

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
                acceptable: ['LGD_OID', 'LGD_CARDACQUIRER', 'LGD_IFOS', 'LGD_MID', 'LGD_FINANCENAME', 'LGD_PCANCELFLAG', 'LGD_FINANCEAUTHNUM', 'LGD_DELIVERYINFO', 'LGD_AFFILIATECODE', 'LGD_TRANSAMOUNT', 'LGD_BUYERID', 'LGD_CARDNUM', 'LGD_RECEIVERPHONE', 'LGD_2TR_FLAG', 'LGD_DEVICE', 'LGD_TID', 'LGD_FINANCECODE', 'LGD_CARDNOINTYN', 'LGD_CARDNOINTEREST_YN', 'LGD_PCANCELSTR', 'LGD_IDPKEY', 'LGD_BUYERPHONE', 'LGD_ESCROWYN', 'LGD_PAYTYPE', 'LGD_VANCODE', 'LGD_EXCHANGERATE', 'LGD_BUYERSSN', 'LGD_CARDINSTALLMONTH', 'LGD_PAYDATE', 'LGD_PRODUCTCODE', 'LGD_HASHDATA', 'LGD_CARDGUBUN1', 'LGD_CARDGUBUN2', 'LGD_BUYERADDRESS', 'LGD_RECEIVER', 'LGD_RESPCODE', 'LGD_RESPMSG','LGD_DISCOUNTUSEYN','LGD_ISPKEY','LGD_DISCOUNTUSEAMOUNT', 'LGD_AMOUNT', 'LGD_BUYER', 'LGD_PRODUCTINFO', 'LGD_TIMESTAMP'],
                essential: ['LGD_OID'],
                resettable: [],
                explains: {
                    'LGD_OID': '수정할 신고 내용'
                },
                defaults: {
                },
                title: '결제 완료',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
                apiCreator.add(put.finishPay());
                apiCreator.add(put.supplement());
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
router.put('/' + resource, api.put());

module.exports.router = router;
module.exports.api = api;