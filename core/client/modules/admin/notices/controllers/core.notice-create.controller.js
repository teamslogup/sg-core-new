export default function ReportCreateCtrl($scope, $filter, $uibModalInstance, scope) {
    "ngInject";

    var NOTICE = scope.metaManager.std.notice;
    var LOADING = scope.metaManager.std.loading;

    $scope.form = {
        type: scope.noticeTypes[0],
        country: scope.noticeCountries[0]
    };

    $scope.noticeTypes = NOTICE.enumNoticeTypes;
    $scope.noticeCountries = scope.noticeCountries;

    $scope.createNotice = createNotice;
    $scope.cancel = cancel;

    function createNotice() {

        var body = angular.copy($scope.form);

        scope.loadingHandler.startLoading(LOADING.spinnerKey, 'updateNotice');
        scope.noticesManager.createNotice(body, function (status, data) {
            if (status == 201) {
                scope.noticeList.unshift(data);
                $uibModalInstance.close(data);
            } else {
                scope.dialogHandler.alertError(status, data);
            }
            scope.loadingHandler.endLoading(LOADING.spinnerKey, 'updateNotice');
        });

    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}