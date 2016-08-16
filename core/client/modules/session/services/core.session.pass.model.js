(function() {
    'use strict';

    angular
        .module('core.session')
        .factory('Pass', Pass);

    /* @ngInject */
    function Pass($resource, sessionResources) {
        return $resource(sessionResources.PASS, {}, {
            update: {
                method: 'PUT'
            }
        });
    }

})();