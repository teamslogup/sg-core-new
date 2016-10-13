export default function LoadingHandlerCtrl ($scope, loadingHandler) {
    var vm = $scope.vm;
    loadingHandler.init(vm);
}