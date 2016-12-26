routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(ADMIN.moduleCompanyInfo, {
            url: '/' + PREFIX.admin + '/' + ADMIN.moduleCompanyInfo,
            views: {
                'contents': {
                    templateUrl: '/modules/admin/company-info/views/core.' + ADMIN.moduleCompanyInfo + '.html'
                }
            }
        });
}