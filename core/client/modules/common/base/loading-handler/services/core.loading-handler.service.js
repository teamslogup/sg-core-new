LoadingHandlerService.$inject = ['metaManager'];

export default function LoadingHandlerService(metaManager) {
    this.vm = {};

    this.init = function (vm) {
        this.vm = vm;
        this.vm.LOADING = metaManager.std.loading;

        this.vm.coreLoading = {};
        this.vm.coreLoading[this.vm.LOADING.spinnerKey] = undefined;
    };

    this.startLoading = function (loadingKey, key) {
        if (this.vm.coreLoading[loadingKey] === undefined) {
            this.vm.coreLoading[loadingKey] = {};
        }
        this.vm.coreLoading[loadingKey][key] = true;
    };

    this.endLoading = function (loadingKey, key) {
        if (this.vm.coreLoading[loadingKey] !== undefined) {
            delete this.vm.coreLoading[loadingKey][key];
        }
        var isLoadingEmpty = true;
        for (var k in this.vm.coreLoading[loadingKey]) {
            isLoadingEmpty = false;
        }
        if (isLoadingEmpty) {
            this.vm.coreLoading[loadingKey] = undefined;
        }
    };
}