var routeHelper = require('sg-route-helper');
var express = require('express');

var META = require('../../bridge/metadata');

module.exports = function (app) {

    function sampleRenderer() {
        return function(req, res) {
            if (req.url === '/oauth/facebook' || req.url.indexOf('/api') != -1) {
                return next();
            }

            req.preparedParam.params.oauth = {};

            if (META.std.flag.isMoreInfo == true) {
                req.preparedParam.params.oauth.facebook = req.flash('facebook')[0];
                req.preparedParam.params.oauth.twitter = req.flash('twitter')[0];
                req.preparedParam.params.oauth.google = req.flash('google')[0];
            }

            if (process.env.NODE_ENV == 'production') {
                res.render('sample-production', req.preparedParam);
            }
            else {
                res.render('sample', req.preparedParam);
            }
        };
    }

    app.get('/sample/*',
        routeHelper.prepareParam("sample"),
        sampleRenderer()
    );

    app.get('/sample',
        routeHelper.prepareParam("sample"),
        sampleRenderer()
    );
};