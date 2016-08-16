(function () {

    'use strict';

    angular.module('core.sample').config(sampleConfig);

    /* @ngInject */
    function sampleConfig($stateProvider, $urlRouterProvider) {

        //$urlRouterProvider.otherwise('/');

        $stateProvider.
            state('index', {
                url: '/sample',
                views: {
                    'header': {
                        templateUrl: 'pages/sample/views/layouts/header.html'
                    },
                    'footer': {
                        templateUrl: 'pages/sample/views/layouts/footer.html'
                    },
                    'contents': {
                        templateUrl: 'pages/sample/views/layouts/main-contents.html'
                    }
                }
            })
            .state('session', {
                abstract: true,
                url: '/sample/accounts',
                views: {
                    'header': {
                        templateUrl: 'pages/sample/views/layouts/header.html'
                    },
                    'footer': {
                        templateUrl: 'pages/sample/views/layouts/footer.html'
                    },
                    'contents': {
                        templateUrl: 'pages/sample/views/layouts/main-contents.html'
                    }
                }
            })
            .state('bbs', {
                abstract: true,
                url: '/sample/boards',
                views: {
                    'header': {
                        templateUrl: 'pages/sample/views/layouts/header.html'
                    },
                    'footer': {
                        templateUrl: 'pages/sample/views/layouts/footer.html'
                    },
                    'contents': {
                        templateUrl: 'pages/sample/views/layouts/sub-contents.html',
                        controller: function($scope, $state, staticLoader) {

                            var slug = $state.params.slug;
                            if (slug != 'slug1' && slug != 'slug2') {
                                slug = 'otherwise';
                            }
                            var jsonName = slug + ".json";

                            staticLoader.get(jsonName, function (status, data) {
                                $scope.menus = data.menus;
                            });
                        }
                    }
                }
            })
            .state('route1', {
                abstract: true,
                url: '/sample/:contentName/:subContentName',
                views: {
                    'header': {
                        templateUrl: 'pages/sample/views/layouts/header.html'
                    },
                    'footer': {
                        templateUrl: 'pages/sample/views/layouts/footer.html'
                    },
                    'contents': {
                        templateUrl: 'pages/sample/views/layouts/sub-contents.html'
                    }
                }
            })
            .state('route1.body', {
                url: "",
                templateUrl: function ($stateParams) {
                    var contentName = $stateParams.contentName;
                    if ($stateParams.contentName != 'route1' && $stateParams.contentName != 'route2') {
                        contentName = "otherwise";
                    }
                    return '/pages/sample/views/contents/' + contentName + '.html';
                }
            });
    }

})();
