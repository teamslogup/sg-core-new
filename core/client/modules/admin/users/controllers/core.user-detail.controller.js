export default function UserDetailCtrl($scope, $filter, $uibModalInstance, scope, user, isEditMode) {

    var LOADING = scope.metaManager.std.loading;
    var COMMON = scope.metaManager.std.common;
    var USER = scope.metaManager.std.user;
    var NOTIFICATION = scope.metaManager.std.notification;

    $scope.currentUser = user;
    $scope.currentPage = 1;

    $scope.form = {};
    $scope.params = {};

    //Notification
    $scope.notifications = [];
    //NotificationBox
    $scope.notificationBoxList = [];
    $scope.notificationBoxListTotal = 0;
    $scope.notificationBoxMore = false;
    //NotificationSwitch
    $scope.notificationSwitches = {};
    $scope.notificationPublicSwitches = {};

    $scope.userDetailEnumGender = angular.copy(USER.enumGenders);

    $scope.enumSendTypes = NOTIFICATION.enumSendTypes;
    $scope.params.sendType = NOTIFICATION.sendTypePush;

    $scope.userEnumRoles = angular.copy(USER.enumRoles);
    $scope.userEnumGender = angular.copy(USER.enumGenders);

    $scope.enumCountries = Object.keys(scope.metaManager.local.countries);
    $scope.enumLanguages = Object.keys(scope.metaManager.local.languages);

    $scope.startEditMode = startEditMode;
    $scope.exitEditMode = exitEditMode;

    $scope.updateUser = updateUser;
    $scope.deleteUser = scope.deleteUser;

    $scope.findAllNotificationBox = findAllNotificationBox;
    $scope.findNotificationBoxMore = findNotificationBoxMore;
    $scope.findAllNotificationSwitch = findAllNotificationSwitch;
    $scope.updateAppNotificationSwitch = updateAppNotificationSwitch;
    $scope.updatePublicNotificationSwitch = updatePublicNotificationSwitch;

    $scope.deleteSessionRemote = deleteSessionRemote;
    $scope.updateProfile = updateProfile;

    if (isEditMode) {
        startEditMode();
    }

    function startEditMode() {
        $scope.isUserEditMode = true;
    }

    function exitEditMode() {
        $scope.isUserEditMode = false;
    }

    function splitBirth(str) {
        if (str) {
            var date = str.split("-");

            $scope.form.birthYear = Number(date[0]);
            $scope.form.birthMonth = Number(date[1]);
            $scope.form.birthDay = Number(date[2]);
        }
    }

    function isFormValidate() {

        var isValidate = true;

        if ($scope.form.nick === undefined || $scope.form.nick === '') {
            isValidate = false;
            dialogHandler.show('', $filter('translate')('requireNick'), '', true);
            return isValidate;
        }

        return isValidate;
    }

    function updateUser(index) {

        var user = $scope.userList[index];

        if (isFormValidate()) {
            var body = angular.copy($scope.form);

            scope.loadingHandler.startLoading(LOADING.spinnerKey, 'updateUserById');
            scope.usersManager.updateUserById(user.id, body, function (status, data) {
                if (status == 200) {
                    $scope.userList[index].nick = body.nick;
                    $scope.userList[index].name = body.name;
                    $scope.userList[index].gender = body.gender;
                    $scope.userList[index].birth = data.birth;
                    $scope.userList[index].country = body.country;
                    $scope.userList[index].language = body.language;
                    $scope.userList[index].role = body.role;
                    $scope.userList[index].agreedEmail = body.agreedEmail;
                    $scope.userList[index].agreedPhoneNum = body.agreedPhoneNum;

                    if (scope.params.role != COMMON.all && scope.params.role != body.role) {
                        $scope.userList.splice(index, 1);
                    }

                    if (scope.params.gender != COMMON.all && scope.params.gender != body.gender) {
                        $scope.userList.splice(index, 1);
                    }

                    $scope.exitEditMode();
                } else {
                    scope.dialogHandler.alertError(status, data);
                }
                scope.loadingHandler.endLoading(LOADING.spinnerKey, 'updateUserById');
            });
        }

    }

    function findAllNotificationBox(userId) {
        $scope.notificationBoxListTotal = 0;
        $scope.notificationBoxList = [];

        $scope.params.last = undefined;
        $scope.params.userId = userId;

        scope.loadingHandler.startLoading(LOADING.spinnerKey, 'findAllNotificationBox');
        scope.notificationBoxManager.findAllNotificationBox($scope.params, function (status, data) {
            if (status == 200) {
                $scope.notificationBoxListTotal = data.count;

                for (var i = 0; i < data.rows.length; i++) {
                    data.rows[i].payload = JSON.parse(data.rows[i].payload);
                }

                $scope.notificationBoxList = $scope.notificationBoxList.concat(data.rows);

                $scope.notificationBoxMore = $scope.notificationBoxListTotal > $scope.notificationBoxList.length;
            } else if (status == 404) {
                $scope.notificationBoxMore = false;
            } else {
                scope.dialogHandler.alertError(status, data);
            }

            scope.loadingHandler.endLoading(LOADING.spinnerKey, 'findAllNotificationBox');
        });
    }

    function findNotificationBoxMore() {

        if ($scope.notificationBoxList.length > 0) {
            $scope.params.last = $scope.notificationBoxList[$scope.notificationBoxList.length - 1].createdAt;
        }

        scope.loadingHandler.startLoading(LOADING.spinnerKey, 'findNotificationBoxMore');
        scope.notificationBoxManager.findAllNotificationBox($scope.params, function (status, data) {
            if (status == 200) {
                $scope.notificationBoxList = $scope.notificationBoxList.concat(data.rows);
                $scope.notificationBoxMore = $scope.notificationBoxListTotal > $scope.notificationBoxList.length;
            } else if (status == 404) {
                $scope.notificationBoxMore = false;
            } else {
                scope.dialogHandler.alertError(status, data);
            }

            scope.loadingHandler.endLoading(LOADING.spinnerKey, 'findNotificationBoxMore');
        });
    }

    function findAllNotificationSwitch(userId) {
        var query = {
            userId: userId,
            sendType: $scope.params.sendType
        };

        scope.loadingHandler.startLoading(LOADING.spinnerKey, 'findAllNotificationSwitch');
        scope.notificationSwitchManager.findAllNotificationSwitch(query, function (status, data) {
            if (status == 200) {

                $scope.notificationSwitches = data.rows;

            } else if (status == 404) {

            } else {
                scope.dialogHandler.alertError(status, data);
            }

            scope.loadingHandler.endLoading(LOADING.spinnerKey, 'findAllNotificationSwitch');
        });
    }

    function findAllNotificationPublicSwitch(userId) {
        var query = {
            userId: userId,
            sendType: $scope.params.sendType
        };

        scope.loadingHandler.startLoading(LOADING.spinnerKey, 'findAllNotificationPublicSwitch');
        scope.notificationPublicSwitchManager.findAllNotificationPublicSwitch(query, function (status, data) {
            if (status == 200) {

                $scope.notificationPublicSwitches = data.rows;

            } else if (status == 404) {

            } else {
                scope.dialogHandler.alertError(status, data);
            }

            scope.loadingHandler.endLoading(LOADING.spinnerKey, 'findAllNotificationPublicSwitch');
        });
    }

    function updateAppNotificationSwitch(notificationSwitch) {

        var body = {
            userId: $scope.currentUser.id,
            key: notificationSwitch.key,
            sendType: notificationSwitch.sendType,
            switch: notificationSwitch.switch
        };

        scope.notificationSwitchManager.updateNotificationSwitch(body, function (status, data) {
            if (status == 204) {

            } else {
                notificationSwitch.switch = !notificationSwitch.switch;
                scope.dialogHandler.alertError(status, data);
            }

        });
    }

    function updatePublicNotificationSwitch(notificationPublicSwitch) {

        var body = {
            userId: $scope.currentUser.id,
            key: notificationPublicSwitch.key,
            sendType: notificationPublicSwitch.sendType,
            switch: notificationPublicSwitch.switch
        };

        scope.notificationPublicSwitchManager.updateNotificationPublicSwitch(body, function (status, data) {
            if (status == 200) {

            } else {
                notificationPublicSwitch.switch = !notificationPublicSwitch.switch;
                scope.dialogHandler.alertError(status, data);
            }

        });
    }

    function deleteSessionRemote(index) {

        var loginHistory = $scope.currentUser.loginHistories[index];

        scope.loadingHandler.startLoading(LOADING.spinnerKey, 'deleteSessionRemote');
        scope.sessionRemoteManager.deleteSessionRemote(loginHistory, function (status, data) {
            if (status == 204) {
                $scope.currentUser.loginHistories.splice(index, 1);
            } else {
                scope.dialogHandler.alertError(status, data);
            }
            scope.loadingHandler.endLoading(LOADING.spinnerKey, 'deleteSessionRemote');
        });

    }

    function updateProfile(user) {

        scope.loadingHandler.startLoading(LOADING.spinnerKey, 'updateProfile');
        scope.profileManager.updateProfileByUserId(user.id, user.profile, function (status, data) {

            if (status == 200) {
                $scope.exitEditMode();
            } else {
                scope.dialogHandler.alertError(status, data);
            }

            scope.loadingHandler.endLoading(LOADING.spinnerKey, 'updateProfile');

        });

    }

    $scope.$watch('params.sendType', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findAllNotificationSwitch($scope.currentUser.id);
            findAllNotificationPublicSwitch($scope.currentUser.id);
        }
    }, true);

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function init() {
        for (var i = 0; i < $scope.currentUser.providers.length; i++) {
            if ($scope.currentUser.providers[i].type == 'facebook') {
                $scope.currentUser.providerFacebookIndex = i;
            } else if ($scope.currentUser.providers[i].type == 'kakao') {
                $scope.currentUser.providerKakaoIndex = i;
            }
        }

        $scope.form = {
            nick: $scope.currentUser.nick,
            name: $scope.currentUser.name,
            gender: $scope.currentUser.gender,
            birthYear: $scope.currentUser.birthYear,
            birthMonth: $scope.currentUser.birthMonth,
            birthDay: $scope.currentUser.birthDay,
            country: $scope.currentUser.country,
            language: $scope.currentUser.language,
            role: $scope.currentUser.role,
            agreedEmail: $scope.currentUser.agreedEmail,
            agreedPhoneNum: $scope.currentUser.agreedPhoneNum
        };
        splitBirth($scope.currentUser.birth);

        delete $scope.currentUser.profile.createdAt;
        delete $scope.currentUser.profile.updatedAt;
        delete $scope.currentUser.profile.deletedAt;
        delete $scope.currentUser.profile.id;

        $scope.isUserDetailVisible = true;
        $scope.isUserDetailFirstTime = false;

        findAllNotificationSwitch($scope.currentUser.id);
        findAllNotificationPublicSwitch($scope.currentUser.id);
        findAllNotificationBox($scope.currentUser.id);
    }

    init();

}