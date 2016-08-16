(function () {
    'use strict';

    angular.module("core.profile").controller("ProfileInfoCtrl", ProfileInfoCtrl);

    /* @ngInject */
    function ProfileInfoCtrl($scope, $rootScope, sessionManager, uploadManager, metaManager, usersManager, errorHandler) {
        var vm = $scope.vm;
        var user = vm.user = sessionManager.session;
        vm.isVisibleItem = isVisibleItem;
        vm.submit = submit;

        vm.form = {
            gender: "",
            birthYear: "",
            birthMonth: "",
            birthDay: "",
            language: "",
            country: ""
        };

        if (sessionManager.isLoggedIn()) {
            if (user.comment) {
                vm.form.comment = user.comment;
            }
            if (user.gender) {
                vm.form.gender = user.gender;
            }
            if (user.birth) {
                vm.form.birthYear = new Date(user.birth).getFullYear() + "";
                vm.form.birthMonth = (new Date(user.birth).getMonth() + 1) + "";
                vm.form.birthDay = new Date(user.birth).getDate() + "";
            }
            vm.form.country = user.country;
            vm.form.language = user.language;
            vm.form.website = user.website;
            vm.form.agreedEmail = user.agreedEmail;
        } else {
            return $rootScope.$broadcast("core.profile.callback", {
                type: 'notLogin'
            });
        }

        function isVisibleItem(item) {
            var enableProfileItems = metaManager.std.profile.enableProfileItems;
            for (var i = 0; i < enableProfileItems.length; ++i) {
                if (item == enableProfileItems[i]) return true;
            }
            return false;
        }

        function submit() {
            if ((vm.form.birthYear || vm.form.birthMonth || vm.form.birthDay)
                && (!vm.form.birthYear || !vm.form.birthMonth || !vm.form.birthDay)) {
                return $rootScope.$broadcast("core.profile.callback", {
                    type: 'infoError',
                    data: vm.form
                });
            } else {
                if (vm.form.birthYear === "" && vm.form.birthMonth === ""  || vm.form.birthDay === "" ) {
                    vm.form.birthYear = vm.form.birthMonth = vm.form.birthDay = vm.RESET;
                }
            }
            if (!vm.form.comment) {
                vm.form.comment = vm.RESET;
            }
            if (!vm.form.website) {
                vm.form.website = vm.RESET;
            }
            if (!vm.form.agreedEmail) {
                vm.form.agreedEmail = false;
            }

            if (vm.file) {
                uploadManager.uploadImage(vm.file, metaManager.std.file.folderUser, function (status, data) {
                    if (status == 201) {
                        vm.form.pfimg = data;
                        updateUser();
                    } else {
                        errorHandler.alertError(status, data);
                    }
                });
            } else {
                updateUser();
            }
        }

        function updateUser() {
            vm.form.id = user.id;
            usersManager.updateUserById(vm.form, function (status, data) {
                if (vm.form.comment == vm.RESET) vm.form.comment = "";
                if (vm.form.birthYear == vm.RESET) vm.form.birthYear = "";
                if (vm.form.birthMonth == vm.RESET) vm.form.birthMonth = "";
                if (vm.form.birthDay == vm.RESET) vm.form.birthDay = "";
                if (vm.form.website == vm.RESET) vm.form.website = "";
                if (vm.form.agreedEmail == vm.RESET) vm.form.agreedEmail = false;
                if (status == 200) {
                    $rootScope.$broadcast("core.profile.callback", {
                        type: 'info',
                        data: vm.form
                    });
                } else {
                    errorHandler.alertError(status, data);
                }
            });
        }
    }

})();
