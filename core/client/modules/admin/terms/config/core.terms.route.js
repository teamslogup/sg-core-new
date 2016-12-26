routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(ADMIN.moduleTerms, {
            url: '/' + PREFIX.admin + '/' + ADMIN.moduleTerms,
            views: {
                'contents': {
                    templateUrl: '/modules/admin/terms/views/core.' + ADMIN.moduleTerms + '.html'
                }
            }
        });

}