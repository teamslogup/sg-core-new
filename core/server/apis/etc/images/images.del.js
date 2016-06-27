var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var path = require('path');

del.getImages = function() {
    return function(req, res, next) {
        req.idArray = [];
        req.utils.common.toArray(req.body, 'imageIds');
        for (var i=0; i<req.body.imageIds.length; i++) {
            req.idArray.push(parseInt(req.body.imageIds[i]));
        }
        req.models.Image.findImagesByIds(req.idArray, req.user, function (status, data) {
            if (status == 200) {
                req.images = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    }
};

del.checkSession = function() {
    return function(req, res, next) {
        if (req.idArray.length == req.images.length) {
            next();
        }
        else {
            return res.hjson(req, next, 403);
        }
    };
};

del.validate = function(){
    return function(req, res, next){
        var FILE = req.meta.std.file;
        var filePath = path.join(__dirname, "../../../../.." + req.meta.std.cdn.rootUrl + '/' + req.body.folder + '/');

        req.files = [];

        for (var j=0; j<req.images.length; j++) {
            for (var i=0; i<FILE.enumPrefixes.length; i++) {
                req.files.push({
                    path: filePath + FILE.enumPrefixes[i] + req.images[j].name
                });
            }
            req.files.push({
                path: filePath + req.images[j].name
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
