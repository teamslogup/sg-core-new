(function() {
    'use strict';

    angular.module('core.bbs').directive('commentList', commentList);

    /* @ngInject */
    function commentList() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: function(element, attrs) {
                return 'modules/bbs/skins/' + attrs.skin + '/views/comment-list.html';
            },
            link: function(scope, element, attrs) {

            }
        }
    }
})();