angular.module('core.session')
    .constant("sessionResources", {
        USERS: '/api/accounts/users',
        SESSION: '/api/accounts/session',
        SENDER_EMAIL: '/api/accounts/sender-email',
        PASS: '/api/accounts/pass'
    });