export default function TermsCtrl($scope, $filter, termsManager, AlertDialog, loadingHandler, metaManager) {

    var LOADING = metaManager.std.loading;

    $scope.isTermsCreateVisible = false;
    $scope.isTermsEditVisible = false;

    $scope.params = {};
    $scope.form = {};

    $scope.termsList = [];
    $scope.termsListTotal = 0;

    $scope.selectedTerms = undefined;
    $scope.activeId = undefined;

    $scope.more = false;

    $scope.showTermsCreate = function () {
        $scope.form.type = $scope.termsTypes[0];
        $scope.form.country = $scope.termsCountries[0];
        $scope.isTermsCreateVisible = true;
    };

    $scope.hideTermsCreate = function () {
        $scope.isTermsCreateVisible = false;
        $scope.form = {};
    };

    $scope.showTermsEdit = function (index) {
        $scope.currentIndex = index;
        $scope.form = {
            title: $scope.termsList[index].title,
            body: $scope.termsList[index].body,
            type: $scope.termsList[index].type,
            country: $scope.termsList[index].country,
        };
        $scope.isTermsEditVisible = true;
    };

    $scope.hideTermsEdit = function () {
        $scope.isTermsEditVisible = false;
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

    $scope.createTerms = function () {

        if ($scope.isFormValidate()) {
            var body = angular.copy($scope.form);

            loadingHandler.startLoading(LOADING.spinnerKey, 'createTerms');
            termsManager.createTerms(body, function (status, data) {
                if (status == 201) {
                    $scope.termsList.unshift(data);
                    $scope.hideTermsCreate();
                } else {
                    AlertDialog.alertError(status, data);
                }
                loadingHandler.endLoading(LOADING.spinnerKey, 'createTerms');
            });
        }

    };

    $scope.updateTerms = function () {

        var terms = $scope.termsList[$scope.currentIndex];

        if ($scope.isFormValidate()) {
            var body = angular.copy($scope.form);

            loadingHandler.startLoading(LOADING.spinnerKey, 'updateTermsById');
            termsManager.updateTermsById(terms.id, body, function (status, data) {
                if (status == 200) {
                    $scope.termsList[$scope.currentIndex] = data;
                    $scope.hideTermsEdit();
                } else {
                    AlertDialog.alertError(status, data);
                }
                loadingHandler.endLoading(LOADING.spinnerKey, 'updateTermsById');
            });
        }

    };

    $scope.findTermsById = function (id, isVersionId) {
        loadingHandler.startLoading(LOADING.spinnerKey, 'findTermsById');
        termsManager.findTermsById(id, function (status, data) {
            if (status == 200) {

                if(!isVersionId){
                    $scope.activeId = id;
                }

                $scope.activeVersionId = id;

                $scope.selectedTerms = data;
            } else {
                AlertDialog.alertError(status, data);
            }
            loadingHandler.endLoading(LOADING.spinnerKey, 'findTermsById');
        });
    };

    $scope.findTerms = function () {

        $scope.termsListTotal = 0;
        $scope.termsList = [];

        $scope.params.last = undefined;

        loadingHandler.startLoading(LOADING.spinnerKey, 'findTerms');
        termsManager.findTerms($scope.params, function (status, data) {
            if (status == 200) {
                $scope.termsListTotal = data.count;
                $scope.termsList = $scope.termsList.concat(data.rows);
                $scope.more = $scope.termsListTotal > $scope.termsList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findTerms');
        });
    };

    $scope.findTermsMore = function () {

        if ($scope.termsList.length > 0) {
            $scope.params.last = $scope.termsList[$scope.termsList.length - 1].createdAt;
        }

        loadingHandler.startLoading(LOADING.spinnerKey, 'findTermsMore');
        termsManager.findTerms($scope.params, function (status, data) {
            if (status == 200) {
                $scope.termsList = $scope.termsList.concat(data.rows);
                $scope.more = $scope.termsListTotal > $scope.termsList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                AlertDialog.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findTermsMore');
        });
    };

    $scope.findTerms();

    $scope.$watch('params.type', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findTerms();
        }
    }, true);
}