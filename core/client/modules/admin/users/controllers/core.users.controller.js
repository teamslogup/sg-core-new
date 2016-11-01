export default function UsersCtrl($scope, $filter, usersManager, notificationManager, notificationBoxManager, notificationSwitchManager, sessionRemoteManager, AlertDialog, loadingHandler, metaManager) {
    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    if (vm.CDN === undefined) {
        vm.CDN = metaManager.std.cdn;
    }

    var NOTIFICATION = metaManager.std.notification;
    var LOADING = metaManager.std.loading;

    $scope.currentPage = 1;

    $scope.isUserDetailVisible = false;
    $scope.isUserDetailFirstTime = true;
    $scope.isUserEditMode = false;

    $scope.params = {};
    $scope.form = {};

    $scope.userList = [];
    $scope.userListTotal = 0;

    $scope.userEnumSearchFields = metaManager.std.user.enumSearchFields;
    $scope.params.searchField = $scope.userEnumSearchFields[0];

    $scope.userEnumRoles = metaManager.std.user.enumRoles;
    $scope.enumCountries = Object.keys(metaManager.local.countries);
    $scope.enumLanguages = Object.keys(metaManager.local.languages);

    $scope.more = false;

    $scope.showUserDetail = function (index) {
        $scope.currentUserIndex = index;
        $scope.currentUser = $scope.userList[index];

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
        $scope.isUserDetailVisible = true;
        $scope.isUserDetailFirstTime = false;

        $scope.findAllNotification($scope.currentUser.id);
        $scope.findAllNotificationBox($scope.currentUser.id);

    };

    $scope.hideUserDetail = function () {
        $scope.isUserDetailVisible = false;
        $scope.form = {};
    };

    $scope.$on('$locationChangeStart', function (event, next, current) {
        if (next != current) {
            if ($scope.isUserDetailVisible) {
                event.preventDefault();
                $scope.hideUserDetail();
            }
        }
    });

    $scope.startEditMode = function () {
        $scope.isUserEditMode = true;
    };

    $scope.exitEditMode = function () {
        $scope.isUserEditMode = false;
    };

    $scope.currentOption = undefined;

    $scope.showItemOption = function ($event, user) {
        $event.stopPropagation();
        $scope.currentOption = user.id;
    };

    $scope.hideItemOption = function () {
        $scope.currentOption = undefined;
    };


    $scope.isFormValidate = function () {

        var isValidate = true;

        if ($scope.form.nick === undefined || $scope.form.nick === '') {
            isValidate = false;
            AlertDialog.show('', $filter('translate')('requireNick'), '', true);
            return isValidate;
        }

        return isValidate;
    };

    $scope.updateUser = function (index) {

        var user = $scope.userList[index];

        if ($scope.isFormValidate()) {
            var body = angular.copy($scope.form);

            loadingHandler.startLoading(LOADING.spinnerKey, 'updateUserById');
            usersManager.updateUserById(user.id, body, function (status, data) {
                if (status == 200) {
                    $scope.userList[index].nick = body.nick;
                    $scope.userList[index].name = body.name;
                    $scope.userList[index].gender = body.gender;
                    $scope.userList[index].birth = body.birthYear + ' ' + body.birthMonth + ' ' + body.birthDay;
                    $scope.userList[index].country = body.country;
                    $scope.userList[index].language = body.language;
                    $scope.userList[index].role = body.role;
                    $scope.userList[index].agreedEmail = body.agreedEmail;
                    $scope.userList[index].agreedPhoneNum = body.agreedPhoneNum;
                    $scope.hideUserDetail();
                } else {
                    AlertDialog.alertError(status, data);
                }
                loadingHandler.endLoading(LOADING.spinnerKey, 'updateUserById');
            });
        }

    };

    $scope.findUsers = function () {

        $scope.userListTotal = 0;
        $scope.userList = [];

        $scope.params.last = undefined;

        loadingHandler.startLoading(LOADING.spinnerKey, 'findAllUsers');
        usersManager.findAllUsers($scope.params, function (status, data) {
            if (status == 200) {
                $scope.userListTotal = data.count;
                $scope.userList = $scope.userList.concat(data.rows);
                $scope.more = $scope.userListTotal > $scope.userList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findAllUsers');
        });
    };

    $scope.findUsersMore = function () {

        if ($scope.userList.length > 0) {
            $scope.params.last = $scope.userList[$scope.userList.length - 1].createdAt;
        }

        loadingHandler.startLoading(LOADING.spinnerKey, 'findUsersMore');
        usersManager.findAllUsers($scope.params, function (status, data) {
            if (status == 200) {
                $scope.userList = $scope.userList.concat(data.rows);
                $scope.more = $scope.userListTotal > $scope.userList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findUsersMore');
        });
    };

    $scope.findUsers();

    $scope.$watch('params.type', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findUsers();
        }
    }, true);

    //Notification

    $scope.notifications = [];

    $scope.notificationSwitchs = {};
    $scope.notificationPublicSwitchs = {};

    var notificationEnumForm = NOTIFICATION.enumForms;

    for (var i = 0; i < notificationEnumForm.length; i++) {
        if (notificationEnumForm[i] == NOTIFICATION.formApplication) {
            notificationEnumForm.splice(i, 1);
        }
    }

    for (var i = 0; i < notificationEnumForm.length; i++) {
        $scope.notificationPublicSwitchs[notificationEnumForm[i]] = {
            switch: true,
            type: notificationEnumForm[i]
        };
    }

    $scope.findAllNotification = function (userId) {
        loadingHandler.startLoading(LOADING.spinnerKey, 'findAllNotification');
        notificationManager.findAllNotification({}, function (status, data) {
            if (status == 200) {

                $scope.notifications = data.rows;

                for (var i = 0; i < $scope.notifications.length; i++) {
                    $scope.notificationSwitchs[$scope.notifications[i].key] = {
                        switch: true,
                        key: $scope.notifications[i].key,
                        notificationId: $scope.notifications[i].id
                    };

                }

                $scope.findAllNotificationSwitch(userId);

            } else if (status == 404) {

            } else {
                AlertDialog.alertError(status, data);
            }

        });
        loadingHandler.endLoading(LOADING.spinnerKey, 'findAllNotification');
    };

    //NotificationBox

    $scope.findAllNotificationBox = function (userId) {
        $scope.notificationBoxListTotal = 0;
        $scope.notificationBoxList = [];

        $scope.params.last = undefined;
        $scope.params.userId = userId;

        loadingHandler.startLoading(LOADING.spinnerKey, 'findAllNotificationBox');
        notificationBoxManager.findAllNotificationBox($scope.params, function (status, data) {
            if (status == 200) {
                $scope.notificationBoxListTotal = data.count;
                $scope.notificationBoxList = $scope.notificationBoxList.concat(data.rows);

                $scope.notificationBoxMore = $scope.notificationBoxListTotal > $scope.notificationBoxList.length;
            } else if (status == 404) {
                $scope.notificationBoxMore = false;
            } else {
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findAllNotificationBox');
        });
    };

    $scope.notificationBoxList = [];
    $scope.notificationBoxListTotal = 0;

    $scope.notificationBoxMore = false;

    $scope.findNotificationBoxMore = function () {

        if ($scope.notificationBoxList.length > 0) {
            $scope.params.last = $scope.notificationBoxList[$scope.notificationBoxList.length - 1].createdAt;
        }

        loadingHandler.startLoading(LOADING.spinnerKey, 'findNotificationBoxMore');
        notificationBoxManager.findAllNotificationBox($scope.params, function (status, data) {
            if (status == 200) {
                $scope.notificationBoxList = $scope.notificationBoxList.concat(data.rows);
                $scope.notificationBoxMore = $scope.notificationBoxListTotal > $scope.notificationBoxList.length;
            } else if (status == 404) {
                $scope.notificationBoxMore = false;
            } else {
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findNotificationBoxMore');
        });
    };

    //NotificationSwitch

    $scope.findAllNotificationSwitch = function (userId) {
        var query = {
            userId: userId
        };

        loadingHandler.startLoading(LOADING.spinnerKey, 'findAllNotificationSwitch');
        notificationSwitchManager.findAllNotificationSwitch(query, function (status, data) {
            if (status == 200) {

                for (var i = 0; i < data.application.length; i++) {
                    if ($scope.notificationSwitchs.hasOwnProperty(data.application[i].notification.key)) {
                        $scope.notificationSwitchs[data.application[i].notification.key].switch = data.application[i].switch;
                    }
                }

                for (var i = 0; i < data.public.length; i++) {
                    if ($scope.notificationPublicSwitchs.hasOwnProperty(data.public[i].type)) {
                        $scope.notificationPublicSwitchs[data.public[i].type].switch = data.public[i].switch;
                    }
                }

            } else if (status == 404) {

            } else {
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findAllNotificationSwitch');
        });
    };

    $scope.deleteUser = function (index) {

        AlertDialog.show('', $filter('translate')('sureDelete'), $filter('translate')('delete'), true, function () {
            var user = $scope.userList[index];

            loadingHandler.startLoading(LOADING.spinnerKey, 'deleteUser');
            usersManager.deleteUser(user, function (status, data) {
                if (status == 200) {
                    $scope.userList.splice(index, 1);
                } else {
                    AlertDialog.alertError(status, data);
                }

                loadingHandler.endLoading(LOADING.spinnerKey, 'deleteUser');
            });
        });

    };

    $scope.updateAppNotificationSwitch = function (notificationSwitch) {

        var body = {
            userId: $scope.currentUser.id,
            notificationId: notificationSwitch.notificationId,
            switch: notificationSwitch.switch,
            type: vm.NOTIFICATION.formApplication
        };

        loadingHandler.startLoading(LOADING.spinnerKey, 'updateAppNotificationSwitch');
        notificationSwitchManager.updateNotificationSwitch(body, function (status, data) {
            if (status == 200) {

            } else {
                notificationSwitch.switch = !notificationSwitch.switch;
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'updateAppNotificationSwitch');
        });
    };

    $scope.updatePublicNotificationSwitch = function (notificationPublicSwitch) {

        var body = {
            userId: $scope.currentUser.id,
            switch: notificationPublicSwitch.switch,
            type: notificationPublicSwitch.type
        };

        loadingHandler.startLoading(LOADING.spinnerKey, 'updatePublicNotificationSwitch');
        notificationSwitchManager.updateNotificationSwitch(body, function (status, data) {
            if (status == 200) {

            } else {
                notificationPublicSwitch.switch = !notificationPublicSwitch.switch;
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'updatePublicNotificationSwitch');
        });
    };

    $scope.deleteSessionRemote = function (index) {

        var loginHistory = $scope.currentUser.loginHistories[index];

        loadingHandler.startLoading(LOADING.spinnerKey, 'deleteSessionRemote');
        sessionRemoteManager.deleteSessionRemote(loginHistory, function (status, data) {
            if (status == 200) {
                $scope.currentUser.loginHistories.splice(index, 1);
            } else {
                AlertDialog.alertError(status, data);
            }
            loadingHandler.endLoading(LOADING.spinnerKey, 'deleteSessionRemote');
        });

    };

}