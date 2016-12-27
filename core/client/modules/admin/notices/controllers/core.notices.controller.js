export default function NoticesCtrl($scope, $rootScope, $sce, $filter, $uibModal, noticesManager, dialogHandler, loadingHandler, metaManager) {

    var LOADING = metaManager.std.loading;
    var NOTICE = metaManager.std.notice;
    var ADMIN = metaManager.std.admin;

    $scope.noticesManager = noticesManager;
    $scope.dialogHandler = dialogHandler;
    $scope.loadingHandler = loadingHandler;
    $scope.metaManager = metaManager;

    $scope.isNoticeCreateVisible = false;
    $scope.isNoticeEditMode = false;
    $scope.isNoticeDetailVisible = false;
    $scope.isNoticeDetailFirstTime = true;

    $scope.params = {};
    $scope.form = {};

    $scope.noticeList = [];
    $scope.noticeListTotal = 0;
    $scope.noticeTypes = NOTICE.enumNoticeTypes;
    $scope.params.type = $scope.noticeTypes[0];

    $scope.noticeCountries = NOTICE.enumCountries;

    $scope.noticeSearchFields = NOTICE.enumFields;
    $scope.params.searchField = $scope.noticeSearchFields[0];

    $scope.more = false;

    $scope.showNoticeCreate = function () {
        $scope.form.type = $scope.noticeTypes[0];
        $scope.form.country = $scope.noticeCountries[0];
        $scope.isNoticeCreateVisible = true;
        $scope.isNoticeDetailFirstTime = false;
    };

    $scope.hideNoticeCreate = function () {
        $scope.isNoticeCreateVisible = false;
        $scope.form = {};
    };

    $scope.showNoticeDetail = function (index) {
        $scope.currentIndex = index;

        openDetailModal($scope.noticeList[index]);
        // $scope.form = {
        //     title: $scope.noticeList[index].title,
        //     body: $scope.noticeList[index].body,
        //     type: $scope.noticeList[index].type,
        //     country: $scope.noticeList[index].country
        // };
        // $scope.isNoticeDetailVisible = true;
        // $scope.isNoticeDetailFirstTime = false;
    };

    $scope.hideNoticeDetail = function () {
        $scope.isNoticeDetailVisible = false;
        $scope.form = {};
        $scope.exitEditMode();
    };

    $scope.$on('$locationChangeStart', function (event, next, current) {
        if (next != current) {
            if ($scope.isNoticeDetailVisible) {
                event.preventDefault();
                $scope.hideNoticeDetail();
            }
        }
    });

    $scope.startEditMode = function () {
        $scope.isNoticeEditMode = true;
    };

    $scope.exitEditMode = function () {
        $scope.isNoticeEditMode = false;
    };

    $scope.currentOption = undefined;

    $scope.showItemOption = function ($event, notice) {
        $event.stopPropagation();
        $scope.currentOption = notice.id;
    };

    $scope.hideItemOption = function () {
        $scope.currentOption = undefined;
    };

    $scope.isFormValidate = function () {

        var isValidate = true;

        if ($scope.form.title === undefined || $scope.form.title === '') {
            isValidate = false;
            dialogHandler.show('', $filter('translate')('requireTitle'), '', true);
            return isValidate;
        }

        if ($scope.form.body === undefined || $scope.form.body === '') {
            isValidate = false;
            dialogHandler.show('', $filter('translate')('requireBody'), '', true);
            return isValidate;
        }
        if ($scope.form.type === undefined || $scope.form.type === '') {
            isValidate = false;
            dialogHandler.show('', $filter('translate')('requireType'), '', true);
            return isValidate;
        }
        if ($scope.form.country === undefined || $scope.form.country === '') {
            isValidate = false;
            dialogHandler.show('', $filter('translate')('requireCountry'), '', true);
            return isValidate;
        }

        return isValidate;
    };

    $scope.createNotice = function () {

        if ($scope.isFormValidate()) {
            var body = angular.copy($scope.form);

            loadingHandler.startLoading(LOADING.spinnerKey, 'updateNotice');
            noticesManager.createNotice(body, function (status, data) {
                if (status == 201) {
                    $scope.noticeList.unshift(data);
                    $scope.hideNoticeCreate();
                } else {
                    dialogHandler.alertError(status, data);
                }
                loadingHandler.endLoading(LOADING.spinnerKey, 'updateNotice');
            });
        }

    };

    $scope.updateNotice = function () {

        var notice = $scope.noticeList[$scope.currentIndex];

        if ($scope.isFormValidate()) {
            var body = angular.copy($scope.form);

            loadingHandler.startLoading(LOADING.spinnerKey, 'updateNotice');
            noticesManager.updateNoticeById(notice.id, body, function (status, data) {
                if (status == 200) {
                    $scope.noticeList[$scope.currentIndex] = data;

                    if ($scope.params.type != body.type) {
                        $scope.noticeList.splice($scope.currentIndex, 1);
                    }

                    $scope.exitEditMode();
                } else {
                    dialogHandler.alertError(status, data);
                }
                loadingHandler.endLoading(LOADING.spinnerKey, 'updateNotice');
            });
        }

    };

    $scope.findNotices = function () {
        $scope.noticeListTotal = 0;
        $scope.noticeList = [];

        $scope.params.last = undefined;

        loadingHandler.startLoading(LOADING.spinnerKey, 'findNotices');
        noticesManager.findNotices($scope.params, function (status, data) {
            if (status == 200) {
                $scope.noticeListTotal = data.count;
                $scope.noticeList = $scope.noticeList.concat(data.rows);
                $scope.more = $scope.noticeListTotal > $scope.noticeList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findNotices');
        });
    };

    $scope.findNoticesMore = function () {
        if ($scope.noticeList.length > 0) {
            $scope.params.last = $scope.noticeList[$scope.noticeList.length - 1].createdAt;
        }

        loadingHandler.startLoading(LOADING.spinnerKey, 'findNoticesMore');
        noticesManager.findNotices($scope.params, function (status, data) {
            if (status == 200) {
                $scope.noticeList = $scope.noticeList.concat(data.rows);
                $scope.more = $scope.noticeListTotal > $scope.noticeList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findNoticesMore');
        });
    };

    $scope.deleteNotice = function (index) {

        dialogHandler.show('', $filter('translate')('sureDelete'), $filter('translate')('delete'), true, function () {

            var notice = $scope.noticeList[index];

            loadingHandler.startLoading(LOADING.spinnerKey, 'deleteNotice');
            noticesManager.deleteNotice(notice, function (status, data) {

                if (status == 204) {
                    $scope.noticeList.splice(index, 1);
                } else {
                    dialogHandler.alertError(status, data);
                }

                loadingHandler.endLoading(LOADING.spinnerKey, 'deleteNotice');

            });

        });

    };

    $scope.showNoticeDetailAndStartEditMode = function (index) {
        $scope.showNoticeDetail(index);
        $scope.startEditMode();
    };

    $scope.findNotices();

    function openDetailModal(notice) {

        var createInstance = $uibModal.open({
            animation: ADMIN.isUseModalAnimation,
            backdrop: ADMIN.modalBackDrop,
            templateUrl: 'coreNoticeDetail.html',
            controller: 'NoticeDetailCtrl',
            size: NOTICE.modalSize,
            resolve: {
                scope: function () {
                    return $scope;
                },
                notice: function () {
                    return notice;
                }
            }
        });

        createInstance.result.then(function (result) {


        }, function () {
            console.log("cancel modal page");
        });
    }

    $scope.$watch('params.type', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findNotices();
        }
    }, true);

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleNotices
    });

}