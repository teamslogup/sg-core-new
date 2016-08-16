angular.module('core.bbs')
    .constant("bbsResources", {
        BOARDS: '/api/socials/boards',
        ARTICLES: '/api/socials/articles',
        USERS: '/api/accounts/users',
        COMMENTS: '/api/socials/comments',
        VIEWS: '/api/socials/views',
        BBS: '/api/socials/bbs',
        IMAGE: '/api/etc/image'
    });