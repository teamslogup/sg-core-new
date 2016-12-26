routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(ADMIN.moduleUsers, {
            url: '/' + PREFIX.admin + '/' + ADMIN.moduleUsers,
            views: {
                'contents': {
                    templateUrl: 'modules/admin/users/views/core.' + ADMIN.moduleUsers + '.html'
                }
            }
        });
}