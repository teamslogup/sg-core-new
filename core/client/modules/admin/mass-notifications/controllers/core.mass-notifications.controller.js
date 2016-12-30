export default function MassNotificationCtrl ($scope, $rootScope, dialogHandler, loadingHandler, metaManager) {

    var ADMIN = metaManager.std.admin;

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleMassNotifications
    });

}