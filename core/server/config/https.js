var http = require('http'),
    https = require('https'),
    fs = require('fs');

var STD = require('../../../bridge/metadata/standards');

module.exports = function (app) {
    var server = {
        isUseHttps: false
    };
    server.http = http.createServer(app);
    if (STD.flag.isUseHttps) {
        var keyPath = __dirname + "/../../../app/server/config/ssl/key.pem",
            certPath = __dirname + "/../../../app/server/config/ssl/cert.pem";
        if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
            server.isUseHttps = true;
            server.https = https.createServer({
                key: fs.readFileSync(keyPath),
                cert: fs.readFileSync(certPath)
            }, app);
        }
    }
    return server;
};