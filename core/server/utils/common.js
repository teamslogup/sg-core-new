var META = require('../../../bridge/metadata/index');
var CODES = META.codes;

module.exports = {
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