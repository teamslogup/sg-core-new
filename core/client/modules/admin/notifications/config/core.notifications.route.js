routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(ADMIN.moduleNotification, {
            url: '/' + PREFIX.admin + '/' + ADMIN.moduleNotification,
            views: {
                'contents': {
                    templateUrl: '/modules/admin/notifications/views/core.' + ADMIN.moduleNotification + '.html'
                }
            }
        });

}