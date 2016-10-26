export default function TermsCtrl($scope, $filter, termsManager, AlertDialog, loadingHandler, metaManager) {

    var LOADING = metaManager.std.loading;

    $scope.isTermsCreateVisible = false;
    $scope.isTermsAddVersionVisible = false;
    $scope.isTermsCreateFirstTime = true;

    $scope.params = {};
    $scope.form = {};

    $scope.termsList = [];
    $scope.termsListTotal = 0;

    $scope.selectedTerms = undefined;
    $scope.activeId = undefined;

    $scope.more = false;

    $scope.enumType = metaManager.std.terms.enumTypes;
    $scope.enumLanguages = Object.keys(metaManager.local.languages);
    $scope.params.language = $scope.enumLanguages[0];

    $scope.showTermsCreate = function () {
        $scope.form.type = $scope.enumType[0];
        $scope.form.language = $scope.enumLanguages[0];
        $scope.isTermsCreateVisible = true;
        $scope.isTermsCreateFirstTime = false;
    };

    $scope.hideTermsCreate = function () {
        $scope.isTermsCreateVisible = false;
        $scope.form = {};
    };

    $scope.showTermsAddVersion = function () {
        $scope.form = {
            title: $scope.currentTerms.title,
            content: $scope.currentTerms.content,
            type: $scope.currentTerms.type,
            language: $scope.currentTerms.language
        };
        $scope.isTermsAddVersionVisible = true;
        $scope.isTermsCreateFirstTime = false;
    };

    $scope.hideTermsAddVersion = function () {
        $scope.isTermsAddVersionVisible = false;
        $scope.form = {};
    };

    $scope.createTerms = function () {
        var body = angular.copy($scope.form);

        termsManager.createTerms(body, function (status, data) {
            if (status == 201) {
                $scope.termsList.unshift(data);
                $scope.hideTermsCreate();
            } else {
                AlertDialog.alertError(status, data);
            }
        });

    };

    $scope.addVersion = function () {
        var body = angular.copy($scope.form);

        termsManager.createTerms(body, function (status, data) {
            if (status == 201) {
                $scope.selectedTerms.versions.unshift(data);
                $scope.hideTermsAddVersion();
            } else {
                AlertDialog.alertError(status, data);
            }
        });
    };

    $scope.deleteVersion = function (terms) {

        AlertDialog.show('', $filter('translate')('sureDelete'), $filter('translate')('delete'), true, function () {
            termsManager.deleteTerms(terms, function (status, data) {
                if (status == 204) {
                    if (terms.id == $scope.currentTerms.id) {
                        $scope.findTerms();
                    } else {
                        $scope.findTermsById($scope.currentTerms.id);
                    }
                } else {
                    AlertDialog.alertError(status, data);
                }
            });
        });
    };

    $scope.findTermsById = function (id) {
        termsManager.findTermsById(id, function (status, data) {
            if (status == 200) {
                $scope.activeVersionId = id;
                $scope.selectedTerms = data;
            } else {
                AlertDialog.alertError(status, data);
            }
        });
    };

    $scope.findTerms = function () {

        $scope.termsList = [];
        $scope.params.last = undefined;

        termsManager.findTerms($scope.params, function (status, data) {
            if (status == 200) {
                $scope.termsList = $scope.termsList.concat(data);
                $scope.currentTerms = $scope.termsList[0];
            } else if (status == 404) {
                $scope.selectedTerms = undefined;
            } else {
                AlertDialog.alertError(status, data);
            }
        });
    };

    $scope.findTerms();

    $scope.$watch('params.type', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findTerms();
        }
    }, true);

    $scope.$watch('params.language', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findTerms();
        }
    }, true);

    $scope.$watch('currentTerms', function (newVal, oldVal) {
        if (newVal != oldVal && newVal !== null) {
            $scope.findTermsById(newVal.id);
        }
    }, true);

    $scope.selectTerms = function (terms) {
        $scope.currentTerms = terms;
    };
}