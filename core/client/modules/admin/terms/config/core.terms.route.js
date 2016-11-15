routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider
        .state('terms.manage', {
            url: '/manage',
            templateUrl: 'modules/admin/terms/views/core.terms-manage.html'
        });
}