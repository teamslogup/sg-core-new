/**
 * User model module.
 * @module core/server/models/sequelize/user
 */

/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var crypto = require('crypto');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

const profileKey = "profile";

var STD = require('../../../../bridge/metadata/standards');
module.exports = {
    fields: {
        'aid': {
            'type': Sequelize.STRING,
            'allowNull': true,
            'unique': true
        },
        'email': {
            'type': Sequelize.STRING,
            'allowNull': true,
            'unique': true
        },
        'secret': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'salt': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'phoneNum': {
            'type': Sequelize.STRING,
            'allowNull': true,
            'unique': true
        },
        'name': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'nick': {
            'type': Sequelize.STRING,
            'allowNull': false,
            'unique': true
        },
        'role': {
            'type': Sequelize.ENUM,
            'values': STD.user.enumRoles,
            'allowNull': false,
            'defaultValue': STD.user.roleUser
        },
        'gender': {
            'type': Sequelize.ENUM,
            'values': STD.user.enumGenders,
            'allowNull': true
        },
        'birth': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'isVerifiedEmail': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': false
        },
        'ip': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'country': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'language': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'isReviewed': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': false
        },
        'agreedEmail': {
            'type': Sequelize.BOOLEAN,
            'allowNull': true
        },
        'agreedPhoneNum': {
            'type': Sequelize.BOOLEAN,
            'allowNull': true
        },
        'profileId': {
            'reference': 'Profile',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'profile',
            'asReverse': 'user'
        },
        'createdAt': {
           'type': Sequelize.BIGINT,
           'allowNull': true
        },
        'updatedAt': {
           'type': Sequelize.BIGINT,
           'allowNull': true
        },
        'deletedAt': {
           'type': Sequelize.BIGINT,
           'allowNull': true
        }
    },
    options: {
        'timestamps': false,
        'charset': 'utf8',
        'paranoid': true, // deletedAt 추가. delete안함.
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt,
            'beforeBulkUpdate': mixin.options.hooks.bulkUpdatedAt,
            'beforeDestroy': mixin.options.hooks.microDeletedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {
            /**
             * 이메일토큰생성
             * @returns {boolean}
             */
            'createEmailToken': function () {
                var now = new Date();
                return {
                    type: STD.user.signUpTypeEmail,
                    key: this.email,
                    token: crypto.randomBytes(STD.user.emailTokenLength).toString('base64'),
                    expiredAt: now.setMinutes(now.getMinutes() + STD.user.expiredEmailTokenMinutes)
                };
            },

            /**
             * 비밀번호 인코딩
             * @param {string} secret - 인코딩할 평문 비밀번호
             * @returns {boolean}
             */
            'createHashPassword': function (secret) {
                return crypto.pbkdf2Sync(secret, this.salt, 10000, 64).toString('base64');
            },

            /**
             * 비밀번호 검증
             * @param secret
             * @returns {boolean}
             */
            'authenticate': function (secret) {
                return this.secret == this.createHashPassword(secret);
            },

            /**
             * 비밀번호 암호화
             * @returns {mixin.options.instanceMethods}
             */
            'encryption': function () {
                this.salt = crypto.randomBytes(16).toString('base64');
                if (this.secret) this.secret = this.createHashPassword(this.secret);
                return this;
            },
            'toSecuredJSON': function () {
                var obj = this.toJSON();
                if (obj.profile) {
                    if (obj.profile.toSimpleJSON) {
                        obj.profile = obj.profile.toSimpleJSON();
                    } else {
                        delete obj.profile.userId;
                        delete obj.profile.id;
                        delete obj.profile.createdAt;
                        delete obj.profile.updatedAt;
                    }
                }
                delete obj.salt;
                delete obj.secret;
                return obj;
            },
            'toStrongSecuredJSON': function () {
                var obj = this.toSecuredJSON();
                delete obj.phoneNum;
                delete obj.email;
                return obj;
            },

            /**
             * 핸드폰번호 추가
             * @param {sequelize.models.Auth} auth - auth모델
             * @param {responseCallback} callback - 응답콜백
             */
            'addPhoneNumber': function (auth, callback) {
                var loadedUser = null;
                var self = this;
                sequelize.transaction(function (t) {
                    return self.updateAttributes({
                        phoneNum: auth.key
                    }, {transaction: t}).then(function (user) {
                        loadedUser = user;
                        return auth.destroy({transaction: t}).then(function () {

                        }).catch(errorHandler.catchCallback(callback));
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedUser) {
                        callback(200, loadedUser)
                    } else {
                        callback(404);
                    }
                })
            },

            /**
             * 등록된 핸드폰번호 제거
             * @param {responseCallback} callback - 응답콜백
             */
            'removePhoneNumber': function (callback) {
                var loadedUser = null;
                var self = this;
                self.updateAttributes({
                    phoneNum: null
                }).then(function (user) {
                    loadedUser = user;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedUser) {
                        callback(200, loadedUser)
                    } else {
                        callback(404);
                    }
                });
            },

            /**
             * 이메일인증
             * @param {string} token - 토큰값
             * @param {responseCallback} callback - 응답콜백
             * @todo testing
             */
            'verifyEmail': function (token, callback) {

                var self = this;
                // 이미 인증되었으면 그냥 넘김.
                // 인증이 되지 않았는데 잘못된 토큰이 오면
                // 토큰을 지우고 비인증처리.
                token = token.replace(new RegExp(' ', "g"), '+');

                var now = new Date();
                var USER = STD.user;

                // 이미 인증이 되어있다면.
                if (this.isVerifiedEmail == true) {
                    return callback(400);
                }

                sequelize.transaction(function (t) {
                    // 1. auth 체크
                    return sequelize.models.Auth.findOne({
                        where: {
                            type: USER.signUpTypeEmail,
                            userId: self.id
                        },
                        transaction: t
                    }).then(function (auth) {

                        if (!auth) {
                            throw {status: 404};
                        }

                        if (auth.expiredAt < now || auth.token.toString() != token.toString()) {
                            console.log('fail');
                            throw {status: 403};
                        }

                        // 2. 인증성공하면 auth 제거
                        return auth.destroy({transaction: t}).then(function () {

                            // 3. 인증상태로 유저 변경.
                            return self.updateAttributes({
                                isVerifiedEmail: true,
                                email: auth.key
                            }, {transaction: t}).then(function (user) {
                                if (!user) {
                                    throw {status: 404};
                                }
                            });
                        });
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    callback(200, self);
                });
            },

            /**
             * 비밀번호 변경
             * @param {sequelize.models.Auth} auth - auth모델
             * @param {string} pass - 바꿀 비밀번호
             * @param {responseCallback} callback - 응답콜백
             */
            'changePassword': function (auth, pass, callback) {
                var loadedUser = null;
                var self = this;
                sequelize.transaction(function (t) {
                    return self.updateAttributes({
                        secret: self.createHashPassword(pass)
                    }, {transaction: t}).then(function (user) {
                        if (!user) throw {status: 404};
                        loadedUser = user;
                        if (auth) {
                            return auth.destroy({transaction: t});
                        }
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedUser) {
                        callback(200, loadedUser);
                    }
                });
            }
        }),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getUserFields': function () {
                var fields = ['id', 'nick', 'gender', 'birth', 'role', 'country', 'language', 'agreedEmail'];
                return fields;
            },
            'getFullUserFields': function () {
                var fields = ['id', 'email', 'phoneNum', 'nick', 'gender', 'birth', 'role', 'country', 'language', 'agreedEmail', 'agreedPhoneNum'];
                return fields;
            },
            /**
             * 생성일자가 last 보다 먼저인 유저 size 만큼 찾기
             * @param {Object} last - 찾을 유저 생성일자 조건
             * @param {Object} size - 찾을 유저 수
             * @param {responseCallback} callback - 응답콜백
             */
            'findUsersByOption': function (searchItem, searchField, last, size, order, sort, callback) {
                var where = {};

                var query = {
                    'limit': parseInt(size),
                    'where': where
                };

                if (searchField && searchItem) {
                    query.where[searchField] = {
                        '$like': '%' + searchItem + '%'
                    };
                } else if (searchItem) {
                    if (STD.user.enumSearchFields.length > 0) query.where.$or = [];
                    for (var i=0; i<STD.user.enumSearchFields.length; i++) {
                        var body = {};
                        body[STD.user.enumSearchFields[i]] = {
                            '$like': '%' + searchItem + '%'
                        };
                        query.where.$or.push(body);
                    }
                }


                if (order == STD.user.orderUpdate) {
                    query.where.updatedAt = {
                        '$lt': last
                    };
                    query.order = [['updatedAt', sort]];
                } else {
                    query.where.createdAt = {
                        '$lt': last
                    };
                    query.order = [['createdAt', sort]];
                }

                query.include = [{
                    'model': sequelize.models.Profile,
                    'as': profileKey
                }];

                sequelize.models.User.findAllDataForQuery(query, callback);
            },
            /**
             * 아이디로 유저 찾기
             * @param {Object} id - 찾을 유저의 아이디
             * @param {responseCallback} callback - 응답콜백
             */
            'findUserById': function (id, callback) {
                this.findDataIncludingById(id, [{
                    model: sequelize.models.Profile,
                    as: profileKey
                }], callback);
            },
            /**
             * 번호로 유저 찾기
             * @param {Object} phoneNum - 찾을 유저의 번호
             * @param {responseCallback} callback - 응답콜백
             */
            'findUserByPhoneNumber': function (phoneNum, callback) {
                var where = {phoneNum: phoneNum};
                sequelize.models.User.findDataIncluding(where, [{
                    model: sequelize.models.Profile,
                    as: profileKey
                }], callback);
            },
            /**
             * 이메일로 유저 찾기
             * @param {Object} email - 찾을 유저의 이메일
             * @param {responseCallback} callback - 응답콜백
             */
            'findUserByEmail': function (email, callback) {
                var where = {email: email};
                sequelize.models.User.findDataIncluding(where, [{
                    model: sequelize.models.Profile,
                    as: profileKey
                }], callback);
            },
            /**
             * AID로 유저 찾기
             * @param {Object} aid - 찾을 유저의 aid
             * @param {responseCallback} callback - 응답콜백
             */
            'findUserByAid': function (aid, callback) {
                var where = {aid: aid};
                sequelize.models.User.findDataIncluding(where, [{
                    model: sequelize.models.Profile,
                    as: profileKey
                }], callback);
            },
            /**
             * 범용 유저생성
             * @param {Object} data - 유저 생성을 위한 유저 필드
             * @param {responseCallback} callback - 응답콜백
             * @todo testing
             */
            'createUserWithType': function (data, callback) {
                data.isVerifiedEmail = STD.flag.isAutoVerifiedEmail;
                if (data.type == STD.user.signUpTypeEmail) {

                    delete data.aid;
                    delete data.apass;

                    data.email = data.uid;
                    data.aid = data.uid;

                    delete data.provider;
                    delete data.uid;
                    this.createUserWithEmail(data, callback);
                }
                else if (data.type == STD.user.signUpTypePhone || data.type == STD.user.signUpTypePhoneId) {
                    data.phoneNum = data.uid;
                    delete data.provider;
                    delete data.uid;
                    this.createUserWithPhoneNumber(data, callback);
                }
                else {
                    this.createUserWithProvider(data, callback);
                }
            },
            /**
             * Email 유저생성
             * @param {Object} data - 유저 생성을 위한 유저 필드
             * @param {responseCallback} callback - 응답콜백
             */
            'createUserWithEmail': function (data, callback) {
                var createdUser = null;
                var type = STD.user.signUpTypeEmail;

                sequelize.transaction(function (t) {
                    var user = sequelize.models.User.build(data);
                    user.encryption();
                    return user.save({transaction: t}).then(function () {

                        createdUser = user;
                        var authData = {
                            type: type,
                            key: createdUser.email,
                            userId: user.id
                        };

                        // 2. 이메일 인증을 위해 인증토큰 생성.
                        return sequelize.models.Auth.upsert(authData, {transaction: t}).then(function () {

                            // 3. 모바일 앱으로 가입한 경우라면 토큰 값을 설정해준다.
                            if (data.deviceToken && data.deviceType) {
                                return sequelize.models.Device.upsert({
                                    type: data.deviceType,
                                    token: data.deviceToken,
                                    userId: user.id
                                }, {transaction: t}).then(function () {

                                });
                            }
                        });
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (createdUser) {
                        var loadedAuth = null;
                        sequelize.models.Auth.findOne({
                            where: {
                                type: type,
                                key: createdUser.email
                            }
                        }).then(function (auth) {
                            loadedAuth = auth;
                        }).catch(errorHandler.catchCallback(callback)).done(function () {
                            if (loadedAuth) {
                                createdUser.auth = loadedAuth;
                                callback(200, createdUser);
                            } else {
                                callback(404);
                            }
                        });
                    }
                });
            },
            /**
             * Phone 유저생성
             * @param {Object} data - 유저 생성을 위한 유저 필드
             * @param {responseCallback} callback - 응답콜백
             * @todo testing
             */
            'createUserWithPhoneNumber': function (data, callback) {
                var createdUser = null;
                var authNum = data.secret;
                if (data.apass !== undefined) {
                    data.secret = data.apass;
                    delete data.apass;
                } else {
                    delete data.secret;
                }

                sequelize.transaction(function (t) {
                    // 1. 유저생성.
                    var user = sequelize.models.User.build(data);
                    user.encryption();
                    return user.save({transaction: t}).then(function () {
                        createdUser = user;

                        // 2. 번호 인증 스키마 얻기.
                        return sequelize.models.Auth.findOne({
                            where: {
                                type: STD.user.signUpTypePhone,
                                key: user.phoneNum
                            },
                            transaction: t
                        }).then(function (auth) {

                            if (!auth) throw {status: 404};

                            // 3. 번호 체크
                            if (auth.token != authNum) {
                                throw {status: 403}
                            } else {
                                // 4. 날짜 체크
                                var now = new Date();
                                if (auth.expiredAt < now) {
                                    throw {status: 403}
                                } else {
                                    // 5. 모두 성공하면 Auth를 지움.
                                    return auth.destroy({transaction: t}).then(function () {
                                        // 6. 모바일 앱으로 가입한 경우라면 토큰 값을 설정해준다.
                                        if (data.deviceToken && data.deviceType) {
                                            return sequelize.models.Device.upsert({
                                                type: data.deviceType,
                                                token: data.deviceToken,
                                                userId: user.id
                                            }, {transaction: t}).then(function () {

                                            });
                                        }
                                    });
                                }
                            }
                        });
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (createdUser) {
                        return callback(200, createdUser);
                    }
                });
            },
            /**
             * Provider 유저생성
             * @param {Object} data - 유저 생성을 위한 유저 필드
             * @param {responseCallback} callback - 응답콜백
             * @todo testing
             */
            'createUserWithProvider': function (data, callback) {
                var createdUser = null;

                sequelize.transaction(function (t) {

                    var uid = data.uid;
                    var type = data.provider;
                    var token = data.secret;

                    delete data.uid;
                    delete data.provider;
                    delete data.secret;

                    // 1. 유저생성.
                    var user = sequelize.models.User.build(data);
                    user.encryption();
                    return user.save({transaction: t}).then(function (user) {

                        // 2. 프로바이더생성
                        return sequelize.models.Provider.create({
                            type: type,
                            uid: uid,
                            token: token,
                            userId: user.id
                        }, {transaction: t}).then(function (provider) {
                            user.setDataValue('provider', provider);
                            createdUser = user;

                            // 3. 앱으로 가입한 경우 토큰 생성
                            if (data.deviceToken && data.deviceType) {
                                return sequelize.models.Device.upsert({
                                    type: data.deviceType,
                                    token: data.deviceToken,
                                    userId: user.id
                                }, {transaction: t}).then(function (device) {

                                });
                            }
                        });
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (createdUser) {
                        return callback(200, createdUser);
                    }
                });
            },
            /**
             * 소셜인증 시 가입요청, 로그인 등을 한번에 수행하는 함수.
             * @param providerData
             * @param callback
             */
            checkAccountForProvider: function (req, providerData, callback) {

                function login(req, data, callback) {
                    req.login(data, function (err) {
                        var bSearched = false;
                        if (err) {
                            for (var k in err) {
                                bSearched = true;
                                break;
                            }
                        }
                        if (err && bSearched) {
                            logger.e(err);
                            callback(400, err);
                        }
                        else {
                            callback(200, data);
                            if (process.env.NODE_ENV == 'test') {

                            } else {

                            }
                        }
                    });
                }

                function signup(req, data, callback) {
                    sequelize.models.User.createUserWithType(data, function (status, data) {
                        if (status == 409) {
                            data.nick = data.nick + Math.floor(Math.random() * 100000) % 4;
                            return signup(req, data, callback);
                        }
                        if (status == 200) {
                            login(req, data, callback);
                        } else {
                            callback(status, data);
                        }
                    });
                }


                sequelize.models.Provider.findDataIncluding({
                        'type': providerData.provider,
                        'uid': providerData.uid
                    }, [{
                        model: sequelize.models.User,
                        as: 'user'
                    }],
                    function (status, data) {
                        if (status == 200) {
                            // 가입되어있으면 바로 로그인
                            login(req, data.user, callback);
                        }
                        else {
                            // 가입되어 있지 않음
                            if (STD.flag.isMoreInfo) {
                                // 더 많은 정보가 필요함. 301을 리턴해서 리다이렉트가 필요하다고 알려줌.
                                callback(301, providerData);
                            } else {
                                // 최소 정보로 가입함, 로그인 필요.
                                signup(req, providerData, callback);
                            }
                        }
                    }
                );
            }
        })
    }
};