var CONFIG = require('../../bridge/config/env');
var express = require('express');
module.exports = function (app) {
    require('../routes/api')(app, CONFIG.app.apiName);
    require('../routes/sample')(app);
};