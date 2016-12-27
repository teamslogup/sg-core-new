export default function ReportDetailCtrl($scope, $filter, $uibModalInstance, scope, notice) {

    var LOADING = scope.metaManager.std.loading;

    $scope.currentNotice = notice;

    $scope.form = {
        title: notice.title,
        body: notice.body,
        type: notice.type,
        country: notice.country
    };

    $scope.startEditMode = function () {
        $scope.isNoticeEditMode = true;
    };

    $scope.exitEditMode = function () {
        $scope.isNoticeEditMode = false;
    };

    $scope.updateNotice = function () {

        if (scope.isFormValidate()) {
            var body = angular.copy(scope.form);

            scope.loadingHandler.startLoading(LOADING.spinnerKey, 'updateNotice');
            scope.noticesManager.updateNoticeById(notice.id, body, function (status, data) {
                if (status == 200) {
                    scope.noticeList[scope.currentIndex] = data;

                    if (scope.params.type != body.type) {
                        scope.noticeList.splice(scope.currentIndex, 1);
                    }

                    scope.exitEditMode();
                } else {
                    scope.dialogHandler.alertError(status, data);
                }
                scope.loadingHandler.endLoading(LOADING.spinnerKey, 'updateNotice');
            });
        }

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}