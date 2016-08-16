(function () {

    angular.module("core.session").provider("oauthManager", oauthManager);

    /* @ngInject */
    function oauthManager() {
        var oauth = window.oauth;
        return {
            $get: function () {
                return oauth;
            }
        };
    }

})();