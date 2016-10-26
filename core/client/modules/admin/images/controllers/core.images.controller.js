export default function ImagesCtrl($scope, $filter, imagesManager, AlertDialog, loadingHandler, metaManager) {
    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    vm.CDN = metaManager.std.cdn;
    var LOADING = metaManager.std.loading;

    $scope.form = {};
    $scope.imageList = [];
    $scope.imageListTotal = 0;
    $scope.imageFolders = metaManager.std.file.enumFolders;
    $scope.form.folder = $scope.imageFolders[0];
    $scope.enumAuthorized = metaManager.std.image.enumAuthorized;
    $scope.isAuthorized = $scope.enumAuthorized[0];
    $scope.enumSearchFields = metaManager.std.image.enumSearchFields;
    $scope.form.searchField = metaManager.std.image.defaultSearchFields;

    $scope.more = false;

    $scope.toggleImageAuthorization = function ($index) {
        var image = $scope.imageList[$index];

        var body = {
            authorized: image.authorized ? false : true
        };

        loadingHandler.startLoading(LOADING.spinnerKey, 'updateImageById');
        imagesManager.updateImageById(image.id, body, function (status, data) {
            if (status == 200) {
                $scope.imageList[$index] = data;
            } else {
                AlertDialog.alertError(status, data);
            }
            loadingHandler.endLoading(LOADING.spinnerKey, 'updateImageById');
        });
    };

    $scope.deleteImage = function ($index) {
        var image = $scope.imageList[$index];

        AlertDialog.show('', $filter('translate')('sureDelete'), '삭제', true, function () {
            loadingHandler.startLoading(LOADING.spinnerKey, 'deleteImage');
            imagesManager.deleteImage(image, function (status, data) {
                if (status == 200) {
                    $scope.imageList = $scope.imageList.slice($index, 1);
                } else {
                    AlertDialog.alertError(status, data);
                }
                loadingHandler.endLoading(LOADING.spinnerKey, 'deleteImage');
            });
        });

    };

    function toBooleanIsAuthorized() {
        if ($scope.isAuthorized == $scope.enumAuthorized[0]) {
            $scope.form.authorized = undefined;
        } else if ($scope.isAuthorized == $scope.enumAuthorized[1]) {
            $scope.form.authorized = true;
        } else if ($scope.isAuthorized == $scope.enumAuthorized[2]) {
            $scope.form.authorized = false;
        }
    }

    $scope.findImages = function () {

        $scope.imageListTotal = 0;
        $scope.imageList = [];

        $scope.form.last = undefined;

        toBooleanIsAuthorized();

        loadingHandler.startLoading(LOADING.spinnerKey, 'findImages');
        imagesManager.findImages($scope.form, function (status, data) {
            if (status == 200) {
                $scope.imageListTotal = data.count;
                $scope.imageList = $scope.imageList.concat(data.rows);
                $scope.more = $scope.imageListTotal > $scope.imageList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findImages');
        });
    };

    $scope.findImagesMore = function () {

        if ($scope.imageList.length > 0) {
            $scope.form.last = $scope.imageList[$scope.imageList.length - 1].createdAt;
        }

        toBooleanIsAuthorized();

        loadingHandler.startLoading(LOADING.spinnerKey, 'findImagesMore');
        imagesManager.findImages($scope.form, function (status, data) {
            if (status == 200) {
                $scope.imageList = $scope.imageList.concat(data.rows);
                $scope.more = $scope.imageListTotal > $scope.imageList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findImagesMore');
        });
    };

    $scope.findImages();

    $scope.$watch('form.folder', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findImages();
        }
    }, true);

    $scope.$watch('isAuthorized', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findImages();
        }
    }, true);
}