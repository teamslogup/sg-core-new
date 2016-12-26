routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(ADMIN.moduleReports, {
            url: '/' + PREFIX.admin + '/' + ADMIN.moduleReports,
            views: {
                'contents': {
                    templateUrl: '/modules/admin/reports/views/core.' + ADMIN.moduleReports + '.html'
                }
            }
        });
}