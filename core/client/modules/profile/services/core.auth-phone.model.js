(function() {
    'use strict';

    angular
        .module('core.profile')
        .factory('AuthPhone', AuthPhone);

    /* @ngInject */
    function AuthPhone($resource, profileResources) {
        return $resource(profileResources.AUTH_PHONE, {}, {
            update: {
                method: 'PUT'
            }
        });
    }

})();