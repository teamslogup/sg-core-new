export default function MassNotificationCtrl ($scope, $rootScope, dialogHandler, loadingHandler, metaManager, massNotificationsManager) {
    var vm = {};
    if ($scope.vm) {
        vm = $scope.vm;
    }
    var ADMIN = metaManager.std.admin;

    $scope.findMassNotifications = findMassNotifications;
    $scope.findMoreMassNotifications = findMoreMassNotifications;

    $scope.COMMON = metaManager.std.common;
    $scope.FLAG = metaManager.std.flag;
    $scope.form = {};
    $scope.enumKeys = [];

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleMassNotifications
    });

    initForm();
    findMassNotifications();

    function findMassNotifications () {
        $scope.massNotifications = {
            rows: []
        };
        var query = {};
        if ($scope.form.key) query.key = angular.copy($scope.form.key);
        if ($scope.form.sendType) query.sendType = angular.copy($scope.form.sendType);
        query.size = $scope.COMMON.defaultLoadingLength;
        massNotificationsManager.findMassNotifications(query, function (status, data) {
            if (status == 200) {

            } else {

            }
        });
    }

    function findMoreMassNotifications () {

    }

    function initForm () {
        $scope.form.key = '';
        $scope.form.sendType = '';
    }
}