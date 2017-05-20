var CONFIG = require('../../../bridge/config/env');
var apiExp = new RegExp('/' + CONFIG.app.apiName + '/');
var htmlExp = new RegExp('.html');

module.exports = {
    apiConnect: function () {
        return function (req, res, next) {
            if (apiExp.test(req.url) ||
                apiExp.test(req.originalUrl)) {
                res.set('cache-control', 'no-cache, no-store, must-revalidate');
                res.set('pragma',  'no-cache');
                res.set('expires', 0);
            }
            next();
        };
    },
    htmlConnect: function () {
        return function (req, res, next) {
            if (htmlExp.test(req.url) ||
                htmlExp.test(req.originalUrl)) {
                res.set('cache-control', 'no-cache, no-store, must-revalidate');
                res.set('pragma',  'no-cache');
                res.set('expires', 0);
            }
            next();
        }
    }
};
