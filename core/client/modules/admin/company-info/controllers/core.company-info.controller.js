export default function CompanyInfoCtrl($scope, $filter, companyInfoManager, AlertDialog, loadingHandler, metaManager) {
    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    var LOADING = metaManager.std.loading;

    $scope.form = {};
    $scope.companyInfo = undefined;

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

}