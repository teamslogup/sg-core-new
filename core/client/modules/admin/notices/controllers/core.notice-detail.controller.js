export default function ReportDetailCtrl($scope, $filter, $uibModalInstance, scope, notice, isEditMode) {
    "ngInject";

    var NOTICE = scope.metaManager.std.notice;
    var LOADING = scope.metaManager.std.loading;

    $scope.currentNotice = notice;

    $scope.form = {
        title: notice.title,
        body: notice.body,
        type: notice.type,
        country: notice.country
    };

    $scope.noticeTypes = NOTICE.enumNoticeTypes;
    $scope.noticeCountries = NOTICE.enumCountries;

    $scope.startEditMode = startEditMode;
    $scope.exitEditMode = exitEditMode;
    $scope.updateNotice = updateNotice;
    $scope.cancel = cancel;

    if (isEditMode) {
        startEditMode();
    }

    function startEditMode() {
        $scope.isNoticeEditMode = true;
    }

    function exitEditMode() {
        $scope.isNoticeEditMode = false;
    }

    function updateNotice() {

        var body = angular.copy($scope.form);

        scope.loadingHandler.startLoading(LOADING.spinnerKey, 'updateNotice');
        scope.noticesManager.updateNoticeById(notice.id, body, function (status, data) {
            if (status == 200) {
                scope.noticeList[scope.currentIndex] = data;

                if (scope.params.type != body.type) {
                    scope.noticeList.splice(scope.currentIndex, 1);
                }

                $scope.exitEditMode();
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