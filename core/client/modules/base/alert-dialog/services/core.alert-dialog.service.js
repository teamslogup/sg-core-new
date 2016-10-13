AlertDialogService.$inject = ['$filter', 'sessionManager'];

export default function AlertDialogService($filter, sessionManager) {
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
        this.vm.isDialogVisible = true;
        this.listenCallback(title, body, actionText, isCloseBtnVisible);
    };

    this.action = function () {
        this.vm.isDialogVisible = false;
        if (this.closeCallback) {
            this.actionCallback();
        }
    };

    this.close = function () {
        this.vm.isDialogVisible = false;
        if (this.closeCallback) {
            this.closeCallback();
        }
    };

    this.alertError = function (status, data) {
        if (status == 401) {
            sessionManager.session = null;
            this.vm.session = sessionManager.session;
            this.show('', '로그인이 해제되었습니다. 다시 로그인 하시겠습니까?', '로그인', true, function () {
                this.vm.isLoginVisible = true;
                this.vm.isContentVisible = true;
            }, function () {
                this.vm.isLoginVisible = true;
                this.vm.isContentVisible = false;
                this.vm.goIndex();
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