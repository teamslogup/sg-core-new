(function() {
    'use strict';

    angular
        .module('core.bbs')
        .factory('Comments', Comments);

    /* @ngInject */
    function Comments($resource, bbsResources) {
        return $resource(bbsResources.COMMENTS + '/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }

})();