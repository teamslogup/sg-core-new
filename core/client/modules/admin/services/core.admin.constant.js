angular.module('core.admin')
    .constant("coreResources", {
        ACTIVITIES: '/api/socials/activities',
        PARTICIPANTS: '/api/socials/participants',
        ACTIVITY_COMMENTS: '/api/socials/activity-comments',
        JOIN_ACTIVITIES: '/api/socials/join-activities',
        NOTIFICATION: '/api/socials/notification',
        REPORTS: '/api/etc/reports'
    });