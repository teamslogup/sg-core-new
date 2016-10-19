export default function notificationSwitchManager(NotificationSwitch) {
    this.findAllNotificationSwitch = findAllNotificationSwitch;
    this.findNotificationSwitchById = findNotificationSwitchById;
    this.updateNotificationSwitchById = updateNotificationSwitchById;
    this.deleteNotificationSwitch = deleteNotificationSwitch;

    function updateNotificationSwitchById(notificationSwitch, callback) {
        var where = {id: notificationSwitch.id};
        delete notificationSwitch.id;
        NotificationSwitch.update(where, notificationSwitch, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findNotificationSwitchById(id, callback) {
        NotificationSwitch.get({
            id: id
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status);
        });
    }

    function findAllNotificationSwitch(data, callback) {
        NotificationSwitch.query({
            userId: data.userId || ''
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteNotificationSwitch(notificationSwitch, callback) {
        notificationSwitch = new NotificationSwitch(notificationSwitch);
        notificationSwitch.$remove(function (data, status) {
            console.log(status, data);
            callback(204, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}