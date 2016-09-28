var META = require('../../../bridge/metadata/index');
var CODES = META.codes;
var fs = require('fs');

module.exports = {
    getAPIParams: function (url, method) {
        var api = this.getAPI(url);
        if (api) {
            return api[method](true)();
        } else {
            return {};
        }
    },
    getAPI: function (url) {
        function getApiPath(isCore, group, resource) {
            if (isCore) {
                return require('path').resolve(__dirname, '../apis/' + group + '/' + resource + '/' + resource + ".assembly.js");
            } else {
                return require('path').resolve(__dirname, '../../../app/server/apis/' + group + '/' + resource + '/' + resource + ".assembly.js");
            }
        }

        var apiResource = url;
        var resourceArr = apiResource.split("/");
        var startIdx = 0;
        if (resourceArr[0] == "") {
            startIdx = 1;
        }
        var group = resourceArr[startIdx++];
        var resource = resourceArr[startIdx];

        var isAppExists = fs.existsSync(getApiPath(false, group, resource));
        var isCoreExists = false;
        if (!isAppExists) {
            isCoreExists = fs.existsSync(getApiPath(true, group, resource));
        }
        if (!isCoreExists && !isAppExists) {
            return null;
        } else {
            var path = getApiPath(true, group, resource);
            if (isAppExists) {
                path = getApiPath(false, group, resource);
            }
            return require(path).api;
        }
    },
    requestAPI: function (req, res, next) {
        /**
         * request api
         * {
         *  method: 'get',
         *  resource: '/etc/samples',
         *  data: {
         *      id: 2
         *  },
         *  params: {
         *      id: 1
         *  }
         * }
         */
        var self = this;
        return function (options, callback) {
            var apiResource = options.resource;
            var method = options.method && options.method.toLowerCase();
            var params = options.params;
            var requestData = options.data;
            var api = self.getAPI(apiResource);
            if (api) {
                if (api[method]) {
                    var tempCallback = req.callback;
                    var query = req.query;
                    var body = req.body;
                    var tempParams = req.params;

                    req.query = {};
                    req.body = {};

                    if (method.toLowerCase() == 'get' || method.toLowerCase() == 'gets') {
                        req.query = requestData;
                    } else {
                        req.body = requestData;
                    }
                    req.params = params;

                    req.callback = function (status, data) {
                        req.callback = tempCallback;
                        req.query = query;
                        req.body = body;
                        req.params = tempParams;
                        callback(status, data);
                    };
                    api[method]()(req, res, next);
                } else {
                    callback(404);
                }
            } else {
                callback(404);
            }
        };
    },
    getCountryEnum: function (req) {

        if (req.body.country) req.body.country = req.body.country.toUpperCase();
        if (req.query.country) req.query.country = req.query.country.toUpperCase();

        var LOCAL = req.meta.local;
        var enumCountries = [];
        for (var k in LOCAL.countries) {
            enumCountries.push(k);
        }
        return enumCountries;
    },
    getLanguageEnum: function (req) {

        if (req.body.language) req.body.language = req.body.language.toLowerCase();
        if (req.query.language) req.query.language = req.query.language.toLowerCase();

        var LOCAL = req.meta.local;
        var enumLanguages = [];
        for (var k in LOCAL.languages) {
            enumLanguages.push(k);
        }
        return enumLanguages;
    },
    errorTranslator: function (err, lang) {
        var str = '';

        if (!lang) lang = 'ko';

        if (err instanceof Array) {
            for (var i = 0; i < err.length; ++i) {
                if (err[i].code) {
                    str += err[i].param + ": " + CODES[lang][err[i].code] + " ";
                }
            }
        } else {
            if (err.code) {
                str = CODES[lang][err.code];
            }
        }
        if (!str) str = err;
        return str;
    }
};