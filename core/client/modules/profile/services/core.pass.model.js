(function() {
    'use strict';

    angular
        .module('core.profile')
        .factory('Pass', Pass);

    /* @ngInject */
    function Pass($resource, profileResources) {
        return $resource(profileResources.PASS, {}, {
            update: {
                method: 'PUT'
            }
        });
    }

})();