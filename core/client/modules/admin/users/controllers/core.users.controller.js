export default function UsersCtrl($scope, $rootScope, $uibModal, $filter, usersManager, notificationManager, notificationBoxManager, notificationSwitchManager, notificationPublicSwitchManager, sessionRemoteManager, profileManager, dialogHandler, loadingHandler, metaManager) {
    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    if (vm.CDN === undefined) {
        vm.CDN = metaManager.std.cdn;
    }

    $scope.openModal = openModal;

    $scope.showUserDetail = showUserDetail;
    $scope.hideUserDetail = hideUserDetail;
    $scope.showUserDetailAndStartEditMode = showUserDetailAndStartEditMode;
    $scope.startEditMode = startEditMode;
    $scope.exitEditMode = exitEditMode;
    $scope.showItemOption = showItemOption;
    $scope.hideItemOption = hideItemOption;
    $scope.updateUser = updateUser;
    $scope.deleteUser = deleteUser;

    $scope.findUsersMore = findUsersMore;
    $scope.findAllNotificationBox = findAllNotificationBox;
    $scope.findNotificationBoxMore = findNotificationBoxMore;
    $scope.findAllNotificationSwitch = findAllNotificationSwitch;
    $scope.updateAppNotificationSwitch = updateAppNotificationSwitch;
    $scope.updatePublicNotificationSwitch = updatePublicNotificationSwitch;

    $scope.deleteSessionRemote = deleteSessionRemote;
    $scope.updateProfile = updateProfile;


    var NOTIFICATION = metaManager.std.notification;
    var LOADING = metaManager.std.loading;
    var USER = metaManager.std.user;
    var COMMON = metaManager.std.common;
    var ADMIN = metaManager.std.admin;

    $scope.currentPage = 1;

    $scope.currentOption = undefined;

    $scope.isUserDetailVisible = false;
    $scope.isUserDetailFirstTime = true;
    $scope.isUserEditMode = false;

    $scope.params = {};
    $scope.form = {};

    $scope.userList = [];
    $scope.userListTotal = 0;

    $scope.userEnumSearchFields = USER.enumSearchFields;
    $scope.params.searchField = $scope.userEnumSearchFields[0];

    $scope.userEnumRoles = angular.copy(USER.enumRoles);
    $scope.userEnumRoles.unshift(USER.roleAll);
    $scope.params.role = USER.roleAll;

    $scope.userEnumGender = angular.copy(USER.enumGenders);
    $scope.userEnumGender.unshift(USER.genderAll);
    $scope.params.gender = USER.genderAll;

    $scope.userDetailEnumGender = angular.copy(USER.enumGenders);

    $scope.enumSendTypes = NOTIFICATION.enumSendTypes;
    $scope.params.sendType = NOTIFICATION.sendTypePush;

    $scope.enumCountries = Object.keys(metaManager.local.countries);
    $scope.enumLanguages = Object.keys(metaManager.local.languages);

    $scope.more = false;

    function showUserDetail(index) {
        // $scope.currentUserIndex = index;
        // $scope.currentUser = $scope.userList[index];
        //
        // for (var i = 0; i < $scope.currentUser.providers.length; i++) {
        //     if ($scope.currentUser.providers[i].type == 'facebook') {
        //         $scope.currentUser.providerFacebookIndex = i;
        //     } else if ($scope.currentUser.providers[i].type == 'kakao') {
        //         $scope.currentUser.providerKakaoIndex = i;
        //     }
        // }
        //
        // $scope.form = {
        //     nick: $scope.currentUser.nick,
        //     name: $scope.currentUser.name,
        //     gender: $scope.currentUser.gender,
        //     birthYear: $scope.currentUser.birthYear,
        //     birthMonth: $scope.currentUser.birthMonth,
        //     birthDay: $scope.currentUser.birthDay,
        //     country: $scope.currentUser.country,
        //     language: $scope.currentUser.language,
        //     role: $scope.currentUser.role,
        //     agreedEmail: $scope.currentUser.agreedEmail,
        //     agreedPhoneNum: $scope.currentUser.agreedPhoneNum
        // };
        // splitBirth($scope.currentUser.birth);
        //
        // delete $scope.currentUser.profile.createdAt;
        // delete $scope.currentUser.profile.updatedAt;
        // delete $scope.currentUser.profile.deletedAt;
        // delete $scope.currentUser.profile.id;
        //
        // $scope.isUserDetailVisible = true;
        // $scope.isUserDetailFirstTime = false;
        //
        // // $scope.findAllNotification($scope.currentUser.id);
        // findAllNotificationSwitch($scope.currentUser.id);
        // findAllNotificationPublicSwitch($scope.currentUser.id);
        // findAllNotificationBox($scope.currentUser.id);

    }

    function hideUserDetail() {
        $scope.isUserDetailVisible = false;
        $scope.form = {};
        $scope.exitEditMode();
    }

    function startEditMode() {
        $scope.isUserEditMode = true;
    }

    function exitEditMode() {
        $scope.isUserEditMode = false;
    }

    function showItemOption($event, user) {
        $event.stopPropagation();
        $scope.currentOption = user.id;
    }

    function hideItemOption() {
        $scope.currentOption = undefined;
    }

    function updateUser(index) {

        var user = $scope.userList[index];

        if (isFormValidate()) {
            var body = angular.copy($scope.form);

            loadingHandler.startLoading(LOADING.spinnerKey, 'updateUserById');
            usersManager.updateUserById(user.id, body, function (status, data) {
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

                    if ($scope.params.role != COMMON.all && $scope.params.role != body.role) {
                        $scope.userList.splice(index, 1);
                    }

                    if ($scope.params.gender != COMMON.all && $scope.params.gender != body.gender) {
                        $scope.userList.splice(index, 1);
                    }

                    $scope.exitEditMode();
                } else {
                    dialogHandler.alertError(status, data);
                }
                loadingHandler.endLoading(LOADING.spinnerKey, 'updateUserById');
            });
        }

    }

    ////////////////////

    // function obejctToArray(object) {
    //
    //     var array = [];
    //
    //     for (var key in object) {
    //         // skip loop if the property is from prototype
    //         if (!object.hasOwnProperty(key)) continue;
    //         array.push(object[key]);
    //     }
    //
    // }

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

    function findUsers() {

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
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findAllUsers');
        });
    }

    function findUsersMore() {

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
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findUsersMore');
        });
    }

    //Notification

    $scope.notifications = [];

    //NotificationBox

    $scope.notificationBoxList = [];
    $scope.notificationBoxListTotal = 0;
    $scope.notificationBoxMore = false;

    function findAllNotificationBox(userId) {
        $scope.notificationBoxListTotal = 0;
        $scope.notificationBoxList = [];

        $scope.params.last = undefined;
        $scope.params.userId = userId;

        loadingHandler.startLoading(LOADING.spinnerKey, 'findAllNotificationBox');
        notificationBoxManager.findAllNotificationBox($scope.params, function (status, data) {
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
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findAllNotificationBox');
        });
    }

    function findNotificationBoxMore() {

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
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findNotificationBoxMore');
        });
    }

    //NotificationSwitch

    $scope.notificationSwitches = {};
    $scope.notificationPublicSwitches = {};

    function findAllNotificationSwitch(userId) {
        var query = {
            userId: userId,
            sendType: $scope.params.sendType
        };

        loadingHandler.startLoading(LOADING.spinnerKey, 'findAllNotificationSwitch');
        notificationSwitchManager.findAllNotificationSwitch(query, function (status, data) {
            if (status == 200) {

                $scope.notificationSwitches = data.rows;

            } else if (status == 404) {

            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findAllNotificationSwitch');
        });
    }

    function findAllNotificationPublicSwitch(userId) {
        var query = {
            userId: userId,
            sendType: $scope.params.sendType
        };

        loadingHandler.startLoading(LOADING.spinnerKey, 'findAllNotificationPublicSwitch');
        notificationPublicSwitchManager.findAllNotificationPublicSwitch(query, function (status, data) {
            if (status == 200) {

                $scope.notificationPublicSwitches = data.rows;

            } else if (status == 404) {

            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findAllNotificationPublicSwitch');
        });
    }

    function deleteUser(index) {

        dialogHandler.show('', $filter('translate')('sureDelete'), $filter('translate')('delete'), true, function () {

            var user = $scope.userList[index];

            loadingHandler.startLoading(LOADING.spinnerKey, 'deleteUser');
            usersManager.deleteUser(user, function (status, data) {

                if (status == 204) {
                    $scope.userList.splice(index, 1);
                } else {
                    dialogHandler.alertError(status, data);
                }

                loadingHandler.endLoading(LOADING.spinnerKey, 'deleteUser');

            });

        });

    }

    function updateAppNotificationSwitch(notificationSwitch) {

        var body = {
            userId: $scope.currentUser.id,
            notificationSendTypeId: notificationSwitch.notificationSendTypeId,
            switch: notificationSwitch.switch
        };

        notificationSwitchManager.updateNotificationSwitch(body, function (status, data) {
            if (status == 200) {

            } else {
                notificationSwitch.switch = !notificationSwitch.switch;
                dialogHandler.alertError(status, data);
            }

        });
    }

    function updatePublicNotificationSwitch(notificationPublicSwitch) {

        var body = {
            userId: $scope.currentUser.id,
            notificationType: notificationPublicSwitch.notificationType,
            sendType: notificationPublicSwitch.sendType,
            switch: notificationPublicSwitch.switch
        };

        notificationPublicSwitchManager.updateNotificationPublicSwitch(body, function (status, data) {
            if (status == 200) {

            } else {
                notificationPublicSwitch.switch = !notificationPublicSwitch.switch;
                dialogHandler.alertError(status, data);
            }

        });
    }

    function deleteSessionRemote(index) {

        var loginHistory = $scope.currentUser.loginHistories[index];

        loadingHandler.startLoading(LOADING.spinnerKey, 'deleteSessionRemote');
        sessionRemoteManager.deleteSessionRemote(loginHistory, function (status, data) {
            if (status == 204) {
                $scope.currentUser.loginHistories.splice(index, 1);
            } else {
                dialogHandler.alertError(status, data);
            }
            loadingHandler.endLoading(LOADING.spinnerKey, 'deleteSessionRemote');
        });

    }

    function updateProfile(user) {

        loadingHandler.startLoading(LOADING.spinnerKey, 'updateProfile');
        profileManager.updateProfileByUserId(user.id, user.profile, function (status, data) {

            if (status == 200) {
                $scope.exitEditMode();
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'updateProfile');

        });

    }

    function showUserDetailAndStartEditMode(index) {
        $scope.showUserDetail(index);
        $scope.startEditMode();
    }

    function openModal(index) {
        $scope.currentUserIndex = index;
        var user = $scope.userList[index];

        var createInstance = $uibModal.open({
            animation: ADMIN.isUseModalAnimation,
            backdrop: ADMIN.modalBackDrop,
            templateUrl: 'coreUserDetail.html',
            controller: 'UserDetailCtrl',
            size: USER.modalSize,
            resolve: {
                scope: function () {
                    return $scope;
                },
                user: function () {
                    return user;
                }
            }
        });

        createInstance.result.then(function (result) {

        }, function () {
            console.log("cancel modal page");
        });
    }

    $scope.$on('$locationChangeStart', function (event, next, current) {
        if (next != current) {
            if ($scope.isUserDetailVisible) {
                event.preventDefault();
                $scope.hideUserDetail();
            }
        }
    });

    $scope.$watch('params.type', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findUsers();
        }
    }, true);

    $scope.$watch('params.role', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findUsers();
        }
    }, true);

    $scope.$watch('params.gender', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findUsers();
        }
    }, true);

    $scope.$watch('params.sendType', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findAllNotificationSwitch($scope.currentUser.id);
            findAllNotificationPublicSwitch($scope.currentUser.id);
        }
    }, true);

    findUsers();

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleUsers
    });

}