(function() {
    'use strict';

    angular
        .module('core.bbs')
        .factory('Articles', Articles);

    /* @ngInject */
    function Articles($resource, bbsResources) {
        return $resource(bbsResources.ARTICLES + '/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }

})();