export default function UserDetailCtrl($scope, $filter, $uibModalInstance, scope, user) {

    var LOADING = scope.metaManager.std.loading;

    $scope.currentUser = user;

    // $scope.form = {
    //     reply: report.reply,
    //     isSolved: true
    // };
    //
    // $scope.solveReport = solveReport;
    // $scope.cancel = cancel;
    //
    // function solveReport() {
    //
    //     var body = angular.copy($scope.form);
    //
    //     scope.loadingHandler.startLoading(LOADING.spinnerKey, 'updateReportById');
    //     scope.reportsManager.updateReportById($scope.currentReport.id, body, function (status, data) {
    //         if (status == 200) {
    //             $uibModalInstance.close(data);
    //         } else {
    //             scope.dialogHandler.alertError(status, data);
    //         }
    //         scope.loadingHandler.endLoading(LOADING.spinnerKey, 'updateReportById');
    //     });
    //
    // }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}