var notifications = {
    "notiChat": {
        "key": "notiNameChat",
        "isStored": false,
        "isOption": true,
        "notificationType": "application",
        "notificationBoxTitle": "kNotiNameChatTitle",
        "notificationBoxBody": "kNotiNameChatBody",
        "notificationSendTypes": [{
            "sendType": "push",
            "title": "kNotiNameChatTitle",
            "body": "kNotiNameChatBody"
        }]
    },
    "notiReport": {
        "key": "notiNameReport",
        "isStored": false,
        "isOption": true,
        "notificationType": "report",
        "notificationBoxTitle": "kNotiNameReportBoxTitle",
        "notificationBoxBody": "kNotiNameReportBoxBody",
        "notificationSendTypes": [{
            "sendType": "email",
            "title": "kNotiNameReportEmailTitle",
            "body": "kNotiNameReportEmailBody"
        },{
            "sendType": "push",
            "title": "kNotiNameReportPushTitle",
            "body": "kNotiNameReportPushBody"
        },{
            "sendType": "message",
            "title": "kNotiNameReportMessageTitle",
            "body": "kNotiNameReportMessageBody"
        }]
    }
};

module.exports = notifications;