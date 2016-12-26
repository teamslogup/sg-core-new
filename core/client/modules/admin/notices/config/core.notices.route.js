routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(ADMIN.moduleNotices, {
            url: '/' + PREFIX.admin + '/' + ADMIN.moduleNotices,
            views: {
                'contents': {
                    templateUrl: '/modules/admin/notices/views/core.' + ADMIN.moduleNotices + '.html'
                }
            }
        });

}