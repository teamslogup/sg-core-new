(function() {
    'use strict';

    angular.module('core.bbs').directive('commentForm', commentForm);

    /* @ngInject */
    function commentForm() {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            link: function(scope, element, attrs) {
                scope.contentUrl = 'modules/bbs/skins/' + scope.vm.data.board.skin + '/views/comment-form.html';
                scope.$watch(attrs.body, function(nv) {
                    scope.realBody = nv;
                    console.log(scope.realBody);
                });
            },
            template: '<div ng-include="contentUrl"></div>'
        }
    }
})();