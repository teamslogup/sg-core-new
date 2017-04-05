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

        if(body.startDate){
            var date = new Date(body.startDate);
            body.startDate = Date.parse(date)*1000;
        }

        if(body.endDate){
            var date = new Date(body.endDate);
            body.endDate = Date.parse(date)*1000;
        }

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