export default function AlertDialogCtrl($scope, dialogHandler, metaManager) {
    var vm = $scope.vm;
    vm.DIALOG = metaManager.std.dialog;
    dialogHandler.init(vm);

    vm.isDialogVisible = false;
    vm.alertTitle = '';
    vm.alertMsg = '';
    vm.isCloseBtnVisible = true;

    dialogHandler.listen(function (title, body, actionText, isCloseBtnVisible) {
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
        dialogHandler.action();
    };

    vm.closeDialog = function () {
        vm.isDialogVisible = false;
        dialogHandler.close();
    };
}