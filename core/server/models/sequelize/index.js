
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
var LoginHistory = require('./login-history');

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
    LoginHistory: LoginHistory
};

module.exports = models;