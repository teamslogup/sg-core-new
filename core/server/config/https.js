var http = require('http'),
    https = require('https'),
    fs = require('fs');

var STD = require('../../../bridge/metadata/standards');
var config = require('../../../bridge/config/env');

module.exports = function (app) {
    var server = {
        isUseHttps: false
    };
    server.http = http.createServer(app);
    if (STD.flag.isUseHttps) {
        var keyPath = __dirname + "/../../../app/server/config/ssl/" + config.app.keyFile,
            certPath = __dirname + "/../../../app/server/config/ssl/" + config.app.crtFile;
        if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
            server.isUseHttps = true;
            server.https = https.createServer({
                key: fs.readFileSync(keyPath, 'utf8'),
                cert: fs.readFileSync(certPath, 'utf8')
            }, app);
        }
    }
    return server;
};