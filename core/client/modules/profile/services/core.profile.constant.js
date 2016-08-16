angular.module('core.profile')
    .constant("profileResources", {
        SENDER_PHONE: '/api/accounts/sender-phone',
        AUTH_PHONE: '/api/accounts/auth-phone',
        PASS: '/api/accounts/pass'
    });