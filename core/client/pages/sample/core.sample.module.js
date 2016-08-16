(function () {
    'use strict';

    var sampleAppModuleName = "core.sample";

    angular.module(sampleAppModuleName, ['core.bbs', 'core.session']);

    if (window.location.hash === '#_=_') window.location.hash = '';

    angular.element(document).ready(function () {
        angular.bootstrap(document, [sampleAppModuleName]);
    });

})();