export default function MassNotificationCtrl ($scope, $rootScope, dialogHandler, loadingHandler, metaManager) {
    var vm = {};
    if ($scope.vm) {
        vm = $scope.vm;
    }
    var ADMIN = metaManager.std.admin;

    $scope.findMassNotifications = findMassNotifications;

    $scope.FLAG = metaManager.flag;
    $scope.massNotifications = {
        rows: []
    };

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleMassNotifications
    });
}