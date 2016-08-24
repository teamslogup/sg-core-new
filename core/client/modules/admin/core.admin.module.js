(function () {
    'use strict';

    var sampleAppModuleName = "core.admin";

    angular.module(sampleAppModuleName, [
        'core.bbs',
        'core.session',
        'core.user',
        'core.profile'
    ]);

})();