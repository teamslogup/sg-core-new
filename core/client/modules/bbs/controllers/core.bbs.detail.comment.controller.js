(function () {
    'use strict';

    angular.module("core.bbs").controller("BbsDetailCommentCtrl", BbsDetailCommentCtrl);

    /* @ngInject */
    function BbsDetailCommentCtrl($scope, commentsManager, metaManager) {

        var vm = $scope.vm;
        var data = vm.data;

        vm.submit = submit;
        vm.remove = remove;
        vm.more = more;
        vm.toggleCommentForm = toggleCommentForm;
        vm.form = {
            body: '',
            recomment: {}
        };

        if (!vm.data.comments) vm.data.comments = [];
        var commentLength = vm.data.comments.length;
        vm.isFinish = commentLength == 0 || commentLength < metaManager.std.comment.defaultLoadingLength;

        function remove(comment) {
            if (confirm("정말 삭제하시겠습니까?")) {
                commentsManager.removeComment(comment, function (status, data) {
                    if (status == 204) {
                        var removingIdxes = [];
                        var comments = vm.data.comments;
                        for (var i = 0; i < comments.length; ++i) {
                            if (comments[i].id == comment.id || comments[i].parentId == comment.id) {
                                removingIdxes.push(i);
                            }
                        }
                        vm.data.commentCount = vm.data.commentCount - removingIdxes.length;
                        for (var i = removingIdxes.length - 1 ; i >= 0 ; --i) {
                            comments.splice(removingIdxes[i], 1);
                        }
                        if (comments.length == 0) {
                            vm.isFinish = true;
                        }
                    } else {

                    }
                });
            }
        }

        function submit(comment) {
            var body = '';
            var isRecomment = false;
            // 댓글의 댓글
            if (vm.form.body) {
                body = vm.form.body;
                vm.form.body = "";
                vm.isLoading = true;
            }
            else if (comment && vm.form.recomment && vm.form.recomment[comment.id]) {
                body = vm.form.recomment[comment.id];
                vm.form.recomment[comment.id] = '';
                comment.isLoading = true;
                isRecomment = true;
            }
            else {
                return;
            }
            var reqBody = {
                body: body,
                articleId: data.article.id,
                categoryId: vm.categoryId,
                slug: vm.slug
            };
            if (isRecomment) {
                reqBody.parentId = comment.id;
            }
            commentsManager.createComment(reqBody, function (status, data) {
                if (isRecomment) {
                    comment.isShowCommentForm = !comment.isShowCommentForm;
                    comment.isLoading = false;
                } else {
                    vm.isLoading = false;
                }

                if (status == 201) {
                    vm.data.commentCount++;
                    var comments = vm.data.comments;
                    if (isRecomment) {
                        for (var i = 0; i < comments.length; ++i){
                            if (comments[i].id == comment.id) {
                                comments.splice(i + 1, 0, data);
                                break;
                            }
                        }
                    } else {
                        vm.data.comments = [data].concat(comments);
                    }
                }
            });
        }

        function more() {
            vm.isMoreLoading = true;
            var comments = vm.data.comments;
            var where = {
                articleId: vm.articleId,
                categoryId: vm.categoryId,
                slug: vm.slug,
                last: comments[comments.length - 1].weight
            };
            commentsManager.findAllComments(where, function (status, data) {
                vm.isMoreLoading = false;
                if (status == 200) {
                    vm.data.comments = vm.data.comments.concat(data);
                } else if (status == 404) {
                    vm.isFinish = true;
                }
            });
        }

        function toggleCommentForm(comment) {
            comment.isShowCommentForm = !comment.isShowCommentForm;
        }
    }

})();