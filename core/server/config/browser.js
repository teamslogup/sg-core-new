var UAParser = require('ua-parser-js');

module.exports = function () {
    return function (req, res, next) {

        var parser = new UAParser();
        var ua = req.headers['user-agent'];
        var browser = parser.setUA(ua).getBrowser();

        req.models.BrowserCount.upsertBrowserCount({
            domain: req.get('host'),
            ip: req.refinedIP,
            browser: browser.name,
            version: browser.major
        }, function (status, data) {
            if (status == 204) {

            } else {
                console.log('BrowserCount fail: ' + req.refinedIP);
            }
        });

        next();
    }
};