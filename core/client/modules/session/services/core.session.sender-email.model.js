(function() {
    'use strict';

    angular
        .module('core.session')
        .factory('SenderEmail', SenderEmail);

    /* @ngInject */
    function SenderEmail($resource, sessionResources) {
        return $resource(sessionResources.SENDER_EMAIL, {}, {});
    }

})();