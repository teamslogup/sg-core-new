export default function ReportDetailCtrl($scope, $filter, $uibModalInstance, scope, report) {

    var LOADING = scope.metaManager.std.loading;

    $scope.currentReport = report;

    $scope.form = {
        reply: report.reply,
        isSolved: true
    };

    $scope.solveReport = solveReport;

    function isFormValidate() {

        var isValidate = true;

        if ($scope.form.reply === undefined || $scope.form.reply === null || $scope.form.reply === '') {
            isValidate = false;
            scope.dialogHandler.show('', $filter('translate')('requireBody'), '', true);
            return isValidate;
        }

        return isValidate;
    }

    function solveReport() {

        if (isFormValidate()) {
            var body = angular.copy($scope.form);

            scope.loadingHandler.startLoading(LOADING.spinnerKey, 'updateReportById');
            scope.reportsManager.updateReportById($scope.currentReport.id, body, function (status, data) {
                if (status == 200) {
                    $uibModalInstance.close(data);
                } else {
                    scope.dialogHandler.alertError(status, data);
                }
                scope.loadingHandler.endLoading(LOADING.spinnerKey, 'updateReportById');
            });
        }

    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}