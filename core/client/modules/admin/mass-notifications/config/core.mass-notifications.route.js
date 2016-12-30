routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(PREFIX.admin + '.' + ADMIN.moduleMassNotifications, {
            url: '/' + ADMIN.moduleMassNotifications,
            templateUrl: '/modules/admin/' + ADMIN.moduleMassNotifications + '/views/core.' + ADMIN.moduleMassNotifications + '.html'
        });

}