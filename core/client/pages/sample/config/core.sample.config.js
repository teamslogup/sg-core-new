(function () {
    'use strict';

    var sampleAppModuleName = "core.sample";

    angular.module(sampleAppModuleName).config(appConfig);

    /* @ngInject */
    function appConfig($locationProvider, $translateProvider, staticLoaderProvider, metaManagerProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
        staticLoaderProvider.setRootPath("pages/sample/assets/contents/");

        var mix = metaManagerProvider.getMixed();
        for (var k in mix) {
            $translateProvider.translations(k, mix[k]);
        }

        $translateProvider.preferredLanguage('en');
    }

})();