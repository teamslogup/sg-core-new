(function () {
    'use strict';

    angular.module('core.admin').config(adminConfig);

    /* @ngInject */
    function adminConfig($stateProvider) {
        var PREFIX = window.meta.std.prefix;
        $stateProvider
            .state(PREFIX.admin + '-user-manage', {
                url: '/' + PREFIX.admin + '/user-manage',
                views: {
                    'contents': {
                        templateUrl: 'pages/admin/views/contents/user-manage.html'
                    }
                }
            });
    }
})();