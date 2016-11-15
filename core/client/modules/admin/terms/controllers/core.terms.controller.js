export default function TermsCtrl($scope, $filter, $uibModal, termsManager, dialogHandler, loadingHandler, metaManager) {

    var LOADING = metaManager.std.loading;
    $scope.TERMS = metaManager.std.terms;
    $scope.ADMIN = metaManager.std.admin;
    $scope.termsManager = termsManager;
    $scope.dialogHandler = dialogHandler;

    $scope.isTermsCreateVisible = false;
    $scope.isTermsAddVersionVisible = false;
    $scope.isTermsCreateFirstTime = true;
    $scope.isTermsAddVersionFirstTime = true;

    $scope.params = {};
    $scope.form = {};

    $scope.termsList = [];
    $scope.termsListTotal = 0;

    $scope.selectedTerms = undefined;
    $scope.activeId = undefined;

    $scope.more = false;

    $scope.enumTypes = metaManager.std.terms.enumTypes;
    $scope.enumLanguages = Object.keys(metaManager.local.languages);
    $scope.params.language = $scope.enumLanguages[0];

    // $scope.addVersion = function () {
    //     var body = angular.copy($scope.form);
    //
    //     termsManager.createTerms(body, function (status, data) {
    //         if (status == 201) {
    //             $scope.selectedTerms.versions.unshift(data);
    //             $scope.hideTermsAddVersion();
    //         } else {
    //             dialogHandler.alertError(status, data);
    //         }
    //     });
    // };

    $scope.deleteVersion = function (terms) {

        dialogHandler.show('', $filter('translate')('sureDelete'), $filter('translate')('delete'), true, function () {
            termsManager.deleteTerms(terms, function (status, data) {
                if (status == 204) {
                    if (terms.id == $scope.currentTerms.id) {
                        $scope.findTerms();
                    } else {
                        $scope.findTermsById($scope.currentTerms.id);
                    }
                } else {
                    dialogHandler.alertError(status, data);
                }
            });
        });
    };

    $scope.findTerms = function () {

        $scope.termsList = [];
        $scope.params.last = undefined;

        termsManager.findTerms($scope.params, function (status, data) {
            if (status == 200) {
                $scope.termsList = $scope.termsList.concat(data.rows);
                $scope.currentTerms = $scope.termsList[0];
            } else if (status == 404) {
                $scope.selectedTerms = undefined;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    };

    $scope.findTermsByTitle = function (title) {
        var query = angular.copy($scope.params);
        query.title = title;

        termsManager.findTerms(query, function (status, data) {
            if (status == 200) {
                $scope.selectVersionId = data.selected.id;
                $scope.selectedTerms = data.selected;
                $scope.selectedTerms.versions = data.versions;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    };

    $scope.findTermsById = function (appliedId) {
        var query = angular.copy($scope.params);
        query.appliedId = appliedId;

        termsManager.findTerms(query, function (status, data) {
            if (status == 200) {
                $scope.selectVersionId = data.selected.id;
                $scope.selectedTerms = data.selected;
                $scope.selectedTerms.versions = data.versions;
            } else {
                dialogHandler.alertError(status, data);
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
            if(newVal.appliedId !== null){
                $scope.findTermsById(newVal.appliedId);
            } else {
                $scope.findTermsByTitle(newVal.title);
            }
        }
    }, true);

    $scope.selectTerms = function (terms) {
        $scope.currentTerms = terms;
    };

    $scope.openCreateTerms = function (terms) {
        if (terms) {
            var query = angular.copy($scope.params);
            if (terms.appliedId) {
                query.appliedId = terms.appliedId;
            } else {
                query.title = terms.title;
            }
            termsManager.findTerms(query, function (status, data) {
                if (status == 200) {
                    openModal(data.selected);
                } else {
                    return dialogHandler.alertError(status, data);
                }
            });
        } else {
            openModal();
        }
    };

    function openModal (terms) {
        var createInstance = $uibModal.open({
            animation: $scope.ADMIN.isUseModalAnimation,
            backdrop: $scope.ADMIN.modalBackDrop,
            templateUrl: 'coreCreateTerms.html',
            controller: 'CreateTermsCtrl',
            size: $scope.TERMS.modalSize,
            resolve: {
                scope: function () {
                    return $scope;
                },
                terms: function () {
                    return terms;
                }
            }
        });

        createInstance.result.then(function (result) {
            if (terms) {
                $scope.selectedTerms.unshift(result);
            } else {
                $scope.termsList.unshift(result);
            }
        }, function () {
            console.log("cancel modal page");
        });
    }
}