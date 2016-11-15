export default function CreateTermsCtrl ($scope, $uibModalInstance, scope, terms) {
    var now = new Date();
    $scope.localNow = (new Date(now.getTime() + 24*60*60*1000)).toDateString();

    $scope.enumTypes = scope.enumTypes;
    $scope.enumLanguages = scope.enumLanguages;

    if (!terms) {
        $scope.form = {};
        $scope.form.type = $scope.enumTypes[0];
        $scope.form.language = $scope.enumLanguages[0];
    } else {
        $scope.terms = terms;
        var query = angular.copy(scope.params);
        if (terms.appliedId) {
            query.appliedId = terms.appliedId;
        } else {
            query.title = terms.title;
        }
        scope.termsManager.findTerms(query, function (status, data) {
            if (status == 200) {
                $scope.form = data.selected;
            } else {
                $uibModalInstance.dismiss('cancel');
            }
        });
    }

    $scope.create = function () {
        var body = angular.copy($scope.form);
        scope.termsManager.createTerms(body, function (status, data) {
            if (status == 201) {
                $uibModalInstance.close(data);
            } else {
                scope.dialogHandler.alertError(status, data);
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}