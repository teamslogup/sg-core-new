(function() {
    'use strict';

    angular
        .module('core.bbs')
        .factory('Boards', Boards);

    /* @ngInject */
    function Boards($resource, bbsResources) {
        return $resource(bbsResources.BOARDS + '/:slug', {
            slug: '@slug'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }

})();