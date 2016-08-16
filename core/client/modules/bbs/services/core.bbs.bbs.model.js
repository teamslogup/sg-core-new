(function() {
    'use strict';

    angular
        .module('core.bbs')
        .factory('Bbs', Bbs);

    /* @ngInject */
    function Bbs($resource, bbsResources) {
        return $resource(bbsResources.BBS, {}, {
            update: {
                method: 'PUT'
            },
            query: {
                isArray: false
            }
        });
    }

})();