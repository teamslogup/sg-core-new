export default function validator() {
    "ngInject";

    function Validator(param, errorCode) {
        this.param = param;
        this.value = '';
        this.errorCode = errorCode;
        this.validateMethod = null;
    }

    Validator.prototype.getParam = function () {
        return this.param;
    };

    Validator.prototype.setValue = function (value) {
        this.value = value;
    };

    Validator.prototype.getValue = function () {
        return this.value;
    };

    Validator.prototype.getCode = function () {
        return this.errorCode;
    };

    Validator.prototype.isValidate = function () {
        return this.validateMethod();
    };

    Validator.prototype.isInt = function () {
        this.validateMethod = function () {
            return function (value) {
                return Number.isInteger(value);
            }(this.value);
        }
    };

    Validator.prototype.isBoolean = function () {
        this.validateMethod = function () {
            return function (value) {
                var result = false;
                if (value === '') return false;
                value = value + "";
                var booleans = ['true', 'false'];
                for (var i = 0; i < booleans.length; ++i) {
                    booleans[i] = booleans[i] + "";
                    if (booleans[i] === value) {
                        result = true;
                    }
                }
                return result;
            }(this.value);
        }
    };

    Validator.prototype.isEnum = function (enums) {
        this.validateMethod = function () {
            return function (value, enums) {
                var result = false;
                if (value === '') return false;
                for (var i = 0; i < enums.length; ++i) {
                    enums[i] = enums[i] + "";
                    if (enums[i] === value) {
                        result = true;
                    }
                }
                return result;
            }(this.value, enums);
        }
    };

    Validator.prototype.isId = function () {
        this.validateMethod = function () {
            return function (value) {

                value = parseInt(value);

                if (!Number.isInteger(value)) {
                    return false;
                }

                if (value <= 0) {
                    return false;
                }

                return true;
            }(this.value);
        }
    };

    Validator.prototype.len = function (minLen, maxLen) {
        this.validateMethod = function () {
            return function (value, minLen, maxLen) {

                if (value === '') {
                    return false;
                } else {
                    return value.length >= minLen && value.length <= maxLen;
                }

            }(this.value, minLen, maxLen);
        }
    };

    Validator.prototype.isEmail = function () {
        this.validateMethod = function () {
            return function (value) {

                var regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

                if (value === '') {
                    return false;
                } else {
                    return regex.test(value);
                }

            }(this.value);
        }

    };

    Validator.prototype.isAlphanumericPassword = function (min, max) {
        this.validateMethod = function () {
            return function (value, min, max) {

                if (value === '') return false;
                var reg = new RegExp("^.*(?=.{" + min + "," + max + "})(?=.*[0-9])(?=.*[a-zA-Z]).*$");
                return reg.test(value);

            }(this.value, min, max);
        }

    };

    Validator.prototype.isMobilePhoneNum = function () {
        this.validateMethod = function () {
            return function (value) {

                var reg = new RegExp("^[+]{1}821[016789]{1}[0-9]{7,8}$");
                return reg.test(value);

            }(this.value);
        }

    };

    return Validator;
}