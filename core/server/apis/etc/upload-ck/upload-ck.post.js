var post = {};
var path = require('path');
var fs = require('fs');

var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        req.body.folder = req.meta.std.file.folderArticle;
        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.supplement = function () {
    return function (req, res, next) {

        var lang = req.query.langCode;
        var langs = req.meta.langs[lang];
        if (!langs) {
            langs = req.meta.langs[req.meta.local.defaultLanguage];
        }

        var msg = langs.uploadSuccess;
        var funcId = req.query.CKEditorFuncNum;
        var url = req.meta.std.cdn.rootUrl + "/" + req.meta.std.file.folderArticle + "/" + req.fileNames[0];

        res.send("<script type='text/javascript'>window.parent.CKEDITOR.tools.callFunction('" + funcId + "', '" + url + "', '" + msg + "')</script>");
    };
};

module.exports = post;
