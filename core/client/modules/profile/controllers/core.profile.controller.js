(function () {
    'use strict';

    angular.module("core.profile").controller("ProfileCtrl", ProfileCtrl);

    /* @ngInject */
    function ProfileCtrl($scope, metaManager) {
        if (!$scope.vm) $scope.vm = {};
        var vm = $scope.vm;
        vm.USER = metaManager.std.user;
        vm.RESET = metaManager.std.magic.reset;
        vm.SMS = metaManager.std.sms;
        vm.enum = {};
        vm.enum.genders = metaManager.std.user.enumGenders;
        vm.enum.deviceTypes = metaManager.std.user.enumDeviceTypes;
        vm.enum.emailSenderTypes = metaManager.std.user.enumEmailSenderTypes;
        vm.enum.phones = metaManager.std.user.enumPhones;
        vm.enum.phoneSenderTypes = metaManager.std.user.enumPhoneSenderTypes;
        vm.enum.providers = metaManager.std.user.enumProviders;
        vm.enum.roles = metaManager.std.user.enumRoles;
        vm.enum.signTypes = metaManager.std.user.enumSignUpTypes;
        vm.enum.years = [];
        for (var i = 0; i < 50; ++i) {
            vm.enum.years.push((1950 + i) + "");
        }
        vm.enum.months = [];
        for (var i = 1; i <= 12; ++i) {
            vm.enum.months.push(i + "");
        }
        vm.enum.days = [];
        for (var i = 1; i <= 31; ++i) {
            vm.enum.days.push(i + "");
        }

        vm.enum.languages = Object.keys(metaManager.local.languages);
        vm.enum.countries = Object.keys(metaManager.local.countries);

        vm.codeToName = codeToName;
        function codeToName(type, key) {
            if (type == 'lang') {
                return metaManager.local.languages[key].name;
            } else {
                return metaManager.local.countries[key].name;
            }
        }
    }

})();
