(function () {

    angular.module('core.profile').config(profileConfig);

    /* @ngInject */
    function profileConfig($stateProvider) {

        $stateProvider
            .state('profile.info', {
                url: '/info/:userId',
                templateUrl: 'modules/profile/views/core.profile.info.html'
            })
            .state('profile.info-add', {
                url: '/info-add/:userId',
                templateUrl: 'modules/profile/views/core.profile.info-add.html'
            })
            .state('profile.pass', {
                url: '/pass/:userId',
                templateUrl: 'modules/profile/views/core.profile.pass.html'
            })
            .state('profile.account', {
                url: '/account/:userId',
                templateUrl: 'modules/profile/views/core.profile.account.html'
            });
    }

})();
