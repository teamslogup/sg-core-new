export default function CompanyInfoCtrl($scope, $rootScope, $filter, companyInfoManager, dialogHandler, loadingHandler, metaManager) {
    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    var LOADING = metaManager.std.loading;
    var ADMIN = metaManager.std.admin;

    $scope.isCompanyInfoEditVisible = false;

    $scope.form = {};
    $scope.companyInfo = {};

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
            } else if (status == 404) {

            } else {
                dialogHandler.alertError(status, data);
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
                dialogHandler.alertError(status, data);
            }
        });
    };

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleCompanyInfo
    });
}