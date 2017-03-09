export default function MassNotificationsCtrl($scope, $rootScope, $uibModal, massNotificationsManager, massNotificationConditionManager, dialogHandler, loadingHandler, metaManager) {
    "ngInject";

    var ADMIN = metaManager.std.admin;
    var LOADING = metaManager.std.loading;
    var COMMON = metaManager.std.common;
    var NOTIFICATION = metaManager.std.notification;

    $scope.metaManager = metaManager;
    $scope.dialogHandler = dialogHandler;
    $scope.loadingHandler = loadingHandler;
    $scope.massNotificationsManager = massNotificationsManager;
    $scope.massNotificationConditionManager = massNotificationConditionManager;

    $scope.findMassNotifications = findMassNotifications;
    $scope.openCreateModal = openCreateModal;

    $scope.params = {
        size: COMMON.defaultLoadingLength
    };

    $scope.massNotificationTotal = 0;
    $scope.massNotifications = [];
    $scope.sendTypes = angular.copy(NOTIFICATION.enumSendTypes);
    $scope.sendTypes.unshift(COMMON.all);
    $scope.params.sendType = $scope.sendTypes[0];

    $scope.searchFields = NOTIFICATION.enumSearchFields;
    $scope.params.searchField = $scope.searchFields[0];

    function findMassNotifications() {

        loadingHandler.startLoading(LOADING.spinnerKey, 'findMassNotifications');
        massNotificationsManager.findMassNotifications($scope.params, function (status, data) {

            if (status == 200) {
                $scope.massNotificationTotal = data.count;
                $scope.massNotifications = data.rows;
            } else if (status == 404) {
                $scope.massNotificationTotal = 0;
                $scope.massNotifications = [];
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findMassNotifications');
        });
    }

    function openCreateModal() {

        var createInstance = $uibModal.open({
            animation: ADMIN.isUseModalAnimation,
            backdrop: ADMIN.modalBackDrop,
            templateUrl: 'coreNotificationsCreate.html',
            controller: 'MassNotificationsCreateCtrl',
            size: NOTIFICATION.modalSize,
            resolve: {
                scope: function () {
                    return $scope;
                }
            }
        });

        createInstance.result.then(function (newItem) {
            if (newItem) {

                if ($scope.params.sendType == COMMON.all || $scope.params.sendType == newItem.sendType) {
                    $scope.massNotifications.unshift(newItem);
                }

            }
        }, function () {
            console.log("cancel modal page");
        });
    }

    findMassNotifications();

    $scope.$watch('params.sendType', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findMassNotifications();
        }
    }, true);

    $scope.$watch('params.searchItem', function (newVal, oldVal) {
        if (newVal != oldVal) {
            console.log(newVal);
        }
    }, true);

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleNotification
    });

}