var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var path = require('path');

del.checkSession = function() {
    return function(req, res, next) {
        req.idArray = [];
        for (var i=0; i<req.body.image.length; i++) {
            req.idArray.push(req.body.image["id" + i]);
        }
        if (req.user.role >= req.meta.std.user.roleAdmin) { // check admin session
            next();
        } else {
            var check = true;
            req.models.Image.findImagesByIds(req.idArray, function (status, data) {
                if (status == 200) {
                    for (var i=0; i<data.length; i++) {
                        if (req.user.id != data[i].authorId) {
                            check = false;
                        }
                    }
                    if (check) next();
                    else {
                        return res.hjson(req, next, 400, {
                            code: '403'
                        });
                    }
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        }
    }
};

del.validate = function(){
    return function(req, res, next){
        var FILE = req.meta.std.file;
        var filePath = path.join(__dirname, "../../../../.." + req.meta.std.cdn.rootUrl + '/' + req.body.folder + '/');

        req.files = [];

        for (var j=0; j<req.body.image.length; j++) {
            for (var i=0; i<FILE.enumPrefixes.length; i++) {
                req.files.push({
                    path: filePath + FILE.enumPrefixes[i] + req.body.image["name" + j]
                });
            }
            req.files.push({
                path: filePath + req.body.image["name" + j]
            });
        }

        req.check('folder','400_3').isEnum(FILE.enumFolders);
        req.utils.common.checkError(req, res, next);
        next();
    };
};

del.destroy = function(){
    return function(req, res, next) {
        req.models.Image.deleteImagesByIds(req.idArray, function (status, data) {
            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    }
};

del.supplement = function(){
    return function(req, res, next){
        res.hjson(req, next, 204);
    };
};

module.exports = del;