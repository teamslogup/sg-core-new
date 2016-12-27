routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider
        .state('session.login', {
            url: '/login',
            templateUrl: 'modules/session/views/core.session.login.html'
        })
        .state('session.signup', {
            url: '/signup',
            templateUrl: 'modules/session/views/core.session.signup.html'
        })
        .state('session.find-pass', {
            url: '/find-pass',
            templateUrl: 'modules/session/views/core.session.find-pass.html'
        })
        .state('session.change-pass', {
            url: '/change-pass',
            templateUrl: 'modules/session/views/core.session.change-pass.html'
        });
}