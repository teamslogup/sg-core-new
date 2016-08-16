(function () {
    'use strict';

    angular.module("core.bbs").controller("BbsDetailCtrl", BbsDetailCtrl);

    /* @ngInject */
    function BbsDetailCtrl($scope, $sce, $location, bbsUtils, articlesManager, viewsManager) {

        var vm = $scope.vm;
        var data = vm.data;

        vm.goToList = goToList;
        vm.editArticle = editArticle;
        vm.removeArticle = removeArticle;
        data.article.body = $sce.trustAsHtml(data.article.body);
        viewArticle();

        function viewArticle() {
            viewsManager.increaseViewCount(
                vm.slug,
                vm.categoryId,
                vm.data.article.id,
                function(status, data) {
                    if (status == 200) {
                        vm.data.article.views++;
                    }
                }
            );
        }

        function removeArticle() {
            if (confirm("정말 삭제하시겠습니까?")) {
                articlesManager.removeArticle(vm.data.article, function (status, data) {
                    if (status == 204) {
                        $location.path(vm.domainPath + bbsUtils.getListUrl(vm.slug, vm.categoryId));
                    }
                });
            }
        }

        function goToList() {
            $location.path(vm.domainPath + bbsUtils.getListUrl(vm.slug, vm.categoryId));
        }

        function editArticle() {
            $location.path(vm.domainPath + bbsUtils.getFormUrl(vm.slug, vm.categoryId, vm.articleId));
        }
    }

})();