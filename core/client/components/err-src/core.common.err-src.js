(function() {
    'use strict';

    angular.module("core.common").directive("errSrc", errSrc);

    /* @ngInject */
    function errSrc() {
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    if (attrs.isHide == true) {
                        element.css('display', 'block');
                    }
                    if (attrs.src != attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        }
    }

})();