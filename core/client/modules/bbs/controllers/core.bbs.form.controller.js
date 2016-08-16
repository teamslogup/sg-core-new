(function () {
    'use strict';

    angular.module("core.bbs").controller("BbsFormCtrl", BbsFormCtrl);

    /* @ngInject */
    function BbsFormCtrl($scope, $location, metaManager, articlesManager, bbsUtils, uploadManager) {

        var vm = $scope.vm;
        var data = vm.data;
        data.categories = data.board.categories;

        vm.submitTitle = vm.articleId ? '수정하기' : '작성하기';
        vm.goBack = goBack;
        vm.upload = upload;
        vm.submit = submit;

        var isVisible = data.article.isVisible === undefined ? true : data.article.isVisible + "";
        vm.form = {
            body: data.article.body,
            categoryId: vm.categoryId,
            title: data.article.title,
            isVisible: isVisible,
            isNotice: data.article.isNotice || false
        };

        $scope.editorOptions = {
            language: 'ko',
            'skin': 'moono',
            'allowedContent': true,
            'filebrowserImageUploadUrl': "/api/etc/upload-ck"
        };

        vm.imageExplain = "이미지를 업로드하세요.";

        function upload() {
            vm.imageExplain = "업로드 중입니다..";
            uploadManager.uploadImage(vm.file, metaManager.std.file.folderAttach, function (status, data) {
                if (status == 201) {
                    vm.form.img = data;
                    vm.imageExplain = "업로드 완료";
                } else {
                    vm.imageExplain = "업로드 실패";
                }
            });
        }

        function goBack() {
            if (vm.articleId) {
                $location.path(vm.domainPath + bbsUtils.getDetailUrl(vm.slug, vm.categoryId, vm.articleId));
            } else {
                $location.path(vm.domainPath + bbsUtils.getListUrl(vm.slug, vm.categoryId));
            }
        }

        function submit(body) {

            function articleCallback(status, data) {
                if (status == 200 || status == 201) {
                    vm.categoryId = body.categoryId;
                    if (vm.articleId) {
                        $location.path(vm.domainPath + bbsUtils.getDetailUrl(vm.slug, vm.categoryId, vm.articleId));
                    } else {
                        $location.path(vm.domainPath + bbsUtils.getListUrl(vm.slug, vm.categoryId));
                    }
                } else {

                }
            }

            var articleBody = {
                slug: vm.slug,
                categoryId: body.categoryId,
                body: body.body,
                title: body.title,
                isNotice: body.isNotice,
                isVisible: body.isVisible
            };

            if (body.img) {
                articleBody.img = body.img;
            }

            if (vm.articleId) {
                articleBody.id = vm.articleId;
                articlesManager.updateArticleById(articleBody, articleCallback);
            } else {
                articlesManager.createArticle(articleBody, articleCallback);
            }
        }
    }

})();