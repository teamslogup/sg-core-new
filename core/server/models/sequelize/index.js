
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
var Audio = require('./audio');
var ExtinctUser = require('./extinct-user');
var Terms = require('./terms');
var OptionalTerms = require('./optional-terms');
var LoginHistory = require('./login-history');
var NotificationBox = require('./notification-box');
var NotificationSwitch = require('./notification-switch');
var NotificationPublicSwitch = require('./notification-public-switch');
var UserImage = require('./user-image');
var CompanyInfo = require('./company-info');
var ChatHistory = require('./chat-history');
var ChatRoom = require('./chat-room');
var ChatRoomUser = require('./chat-room-user');
var LoginCount = require('./login-count');
var MassNotification = require('./mass-notification');
var AuthCi = require('./auth-ci');
var MobileVersion = require('./mobile-version');
var DomainRender = require('./domain-render');
var MassNotificationImportHistory = require('./mass-notification-import-history');
var MassNotificationDest = require('./mass-notification-dest');
var Lguplus = require('./lguplus');
var InAppPurchase = require('./in-app-purchase');
var PgPurchase = require('./pg-purchase');
var BrowserCount = require('./browser-count');

var models = {
    User: User,
    Provider: Provider,
    Auth: Auth,
    AuthCi: AuthCi,
    Report: Report,
    Notice: Notice,
    Board: Board,
    Category: Category,
    Comment: Comment,
    Article: Article,
    Test: Test,
    Profile: Profile,
    Image: Image,
    Audio: Audio,
    ExtinctUser: ExtinctUser,
    Terms: Terms,
    OptionalTerms: OptionalTerms,
    LoginHistory: LoginHistory,
    NotificationBox: NotificationBox,
    NotificationSwitch: NotificationSwitch,
    NotificationPublicSwitch: NotificationPublicSwitch,
    UserImage: UserImage,
    CompanyInfo: CompanyInfo,
    ChatHistory: ChatHistory,
    ChatRoom: ChatRoom,
    ChatRoomUser: ChatRoomUser,
    LoginCount: LoginCount,
    MassNotification: MassNotification,
    MobileVersion: MobileVersion,
    DomainRender: DomainRender,
    MassNotificationImportHistory: MassNotificationImportHistory,
    MassNotificationDest: MassNotificationDest,
    Lguplus: Lguplus,
    InAppPurchase: InAppPurchase,
    PgPurchase: PgPurchase,
    BrowserCount: BrowserCount
};

module.exports = models;