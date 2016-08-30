export default function inputPass() {
    return {
        restrict: 'EA',
        templateUrl: 'components/input-pass/core.common.input-pass.html',
        scope: {
            ngModel: '=',
            minLength: '@',
            goodLength: '@',
            maxLength: '@'
        },
        controller: function ($scope) {

        },
        link: function (scope, element, attrs) {
            scope.barClass = "";
            var base = new RegExp("^.*(?=.{" + scope.minLength + "," + scope.maxLength +"})(?=.*[0-9])(?=.*[a-zA-Z]).*$");
            var enhance = new RegExp("^.*(?=.{" + scope.goodLength + "," + scope.maxLength + "}).*$");
            scope.$watch('ngModel', function(newVal, oldVal) {
                if (newVal) {
                    if (base.test(newVal)) {
                        scope.barClass = "orange";
                        if (enhance.test(newVal) || /^.*(?=.*\W).*$/.test(newVal)) {
                            scope.barClass = "green";
                        }
                        if (enhance.test(newVal) && /^.*(?=.*\W).*$/.test(newVal)) {
                            scope.barClass = "blue";
                        }
                    } else {
                        scope.barClass = "red";
                    }
                } else {
                    scope.barClass = "";
                }
            }, true);
        }
    };
}