AlertDialogService.$inject = ['$filter', 'sessionManager', '$rootScope'];

export default function AlertDialogService($filter, sessionManager, $rootScope) {
    this.vm = {};
    this.listenCallback = undefined;
    this.actionCallback = undefined;
    this.closeCallback = undefined;

    this.init = function (vm) {
        this.vm = vm;
    };

    this.listen = function (listenCallback) {
        this.listenCallback = listenCallback;
    };

    this.show = function (title, body, actionText, isCloseBtnVisible, actionCallback, closeCallback) {
        this.actionCallback = actionCallback;
        this.closeCallback = closeCallback;
        if (this.listenCallback) {
            this.listenCallback(title, body, actionText, isCloseBtnVisible);
        }
    };

    this.action = function () {
        if (this.actionCallback) {
            this.actionCallback();
        }
    };

    this.close = function () {
        if (this.closeCallback) {
            this.closeCallback();
        }
    };

    this.alertError = function (status, data) {
        if (status == 401) {
            $rootScope.$broadcast("core.alert-dialog.callback", {
                type: '401'
            });
        } else if(status == 403 && data.code == "403_20") {
            $rootScope.$broadcast("core.alert-dialog.callback", {
                type: '403_20'
            });
        } else {
            this.show(status, this.translateError(status, data), '', true);
        }
    };

    this.translateError = function (status, data) {
        if (status >= 400) {
            if (data) {
                if (data instanceof Array) {
                    return $filter('translate')(data[0].code);
                } else if (data.code) {
                    return $filter('translate')(data.code);
                } else {
                    return $filter('translate')(status);
                }
            } else {
                return $filter('translate')(status);
            }
        } else {
            return "정의되지 않은 에러";
        }
    }
}