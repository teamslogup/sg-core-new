var standards = {
    "cdn": {
        "rootUrl": "",
        "staticsUrl": ""
    },
    "admin": {
        "isUseModalAnimation": true,
        "modalBackDrop": true
    },
    "profile": {
        "enableProfileItems": ["nick", "gender", "birth", "language", "country", "comment", "pfImgId", "website", "role", "name"],
        "includeProfileItems": []
    },
    "notification": {
        "enumForms": ["notice", "event", "emergency", "application"],
        "formNotice": "notice",
        "formEvent": "event",
        "formEmergency": "emergency",
        "formApplication": "application",
        "enumNotificationTypes": ["email", "push", "sms", "email+push"],
        "notificationEmail": "email",
        "notificationPush": "push",
        "notificationSms": "sms",
        "notificationEmailPush": "email+push",
        "maxKeyLength": 100,
        "minKeyLength": 1,
        "maxTitleLength": 60,
        "minTitleLength": 1,
        "maxBodyLength": 60,
        "minBodyLength": 1,
        "maxDataLength": 60,
        "minDataLength": 1,
        "maxImgLength": 60,
        "minImgLength": 1,
        "maxDescriptionLength": 60,
        "minDescriptionLength": 1,
        "notiApply": {
            "type": "push",
            "key": "notiNameApply",
            "title": "notiNameApplyTitle",
            "body": "notiNameApplyBody",
            "isStored": true,
            "isOption": true,
            "form": "application"
        }
    },
    "notificationBox": {
        "defaultLoadingLength": 8,
        "enumOrders": ["createdAt"],
        "defaultOrderBy": "createdAt"
    },
    "user": {
        "enumPhones": ["ios", "android"],
        "phoneIOS": "ios",
        "phoneAndroid": "android",
        "enumGenders": ["m", "f"],
        "genderMale": "m",
        "genderFemale": "f",
        "enumAuthTypes": ["emailSignup", "phoneSignup", "emailFindPass", "phoneFindPass", "phoneFindId", "emailAdding", "phoneAdding", "phoneLogin", "emailFindId"],
        "enumAuthPhoneTypes": ["phoneSignup", "phoneFindPass", "phoneFindId", "phoneAdding", "phoneLogin"],
        "enumAuthEmailTypes": ["emailSignup", "emailFindPass", "emailAdding", 'emailFindId'],
        "authEmailSignup": "emailSignup",
        "authEmailAdding": "emailAdding",
        "authEmailFindPass": "emailFindPass",
        "authEmailFindId": "emailFindId",
        "authPhoneSignup": "phoneSignup",
        "authPhoneFindPass": "phoneFindPass",
        "authPhoneFindId": "phoneFindId",
        "authPhoneAdding": "phoneAdding",
        "authPhoneLogin": "phoneLogin",
        "enumSignUpTypes": ["email", "phone", "social", "phoneId", "normalId", "phoneEmail"],
        "signUpTypeEmail": "email",
        "signUpTypePhone": "phone",
        "signUpTypePhoneId": "phoneId",
        "signUpTypePhoneEmail": "phoneEmail",
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
        "deletedUserStoringDay": 10,
        "quiescenceUserPivotDay": 365,
    },
    "flag": {
        "isMoreSocialInfo": true, // 소셜가입할때 추가정보가 필요할경우.
        "isAutoVerifiedEmail": false,
        "isJoinFriendNotifications": true,
        "isUseS3Bucket": true,
        "isUseRedis": false,
        "isUseHttps": false,
        "isDuplicatedLogin": false,
        "isUseCluster": false
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
        "enumTypes": ["essential", "optional"],
        "typeEssential": "essential",
        "typeOptional": "optional",
        "contentDataType": "long",
        "minContentLength": 2,
        "maxContentLength": 100000,
        "minTitleLength": 2,
        "maxTitleLength": 40,
        "enumSearchFields": ["id", "title"],
        "enumOrderBys": ["createdAt", "updatedAt"],
        "defaultOrderBy": "createdAt",
        "showAgreeTerms": "showAgreeTerms",
        "modalSize": "md"
    },
    "report": {
        "minBodyLength": 1,
        "maxBodyLength": 10000,
        "minReplyLength": 1,
        "maxReplyLength": 10000,
        "minNickLength": 1,
        "maxNickLength": 14,
        "enumSearchFields": ["nick", "email", "body"],
        "enumSolved": ["all", "solved", "unsolved"]
    },
    "notice": {
        "minTitleLength": 1,
        "maxTitleLength": 30,
        "minBodyLength": 1,
        "maxBodyLength": 100000,
        "enumNoticeTypes": ["notice", "faq", "what", "event", "popup"],
        "noticeTypeNormal": "notice",
        "noticeTypeFaq": "faq",
        "noticeTypeWhat": "what",
        "noticeTypeEvent": "event",
        "noticeTypePopup": "popup",
        "enumFields": ["title", "body"],
        "enumCountries": ["KR"]
    },
    "board": {
        "minSlugLength": 1,
        "maxSlugLength": 1000
    },
    "image": {
        "enumOrders": ["orderCreate", "orderUpdate"],
        "orderCreate": "orderCreate",
        "orderUpdate": "orderUpdate",
        "enumAuthorized": ["all", "authorized", "unauthorized"],
        "enumSearchFields": ["id"],
        "enumSearchFieldsUser": ["nick", "name"],
        "defaultSearchFields": "nick",
    },
    "magic": {
        "reset": ":RESET:",
        "default": ":DEFAULT:",
        "id": ":ID:",
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
        "ASC": "ASC",
        "id": "id"
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
        "admin": "admin",
        "terms": "terms"
    },
    "cluster": {
        "defaultExecutionDelay": 1000
    },
    "role": {
        "account": "roleD",
        "report": "roleD"
    },
    "loading": {
        "spinnerKey": "spinner"
    },
    "companyInfo": {
        "minCompanyNameLength": 1,
        "maxCompanyNameLength": 100,
        "minRepresentativeLength": 1,
        "maxRepresentativeLength": 100,
        "minRegNumLength": 1,
        "maxRegNumLength": 20,
        "minPrivateInfoManagerLength": 1,
        "maxPrivateInfoManagerLength": 100,
        "minAddressLength": 1,
        "maxAddressLength": 1000,
        "minContactLength": 1,
        "maxContactLength": 100,
    },
    "dashboardInfo": {
        "minMonthArrayLength": 1,
        "maxMonthArrayLength": 10,
        "defaultMonthsLength": 5
    }
};

module.exports = standards;
