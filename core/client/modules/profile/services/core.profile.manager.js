(function () {

    angular.module("core.profile").service("profileManager", profileManager);

    /* @ngInject */
    function profileManager(SenderPhone, AuthPhone, Pass, metaManager) {
        this.sendAuthNum = sendAuthNum;
        this.savePhoneNumber = savePhoneNumber;
        this.changePassword = changePassword;
        this.deletePhoneNumber = deletePhoneNumber;

        function sendAuthNum(phoneNum, callback) {
            var phoneInfo = {
                phoneNum: phoneNum,
                type: metaManager.std.user.phoneSenderTypeAdding
            };
            var senderPhone = new SenderPhone(phoneInfo);
            senderPhone.$save(function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status, data.data);
            });
        }

        function savePhoneNumber(token, callback) {
            var tokenBody = {
                token: token
            };
            var authPhone = new AuthPhone(tokenBody);
            authPhone.$save(function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status, data.data);
            });
        }

        function changePassword(newPass, oldPass, callback) {
            var where = {};
            Pass.update(where, {
                newPass: newPass,
                oldPass: oldPass
            }, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status, data);
            });
        }

        function deletePhoneNumber(callback) {
            AuthPhone.delete({}, {}, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status, data);
            });
        }
    }

})();