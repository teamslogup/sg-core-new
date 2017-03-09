export default function massNotificationConditionManager(metaManager, MassNotificationCondition) {
    "ngInject";

    var COMMON = metaManager.std.common;

    this.sendNotificationCondition = sendNotificationCondition;

    function sendNotificationCondition(body, callback) {

        if (isFormValidate(body)) {
            var massNotificationCondition = new MassNotificationCondition(body);
            massNotificationCondition.$save(function (data) {
                callback(201, data);
            }, function (data) {
                callback(data.status, data.data);
            });
        } else {
            callback(400, {
                code: "400_53"
            });
        }

    }

    function isFormValidate(form) {

        var isValidate = true;

        if(form.gender == COMMON.all){
            form.gender = undefined;
        }

        if(form.platform == COMMON.all){
            form.platform = undefined;
        }

        return isValidate;
    }
}