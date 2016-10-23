export default function CompanyInfoCtrl($scope, $filter, companyInfoManager, AlertDialog, loadingHandler, metaManager) {
    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    var LOADING = metaManager.std.loading;

    $scope.isCompanyInfoEditVisible = false;

    $scope.form = {};
    $scope.companyInfo = undefined;

    $scope.showCompanyInfoEdit = function () {
        $scope.isCompanyInfoEditVisible = true;
        $scope.form = angular.copy($scope.companyInfo);
    };

    $scope.hideCompanyInfoEdit = function () {
        $scope.isCompanyInfoEditVisible = false;
    };

    $scope.findCompanyInfo = function () {

        loadingHandler.startLoading(LOADING.spinnerKey, 'findCompanyInfo');
        companyInfoManager.findCompanyInfo(function (status, data) {
            if (status == 200) {
                $scope.companyInfo = data;
            } else {
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findCompanyInfo');
        });
    };

    $scope.findCompanyInfo();

    $scope.updateCompanyInfo = function (companyInfo) {
        companyInfoManager.updateCompanyInfo(companyInfo, function (status, data) {
            if (status == 200) {
                $scope.companyInfo = data;
                $scope.hideCompanyInfoEdit();
            } else {
                AlertDialog.alertError(status, data);
            }
        });
    };
}