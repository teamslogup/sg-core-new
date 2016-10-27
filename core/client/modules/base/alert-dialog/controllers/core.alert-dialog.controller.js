export default function AlertDialogCtrl($scope, AlertDialog) {
    var vm = $scope.vm;
    AlertDialog.init(vm);

    vm.isDialogVisible = false;
    vm.alertTitle = '';
    vm.alertMsg = '';
    vm.isCloseBtnVisible = true;

    AlertDialog.listen(function (title, body, actionText, isCloseBtnVisible) {
        vm.isDialogVisible = true;
        vm.alertTitle = title;
        vm.alertMsg = body;
        vm.isCloseBtnVisible = isCloseBtnVisible;

        if (actionText) {
            vm.alertAction = actionText;
        } else {
            vm.alertAction = undefined;
        }

    });

    vm.action = function () {
        vm.isDialogVisible = false;
        AlertDialog.action();
    };

    vm.closeDialog = function () {
        vm.isDialogVisible = false;
        AlertDialog.close();
    };
}