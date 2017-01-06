export default function MassNotificationCtrl ($scope, $rootScope, dialogHandler, loadingHandler, metaManager, massNotificationsManager) {
    var vm = {};
    if ($scope.vm) {
        vm = $scope.vm;
    }
    var ADMIN = metaManager.std.admin;
    var prevQuery = null;

    $scope.createMassNotification = createMassNotification;
    $scope.findMassNotifications = findMassNotifications;
    $scope.findMoreMassNotifications = findMoreMassNotifications;
    $scope.deleteMassNotification = deleteMassNotification;
    $scope.detailMassNotification = detailMassNotification;

    $scope.COMMON = metaManager.std.common;
    $scope.FLAG = metaManager.std.flag;
    $scope.NOTIFICATION = metaManager.std.notification;

    $scope.form = {};
    $scope.more = false;

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleMassNotifications
    });

    $scope.$watch('form', function (newVal, oldVal) {
        if (newVal.key != oldVal.key) {
            findMassNotifications();
        }
        if (newVal.sendType != oldVal.sendType) {
            findMassNotifications();
        }
    });

    initEnum();
    initForm();
    findMassNotifications();

    function findMassNotifications () {
        $scope.massNotifications = {
            count: 0,
            rows: []
        };
        var query = {};
        if ($scope.form.searchField) query.searchField = angular.copy($scope.form.searchField);
        if ($scope.form.key) query.key = angular.copy($scope.form.key);
        if ($scope.form.sendType) query.sendType = angular.copy($scope.form.sendType);
        query = deleteAllQuery(query);
        query.size = $scope.COMMON.defaultLoadingLength;
        prevQuery = query;
        massNotificationsManager.findMassNotifications(query, function (status, data) {
            if (status == 200) {
                $scope.massNotifications = data;
                if (data.count > data.rows.length) {
                    $scope.more = true;
                }
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function findMoreMassNotifications () {
        var query = prevQuery;
        if ($scope.massNotifications.rows.length) {
            query.last = $scope.massNotifications.rows[$scope.massNotifications.rows.length - 1][$scope.NOTIFICATION.defaultOrderBy];
        } else {
            return false;
        }
        massNotificationsManager.findMassNotifications(query, function (status, data) {
            if (status == 200) {
                $scope.massNotifications.rows = $scope.massNotifications.rows.concat(data.rows);
                if (data.count == $scope.massNotifications.rows.length) {
                    $scope.more = false;
                }
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function deleteAllQuery (query) {
        var all = $scope.COMMON.all;
        if (query.key == all) delete query.key;
        if (query.searchField == all) delete query.searchField;
        if (query.sendType == all) delete query.sendType;
        return query;
    }

    function createMassNotification () {

    }

    function detailMassNotification (massNotification) {

    }

    function deleteMassNotification (massNotification) {
        massNotificationsManager.deleteMassNotification(massNotification, function (status, data) {
            if (status == 204) {
                $scope.massNotifications.count--;
                $scope.massNotifications.rows.splice($scope.massNotifications.rows.indexOf(massNotification));
            } else {
                return dialogHandler.alertError(status, data);
            }
        });
    }

    function initForm () {
        $scope.form.key = '';
        $scope.form.sendType = '';
        $scope.form.searchField = '';
    }

    function initEnum () {
        $scope.searchFields = angular.copy($scope.NOTIFICATION.enumSearchFields);
        $scope.searchFields.unshift($scope.COMMON.all);
        $scope.keys = angular.copy(Object.keys(metaManager.notifications.public));
        $scope.keys.unshift($scope.COMMON.all);
        $scope.sendTypes = angular.copy($scope.NOTIFICATION.enumSendTypes);
        $scope.sendTypes.unshift($scope.COMMON.all);
    }
}