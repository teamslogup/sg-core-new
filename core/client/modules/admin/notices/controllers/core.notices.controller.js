export default function NoticesCtrl($scope, $filter, noticesManager, AlertDialog, metaManager) {
    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    $scope.isNoticeCreateVisible = false;
    $scope.isNoticeEditVisible = false;

    $scope.params = {};
    $scope.form = {};

    $scope.noticeList = [];
    $scope.noticeListTotal = 0;
    $scope.noticeTypes = metaManager.std.notice.enumNoticeTypes;
    $scope.params.type = $scope.noticeTypes[0];

    $scope.noticeCountries = metaManager.std.notice.enumCountries;

    vm.loading = false;
    $scope.more = false;

    $scope.showNoticeCreate = function () {
        $scope.form.type = $scope.noticeTypes[0];
        $scope.form.country = $scope.noticeCountries[0];
        $scope.isNoticeCreateVisible = true;
    };

    $scope.hideNoticeCreate = function () {
        $scope.isNoticeCreateVisible = false;
        $scope.form = {};
    };

    $scope.showNoticeEdit = function (index) {
        $scope.currentIndex = index;
        $scope.form = {
            title: $scope.noticeList[index].title,
            body: $scope.noticeList[index].body,
            type: $scope.noticeList[index].type,
            country: $scope.noticeList[index].country,
        };
        $scope.isNoticeEditVisible = true;
    };

    $scope.hideNoticeEdit = function () {
        $scope.isNoticeEditVisible = false;
        $scope.form = {};
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

    $scope.createNotice = function () {

        if ($scope.isFormValidate()) {
            var body = angular.copy($scope.form);

            vm.loading = true;
            noticesManager.createNotice(body, function (status, data) {
                if (status == 201) {
                    $scope.noticeList.unshift(data);
                    $scope.hideNoticeCreate();
                } else {
                    AlertDialog.alertError(status, data);
                }
                vm.loading = false;
            });
        }

    };

    $scope.updateNotice = function () {

        var notice = $scope.noticeList[$scope.currentIndex];

        if ($scope.isFormValidate()) {
            var body = angular.copy($scope.form);

            vm.loading = true;
            noticesManager.updateNoticeById(notice.id, body, function (status, data) {
                if (status == 200) {
                    $scope.noticeList[$scope.currentIndex] = data;
                    $scope.hideNoticeEdit();
                } else {
                    AlertDialog.alertError(status, data);
                }
                vm.loading = false;
            });
        }

    };

    $scope.findNotices = function () {
        if (vm.session && vm.session.id) {

            $scope.noticeListTotal = 0;
            $scope.noticeList = [];

            $scope.params.last = undefined;

            vm.loading = true;
            noticesManager.findNotices($scope.params, function (status, data) {
                if (status == 200) {
                    $scope.noticeListTotal = data.count;
                    $scope.noticeList = $scope.noticeList.concat(data.rows);
                    $scope.more = $scope.noticeListTotal > $scope.noticeList.length;
                } else if (status == 404) {
                    $scope.more = false;
                } else {
                    AlertDialog.alertError(status, data);
                }

                vm.loading = false;
            });
        }
    };

    $scope.findNoticesMore = function () {

        if (vm.session && vm.session.id) {

            if ($scope.noticeList.length > 0) {
                $scope.params.last = $scope.noticeList[$scope.noticeList.length - 1].createdAt;
            }

            vm.loading = true;
            noticesManager.findNotices($scope.params, function (status, data) {
                if (status == 200) {
                    $scope.noticeList = $scope.noticeList.concat(data.rows);
                    $scope.more = $scope.noticeListTotal > $scope.noticeList.length;
                } else if (status == 404) {
                    $scope.more = false;
                } else {
                    AlertDialog.alertError(status, data);
                }

                vm.loading = false;
            });
        }
    };

    $scope.findNotices();

    $scope.$watch('params.type', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findNotices();
        }
    }, true);
}