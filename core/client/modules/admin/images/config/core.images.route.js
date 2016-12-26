routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(ADMIN.moduleImages, {
            url: '/' + PREFIX.admin + '/' + ADMIN.moduleImages,
            views: {
                'contents': {
                    templateUrl: '/modules/admin/images/views/core.' + ADMIN.moduleImages + '.html'
                }
            }
        });
}