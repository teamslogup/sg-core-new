export default function ReportsCtrl($scope, $rootScope, $filter, reportsManager, dialogHandler, loadingHandler, metaManager) {
    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    if (vm.CDN === undefined) {
        vm.CDN = metaManager.std.cdn;
    }

    var LOADING = metaManager.std.loading;
    var COMMON = metaManager.std.common;
    var REPORT = metaManager.std.report;
    var ADMIN = metaManager.std.admin;

    $scope.isReportDetailVisible = false;
    $scope.isReportDetailFirstTime = true;

    $scope.params = {};
    $scope.form = {};
    $scope.form = {};

    $scope.reportList = [];
    $scope.reportListTotal = 0;
    $scope.reportEnumSearchFields = REPORT.enumSearchFields;
    $scope.params.searchItem = '';
    $scope.params.searchField = $scope.reportEnumSearchFields[0];
    $scope.reportEnumSolved = angular.copy(REPORT.enumSolved);
    $scope.reportEnumSolved.unshift(COMMON.all);
    $scope.isSolved = $scope.reportEnumSolved[0];

    $scope.more = false;

    $scope.showReportDetail = function (index) {
        $scope.currentIndex = index;
        $scope.currentReport = $scope.reportList[$scope.currentIndex];

        $scope.form = {
            reply: $scope.currentReport.reply,
            isSolved: true
        };
        $scope.isReportDetailVisible = true;
        $scope.isReportDetailFirstTime = false;
    };

    $scope.hideReportDetail = function () {
        $scope.isReportDetailVisible = false;
        $scope.form = {};
    };

    $scope.$on('$locationChangeStart', function (event, next, current) {
        if (next != current) {
            if($scope.isReportDetailVisible) {
                event.preventDefault();
                $scope.hideReportDetail();
            }
        }
    });

    $scope.isFormValidate = function () {

        var isValidate = true;

        if ($scope.form.reply === undefined || $scope.form.reply === null || $scope.form.reply === '') {
            isValidate = false;
            dialogHandler.show('', $filter('translate')('requireBody'), '', true);
            return isValidate;
        }

        return isValidate;
    };

    $scope.solveReport = function () {

        if ($scope.isFormValidate()) {
            var body = angular.copy($scope.form);

            loadingHandler.startLoading(LOADING.spinnerKey, 'updateReportById');
            reportsManager.updateReportById($scope.currentReport.id, body, function (status, data) {
                if (status == 200) {
                    $scope.reportList[$scope.currentIndex] = data;

                    if ($scope.isSolved == REPORT.unsolved) {
                        $scope.reportList.splice($scope.currentIndex, 1);
                    }

                    $scope.hideReportDetail();
                } else {
                    dialogHandler.alertError(status, data);
                }
                loadingHandler.endLoading(LOADING.spinnerKey, 'updateReportById');
            });
        }

    };

    function toBooleanIsSolved() {
        if ($scope.isSolved == $scope.reportEnumSolved[0]) {
            $scope.params.isSolved = undefined;
        } else if ($scope.isSolved == $scope.reportEnumSolved[1]) {
            $scope.params.isSolved = true;
        } else if ($scope.isSolved == $scope.reportEnumSolved[2]) {
            $scope.params.isSolved = false;
        }
    }

    $scope.findReports = function () {

        $scope.reportListTotal = 0;
        $scope.reportList = [];

        $scope.params.last = undefined;

        toBooleanIsSolved();

        loadingHandler.startLoading(LOADING.spinnerKey, 'findReports');
        reportsManager.findReports($scope.params, function (status, data) {
            if (status == 200) {
                $scope.reportListTotal = data.count;
                $scope.reportList = $scope.reportList.concat(data.rows);
                $scope.more = $scope.reportListTotal > $scope.reportList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findReports');
        });
    };

    $scope.findReportsMore = function () {

        if ($scope.reportList.length > 0) {
            $scope.params.last = $scope.reportList[$scope.reportList.length - 1].createdAt;
        }

        toBooleanIsSolved();

        loadingHandler.startLoading(LOADING.spinnerKey, 'findReportsMore');
        reportsManager.findReports($scope.params, function (status, data) {
            if (status == 200) {
                $scope.reportList = $scope.reportList.concat(data.rows);
                $scope.more = $scope.reportListTotal > $scope.reportList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findReportsMore');
        });
    };

    $scope.findReports();

    $scope.$watch('isSolved', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findReports();
        }
    }, true);

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleReports
    });
}