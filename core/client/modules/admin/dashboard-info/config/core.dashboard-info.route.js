routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(ADMIN.moduleDashboardInfo, {
            url: '/' + PREFIX.admin,
            views: {
                'contents': {
                    templateUrl: '/modules/admin/dashboard-info/views/core.' + ADMIN.moduleDashboardInfo + '.html'
                }
            }
        });
}