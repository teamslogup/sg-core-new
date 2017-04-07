export default function NotificationsCreateCtrl($scope, $filter, $interval, $uibModalInstance, scope, FileUploader, uploadManager, dialogHandler) {
    "ngInject";

    var USER = scope.metaManager.std.user;
    var LOADING = scope.metaManager.std.loading;
    var COMMON = scope.metaManager.std.common;
    var FILE = scope.metaManager.std.file;

    $scope.stopProgress = null;
    $scope.progress = {
        loading: false,
        title: '',
        progress: 0
    };

    $scope.currentSendType = '';
    $scope.tempStore = {
        notificationName: '',
        message: {
            title: '',
            body: ''
        },
        email: {
            title: '',
            body: ''
        },
        push: {
            title: '',
            body: ''
        },
        condition: {}
    };

    $scope.messageLength = {
        sms: 90,
        lms: 2000,
        mms: 20000
    };

    $scope.messageTop = 'sms';

    $scope.currentMessageLength = 0;
    $scope.currentMessageMaxLength = $scope.messageLength.sms;

    $scope.enumGenders = angular.copy(USER.enumGenders);
    $scope.enumPhones = angular.copy(USER.enumPhones);

    $scope.enumGenders.unshift(COMMON.all);
    $scope.enumPhones.unshift(COMMON.all);

    $scope.tempStore.condition.gender = $scope.enumGenders[0];
    $scope.tempStore.condition.platform = $scope.enumPhones[0];

    $scope.images = [];

    // $scope.form = {
    //     type: scope.noticeTypes[0],
    //     country: scope.noticeCountries[0]
    // };
    //
    // $scope.noticeTypes = NOTICE.enumNoticeTypes;
    // $scope.noticeCountries = NOTICE.enumCountries;

    $scope.changeBodyPath = changeBodyPath;
    $scope.changeSelectPath = changeSelectPath;
    $scope.next = next;
    $scope.back = back;
    $scope.sendNotificationCondition = sendNotificationCondition;
    $scope.cancel = cancel;

    var frontPath = 'modules/admin/notifications/directives/notifications-create/core.notifications-create-';
    var tailPath = '.html';

    $scope.lastPage = false;
    $scope.createBodyPath = '';
    $scope.sendTypeItem = {};
    $scope.sendTypeSelectItem = {};

    $scope.createSelectPath = '';
    $scope.massNotification = null;

    function changeBodyPath(name) {
        $scope.createBodyPath = frontPath + name + tailPath;
        $scope.sendTypeItem = {};
        $scope.sendTypeItem[name] = true;
        $scope.currentSendType = name;
    }

    function changeSelectPath(name) {
        $scope.createSelectPath = frontPath + name + tailPath;
        $scope.sendTypeSelectItem = {};
        $scope.sendTypeSelectItem[name] = true;
    }

    function next() {

        if (!$scope.tempStore.notificationName) {
            return scope.dialogHandler.show('', $filter('translate')('notificationName') + '을 입력해주세요.', '', true);
        }
        if (!$scope.tempStore[$scope.currentSendType].body) {
            return scope.dialogHandler.show('', $filter('translate')('body') + '을 입력해주세요.', '', true);
        }
        $scope.lastPage = true;
    }

    function back() {
        $scope.lastPage = false;
    }

    changeBodyPath('message');
    changeSelectPath('condition');

    function sendNotificationCondition() {

        var body = {
            sendType: $scope.currentSendType,
            notificationName: $scope.tempStore.notificationName,
            messageTitle: $scope.tempStore[$scope.currentSendType].title,
            messageBody: $scope.tempStore[$scope.currentSendType].body
        };

        body.gender = $scope.tempStore.condition.gender;
        body.platform = $scope.tempStore.condition.platform;

        scope.loadingHandler.startLoading(LOADING.spinnerKey, 'sendNotificationCondition');
        scope.massNotificationConditionManager.sendNotificationCondition(body, $scope.images, function (status, data) {
            if (status == 201) {

                $scope.massNotification = data;

                setProgress($scope.massNotification.progress, '알림을 전송중입니다.');
                $scope.stopProgress = $interval(function () {
                    getProgress();
                }, 1000);


            } else {
                scope.dialogHandler.alertError(status, data);
            }

            scope.loadingHandler.endLoading(LOADING.spinnerKey, 'sendNotificationCondition');
        });

    }

    function getProgress() {
        scope.massNotificationsManager.findMassNotificationById($scope.massNotification.id, function (status, data) {
            if (status == 200) {
                $scope.massNotification = data;
                setProgress($scope.massNotification.progress, '알림을 전송중입니다.');
                if ($scope.massNotification.progress == 100 || $scope.massNotification.errorCode != null) {
                    $uibModalInstance.close(data);
                    $interval.cancel($scope.stopProgress);
                    endProgress();
                }

            } else {
                scope.dialogHandler.alertError(status, data);
            }
        });
    }

    function setProgress(progress, title) {
        $scope.progress.loading = true;
        $scope.progress.title = title;
        $scope.progress.progress = progress;
    }

    function endProgress() {
        $scope.progress.loading = false;
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function setMessageTop(name) {
        $scope.messageTop = name;
        $scope.currentMessageMaxLength = $scope.messageLength[name];
    }

    $scope.$watch('tempStore.message.body', function (newVal, oldVal) {

        if (newVal != oldVal) {

            $scope.currentMessageLength = (function (s, b, i, c) {
                for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 2 : c >> 7 ? 2 : 1);
                return b
            })(newVal);

            if ($scope.currentMessageLength <= $scope.messageLength.sms) {
                setMessageTop('sms');
                return true;
            }

            if ($scope.currentMessageLength <= $scope.messageLength.lms) {
                setMessageTop('lms');
                return true;
            }

            if ($scope.currentMessageLength <= $scope.messageLength.mms) {
                setMessageTop('mms');
                return true;
            }

        }

    }, true);


    $scope.uploader = new FileUploader({
        onAfterAddingAll: function (items) {
            if (items.length > 1) {
                // dialogHandler.show('', '최대 이미지 갯수는 1개 까지 입니다.', '', true);
                previewFile(items[0]._file);
            } else {
                previewFile(items[0]._file);
            }
        },
        onErrorItem: function (err) {
            console.log(err);
        }
    });

    function previewFile(image) {
        var file = image;
        var reader = new FileReader();

        reader.addEventListener("load", function () {

            if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
                $scope.images.push(reader.result);
            } else {
                $scope.$apply(function () {
                    $scope.images.push(reader.result);
                });
            }

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }

        uploadManager.uploadImages(file, 'common', function (status, data) {
            if (status == 201) {
                console.log(status);
            } else {
                console.log(status);
            }
        });
    }

    $scope.clickUploadFile = function () {
        $('#uploadFile')[0].click();
    };


}