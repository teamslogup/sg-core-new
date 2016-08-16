(function () {

    angular.module('core.bbs').config(bbsConfig);

    /* @ngInject */
    function bbsConfig($stateProvider) {

        $stateProvider
            .state('bbs.create', {
                url: '/:slug/create',
                templateUrl: 'modules/bbs/views/index.html'
            })
            .state('bbs.create-with-category', {
                url: '/:slug/:categoryId/create',
                templateUrl: 'modules/bbs/views/index.html'
            })
            .state('bbs.edit', {
                url: '/:slug/:categoryId/:articleId/edit',
                templateUrl: 'modules/bbs/views/index.html'
            })
            .state('bbs.list-with-category', {
                url: '/:slug/:categoryId',
                templateUrl: 'modules/bbs/views/index.html'
            })
            .state('bbs.list', {
                url: '/:slug',
                templateUrl: 'modules/bbs/views/index.html'
            })
            .state('bbs.detail', {
                url: '/:slug/:categoryId/:articleId',
                templateUrl: 'modules/bbs/views/index.html'
            });
    }

})();
