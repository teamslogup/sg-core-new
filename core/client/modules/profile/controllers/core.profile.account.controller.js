(function () {
    'use strict';

    angular.module("core.profile").controller("ProfileAccountCtrl", ProfileAccountCtrl);

    /* @ngInject */
    function ProfileAccountCtrl($scope, $interval, $rootScope, profileManager, sessionManager, metaManager, errorHandler) {
        var user = sessionManager.session;
        var vm = $scope.vm;
        vm.hasPhone = false;
        vm.requestingAuth = false;
        if (sessionManager.isLoggedIn() && user.phoneNum) {
            vm.hasPhone = true;
        }
        vm.form = {
            phone1: '010'
        };

        var stop = null;

        function splitPhoneNumber(fullNumber) {
            fullNumber = fullNumber.replace("+82", "0");
            return {
                phone1: fullNumber.substr(0, 3),
                phone2: fullNumber.substr(3, 4),
                phone3: fullNumber.substr(7, 4)
            };
        }

        function combinePhoneNumber(p1, p2, p3) {
            p1 = "+82" + p1.substr(1, 2);
            return p1 + p2 + p3;
        }

        if (sessionManager.session && sessionManager.session.phoneNum) {
            var phones = splitPhoneNumber(sessionManager.session.phoneNum);
            vm.form.phone1 = phones.phone1;
            vm.form.phone2 = phones.phone2;
            vm.form.phone3 = phones.phone3;
        }

        function runCountdown() {
            var now = (new Date()).getTime();
            var finish = now + metaManager.std.user.expiredPhoneTokenMinutes * 60 * 1000;
            vm.counter = finish - now;
            stop = $interval(function () {
                var start = (new Date()).getTime();
                vm.counter = finish - start;
                var sec = parseInt((vm.counter / 1000) % 60);
                if (sec < 10) sec = '0' + sec;
                vm.remainTime = parseInt(((vm.counter / 1000) / 60)) + ":" + sec;
                if (start + 1000 > finish) {
                    if (stop) $interval.cancel(stop);
                }

            }, 1000);
        }

        vm.deletePhone = deletePhone;
        vm.requestAuthNum = requestAuthNum;
        vm.submit = submit;

        function deletePhone() {
            profileManager.deletePhoneNumber(function (status, data) {
                if (status == 200) {
                    vm.hasPhone = false;
                    vm.form.phone1 = "010";
                    vm.form.phone2 = "";
                    vm.form.phone3 = "";
                    $rootScope.$broadcast("core.profile.callback", {
                        type: 'deletePhone'
                    });
                } else {
                    errorHandler.alertError(status, data);
                }
            });
        }

        function requestAuthNum() {
            if (!vm.form.phone1 || !vm.form.phone2 || !vm.form.phone3) {
                return alert("휴대폰 번호를 입력해 주세요.");
            }

            if (sessionManager.session.phoneNum) {
                var phones = splitPhoneNumber(sessionManager.session.phoneNum);
                if (vm.form.phone1 == phones.phone1 &&
                    vm.form.phone2 == phones.phone2 &&
                    vm.form.phone3 == phones.phone3) {
                    return alert("동일번호로 중복인증은 되지 않습니다.");
                }
            }
            if (stop) $interval.cancel(stop);
            profileManager.sendAuthNum(
                combinePhoneNumber(
                    vm.form.phone1,
                    vm.form.phone2,
                    vm.form.phone3
                ),
                function (status, data) {
                    if (status == 200) {
                        vm.requestingAuth = true;
                        runCountdown();
                    } else {
                        errorHandler.alertError(status, data);
                    }
                }
            )
        }

        function submit() {

            profileManager.savePhoneNumber(
                vm.form.authNum,
                function (status, data) {
                    if (status == 200) {
                        vm.requestingAuth = false;
                        vm.hasPhone = true;
                        vm.form.authNum = "";
                        sessionManager.session.phoneNum = combinePhoneNumber(vm.form.phone1, vm.form.phone2, vm.form.phone3);
                        vm.remainTime = "";
                        vm.counter = 0;
                        if (stop) $interval.cancel(stop);
                    } else {
                        errorHandler.alertError(status, data);
                    }
                }
            )
        }
    }

})();
