(function() {
    'use strict';

    angular
        .module('core.users')
        .factory('Users', Users);

    /* @ngInject */
    function Users($resource, bbsResources) {
        return $resource(bbsResources.USERS + '/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }

})();