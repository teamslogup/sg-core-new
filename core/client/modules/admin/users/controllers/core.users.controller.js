export default function UsersCtrl($scope, $filter, usersManager, AlertDialog, loadingHandler, metaManager) {
    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    if (vm.CDN === undefined) {
        vm.CDN = metaManager.std.cdn;
    }

    var LOADING = metaManager.std.loading;

    $scope.isUserDetailVisible = false;
    $scope.isUserEditMode = false;

    $scope.params = {};
    $scope.form = {};

    $scope.userList = [];
    $scope.userListTotal = 0;

    $scope.more = false;

    $scope.showUserDetail = function (user) {
        $scope.currentUser = user;

        for (var i = 0; i < $scope.currentUser.providers.length; i++) {
            if ($scope.currentUser.providers[i].type == 'facebook') {
                $scope.currentUser.providerFacebookIndex = i;
            } else if ($scope.currentUser.providers[i].type == 'kakao') {
                $scope.currentUser.providerKakaoIndex = i;
            }
        }

        $scope.form = {
            nick: user.nick,
            name: user.name,
            gender: user.gender,
            birthYear: user.birthYear,
            birthMonth: user.birthMonth,
            birthDay: user.birthDay,
            country: user.country,
            language: user.language,
            role: user.role,
            agreedEmail: user.agreedEmail,
            agreedPhoneNum: user.agreedPhoneNum
        };
        $scope.isUserDetailVisible = true;
    };

    $scope.hideUserDetail = function () {
        $scope.isUserDetailVisible = false;
        $scope.form = {};
    };

    $scope.$on('$locationChangeStart', function (event, next, current) {
        if (next != current) {
            if($scope.isUserDetailVisible) {
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

    $scope.isFormValidate = function () {

        var isValidate = true;

        if ($scope.form.title === undefined || $scope.form.title === '') {
            isValidate = false;
            AlertDialog.show('', $filter('translate')('requireTitle'), '', true);
            return isValidate;
        }

        if ($scope.form.body === undefined || $scope.form.body === '') {
            isValidate = false;
            AlertDialog.show('', $filter('translate')('requireBody'), '', true);
            return isValidate;
        }
        if ($scope.form.type === undefined || $scope.form.type === '') {
            isValidate = false;
            AlertDialog.show('', $filter('translate')('requireType'), '', true);
            return isValidate;
        }
        if ($scope.form.country === undefined || $scope.form.country === '') {
            isValidate = false;
            AlertDialog.show('', $filter('translate')('requireCountry'), '', true);
            return isValidate;
        }

        return isValidate;
    };

    $scope.updateUser = function () {

        var user = $scope.userList[$scope.currentIndex];

        if ($scope.isFormValidate()) {
            var body = angular.copy($scope.form);

            loadingHandler.startLoading(LOADING.spinnerKey, 'updateUserById');
            usersManager.updateUserById(user.id, body, function (status, data) {
                if (status == 200) {
                    $scope.userList[$scope.currentIndex] = data;
                    $scope.hideUserEdit();
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
}