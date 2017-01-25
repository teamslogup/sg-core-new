export default function massNotificationsManager (MassNotification) {
    "ngInject";

    this.findMassNotificationById = findMassNotificationById;
    this.findMassNotifications = findMassNotifications;
    this.deleteMassNotification = deleteMassNotification;

    function findMassNotificationById (massNotificationId, callback) {
        MassNotification.get({
            id: massNotificationId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findMassNotifications (data, callback) {
        var query = {};
        if (data.orderBy !== undefined) query.orderBy = data.orderBy;
        if (data.sort !== undefined) query.sort = data.sort;
        if (data.last !== undefined) query.last = data.last;
        if (data.size !== undefined) query.size = data.size;
        if (data.key !== undefined) query.key = data.key;
        if (data.sendType !== undefined) query.sendType = data.sendType;
        if (data.isStored !== undefined) query.isStored = data.isStored;
        MassNotification.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteMassNotification (massNotification, callback) {
        massNotification = new MassNotification(massNotification);
        massNotification.$remove(function (data) {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}