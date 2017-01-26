export default function LoadingHandlerCtrl ($scope, loadingHandler) {
    "ngInject";

    var vm = $scope.vm;
    loadingHandler.init(vm);
}