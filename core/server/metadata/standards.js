var standards = {
    "cdn": {
        "rootUrl": "",
        "staticsUrl": ""
    },
    "admin": {
        "enumManagements": ["user", "photo", "board", "notice", "report", "notification", "chart"],
        "enumAppManagements": []
    },
    "profile": {
        "enableProfileItems": ["nick", "gender", "birth", "language", "country", "comment", "pfImgId", "website", "role", "name"],
        "includeProfileItems": []
    },
    "user": {
        "enumPhones": ["ios", "android"],
        "phoneIOS": "ios",
        "phoneAndroid": "android",
        "enumGenders": ["m", "f"],
        "genderMale": "m",
        "genderFemale": "f",
        "enumAuthTypes": ["emailSignup", "emailFindPass", "phoneFindPass", "emailAdding", "phoneAdding"],
        "authEmailSignup": "emailSignup",
        "authEmailAdding": "emailAdding",
        "authEmailFindPass": "emailFindPass",
        "authPhoneFindPass": "phoneFindPass",
        "authPhoneAdding": "phoneAdding",
        "enumSignUpTypes": ["email", "phone", "social", "phoneId", "normalId"],
        "signUpTypeEmail": "email",
        "signUpTypePhone": "phone",
        "signUpTypePhoneId": "phoneId",
        "signUpTypeNormalId": "normalId",
        "signUpTypeSocial": "social",
        "defaultSignUpType": "email",
        "enumProviders": ["facebook", "twitter", "google", "kakao"],
        "providerFacebook": "facebook",
        "providerTwitter": "twitter",
        "providerGoogle": "google",
        "providerKakao": "kakao",
        "enumDeviceTypes": ["ios", "android", "winos", "blackberry"],
        "deviceTypeIOS": "ios",
        "deviceTypeAndroid": "android",
        "enumRoles": ["roleA", "roleB", "roleC", "roleD", "roleE", "roleF", "roleG", "roleS"],
        "enumAssignRoles": ["roleA", "roleB", "roleC"],
        "roleUnauthorizedUser": "roleA",
        "roleUser": "roleB",
        "roleHeavyUser": "roleC",
        "roleAdmin": "roleD",
        "roleSuperAdmin": "roleE",
        "roleUltraAdmin": "roleF",
        "roleSuperUltraAdmin": "roleG",
        "roleSupervisor": "roleS",
        "enumEmailSenderTypes": ["signUp", "findPass", "adding"],
        "emailSenderTypeSignUp": "signUp",
        "emailSenderTypeAdding": "adding",
        "emailSenderTypeFindPass": "findPass",
        "enumPhoneSenderTypes": ["signUp", "adding", "logIn", "findPass"],
        "phoneSenderTypeSignUp": "signUp",
        "phoneSenderTypeAdding": "adding",
        "phoneSenderTypeLogIn": "logIn",
        "phoneSenderTypeFindPass": "findPass",
        "enumLinkIdPassTypes": ["email", "normal"],
        "linkIdPassEmail": "email",
        "linkIdPassNormal": "normal",
        "minNickLength": 2,
        "maxNickLength": 14,
        "minNameLength": 2,
        "maxNameLength": 40,
        "minSecretLength": 6,
        "goodSecretLength": 9,
        "maxSecretLength": 350,
        "emailTokenLength": 121,
        "phoneTokenLength": 4,
        "minPhoneNumLength": 4,
        "maxPhoneNumLength": 30,
        "minIdLength": 4,
        "maxIdLength": 14,
        "expiredEmailTokenMinutes": 120,
        "expiredPhoneTokenMinutes": 3,
        "maxCommentLength": 200,
        "minCommentLength": 1,
        "enableProvider": ["facebook"],
        "defaultAgreedEmail": true,
        "defaultAgreedPhoneNum": true,
        "enumOrders": ["orderCreate", "orderUpdate"],
        "orderCreate": "orderCreate",
        "orderUpdate": "orderUpdate",
        "enumSearchFields": ["nick", "gender", "email", "phoneNum", "birth", "name"],
        "nick": "nick",
        "gender": "gender",
        "email": "email",
        "phoneNum": "phoneNum",
        "birth": "birth",
        "name": "name",
        "defaultPfImg": "http://d16s4e1wnewfvs.cloudfront.net/user/thumb_static_sloger.png",
        "deletedUserStoringDay": 10
    },
    "flag": {
        "isMoreInfo": true,
        "isAutoVerifiedEmail": false,
        "isJoinFriendNotifications": true,
        "isUseS3Bucket": true,
        "isUseRedis": false,
        "isUseHttps": false
    },
    "category": {
        "minNameLength": 1,
        "maxNameLength": 25
    },
    "article": {
        "maxNoticeLength": 100,
        "minTitleLength": 1,
        "maxTitleLength": 80,
        "minBodyLength": 1,
        "maxBodyLength": 10000,
        "maxTagCount": 20,
        "maxPageSize": 10
    },
    "comment": {
        "minBodyLength": 1,
        "maxBodyLength": 10000,
        "maxPositionNumberLength": 14,
        "maxDepth": 2
    },
    "terms": {
        "enumTypes": ["etc"],
        "defaultType": "etc",
        "contentDataType": "long",
        "minContentLength": 2,
        "maxContentLength": 100000,
        "minTitleLength": 2,
        "maxTitleLength": 40,
        "enumSearchFields": ["id", "title"],
        "enumOrderBys": ["createdAt", "updatedAt"],
        "defaultOrderBy": "createdAt"
    },
    "report": {
        "minBodyLength": 1,
        "maxBodyLength": 10000,
        "minReplyLength": 1,
        "maxReplyLength": 10000,
        "minNickLength": 1,
        "maxNickLength": 14,
        "enumSearchFields": ["body", "nick", "email"]
    },
    "notice": {
        "minTitleLength": 1,
        "maxTitleLength": 30,
        "minBodyLength": 1,
        "maxBodyLength": 100000,
        "enumNoticeTypes": ["normal", "faq", "what", "event", "popup"],
        "noticeTypeNormal": "normal",
        "noticeTypeFaq": "faq",
        "noticeTypeWhat": "what",
        "noticeTypeEvent": "event",
        "noticeTypePopup": "popup",
        "enumFields": ["title", "body"]
    },
    "board": {
        "minSlugLength": 1,
        "maxSlugLength": 1000
    },
    "image": {
        "enumOrders": ["orderCreate", "orderUpdate"],
        "orderCreate": "orderCreate",
        "orderUpdate": "orderUpdate"
    },
    "magic": {
        "reset": ":RESET:",
        "default": ":DEFAULT:",
        "nick": ":NICK:",
        "authNum": ":AUTH_NUM:",
        "minute": ":MINUTE:",
        "total": ":TOTAL:",
        "sender": ":SENDER:",
        "empty": ":EMPTY:",
        "itemDay": ":DAY:",
        "item2Week": ":2WEEK:",
        "item4Week": ":4WEEK:",
        "item12Week": ":12WEEK:",
        "item24Week": ":24WEEK:",
        "item48Week": ":48WEEK:",
        "pass": ":PASS:"
    },
    "common": {
        "deletedRowPrefix": "deleted_",
        "wordMaxLength": 100000,
        "wordMinLength": 1,
        "oidLength": 24,
        "defaultLoadingLength": 12,
        "defaultLoadingAdminLength": 36,
        "defaultLast": 0,
        "loadingMaxLength": 36,
        "enumLoadTypes": ["blog", "page"],
        "loadTypeBlog": "blog",
        "loadTypePage": "page",
        "enumSortTypes": ["DESC", "ASC"],
        "DESC": "DESC",
        "ASC": "ASC"
    },
    "file": {
        "enumFolders": ["user", "common", "bg", "article", "attach"],
        "folderUser": "user",
        "folderCommon": "common",
        "folderArticle": "article",
        "folderAttach": "attach",
        "folderBg": "bg",
        "minCount": 1,
        "maxCount": 20,
        "enumValidImageExtensions": ["jpg", "jpeg", "png", "gif"],
        "enumInvalidFileExtensions": ["exe", "js", "php", "jsp", "aspx", "asp", "html", "htm", "css"],
        "enumPrefixes": ["s_", "m_", "l_"],
        "prefixSmall": "s_",
        "prefixMedium": "m_",
        "prefixLarge": "l_",
        "userSize": [{
            "w": 50,
            "h": 50
        }, {
            "w": 200,
            "h": 200
        }, {
            "w": 400,
            "h": 400
        }],
        "commonSize": [{
            "w": 100,
            "h": null
        }, {
            "w": 300,
            "h": null
        }, {
            "w": 600,
            "h": null
        }],
        "bgSize": [{
            "w": 200,
            "h": 50
        }, {
            "w": 800,
            "h": 200
        }, {
            "w": 1600,
            "h": 400
        }]
    },
    "sms": {
        "timeout": 180000,
        "serverTimeout": 190000,
        "authNumLength": 6
    },
    "metadata": {
        "enumMetaTypes": ["std", "langs", "local", "codes"],
        "metaTypeStandards": "std",
        "metaTypeLanguages": "langs",
        "metaTypeLocalization": "local",
        "metaTypeCodes": "codes"
    },
    "prefix": {
        "account": "accounts",
        "board": "boards",
        "profile": "profile",
        "admin": "admin"
    },
    "cluster": {
        "defaultExecutionDelay": 1000
    },
    "role": {
        "account": "roleD",
        "report": "roleD"
    }
};

module.exports = standards;
