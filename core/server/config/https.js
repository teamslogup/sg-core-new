var http = require('http'),
    https = require('https'),
    fs = require('fs');

var STD = require('../../../bridge/metadata/standards');
var config = require('../../../bridge/config/env');

module.exports = function (app) {
    var server = {
        http: null,
        https: null
    };
    server.http = http.createServer(app);
    if (STD.flag.isUseHttps) {

        var keyPath = __dirname + "/../../../app/server/config/ssl/" + config.app.keyFile,
            certPath = __dirname + "/../../../app/server/config/ssl/" + config.app.crtFile;

        var options = {
            key: fs.readFileSync(keyPath, 'utf8'),
            cert: fs.readFileSync(certPath, 'utf8')
        };

        var cr = [];

        if (config.app.cr && config.app.cr.length) {
            for (var i=0; i<config.app.cr.length; i++) {
                cr.push(fs.readFileSync(__dirname + "/../../../app/server/config/ssl/" + config.app.cr[i]));
            }
            options.cr = cr;
        }

        if (config.app.passphrase) {
            options.passphrase = config.app.passphrase;
        }

        if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
            server.https = https.createServer(options, app);
        }
    }
    return server;
};