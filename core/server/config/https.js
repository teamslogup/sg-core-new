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
            csrPath = __dirname + "/../../../app/server/config/ssl/csr.pem";
        if (fs.existsSync(keyPath) && fs.existsSync(csrPath)) {
            server.isUseHttps = true;
            server.https = https.createServer({
                key: fs.readFileSync(keyPath, 'utf8'),
                csr: fs.readFileSync(csrPath, 'utf8')
            }, app);
        }
    }
    return server;
};