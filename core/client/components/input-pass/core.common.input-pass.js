export default function inputPass() {
    return {
        restrict: 'EA',
        templateUrl: 'components/input-pass/core.common.input-pass.html',
        scope: {
            ngFlag: '=',
            ngModel: '=',
            minLength: '@',
            goodLength: '@',
            maxLength: '@'
        },
        controller: function ($scope) {

        },
        link: function (scope, element, attrs) {
            scope.barClass = "";
            scope.wrapClass = "";
            scope.inputClass = "";
            var base = new RegExp("^.*(?=.{" + scope.minLength + "," + scope.maxLength +"})(?=.*[0-9])(?=.*[a-zA-Z]).*$");
            var enhance = new RegExp("^.*(?=.{" + scope.goodLength + "," + scope.maxLength + "}).*$");
            scope.$watch('ngModel', function(newVal, oldVal) {
                if (newVal) {
                    if (base.test(newVal)) {
                        scope.barClass = "sg-core-orange";
                        scope.inputClass = "sg-core-orange";
                        scope.inputClass = "sg-core-orange";
                        scope.ngFlag = true;
                        if (enhance.test(newVal) || /^.*(?=.*\W).*$/.test(newVal)) {
                            scope.barClass = "sg-core-green";
                            scope.inputClass = "sg-core-green";
                            scope.inputClass = "sg-core-green";
                        }
                        if (enhance.test(newVal) && /^.*(?=.*\W).*$/.test(newVal)) {
                            scope.barClass = "sg-core-blue";
                            scope.inputClass = "sg-core-blue";
                            scope.inputClass = "sg-core-blue";
                        }
                    } else {
                        scope.barClass = "sg-core-red";
                        scope.inputClass = "sg-core-red";
                        scope.inputClass = "sg-core-red";
                        scope.ngFlag = false;
                    }
                } else {
                    scope.barClass = "";
                }
            }, true);
        }
    };
}