var expressValidator = require('express-validator');

function extending() {

    expressValidator.validator.extend('isMicroTimestamp', function(str) {
        if (str === '') return false;
        if (Number(str)) {
            str = str + '';
            if (str.length == 16) {
                return true;
            }
        }
        return false;
    });

    expressValidator.validator.extend('isAlphanumericPassword', function(str, min, max) {
        if (str === '') return false;
        var reg = new RegExp("^.*(?=.{" + min + "," + max +"})(?=.*[0-9])(?=.*[a-zA-Z]).*$");
        return reg.test(str);
    });

    expressValidator.validator.extend('isId', function(str, min, max) {
        if (str === '') return false;
        if (str.length > min || str.length < max) return false;
        var reg = new RegExp("^[a-z0-9]{" + min + "," + max + "}$");
        return reg.test(str);
    });

    expressValidator.validator.extend('isPos', function (str) {
        if (str === '') return false;

        var arr = str.split(',');
        var result = (arr.length != 2) ? false : true;

        if (result === true) {
            for (var i = 0; i < arr.length; ++i) {
                var value = Number(arr[i]);
                if (!value && value !== 0) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    });

    expressValidator.validator.extend('isObjectIds', function (str, maxCnt) {
        if (!maxCnt) maxCnt = 100;
        if (str === '') return false;

        var arr = str.split(',');
        var result = (arr.length > maxCnt) ? false : true;

        if (result === true) {
            for (var i = 0; i < arr.length; ++i) {
                var value = arr[i].replace(new RegExp(" ", "g"), "");
                if (value != '') {
                    if (!(value.length === 24) || (value.match(/^[0-9a-fA-F]+$/) === false)) {
                        result = false;
                        break;
                    }
                }
            }
        }
        return result;
    });

    expressValidator.validator.extend('isYear', function (str) {
        if (str === '') return false;
        var now = new Date();
        var result = Number(str);
        if (!result) return false;
        if (str < 1900 || str > now.getFullYear()) return false;
        return true;
    });

    expressValidator.validator.extend('isMonth', function (str) {
        if (str === '') return false;
        var result = Number(str);
        if (!result) return false;
        if (str < 1 || str > 12) return false;
        return true;
    });

    expressValidator.validator.extend('isDay', function (str) {
        if (str === '') return false;
        var result = Number(str);
        if (!result) return false;
        if (str < 1 || str > 31) return false;
        return true;
    });

    expressValidator.validator.extend('onlyError', function () {
        return false;
    });

    expressValidator.validator.extend('isEnum', function (str, enums) {
        var result = false;
        if (str === '') return true;
        for (var i = 0; i < enums.length; ++i) {
            enums[i] = enums[i] + "";
            if (enums[i] === str) {
                result = true;
            }
        }
        return result;
    });

    expressValidator.validator.extend('isBoolean', function (str) {
        var result = false;
        if (str === '') return true;
        str = str + "";
        var booleans = ['true', 'false'];
        for (var i = 0; i < booleans.length; ++i) {
            booleans[i] = booleans[i] + "";
            if (booleans[i] === str) {
                result = true;
            }
        }
        return result;
    });

    expressValidator.validator.extend('isRange', function (str, min, max) {
        if (str === '') return false;
        var num = Number(str);
        if (!num) return false;
        if (num >= min && num <= max) return true;
        else return false;
    });

    expressValidator.validator.extend('isImages', function (str, maxCnt) {
        if (!maxCnt) maxCnt = 1;
        if (str === '') return false;
        var arr = str.split(',');
        if (arr.length > maxCnt) {
            return false;
        } else {
            for (var i = 0; i < arr.length; ++i) {
                //trim
                arr[i] = arr[i].replace(/^\s*|\s*$/g, "");
                arr[i] = arr[i].toLowerCase();
                //check image
                var result = arr[i].match(/\.(jpg|gif|png|jpeg)$/i);
                if (!result) break;
            }
        }
        return result;
    });

    expressValidator.validator.extend('isTags', function (str, minLen, maxLen, maxCnt) {
        if (!maxCnt) maxCnt = 1;
        if (str === '') return false;
        var arr = str.split(',');
        if (arr.length > maxCnt || arr.length < minLen) {
            return false;
        } else {
            for (var i = 0; i < arr.length; ++i) {
                //trim
                arr[i] = arr[i].replace(/^\s*|\s*$/g, "");
                arr[i] = arr[i].toLowerCase();
                //check image
                var result = arr[i].length <= maxLen;
                if (!result) break;
            }
        }
        return result;
    });

    expressValidator.validator.extend('isEmails', function (str, maxCnt) {
        if (!maxCnt) maxCnt = 1;
        if (str === '') return false;
        var arr = str.split(',');
        if (arr.length > maxCnt) {
            return false;
        } else {
            for (var i = 0; i < arr.length; ++i) {
                //trim
                arr[i] = arr[i].replace(/^\s*|\s*$/g, "");
                arr[i] = arr[i].toLowerCase();

                //check email
                var result = expressValidator.validator.isEmail(arr[i]);
                if (!result) break;
            }
        }
        return result;
    });
}

module.exports = extending;