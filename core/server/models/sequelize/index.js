
var User = require('./user');
var Provider = require('./provider');
var Auth = require('./auth');
var Report = require('./report');
var Notice = require('./notice');
var Board = require('./board');
var Category = require('./category');
var Comment = require('./comment');
var Article = require('./article');
var Test = require('./test');
var Profile = require('./profile');
var Image = require('./image');
var ExtinctUser = require('./extinct-user');
var Terms = require('./terms');
var OptionalTerms = require('./optional-terms');
var LoginHistory = require('./login-history');
var Notification = require('./notification');
var NotificationBox = require('./notification-box');
var UserNotification = require('./user-notification');
var UserPublicNotification = require('./user-public-notification');
var UserImage = require('./user-image');
var CompanyInfo = require('./company-info');
var LoginCount = require('./login-count');

var models = {
    User: User,
    Provider: Provider,
    Auth: Auth,
    Report: Report,
    Notice: Notice,
    Board: Board,
    Category: Category,
    Comment: Comment,
    Article: Article,
    Test: Test,
    Profile: Profile,
    Image: Image,
    ExtinctUser: ExtinctUser,
    Terms: Terms,
    OptionalTerms: OptionalTerms,
    LoginHistory: LoginHistory,
    Notification: Notification,
    NotificationBox: NotificationBox,
    UserNotification: UserNotification,
    UserPublicNotification: UserPublicNotification,
    UserImage: UserImage,
    CompanyInfo: CompanyInfo,
    LoginCount: LoginCount
};

module.exports = models;