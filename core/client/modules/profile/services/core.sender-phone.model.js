(function() {
    'use strict';

    angular
        .module('core.profile')
        .factory('SenderPhone', SenderPhone);

    /* @ngInject */
    function SenderPhone($resource, profileResources) {
        return $resource(profileResources.SENDER_PHONE, {}, {
            update: {
                method: 'PUT'
            }
        });
    }

})();