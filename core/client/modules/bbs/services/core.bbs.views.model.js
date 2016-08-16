(function() {
    'use strict';

    angular
        .module('core.bbs')
        .factory('Views', Views);

    /* @ngInject */
    function Views($resource, bbsResources) {
        return $resource(bbsResources.VIEWS, {}, {
            update: {
                method: 'PUT'
            }
        });
    }

})();