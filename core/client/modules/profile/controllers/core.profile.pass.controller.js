(function () {
    'use strict';

    angular.module("core.profile").controller("ProfilePassCtrl", ProfilePassCtrl);

    /* @ngInject */
    function ProfilePassCtrl($scope, $rootScope, profileManager) {
        var vm = $scope.vm;
        vm.form = {};
        vm.submit = submit;
        function submit() {
            var newPass = vm.form.newPass;
            var oldPass = vm.form.oldPass;
            var rePass = vm.form.rePass;

            if (!newPass || !oldPass || !rePass) {
                return alert("비밀번호를 입력해주세요.");
            }

            if (newPass != rePass) {
                return alert("신규 비밀번호와 재입력 비밀번호가 다릅니다.");
            }

            profileManager.changePassword(vm.form.newPass, vm.form.oldPass, function(status, data) {
                if (status == 200) {
                    $rootScope.$broadcast('core.profile.callback', {
                        type: 'pass'
                    });
                } else {

                }
            });
        }
    }

})();
