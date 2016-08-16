(function() {
    'use strict';

    angular.module('core.sample').controller('mainCtrl', mainCtrl);

    /* @ngInject */
    function mainCtrl($scope, $translate, $location, staticLoader, sessionManager,  metaManager) {
        staticLoader.get('route1.json', function (status, data) {
            $scope.contents = data;
        });

        $scope.change = function(key) {
            $translate.use(key).then(function (key) {
            }, function (key) {
                alert('fail ' + key);
            });
        };

        $scope.logout = function() {
            sessionManager.logout(function(status, data) {
                $location.href = "/";
            });
        };

        $scope.isLoggedIn = function() {
            return sessionManager.isLoggedIn();
        };

        $scope.goToLogin = function() {
            $location.href = "/accounts/login";
        };
    }

})();