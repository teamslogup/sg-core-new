export default function AlertDialogCtrl ($scope, AlertDialog) {
    var vm = $scope.vm;
    AlertDialog.init(vm);

    AlertDialog.listen(function (title, body, actionText, isCloseBtnVisible) {
        $scope.alertTitle = title;
        $scope.alertMsg = body;
        $scope.isCloseBtnVisible = isCloseBtnVisible;

        if (actionText) {
            $scope.alertAction = actionText;
        } else {
            $scope.alertAction = undefined;
        }

    });

    $scope.action = function () {
        AlertDialog.action();
    };

    $scope.closeDialog = function () {
        AlertDialog.close();
    };
}