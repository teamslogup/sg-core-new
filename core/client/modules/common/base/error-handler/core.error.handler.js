errorHandler.$inject = ['$filter', '$location'];

export default function errorHandler($filter, metaManager, $location) {
    this.alertError = alertError;
    this.refineError = refineError;
    this.getErrorObject = getErrorObject;
    this.getFormError = getFormError;
    this.isInvalid = isInvalid;

    function isInvalid(ngNameObj) {
        if (angular.isDefined(ngNameObj)) {
            return !ngNameObj.$focus && ngNameObj.$invalid && ngNameObj.$dirty;
        }
        return false;
    }

    function getFormError(error) {
        if (!error) return "";
        if (error.required) return "400_53";
        if (error.email) return "400_1";
        if (error.minlength) return "400_51";
        if (error.maxlength) return "400_51";
        if (error.min) return "400_11";
        if (error.url) return "400_52";
        else return "400";
    }

    function alertError(status, data, redirectObj) {
        if (status >= 400) {
            if (data) {
                if (data instanceof Array) {
                    return alert($filter('translate')(data[0].code));
                } else if (data.code) {
                    if (redirectObj) {
                        if (data.code == redirectObj.code) {
                            return $location.path(redirectObj.url);
                        }
                    }
                    return alert($filter('translate')(data.code));
                } else {
                    return alert($filter('translate')(status));
                }
            } else {
                return alert($filter('translate')(status));
            }
        } else {
            return "";
        }
    }

    function refineError(status, data) {
        if (status >= 400) {
            if (data.data) {
                if (data.data instanceof Array) {
                    return $filter('translate')(data.data[0].code);
                } else if (data.data.code) {
                    return $filter('translate')(data.data.code);
                } else {
                    return $filter('translate')(status);
                }
            } else {
                return $filter('translate')(status);
            }
        } else {
            return "";
        }
    }

    function getErrorObject(status, data) {
        if (status >= 400) {
            if (data.data) {
                if (data.data instanceof Array) {
                    return data.data;
                } else if (data.data.code) {
                    return data.data.code;
                } else {
                    return status
                }
            } else {
                return status
            }
        } else {
            return null;
        }
    }
}