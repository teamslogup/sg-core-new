routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(PREFIX.admin + '.' + ADMIN.moduleNotification, {
            url: '/' + ADMIN.moduleNotification,
            templateUrl: '/modules/admin/notifications/views/core.' + ADMIN.moduleNotification + '.html'
        });

}