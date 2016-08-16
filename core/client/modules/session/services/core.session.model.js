(function() {
    'use strict';

    angular
        .module('core.session')
        .factory('Session', Session);

    /* @ngInject */
    function Session($resource, sessionResources) {
        return $resource(sessionResources.SESSION, {}, {
            update: {
                method: 'PUT'
            }
        });
    }

})();