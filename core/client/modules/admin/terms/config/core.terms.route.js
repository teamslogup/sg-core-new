routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(PREFIX.admin + '.' + ADMIN.moduleTerms, {
            url: '/' + ADMIN.moduleTerms,
            templateUrl: '/modules/admin/terms/views/core.' + ADMIN.moduleTerms + '.html'
        });

}